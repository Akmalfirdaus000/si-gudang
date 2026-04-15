<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['id_penjualan', 'id_kualitas', 'jumlah', 'harga', 'subtotal'])]
class DetailPenjualan extends Model
{
    use HasFactory;

    protected $table = 'detail_penjualan';
    protected $primaryKey = 'id_detail_penjualan';

    public function penjualan(): BelongsTo
    {
        return $this->belongsTo(Penjualan::class, 'id_penjualan', 'id_penjualan');
    }

    public function kualitasBarang(): BelongsTo
    {
        return $this->belongsTo(KualitasBarang::class, 'id_kualitas', 'id_kualitas');
    }
}
