<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['id_kualitas', 'tanggal', 'tipe', 'jumlah', 'keterangan'])]
class LogStok extends Model
{
    use HasFactory;

    protected $table = 'log_stok';
    protected $primaryKey = 'id_log';

    public function kualitasBarang(): BelongsTo
    {
        return $this->belongsTo(KualitasBarang::class, 'id_kualitas', 'id_kualitas');
    }
}
