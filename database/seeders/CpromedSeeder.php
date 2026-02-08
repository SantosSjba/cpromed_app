<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Laboratorio;
use App\Models\Seccion;
use App\Models\Ubicacion;
use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CpromedSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSecciones();
        $this->seedUbicaciones();
        $this->seedCategorias();
        $this->seedLaboratorios();
        $this->seedUsuarioAdmin();
    }

    private function seedSecciones(): void
    {
        $secciones = [
            ['codigo' => 'A', 'nombre' => 'Sección A', 'descripcion' => 'Analgésicos y antiinflamatorios'],
            ['codigo' => 'B', 'nombre' => 'Sección B', 'descripcion' => 'Antibióticos y antivirales'],
            ['codigo' => 'C', 'nombre' => 'Sección C', 'descripcion' => 'Medicamentos controlados'],
            ['codigo' => 'D', 'nombre' => 'Sección D', 'descripcion' => 'Inyectables'],
            ['codigo' => 'E', 'nombre' => 'Sección E', 'descripcion' => 'Refrigerados'],
        ];

        foreach ($secciones as $s) {
            Seccion::firstOrCreate(
                ['codigo' => $s['codigo']],
                $s
            );
        }
    }

    private function seedUbicaciones(): void
    {
        $seccionA = Seccion::where('codigo', 'A')->first();
        $seccionB = Seccion::where('codigo', 'B')->first();

        if ($seccionA) {
            foreach (['A1', 'A2', 'A3', 'A4', 'A5'] as $i => $codigo) {
                Ubicacion::firstOrCreate(
                    ['codigo' => $codigo],
                    [
                        'id_seccion' => $seccionA->id_seccion,
                        'fila' => '1',
                        'columna' => (string) ($i + 1),
                        'nivel' => '1',
                        'capacidad_maxima' => 100,
                    ]
                );
            }
        }

        if ($seccionB) {
            foreach (['B1', 'B2', 'B3', 'B4'] as $i => $codigo) {
                Ubicacion::firstOrCreate(
                    ['codigo' => $codigo],
                    [
                        'id_seccion' => $seccionB->id_seccion,
                        'fila' => '1',
                        'columna' => (string) ($i + 1),
                        'nivel' => '1',
                        'capacidad_maxima' => 100,
                    ]
                );
            }
        }
    }

    private function seedCategorias(): void
    {
        $categorias = [
            ['nombre' => 'Analgésicos', 'descripcion' => 'Medicamentos para el dolor'],
            ['nombre' => 'Antiinflamatorios', 'descripcion' => 'Reducen la inflamación'],
            ['nombre' => 'Antibióticos', 'descripcion' => 'Combaten infecciones bacterianas'],
            ['nombre' => 'Antivirales', 'descripcion' => 'Combaten infecciones virales'],
            ['nombre' => 'Antihipertensivos', 'descripcion' => 'Control de presión arterial'],
            ['nombre' => 'Antidiabéticos', 'descripcion' => 'Control de glucosa'],
            ['nombre' => 'Antihistamínicos', 'descripcion' => 'Alergias'],
            ['nombre' => 'Vitaminas y Suplementos', 'descripcion' => 'Complementos nutricionales'],
        ];

        foreach ($categorias as $c) {
            Categoria::firstOrCreate(
                ['nombre' => $c['nombre']],
                $c
            );
        }
    }

    private function seedLaboratorios(): void
    {
        Laboratorio::firstOrCreate(
            ['nombre' => 'Genérico'],
            ['pais_origen' => 'Perú']
        );
    }

    private function seedUsuarioAdmin(): void
    {
        Usuario::firstOrCreate(
            ['username' => 'admin'],
            [
                'password_hash' => Hash::make('password'),
                'nombres' => 'Administrador',
                'apellidos' => 'Sistema',
                'email' => 'admin@cpromed.local',
                'rol' => 'Administrador',
                'activo' => true,
            ]
        );
    }
}
