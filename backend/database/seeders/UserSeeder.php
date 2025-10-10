<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Иван Иванов',
            'email' => 'ivan@admin.local',
            'password' => Hash::make('password'),
            'role' => 'owner',
        ]);

        User::create([
            'name' => 'Админ Админов',
            'email' => 'admin@admin.local',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Елена Петрова',
            'email' => 'elena@frontend.local',
            'password' => Hash::make('password'),
            'role' => 'frontend',
        ]);

        User::create([
            'name' => 'Петър Георгиев',
            'email' => 'petar@backend.local',
            'password' => Hash::make('password'),
            'role' => 'backend',
        ]);
    }
}