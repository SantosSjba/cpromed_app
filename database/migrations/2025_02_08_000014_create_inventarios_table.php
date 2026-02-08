<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventarios', function (Blueprint $table) {
            $table->increments('id_inventario');
            $table->date('fecha_inventario');
            $table->enum('tipo', ['Total', 'Parcial', 'Cíclico']);
            $table->text('observaciones')->nullable();
            $table->string('usuario_responsable', 100)->nullable();
            $table->enum('estado', ['En Proceso', 'Completado', 'Cancelado'])->default('En Proceso');
            $table->timestamp('fecha_creacion')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventarios');
    }
};
