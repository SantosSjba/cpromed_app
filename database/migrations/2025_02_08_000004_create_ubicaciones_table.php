<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ubicaciones', function (Blueprint $table) {
            $table->increments('id_ubicacion');
            $table->unsignedInteger('id_seccion');
            $table->string('codigo', 20)->unique();
            $table->string('fila', 10)->nullable();
            $table->string('columna', 10)->nullable();
            $table->string('nivel', 10)->nullable();
            $table->unsignedInteger('capacidad_maxima')->nullable();
            $table->boolean('ocupado')->default(false);
            $table->boolean('activo')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->foreign('id_seccion')->references('id_seccion')->on('secciones')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ubicaciones');
    }
};
