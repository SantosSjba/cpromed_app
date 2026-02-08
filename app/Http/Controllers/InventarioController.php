<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventarioRequest;
use App\Models\DetalleInventario;
use App\Models\Inventario;
use App\Models\Lote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventarioController extends Controller
{
    public function index(Request $request): Response
    {
        $inventarios = Inventario::query()
            ->when($request->filled('buscar'), function ($q) use ($request) {
                $b = $request->buscar;
                $q->where('observaciones', 'like', "%{$b}%")
                    ->orWhere('usuario_responsable', 'like', "%{$b}%");
            })
            ->when($request->filled('estado'), fn ($q) => $q->where('estado', $request->estado))
            ->when($request->filled('desde'), fn ($q) => $q->whereDate('fecha_inventario', '>=', $request->desde))
            ->when($request->filled('hasta'), fn ($q) => $q->whereDate('fecha_inventario', '<=', $request->hasta))
            ->orderBy('fecha_inventario', 'desc')
            ->orderBy('id_inventario', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Inventarios/Index', [
            'inventarios' => $inventarios,
            'filters' => $request->only(['buscar', 'estado', 'desde', 'hasta']),
        ]);
    }

    public function create(): Response
    {
        $lotes = Lote::with(['presentacion.medicamento:id_medicamento,nombre_generico', 'ubicacion:id_ubicacion,codigo'])
            ->where('activo', true)
            ->where('cantidad_actual', '>', 0)
            ->orderBy('fecha_vencimiento')
            ->get(['id_lote', 'id_presentacion', 'id_ubicacion', 'numero_lote', 'cantidad_actual', 'fecha_vencimiento']);

        return Inertia::render('Inventarios/Create', [
            'lotes' => $lotes,
        ]);
    }

    public function store(StoreInventarioRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $inv = Inventario::create([
                'fecha_inventario' => $validated['fecha_inventario'],
                'tipo' => $validated['tipo'],
                'observaciones' => $validated['observaciones'] ?? null,
                'usuario_responsable' => $validated['usuario_responsable'] ?? null,
                'estado' => 'En Proceso',
            ]);

            $idLotes = [];
            foreach ($validated['items'] as $item) {
                $idLote = (int) $item['id_lote'];
                if (in_array($idLote, $idLotes, true)) {
                    continue;
                }
                $idLotes[] = $idLote;
                $lote = Lote::findOrFail($idLote);
                $cantSistema = (int) $lote->cantidad_actual;
                $cantFisica = array_key_exists('cantidad_fisica', $item) && $item['cantidad_fisica'] !== '' && $item['cantidad_fisica'] !== null
                    ? (int) $item['cantidad_fisica']
                    : null;
                $diferencia = $cantFisica !== null ? $cantFisica - $cantSistema : null;

                DetalleInventario::create([
                    'id_inventario' => $inv->id_inventario,
                    'id_lote' => $idLote,
                    'cantidad_sistema' => $cantSistema,
                    'cantidad_fisica' => $cantFisica,
                    'diferencia' => $diferencia,
                    'observaciones' => $item['observaciones'] ?? null,
                ]);
            }
        });

        return redirect()->route('inventarios.index')->with('success', 'Inventario registrado correctamente.');
    }

    public function show(Inventario $inventario): Response
    {
        $inventario->load([
            'detalleInventarios.lote.presentacion.medicamento:id_medicamento,nombre_generico,codigo_interno',
            'detalleInventarios.lote.ubicacion:id_ubicacion,codigo',
        ]);

        return Inertia::render('Inventarios/Show', [
            'inventario' => $inventario,
        ]);
    }
}
