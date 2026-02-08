<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMedicamentoRequest;
use App\Http\Requests\UpdateMedicamentoRequest;
use App\Models\Categoria;
use App\Models\Laboratorio;
use App\Models\Medicamento;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicamentoController extends Controller
{
    public function index(Request $request): Response
    {
        $medicamentos = Medicamento::query()
            ->with(['categoria:id_categoria,nombre', 'laboratorio:id_laboratorio,nombre'])
            ->when($request->filled('buscar'), function ($q) use ($request) {
                $b = $request->buscar;
                $q->where(function ($q) use ($b) {
                    $q->where('nombre_generico', 'like', "%{$b}%")
                        ->orWhere('nombre_comercial', 'like', "%{$b}%")
                        ->orWhere('codigo_interno', 'like', "%{$b}%")
                        ->orWhere('codigo_digemid', 'like', "%{$b}%")
                        ->orWhere('principio_activo', 'like', "%{$b}%");
                });
            })
            ->when($request->filled('id_categoria'), fn ($q) => $q->where('id_categoria', $request->id_categoria))
            ->when($request->filled('id_laboratorio'), fn ($q) => $q->where('id_laboratorio', $request->id_laboratorio))
            ->orderBy('nombre_generico')
            ->paginate(10)
            ->withQueryString();

        $categorias = Categoria::where('activo', true)->orderBy('nombre')->get(['id_categoria', 'nombre']);
        $laboratorios = Laboratorio::where('activo', true)->orderBy('nombre')->get(['id_laboratorio', 'nombre']);

        return Inertia::render('Medicamentos/Index', [
            'medicamentos' => $medicamentos,
            'categorias' => $categorias,
            'laboratorios' => $laboratorios,
            'filters' => $request->only(['buscar', 'id_categoria', 'id_laboratorio']),
        ]);
    }

    public function create(): Response
    {
        $categorias = Categoria::where('activo', true)->orderBy('nombre')->get(['id_categoria', 'nombre']);
        $laboratorios = Laboratorio::where('activo', true)->orderBy('nombre')->get(['id_laboratorio', 'nombre']);

        return Inertia::render('Medicamentos/Create', [
            'categorias' => $categorias,
            'laboratorios' => $laboratorios,
        ]);
    }

    public function store(StoreMedicamentoRequest $request): RedirectResponse
    {
        Medicamento::create($request->validated());

        return redirect()->route('medicamentos.index')->with('success', 'Medicamento creado correctamente.');
    }

    public function show(Medicamento $medicamento): Response
    {
        $medicamento->load(['categoria', 'laboratorio', 'presentaciones.ubicacion']);

        return Inertia::render('Medicamentos/Show', [
            'medicamento' => $medicamento,
        ]);
    }

    public function edit(Medicamento $medicamento): Response
    {
        $categorias = Categoria::where('activo', true)->orderBy('nombre')->get(['id_categoria', 'nombre']);
        $laboratorios = Laboratorio::where('activo', true)->orderBy('nombre')->get(['id_laboratorio', 'nombre']);

        return Inertia::render('Medicamentos/Edit', [
            'medicamento' => $medicamento,
            'categorias' => $categorias,
            'laboratorios' => $laboratorios,
        ]);
    }

    public function update(UpdateMedicamentoRequest $request, Medicamento $medicamento): RedirectResponse
    {
        $medicamento->update($request->validated());

        return redirect()->route('medicamentos.index')->with('success', 'Medicamento actualizado correctamente.');
    }

    public function destroy(Medicamento $medicamento): RedirectResponse
    {
        if ($medicamento->presentaciones()->exists()) {
            return back()->with('error', 'No se puede eliminar: tiene presentaciones asociadas.');
        }
        $medicamento->delete();

        return redirect()->route('medicamentos.index')->with('success', 'Medicamento eliminado.');
    }
}
