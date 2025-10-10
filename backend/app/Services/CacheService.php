<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use App\Models\AiTool;
use App\Models\User;
use App\Models\Review;

class CacheService
{
    const CATEGORIES_CACHE_KEY = 'ai_tools_categories';
    const TOOLS_COUNT_CACHE_KEY = 'ai_tools_count';
    const APPROVED_TOOLS_COUNT_CACHE_KEY = 'approved_tools_count';
    const PENDING_TOOLS_COUNT_CACHE_KEY = 'pending_tools_count';
    const USERS_COUNT_CACHE_KEY = 'users_count';
    const REVIEWS_COUNT_CACHE_KEY = 'reviews_count';
    
    const CACHE_TTL = 3600; // 1 hour

    /**
     * Get cached categories or fetch from database
     */
    public static function getCategories(): array
    {
        return Cache::remember(self::CATEGORIES_CACHE_KEY, self::CACHE_TTL, function () {
            return DB::table('ai_tools')
                ->select('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category')
                ->toArray();
        });
    }

    /**
     * Get cached total tools count or fetch from database
     */
    public static function getTotalToolsCount(): int
    {
        return Cache::remember(self::TOOLS_COUNT_CACHE_KEY, self::CACHE_TTL, function () {
            return AiTool::count();
        });
    }

    /**
     * Get cached approved tools count or fetch from database
     */
    public static function getApprovedToolsCount(): int
    {
        return Cache::remember(self::APPROVED_TOOLS_COUNT_CACHE_KEY, self::CACHE_TTL, function () {
            return AiTool::where('status', 'approved')->count();
        });
    }

    /**
     * Get cached pending tools count or fetch from database
     */
    public static function getPendingToolsCount(): int
    {
        return Cache::remember(self::PENDING_TOOLS_COUNT_CACHE_KEY, self::CACHE_TTL, function () {
            return AiTool::where('status', 'pending')->count();
        });
    }

    /**
     * Get cached users count or fetch from database
     */
    public static function getUsersCount(): int
    {
        return Cache::remember(self::USERS_COUNT_CACHE_KEY, self::CACHE_TTL, function () {
            return User::count();
        });
    }

    /**
     * Get cached reviews count or fetch from database
     */
    public static function getReviewsCount(): int
    {
        return Cache::remember(self::REVIEWS_COUNT_CACHE_KEY, self::CACHE_TTL, function () {
            return Review::count();
        });
    }

    /**
     * Clear all AI tools related cache
     */
    public static function clearAiToolsCache(): void
    {
        Cache::forget(self::CATEGORIES_CACHE_KEY);
        Cache::forget(self::TOOLS_COUNT_CACHE_KEY);
        Cache::forget(self::APPROVED_TOOLS_COUNT_CACHE_KEY);
        Cache::forget(self::PENDING_TOOLS_COUNT_CACHE_KEY);
    }

    /**
     * Clear users cache
     */
    public static function clearUsersCache(): void
    {
        Cache::forget(self::USERS_COUNT_CACHE_KEY);
    }

    /**
     * Clear reviews cache
     */
    public static function clearReviewsCache(): void
    {
        Cache::forget(self::REVIEWS_COUNT_CACHE_KEY);
    }

    /**
     * Clear all cache
     */
    public static function clearAllCache(): void
    {
        self::clearAiToolsCache();
        self::clearUsersCache();
        self::clearReviewsCache();
    }

    /**
     * Warm up cache with all data
     */
    public static function warmUpCache(): void
    {
        self::getCategories();
        self::getTotalToolsCount();
        self::getApprovedToolsCount();
        self::getPendingToolsCount();
        self::getUsersCount();
        self::getReviewsCount();
    }

    /**
     * Get cache statistics
     */
    public static function getCacheStats(): array
    {
        return [
            'categories_cached' => Cache::has(self::CATEGORIES_CACHE_KEY),
            'tools_count_cached' => Cache::has(self::TOOLS_COUNT_CACHE_KEY),
            'approved_tools_cached' => Cache::has(self::APPROVED_TOOLS_COUNT_CACHE_KEY),
            'pending_tools_cached' => Cache::has(self::PENDING_TOOLS_COUNT_CACHE_KEY),
            'users_cached' => Cache::has(self::USERS_COUNT_CACHE_KEY),
            'reviews_cached' => Cache::has(self::REVIEWS_COUNT_CACHE_KEY),
        ];
    }

    /**
     * Get cache TTL in seconds
     */
    public static function getCacheTtl(): int
    {
        return self::CACHE_TTL;
    }

    /**
     * Set custom cache TTL (in seconds)
     */
    public static function setCacheTtl(int $ttl): void
    {
        // This would require refactoring to use instance methods
        // For now, we'll use the constant
        // In a production environment, you might want to make this configurable
    }
}
