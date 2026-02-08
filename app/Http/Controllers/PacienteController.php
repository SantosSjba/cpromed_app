<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePacienteRequest;
use App\Http\Requests\UpdatePacienteRequest;
use App\Models\Paciente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PacienteController extends Controller
{
    public function index(Request $request): Response
    {
        $pacientes = Paciente::query()
            ->when($request->filled('buscar'), function ($q) use ($request) {
                $b = $request->buscar;
                $q->where(function ($q) use ($b) {
                    $q->where('dni', 'like', "%{$b}%")
                        ->orWhere('nombres', 'like', "%{$b}%")
                        ->orWhere('apellidos', 'like', "%{$b}%");
                });
            })
            ->orderBy('apellidos')
            ->orderBy('nombres')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Pacientes/Index', [
            'pacientes' => $pacientes,
            'filters' => $request->only(['buscar']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Pacientes/Create');
    }

    public function store(StorePacienteRequest $request): RedirectResponse
    {
        Paciente::create($request->validated());

        return redirect()->route('pacientes.index')->with('success', 'Paciente creado correctamente.');
    }

    public function edit(Paciente $paciente): Response
    {
        return Inertia::render('Pacientes/Edit', [
            'paciente' => $paciente,
        ]);
    }

    public function update(UpdatePacienteRequest $request, Paciente $paciente): RedirectResponse
    {
        $paciente->update($request->validated());

        return redirect()->route('pacientes.index')->with('success', 'Paciente actualizado correctamente.');
    }

    public function destroy(Paciente $paciente): RedirectResponse
    {
        if ($paciente->salidas()->exists()) {
            return back()->with('error', 'No se puede eliminar: tiene dispensaciones asociadas.');
        }
        $paciente->delete();

        return redirect()->route('pacientes.index')->with('success', 'Paciente eliminado.');
    }
}
