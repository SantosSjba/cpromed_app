<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotes', function (Blueprint $table) {
            $table->increments('id_lote');
            $table->unsignedInteger('id_presentacion');
            $table->string('numero_lote', 50);
            $table->date('fecha_fabricacion')->nullable();
            $table->date('fecha_vencimiento');
            $table->unsignedInteger('cantidad_inicial');
            $table->unsignedInteger('cantidad_actual');
            $table->unsignedInteger('id_ubicacion')->nullable();
            $table->string('registro_sanitario', 100)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->foreign('id_presentacion')->references('id_presentacion')->on('presentaciones')->cascadeOnDelete();
            $table->foreign('id_ubicacion')->references('id_ubicacion')->on('ubicaciones')->nullOnDelete();
            $table->unique(['id_presentacion', 'numero_lote']);
            $table->index('fecha_vencimiento');
            $table->index('activo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotes');
    }
};
