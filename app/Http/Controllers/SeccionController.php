<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSeccionRequest;
use App\Http\Requests\UpdateSeccionRequest;
use App\Models\Seccion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeccionController extends Controller
{
    public function index(Request $request): Response
    {
        $secciones = Seccion::query()
            ->withCount('ubicaciones')
            ->when($request->filled('buscar'), fn ($q) => $q->where('codigo', 'like', '%'.$request->buscar.'%')
                ->orWhere('nombre', 'like', '%'.$request->buscar.'%'))
            ->orderBy('codigo')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Secciones/Index', [
            'secciones' => $secciones,
            'filters' => $request->only(['buscar']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Secciones/Create');
    }

    public function store(StoreSeccionRequest $request): RedirectResponse
    {
        Seccion::create($request->validated());

        return redirect()->route('secciones.index')->with('success', 'Sección creada correctamente.');
    }

    public function edit(Seccion $seccion): Response
    {
        return Inertia::render('Secciones/Edit', [
            'seccion' => $seccion,
        ]);
    }

    public function update(UpdateSeccionRequest $request, Seccion $seccion): RedirectResponse
    {
        $seccion->update($request->validated());

        return redirect()->route('secciones.index')->with('success', 'Sección actualizada correctamente.');
    }

    public function destroy(Seccion $seccion): RedirectResponse
    {
        if ($seccion->ubicaciones()->exists()) {
            return back()->with('error', 'No se puede eliminar: tiene ubicaciones asociadas.');
        }
        $seccion->delete();

        return redirect()->route('secciones.index')->with('success', 'Sección eliminada.');
    }
}
