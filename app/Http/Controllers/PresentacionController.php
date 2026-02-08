<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePresentacionRequest;
use App\Http\Requests\UpdatePresentacionRequest;
use App\Models\Medicamento;
use App\Models\Presentacion;
use App\Models\Ubicacion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PresentacionController extends Controller
{
    public function index(Request $request): Response
    {
        $presentaciones = Presentacion::query()
            ->with(['medicamento:id_medicamento,nombre_generico,codigo_interno', 'ubicacion:id_ubicacion,codigo'])
            ->when($request->filled('buscar'), function ($q) use ($request) {
                $b = $request->buscar;
                $q->whereHas('medicamento', function ($q) use ($b) {
                    $q->where('nombre_generico', 'like', "%{$b}%")
                        ->orWhere('nombre_comercial', 'like', "%{$b}%")
                        ->orWhere('codigo_interno', 'like', "%{$b}%");
                });
            })
            ->when($request->filled('id_medicamento'), fn ($q) => $q->where('id_medicamento', $request->id_medicamento))
            ->orderBy('id_presentacion', 'desc')
            ->paginate(10)
            ->withQueryString();

        $medicamentos = Medicamento::where('activo', true)->orderBy('nombre_generico')->get(['id_medicamento', 'nombre_generico', 'codigo_interno']);

        return Inertia::render('Presentaciones/Index', [
            'presentaciones' => $presentaciones,
            'medicamentos' => $medicamentos,
            'filters' => $request->only(['buscar', 'id_medicamento']),
        ]);
    }

    public function create(): Response
    {
        $medicamentos = Medicamento::where('activo', true)->orderBy('nombre_generico')->get(['id_medicamento', 'nombre_generico', 'codigo_interno']);
        $ubicaciones = Ubicacion::where('activo', true)->orderBy('codigo')->get(['id_ubicacion', 'codigo', 'id_seccion']);

        return Inertia::render('Presentaciones/Create', [
            'medicamentos' => $medicamentos,
            'ubicaciones' => $ubicaciones,
        ]);
    }

    public function store(StorePresentacionRequest $request): RedirectResponse
    {
        Presentacion::create($request->validated());

        return redirect()->route('presentaciones.index')->with('success', 'Presentación creada correctamente.');
    }

    public function edit(Presentacion $presentacion): Response
    {
        $presentacion->load('medicamento');
        $medicamentos = Medicamento::where('activo', true)->orderBy('nombre_generico')->get(['id_medicamento', 'nombre_generico', 'codigo_interno']);
        $ubicaciones = Ubicacion::where('activo', true)->orderBy('codigo')->get(['id_ubicacion', 'codigo', 'id_seccion']);

        return Inertia::render('Presentaciones/Edit', [
            'presentacion' => $presentacion,
            'medicamentos' => $medicamentos,
            'ubicaciones' => $ubicaciones,
        ]);
    }

    public function update(UpdatePresentacionRequest $request, Presentacion $presentacion): RedirectResponse
    {
        $presentacion->update($request->validated());

        return redirect()->route('presentaciones.index')->with('success', 'Presentación actualizada correctamente.');
    }

    public function destroy(Presentacion $presentacion): RedirectResponse
    {
        if ($presentacion->lotes()->exists()) {
            return back()->with('error', 'No se puede eliminar: tiene lotes asociados.');
        }
        $presentacion->delete();

        return redirect()->route('presentaciones.index')->with('success', 'Presentación eliminada.');
    }
}
