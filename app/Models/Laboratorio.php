<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Laboratorio extends Model
{
    protected $table = 'laboratorios';

    protected $primaryKey = 'id_laboratorio';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'pais_origen',
        'contacto',
        'telefono',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'id_laboratorio';
    }

    public function medicamentos(): HasMany
    {
        return $this->hasMany(Medicamento::class, 'id_laboratorio');
    }
}
