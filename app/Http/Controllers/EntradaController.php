<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEntradaRequest;
use App\Models\DetalleEntrada;
use App\Models\Entrada;
use App\Models\Lote;
use App\Models\Presentacion;
use App\Models\Proveedor;
use App\Models\Ubicacion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EntradaController extends Controller
{
    public function index(Request $request): Response
    {
        $entradas = Entrada::query()
            ->with('proveedor:id_proveedor,razon_social,ruc')
            ->when($request->filled('buscar'), function ($q) use ($request) {
                $b = $request->buscar;
                $q->where(function ($q) use ($b) {
                    $q->where('numero_documento', 'like', "%{$b}%")
                        ->orWhereHas('proveedor', fn ($q) => $q->where('razon_social', 'like', "%{$b}%"));
                });
            })
            ->when($request->filled('desde'), fn ($q) => $q->whereDate('fecha_entrada', '>=', $request->desde))
            ->when($request->filled('hasta'), fn ($q) => $q->whereDate('fecha_entrada', '<=', $request->hasta))
            ->orderBy('fecha_entrada', 'desc')
            ->orderBy('id_entrada', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Entradas/Index', [
            'entradas' => $entradas,
            'filters' => $request->only(['buscar', 'desde', 'hasta']),
        ]);
    }

    public function create(): Response
    {
        $proveedores = Proveedor::where('activo', true)->orderBy('razon_social')->get(['id_proveedor', 'razon_social', 'ruc']);
        $presentaciones = Presentacion::with('medicamento:id_medicamento,nombre_generico,codigo_interno')
            ->where('activo', true)
            ->orderBy('id_presentacion')
            ->get(['id_presentacion', 'id_medicamento', 'tipo_presentacion', 'unidades_por_presentacion']);
        $ubicaciones = Ubicacion::where('activo', true)->orderBy('codigo')->get(['id_ubicacion', 'codigo']);

        return Inertia::render('Entradas/Create', [
            'proveedores' => $proveedores,
            'presentaciones' => $presentaciones,
            'ubicaciones' => $ubicaciones,
        ]);
    }

    public function store(StoreEntradaRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $total = 0;

        DB::transaction(function () use ($validated, &$total) {
            $entrada = Entrada::create([
                'numero_documento' => $validated['numero_documento'],
                'tipo_documento' => $validated['tipo_documento'],
                'id_proveedor' => $validated['id_proveedor'] ?? null,
                'fecha_entrada' => $validated['fecha_entrada'],
                'fecha_documento' => $validated['fecha_documento'] ?? null,
                'total' => 0,
                'observaciones' => $validated['observaciones'] ?? null,
                'usuario_registro' => auth()->user()?->name ?? 'Sistema',
            ]);

            foreach ($validated['items'] as $item) {
                $precio = (float) ($item['precio_unitario'] ?? 0);
                $cantidad = (int) $item['cantidad'];
                $subtotal = round($precio * $cantidad, 2);

                $lote = Lote::create([
                    'id_presentacion' => $item['id_presentacion'],
                    'numero_lote' => $item['numero_lote'],
                    'fecha_fabricacion' => $item['fecha_fabricacion'] ?? null,
                    'fecha_vencimiento' => $item['fecha_vencimiento'],
                    'cantidad_inicial' => $cantidad,
                    'cantidad_actual' => 0,
                    'id_ubicacion' => $item['id_ubicacion'] ?? null,
                    'registro_sanitario' => $item['registro_sanitario'] ?? null,
                    'activo' => true,
                ]);

                DetalleEntrada::create([
                    'id_entrada' => $entrada->id_entrada,
                    'id_lote' => $lote->id_lote,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precio > 0 ? $precio : null,
                    'subtotal' => $subtotal > 0 ? $subtotal : null,
                ]);

                $total += $subtotal;
            }

            $entrada->update(['total' => round($total, 2)]);
        });

        return redirect()->route('entradas.index')->with('success', 'Entrada registrada correctamente.');
    }

    public function show(Entrada $entrada): Response
    {
        $entrada->load([
            'proveedor',
            'detalleEntradas.lote.presentacion.medicamento',
            'detalleEntradas.lote.ubicacion',
        ]);

        return Inertia::render('Entradas/Show', [
            'entrada' => $entrada,
        ]);
    }
}
