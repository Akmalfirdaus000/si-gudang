<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seeder Akun
        \App\Models\User::create([
            'name' => 'Admin Gudang',
            'email' => 'gudang@gmail.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin_gudang',
        ]);

        \App\Models\User::create([
            'name' => 'Pemilik Toko',
            'email' => 'pemilik@gmail.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'pemilik',
        ]);

        // Seeder Kualitas Barang
        \DB::table('kualitas_barang')->insert([
            [
                'kode_kualitas' => 'STK',
                'nama_kualitas' => 'Stik',
                'harga_default' => 39000,
                'deskripsi' => 'Kualitas stik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode_kualitas' => 'KF',
                'nama_kualitas' => 'KF',
                'harga_default' => 33000,
                'deskripsi' => 'Kualitas KF',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode_kualitas' => 'PTH',
                'nama_kualitas' => 'Pth',
                'harga_default' => 26000,
                'deskripsi' => 'Kualitas patah',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode_kualitas' => 'KB',
                'nama_kualitas' => 'KB',
                'harga_default' => 20000,
                'deskripsi' => 'Kualitas kecil/biasa',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Seeder Supplier
        \DB::table('supplier')->insert([
            [
                'nama_supplier' => 'Bpk. Sugeng (Supplier Kerinci)',
                'alamat' => 'Kerinci, Jambi',
                'no_hp' => '081234567890',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_supplier' => 'Ibu Maria',
                'alamat' => 'Sungai Penuh',
                'no_hp' => '089876543210',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Seeder Pelanggan
        \DB::table('pelanggan')->insert([
            [
                'nama_pelanggan' => 'Toko Berkah Padang',
                'alamat' => 'Padang, Sumatera Barat',
                'no_hp' => '081122334455',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_pelanggan' => 'CV Kayu Harum',
                'alamat' => 'Jakarta Timur',
                'no_hp' => '085566778899',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
