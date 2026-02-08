<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProveedorRequest;
use App\Http\Requests\UpdateProveedorRequest;
use App\Models\Proveedor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProveedorController extends Controller
{
    public function index(Request $request): Response
    {
        $proveedores = Proveedor::query()
            ->when($request->filled('buscar'), function ($q) use ($request) {
                $b = $request->buscar;
                $q->where(function ($q) use ($b) {
                    $q->where('razon_social', 'like', "%{$b}%")
                        ->orWhere('nombre_comercial', 'like', "%{$b}%")
                        ->orWhere('ruc', 'like', "%{$b}%");
                });
            })
            ->orderBy('razon_social')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Proveedores/Index', [
            'proveedores' => $proveedores,
            'filters' => $request->only(['buscar']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Proveedores/Create');
    }

    public function store(StoreProveedorRequest $request): RedirectResponse
    {
        Proveedor::create($request->validated());

        return redirect()->route('proveedores.index')->with('success', 'Proveedor creado correctamente.');
    }

    public function edit(Proveedor $proveedor): Response
    {
        return Inertia::render('Proveedores/Edit', [
            'proveedor' => $proveedor,
        ]);
    }

    public function update(UpdateProveedorRequest $request, Proveedor $proveedor): RedirectResponse
    {
        $proveedor->update($request->validated());

        return redirect()->route('proveedores.index')->with('success', 'Proveedor actualizado correctamente.');
    }

    public function destroy(Proveedor $proveedor): RedirectResponse
    {
        if ($proveedor->entradas()->exists()) {
            return back()->with('error', 'No se puede eliminar: tiene entradas asociadas.');
        }
        $proveedor->delete();

        return redirect()->route('proveedores.index')->with('success', 'Proveedor eliminado.');
    }
}
