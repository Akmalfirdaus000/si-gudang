<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['id_kualitas', 'jumlah_stok', 'stok_minimum', 'last_update'])]
class Stok extends Model
{
    use HasFactory;

    protected $table = 'stok';
    protected $primaryKey = 'id_kualitas';
    public $incrementing = false;

    public function kualitasBarang(): BelongsTo
    {
        return $this->belongsTo(KualitasBarang::class, 'id_kualitas', 'id_kualitas');
    }
}
