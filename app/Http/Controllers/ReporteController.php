<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReporteController extends Controller
{
    public function index(): Response
    {
        $usarVistas = config('database.default') === 'mysql';

        $stockActual = [];
        $proximosVencer = [];

        if ($usarVistas) {
            try {
                $stockActual = DB::table('v_stock_actual')
                    ->orderBy('nombre_generico')
                    ->orderBy('numero_lote')
                    ->limit(500)
                    ->get();
                $proximosVencer = DB::table('v_proximos_vencer')
                    ->limit(200)
                    ->get();
            } catch (\Throwable) {
                $usarVistas = false;
            }
        }

        return Inertia::render('Reportes/Index', [
            'stock_actual' => $stockActual,
            'proximos_vencer' => $proximosVencer,
            'usar_vistas' => $usarVistas,
        ]);
    }
}
