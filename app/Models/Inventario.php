<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventario extends Model
{
    protected $table = 'inventarios';

    protected $primaryKey = 'id_inventario';

    public $timestamps = false;

    protected $fillable = [
        'fecha_inventario',
        'tipo',
        'observaciones',
        'usuario_responsable',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inventario' => 'date',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'id_inventario';
    }

    public function detalleInventarios(): HasMany
    {
        return $this->hasMany(DetalleInventario::class, 'id_inventario');
    }
}
