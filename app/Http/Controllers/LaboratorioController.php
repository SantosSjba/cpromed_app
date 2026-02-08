<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLaboratorioRequest;
use App\Http\Requests\UpdateLaboratorioRequest;
use App\Models\Laboratorio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaboratorioController extends Controller
{
    public function index(Request $request): Response
    {
        $laboratorios = Laboratorio::query()
            ->when($request->filled('buscar'), fn ($q) => $q->where('nombre', 'like', '%'.$request->buscar.'%')
                ->orWhere('pais_origen', 'like', '%'.$request->buscar.'%'))
            ->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Laboratorios/Index', [
            'laboratorios' => $laboratorios,
            'filters' => $request->only(['buscar']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Laboratorios/Create');
    }

    public function store(StoreLaboratorioRequest $request): RedirectResponse
    {
        Laboratorio::create($request->validated());

        return redirect()->route('laboratorios.index')->with('success', 'Laboratorio creado correctamente.');
    }

    public function edit(Laboratorio $laboratorio): Response
    {
        return Inertia::render('Laboratorios/Edit', [
            'laboratorio' => $laboratorio,
        ]);
    }

    public function update(UpdateLaboratorioRequest $request, Laboratorio $laboratorio): RedirectResponse
    {
        $laboratorio->update($request->validated());

        return redirect()->route('laboratorios.index')->with('success', 'Laboratorio actualizado correctamente.');
    }

    public function destroy(Laboratorio $laboratorio): RedirectResponse
    {
        if ($laboratorio->medicamentos()->exists()) {
            return back()->with('error', 'No se puede eliminar: tiene medicamentos asociados.');
        }
        $laboratorio->delete();

        return redirect()->route('laboratorios.index')->with('success', 'Laboratorio eliminado.');
    }
}
