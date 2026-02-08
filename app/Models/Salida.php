<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Salida extends Model
{
    protected $table = 'salidas';

    protected $primaryKey = 'id_salida';

    public $timestamps = false;

    protected $fillable = [
        'numero_atencion',
        'id_paciente',
        'paciente_nombre',
        'tipo_salida',
        'fecha_salida',
        'observaciones',
        'usuario_registro',
    ];

    protected function casts(): array
    {
        return [
            'fecha_salida' => 'datetime',
        ];
    }

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'id_paciente');
    }

    public function detalleSalidas(): HasMany
    {
        return $this->hasMany(DetalleSalida::class, 'id_salida');
    }
}
