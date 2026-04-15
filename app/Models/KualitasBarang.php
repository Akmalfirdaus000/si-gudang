<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['kode_kualitas', 'nama_kualitas', 'harga_default', 'deskripsi'])]
class KualitasBarang extends Model
{
    use HasFactory;

    protected $table = 'kualitas_barang';
    protected $primaryKey = 'id_kualitas';

    public function stok(): HasOne
    {
        return $this->hasOne(Stok::class, 'id_kualitas', 'id_kualitas');
    }

    public function detailPembelian(): HasMany
    {
        return $this->hasMany(DetailPembelian::class, 'id_kualitas', 'id_kualitas');
    }

    public function detailPenjualan(): HasMany
    {
        return $this->hasMany(DetailPenjualan::class, 'id_kualitas', 'id_kualitas');
    }

    public function logStok(): HasMany
    {
        return $this->hasMany(LogStok::class, 'id_kualitas', 'id_kualitas');
    }
}
