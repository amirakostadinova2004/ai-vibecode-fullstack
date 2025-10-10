<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class WarmUpCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:warm-up';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Warm up the application cache with frequently accessed data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting cache warm-up...');
        
        // Warm up all cache
        \App\Services\CacheService::warmUpCache();
        
        $this->info('Cache warm-up completed successfully!');
        
        // Show cache stats
        $stats = \App\Services\CacheService::getCacheStats();
        $this->info('Cache status:');
        foreach ($stats as $key => $cached) {
            $status = $cached ? '✅ Cached' : '❌ Not cached';
            $this->line("  {$key}: {$status}");
        }
        
        return 0;
    }
}
