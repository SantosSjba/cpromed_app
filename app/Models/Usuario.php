<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuario';

    public $timestamps = false;

    protected $fillable = [
        'username',
        'password_hash',
        'nombres',
        'apellidos',
        'email',
        'rol',
        'activo',
        'ultimo_acceso',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'ultimo_acceso' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'id_usuario';
    }

    public function getNombreCompletoAttribute(): string
    {
        return trim("{$this->nombres} {$this->apellidos}");
    }

    public function isAdministrador(): bool
    {
        return $this->rol === 'Administrador';
    }
}
