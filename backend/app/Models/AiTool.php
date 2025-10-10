<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiTool extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'url',
        'image_url',
        'tags',
        'rating',
        'price_tier',
        'is_featured',
        'user_id',
        'status',
        'approved_at',
        'approved_by',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
        'rating' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getPriceTierNameAttribute(): string
    {
        return match($this->price_tier) {
            1 => 'Free',
            2 => 'Freemium',
            3 => 'Paid',
            default => 'Unknown'
        };
    }
}
