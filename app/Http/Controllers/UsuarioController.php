<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use App\Models\Usuario;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    public function index(Request $request): Response
    {
        $usuarios = Usuario::query()
            ->when($request->filled('buscar'), function ($q) use ($request) {
                $b = $request->buscar;
                $q->where(function ($q) use ($b) {
                    $q->where('username', 'like', "%{$b}%")
                        ->orWhere('nombres', 'like', "%{$b}%")
                        ->orWhere('apellidos', 'like', "%{$b}%")
                        ->orWhere('email', 'like', "%{$b}%");
                });
            })
            ->when($request->filled('rol'), fn ($q) => $q->where('rol', $request->rol))
            ->orderBy('username')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
            'filters' => $request->only(['buscar', 'rol']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Usuarios/Create');
    }

    public function store(StoreUsuarioRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        Usuario::create([
            'username' => $validated['username'],
            'password_hash' => bcrypt($validated['password']),
            'nombres' => $validated['nombres'],
            'apellidos' => $validated['apellidos'],
            'email' => $validated['email'] ?? null,
            'rol' => $validated['rol'],
            'activo' => $validated['activo'] ?? true,
        ]);

        return redirect()->route('usuarios.index')->with('success', 'Usuario creado correctamente.');
    }

    public function edit(Usuario $usuario): Response
    {
        return Inertia::render('Usuarios/Edit', [
            'usuario' => $usuario->only(['id_usuario', 'username', 'nombres', 'apellidos', 'email', 'rol', 'activo']),
        ]);
    }

    public function update(UpdateUsuarioRequest $request, Usuario $usuario): RedirectResponse
    {
        $validated = $request->validated();
        $data = [
            'username' => $validated['username'],
            'nombres' => $validated['nombres'],
            'apellidos' => $validated['apellidos'],
            'email' => $validated['email'] ?? null,
            'rol' => $validated['rol'],
            'activo' => $validated['activo'] ?? true,
        ];
        if (! empty($validated['password'])) {
            $data['password_hash'] = bcrypt($validated['password']);
        }
        $usuario->update($data);

        return redirect()->route('usuarios.index')->with('success', 'Usuario actualizado correctamente.');
    }
}
