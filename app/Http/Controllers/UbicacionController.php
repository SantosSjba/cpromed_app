<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUbicacionRequest;
use App\Http\Requests\UpdateUbicacionRequest;
use App\Models\Seccion;
use App\Models\Ubicacion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UbicacionController extends Controller
{
    public function index(Request $request): Response
    {
        $ubicaciones = Ubicacion::query()
            ->with('seccion:id_seccion,codigo,nombre')
            ->when($request->filled('buscar'), fn ($q) => $q->where('codigo', 'like', '%'.$request->buscar.'%'))
            ->when($request->filled('id_seccion'), fn ($q) => $q->where('id_seccion', $request->id_seccion))
            ->orderBy('codigo')
            ->paginate(10)
            ->withQueryString();

        $secciones = Seccion::where('activo', true)->orderBy('codigo')->get(['id_seccion', 'codigo', 'nombre']);

        return Inertia::render('Ubicaciones/Index', [
            'ubicaciones' => $ubicaciones,
            'secciones' => $secciones,
            'filters' => $request->only(['buscar', 'id_seccion']),
        ]);
    }

    public function create(): Response
    {
        $secciones = Seccion::where('activo', true)->orderBy('codigo')->get(['id_seccion', 'codigo', 'nombre']);

        return Inertia::render('Ubicaciones/Create', [
            'secciones' => $secciones,
        ]);
    }

    public function store(StoreUbicacionRequest $request): RedirectResponse
    {
        Ubicacion::create($request->validated());

        return redirect()->route('ubicaciones.index')->with('success', 'Ubicación creada correctamente.');
    }

    public function edit(Ubicacion $ubicacion): Response
    {
        $ubicacion->load('seccion');
        $secciones = Seccion::where('activo', true)->orderBy('codigo')->get(['id_seccion', 'codigo', 'nombre']);

        return Inertia::render('Ubicaciones/Edit', [
            'ubicacion' => $ubicacion,
            'secciones' => $secciones,
        ]);
    }

    public function update(UpdateUbicacionRequest $request, Ubicacion $ubicacion): RedirectResponse
    {
        $ubicacion->update($request->validated());

        return redirect()->route('ubicaciones.index')->with('success', 'Ubicación actualizada correctamente.');
    }

    public function destroy(Ubicacion $ubicacion): RedirectResponse
    {
        if ($ubicacion->lotes()->exists() || $ubicacion->presentaciones()->exists()) {
            return back()->with('error', 'No se puede eliminar: tiene lotes o presentaciones asociados.');
        }
        $ubicacion->delete();

        return redirect()->route('ubicaciones.index')->with('success', 'Ubicación eliminada.');
    }
}
