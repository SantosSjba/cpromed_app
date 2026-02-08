<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ConfiguracionController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Configuracion/Index', [
            'app_name' => config('app.name'),
            'env' => config('app.env'),
            'debug' => config('app.debug'),
        ]);
    }
}
