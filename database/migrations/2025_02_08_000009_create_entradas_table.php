<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entradas', function (Blueprint $table) {
            $table->increments('id_entrada');
            $table->string('numero_documento', 50)->unique();
            $table->enum('tipo_documento', [
                'Factura', 'Boleta', 'Guía de Remisión', 'Nota de Crédito', 'Otro',
            ]);
            $table->unsignedInteger('id_proveedor')->nullable();
            $table->date('fecha_entrada');
            $table->date('fecha_documento')->nullable();
            $table->decimal('total', 10, 2)->nullable();
            $table->text('observaciones')->nullable();
            $table->string('usuario_registro', 100)->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->foreign('id_proveedor')->references('id_proveedor')->on('proveedores')->nullOnDelete();
            $table->index('fecha_entrada');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entradas');
    }
};
