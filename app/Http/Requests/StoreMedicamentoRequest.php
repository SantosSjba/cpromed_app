<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMedicamentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $formaFarmaceutica = [
            'Tableta', 'Cápsula', 'Jarabe', 'Suspensión', 'Inyectable',
            'Crema', 'Ungüento', 'Gotas', 'Óvulo', 'Supositorio', 'Parche',
            'Inhalador', 'Otro',
        ];
        $viaAdministracion = [
            'Oral', 'Tópica', 'Parenteral', 'Inhalatoria', 'Rectal', 'Vaginal',
            'Oftálmica', 'Ótica', 'Nasal', 'Sublingual', 'Otro',
        ];

        return [
            'codigo_digemid' => ['nullable', 'string', 'max:50', 'unique:medicamentos,codigo_digemid'],
            'codigo_interno' => ['required', 'string', 'max:50', 'unique:medicamentos,codigo_interno'],
            'nombre_generico' => ['required', 'string', 'max:200'],
            'nombre_comercial' => ['nullable', 'string', 'max:200'],
            'id_categoria' => ['nullable', 'exists:categorias,id_categoria'],
            'id_laboratorio' => ['nullable', 'exists:laboratorios,id_laboratorio'],
            'principio_activo' => ['nullable', 'string', 'max:300'],
            'concentracion' => ['nullable', 'string', 'max:100'],
            'forma_farmaceutica' => ['required', Rule::in($formaFarmaceutica)],
            'via_administracion' => ['nullable', Rule::in($viaAdministracion)],
            'requiere_receta' => ['boolean'],
            'controlado' => ['boolean'],
            'temperatura_almacenamiento' => ['nullable', 'string', 'max:50'],
            'activo' => ['boolean'],
            'notas' => ['nullable', 'string'],
        ];
    }
}
