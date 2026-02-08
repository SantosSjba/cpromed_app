<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSalidaRequest;
use App\Models\DetalleSalida;
use App\Models\Lote;
use App\Models\Paciente;
use App\Models\Salida;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SalidaController extends Controller
{
    public function index(Request $request): Response
    {
        $salidas = Salida::query()
            ->with('paciente:id_paciente,dni,nombres,apellidos')
            ->when($request->filled('buscar'), function ($q) use ($request) {
                $b = $request->buscar;
                $q->where(function ($q) use ($b) {
                    $q->where('numero_atencion', 'like', "%{$b}%")
                        ->orWhere('paciente_nombre', 'like', "%{$b}%")
                        ->orWhereHas('paciente', fn ($q) => $q->where('dni', 'like', "%{$b}%")->orWhere('nombres', 'like', "%{$b}%")->orWhere('apellidos', 'like', "%{$b}%"));
                });
            })
            ->when($request->filled('tipo_salida'), fn ($q) => $q->where('tipo_salida', $request->tipo_salida))
            ->when($request->filled('desde'), fn ($q) => $q->whereDate('fecha_salida', '>=', $request->desde))
            ->when($request->filled('hasta'), fn ($q) => $q->whereDate('fecha_salida', '<=', $request->hasta))
            ->orderBy('fecha_salida', 'desc')
            ->orderBy('id_salida', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Salidas/Index', [
            'salidas' => $salidas,
            'filters' => $request->only(['buscar', 'tipo_salida', 'desde', 'hasta']),
        ]);
    }

    public function create(): Response
    {
        $pacientes = Paciente::where('activo', true)->orderBy('apellidos')->orderBy('nombres')->get(['id_paciente', 'dni', 'nombres', 'apellidos']);
        $lotes = Lote::where('cantidad_actual', '>', 0)
            ->where('activo', 1)
            ->with(['presentacion.medicamento:id_medicamento,nombre_generico,codigo_interno', 'ubicacion:id_ubicacion,codigo'])
            ->orderBy('fecha_vencimiento')
            ->get();

        return Inertia::render('Salidas/Create', [
            'pacientes' => $pacientes,
            'lotes' => $lotes,
        ]);
    }

    public function store(StoreSalidaRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $numeroAtencion = 'ATE-'.now()->format('Ymd-His').'-'.Str::lower(Str::random(4));

        DB::transaction(function () use ($validated, $numeroAtencion) {
            $salida = Salida::create([
                'numero_atencion' => $numeroAtencion,
                'id_paciente' => $validated['id_paciente'] ?? null,
                'paciente_nombre' => $validated['paciente_nombre'] ?? null,
                'tipo_salida' => $validated['tipo_salida'],
                'fecha_salida' => $validated['fecha_salida'],
                'observaciones' => $validated['observaciones'] ?? null,
                'usuario_registro' => auth()->user()?->name ?? 'Sistema',
            ]);

            foreach ($validated['items'] as $item) {
                $cantidad = (int) $item['cantidad'];
                $lote = Lote::find($item['id_lote']);
                if ($lote && $lote->cantidad_actual >= $cantidad) {
                    DetalleSalida::create([
                        'id_salida' => $salida->id_salida,
                        'id_lote' => $item['id_lote'],
                        'tipo_unidad' => $item['tipo_unidad'],
                        'cantidad' => $cantidad,
                    ]);
                }
            }
        });

        return redirect()->route('salidas.index')->with('success', 'Salida registrada correctamente.');
    }

    public function show(Salida $salida): Response
    {
        $salida->load([
            'paciente',
            'detalleSalidas.lote.presentacion.medicamento',
            'detalleSalidas.lote.ubicacion',
        ]);

        return Inertia::render('Salidas/Show', [
            'salida' => $salida,
        ]);
    }
}
