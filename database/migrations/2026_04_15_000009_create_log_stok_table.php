<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop if exists to allow clean re-creation for audit trail setup
        Schema::dropIfExists('log_stok');

        Schema::create('log_stok', function (Blueprint $table) {
            $table->id('id_log');
            $table->foreignId('id_kualitas')->constrained('kualitas_barang', 'id_kualitas')->onDelete('cascade');
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade');
            $table->timestamp('tanggal')->useCurrent();
            $table->enum('tipe_perubahan', ['masuk', 'keluar', 'penyesuaian']);
            $table->integer('jumlah');
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_stok');
    }
};
