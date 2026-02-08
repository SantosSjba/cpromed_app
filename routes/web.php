<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LaboratorioController;
use App\Http\Controllers\SeccionController;
use App\Http\Controllers\UbicacionController;
use Illuminate\Support\Facades\Route;

Route::get('/', DashboardController::class)->name('dashboard');

Route::resource('categorias', CategoriaController::class);
Route::resource('laboratorios', LaboratorioController::class);
Route::resource('secciones', SeccionController::class);
Route::resource('ubicaciones', UbicacionController::class);
