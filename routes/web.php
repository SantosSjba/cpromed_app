<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ConfiguracionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EntradaController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\LaboratorioController;
use App\Http\Controllers\LoteController;
use App\Http\Controllers\MedicamentoController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\PresentacionController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\SalidaController;
use App\Http\Controllers\SeccionController;
use App\Http\Controllers\UbicacionController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::get('/', DashboardController::class)->name('dashboard');

Route::resource('categorias', CategoriaController::class);
Route::resource('laboratorios', LaboratorioController::class);
Route::resource('secciones', SeccionController::class);
Route::resource('ubicaciones', UbicacionController::class);
Route::resource('medicamentos', MedicamentoController::class);
Route::resource('presentaciones', PresentacionController::class)->except(['show']);
Route::resource('proveedores', ProveedorController::class)->except(['show']);
Route::resource('pacientes', PacienteController::class)->except(['show']);
Route::resource('entradas', EntradaController::class)->only(['index', 'create', 'store', 'show']);
Route::get('lotes', [LoteController::class, 'index'])->name('lotes.index');
Route::resource('salidas', SalidaController::class)->only(['index', 'create', 'store', 'show']);
Route::resource('inventarios', InventarioController::class)->only(['index', 'create', 'store', 'show']);
Route::get('reportes', [ReporteController::class, 'index'])->name('reportes.index');
Route::resource('usuarios', UsuarioController::class)->except(['show', 'destroy']);
Route::get('configuracion', ConfiguracionController::class)->name('configuracion.index');
