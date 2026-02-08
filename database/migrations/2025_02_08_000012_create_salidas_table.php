<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salidas', function (Blueprint $table) {
            $table->increments('id_salida');
            $table->string('numero_atencion', 50)->unique();
            $table->unsignedInteger('id_paciente')->nullable();
            $table->string('paciente_nombre', 200)->nullable();
            $table->enum('tipo_salida', [
                'Dispensación', 'Transferencia', 'Baja', 'Merma', 'Vencido', 'Otro',
            ]);
            $table->dateTime('fecha_salida');
            $table->text('observaciones')->nullable();
            $table->string('usuario_registro', 100)->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->foreign('id_paciente')->references('id_paciente')->on('pacientes')->nullOnDelete();
            $table->index('fecha_salida');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salidas');
    }
};
