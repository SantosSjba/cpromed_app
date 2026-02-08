<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->increments('id_usuario');
            $table->string('username', 50)->unique();
            $table->string('password_hash', 255);
            $table->string('nombres', 150);
            $table->string('apellidos', 150);
            $table->string('email', 100)->nullable();
            $table->enum('rol', ['Administrador', 'Farmacéutico', 'Auxiliar', 'Solo Lectura']);
            $table->boolean('activo')->default(true);
            $table->timestamp('ultimo_acceso')->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
