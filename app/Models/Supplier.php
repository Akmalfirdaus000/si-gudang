<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama_supplier', 'alamat', 'no_hp'])]
class Supplier extends Model
{
    use HasFactory;

    protected $table = 'supplier';
    protected $primaryKey = 'id_supplier';

    public function pembelian(): HasMany
    {
        return $this->hasMany(Pembelian::class, 'id_supplier', 'id_supplier');
    }
}
