<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['id_pembelian', 'id_kualitas', 'jumlah', 'harga', 'subtotal'])]
class DetailPembelian extends Model
{
    use HasFactory;

    protected $table = 'detail_pembelian';
    protected $primaryKey = 'id_detail_pembelian';

    public function pembelian(): BelongsTo
    {
        return $this->belongsTo(Pembelian::class, 'id_pembelian', 'id_pembelian');
    }

    public function kualitasBarang(): BelongsTo
    {
        return $this->belongsTo(KualitasBarang::class, 'id_kualitas', 'id_kualitas');
    }
}
