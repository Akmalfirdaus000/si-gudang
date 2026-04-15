<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama_pelanggan', 'alamat', 'no_hp'])]
class Pelanggan extends Model
{
    use HasFactory;

    protected $table = 'pelanggan';
    protected $primaryKey = 'id_pelanggan';

    public function penjualan(): HasMany
    {
        return $this->hasMany(Penjualan::class, 'id_pelanggan', 'id_pelanggan');
    }
}
