<?php

namespace App\Http\Controllers;

use App\Models\Lote;
use App\Models\Medicamento;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $hoy = now()->toDateString();
        $en30 = now()->addDays(30)->toDateString();
        $en60 = now()->addDays(60)->toDateString();
        $en90 = now()->addDays(90)->toDateString();

        $totalMedicamentos = Medicamento::where('activo', 1)->count();
        $totalLotesConStock = Lote::where('activo', 1)->where('cantidad_actual', '>', 0)->count();

        $valorizado = (float) Lote::query()
            ->where('lotes.activo', 1)
            ->where('lotes.cantidad_actual', '>', 0)
            ->join('presentaciones', 'lotes.id_presentacion', '=', 'presentaciones.id_presentacion')
            ->selectRaw('COALESCE(SUM(lotes.cantidad_actual * COALESCE(presentaciones.precio_compra, 0)), 0) as total')
            ->value('total');

        $vencidos = Lote::where('activo', 1)->where('cantidad_actual', '>', 0)->where('fecha_vencimiento', '<', $hoy)->count();
        $porVencer30 = Lote::where('activo', 1)->where('cantidad_actual', '>', 0)->whereBetween('fecha_vencimiento', [$hoy, $en30])->count();
        $porVencer60 = Lote::where('activo', 1)->where('cantidad_actual', '>', 0)->whereBetween('fecha_vencimiento', [$hoy, $en60])->count();
        $porVencer90 = Lote::where('activo', 1)->where('cantidad_actual', '>', 0)->whereBetween('fecha_vencimiento', [$hoy, $en90])->count();

        $stockBajo = (int) DB::table('lotes')
            ->join('presentaciones', 'lotes.id_presentacion', '=', 'presentaciones.id_presentacion')
            ->where('lotes.activo', 1)
            ->whereRaw('lotes.cantidad_actual <= presentaciones.stock_minimo AND presentaciones.stock_minimo > 0')
            ->count();

        return Inertia::render('Dashboard', [
            'kpis' => [
                'total_medicamentos' => $totalMedicamentos,
                'total_lotes_stock' => $totalLotesConStock,
                'stock_valorizado' => round($valorizado, 2),
                'vencidos' => $vencidos,
                'por_vencer_30' => $porVencer30,
                'por_vencer_60' => $porVencer60,
                'por_vencer_90' => $porVencer90,
                'stock_bajo' => $stockBajo,
            ],
        ]);
    }
}
