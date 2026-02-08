<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ubicacion extends Model
{
    protected $table = 'ubicaciones';

    protected $primaryKey = 'id_ubicacion';

    public $timestamps = false;

    protected $fillable = [
        'id_seccion',
        'codigo',
        'fila',
        'columna',
        'nivel',
        'capacidad_maxima',
        'ocupado',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'ocupado' => 'boolean',
            'activo' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'id_ubicacion';
    }

    public function seccion(): BelongsTo
    {
        return $this->belongsTo(Seccion::class, 'id_seccion');
    }

    public function lotes(): HasMany
    {
        return $this->hasMany(Lote::class, 'id_ubicacion');
    }

    public function presentaciones(): HasMany
    {
        return $this->hasMany(Presentacion::class, 'id_ubicacion');
    }
}
