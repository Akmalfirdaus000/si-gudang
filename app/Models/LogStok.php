<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['id_kualitas', 'id_user', 'tanggal', 'tipe_perubahan', 'jumlah', 'keterangan'])]
class LogStok extends Model
{
    use HasFactory;

    protected $table = 'log_stok';
    protected $primaryKey = 'id_log';

    public function kualitas(): BelongsTo
    {
        return $this->belongsTo(KualitasBarang::class, 'id_kualitas', 'id_kualitas');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}
