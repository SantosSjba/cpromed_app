<?php

namespace App\Http\Controllers;

use App\Models\Lote;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoteController extends Controller
{
    public function index(Request $request): Response
    {
        $lotes = Lote::query()
            ->with(['presentacion.medicamento:id_medicamento,nombre_generico,codigo_interno', 'ubicacion:id_ubicacion,codigo'])
            ->when($request->filled('buscar'), function ($q) use ($request) {
                $b = $request->buscar;
                $q->where(function ($q) use ($b) {
                    $q->where('numero_lote', 'like', "%{$b}%")
                        ->orWhereHas('presentacion.medicamento', function ($q) use ($b) {
                            $q->where('nombre_generico', 'like', "%{$b}%")
                                ->orWhere('codigo_interno', 'like', "%{$b}%");
                        });
                });
            })
            ->when($request->filled('vencidos'), function ($q) {
                if (request('vencidos') === '1') {
                    $q->where('fecha_vencimiento', '<', now()->toDateString());
                }
            })
            ->when($request->filled('por_vencer'), function ($q) {
                if (request('por_vencer') === '1') {
                    $q->whereBetween('fecha_vencimiento', [now()->toDateString(), now()->addDays(90)->toDateString()]);
                }
            })
            ->orderBy('fecha_vencimiento')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Lotes/Index', [
            'lotes' => $lotes,
            'filters' => $request->only(['buscar', 'vencidos', 'por_vencer']),
        ]);
    }
}
