<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lote extends Model
{
    protected $table = 'lotes';

    protected $primaryKey = 'id_lote';

    public $timestamps = false;

    protected $fillable = [
        'id_presentacion',
        'numero_lote',
        'fecha_fabricacion',
        'fecha_vencimiento',
        'cantidad_inicial',
        'cantidad_actual',
        'id_ubicacion',
        'registro_sanitario',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'fecha_fabricacion' => 'date',
            'fecha_vencimiento' => 'date',
            'activo' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'id_lote';
    }

    public function presentacion(): BelongsTo
    {
        return $this->belongsTo(Presentacion::class, 'id_presentacion');
    }

    public function ubicacion(): BelongsTo
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion');
    }

    public function detalleEntradas(): HasMany
    {
        return $this->hasMany(DetalleEntrada::class, 'id_lote');
    }

    public function detalleSalidas(): HasMany
    {
        return $this->hasMany(DetalleSalida::class, 'id_lote');
    }

    public function isVencido(): bool
    {
        return $this->fecha_vencimiento->isPast();
    }

    public function diasParaVencer(): int
    {
        return (int) now()->diffInDays($this->fecha_vencimiento, false);
    }
}
