<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AiTool;
use App\Models\User;

class AiToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->info('No users found. Please run UserSeeder first.');
            return;
        }

        $sampleTools = [
            [
                'name' => 'ChatGPT',
                'description' => 'Advanced AI language model for conversation, writing, and problem-solving',
                'category' => 'Text Generation',
                'url' => 'https://chat.openai.com',
                'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
                'tags' => ['AI', 'Chat', 'Writing', 'Assistant'],
                'rating' => 4.8,
                'price_tier' => 2,
                'is_featured' => true,
            ],
            [
                'name' => 'Midjourney',
                'description' => 'AI-powered image generation tool for creating stunning artwork and designs',
                'category' => 'Image Generation',
                'url' => 'https://www.midjourney.com',
                'image_url' => 'https://cdn.midjourney.com/logo.png',
                'tags' => ['AI', 'Art', 'Images', 'Design'],
                'rating' => 4.7,
                'price_tier' => 3,
                'is_featured' => true,
            ],
            [
                'name' => 'GitHub Copilot',
                'description' => 'AI pair programmer that helps you write code faster and with fewer errors',
                'category' => 'Code Generation',
                'url' => 'https://github.com/features/copilot',
                'image_url' => 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.png',
                'tags' => ['AI', 'Coding', 'Programming', 'Development'],
                'rating' => 4.5,
                'price_tier' => 3,
                'is_featured' => true,
            ],
            [
                'name' => 'Notion AI',
                'description' => 'AI writing assistant integrated into Notion for better productivity',
                'category' => 'Productivity',
                'url' => 'https://www.notion.so/product/ai',
                'image_url' => 'https://www.notion.so/images/logo-ios.png',
                'tags' => ['AI', 'Writing', 'Productivity', 'Notes'],
                'rating' => 4.3,
                'price_tier' => 2,
                'is_featured' => false,
            ],
            [
                'name' => 'Grammarly',
                'description' => 'AI-powered writing assistant for grammar, style, and clarity improvements',
                'category' => 'Writing Assistant',
                'url' => 'https://www.grammarly.com',
                'image_url' => 'https://static.grammarly.com/assets/files/cb6ce17d281d2341d19a80f0e6aa031e/grammarly_logo.png',
                'tags' => ['AI', 'Grammar', 'Writing', 'Proofreading'],
                'rating' => 4.6,
                'price_tier' => 2,
                'is_featured' => false,
            ],
            [
                'name' => 'DALL-E 2',
                'description' => 'OpenAI\'s AI system that can create realistic images from text descriptions',
                'category' => 'Image Generation',
                'url' => 'https://openai.com/dall-e-2',
                'image_url' => 'https://openai.com/content/images/2022/05/dall-e-2.png',
                'tags' => ['AI', 'Images', 'Art', 'OpenAI'],
                'rating' => 4.4,
                'price_tier' => 3,
                'is_featured' => false,
            ],
            [
                'name' => 'Jasper AI',
                'description' => 'AI content creation platform for marketing copy, blogs, and social media',
                'category' => 'Content Creation',
                'url' => 'https://www.jasper.ai',
                'image_url' => 'https://www.jasper.ai/favicon.ico',
                'tags' => ['AI', 'Content', 'Marketing', 'Writing'],
                'rating' => 4.2,
                'price_tier' => 3,
                'is_featured' => false,
            ],
            [
                'name' => 'Canva AI',
                'description' => 'AI-powered design tool for creating graphics, presentations, and social media content',
                'category' => 'Design',
                'url' => 'https://www.canva.com/ai-image-generator',
                'image_url' => 'https://static.canva.com/web/images/favicon.ico',
                'tags' => ['AI', 'Design', 'Graphics', 'Templates'],
                'rating' => 4.1,
                'price_tier' => 2,
                'is_featured' => false,
            ],
            [
                'name' => 'Otter.ai',
                'description' => 'AI-powered transcription and meeting notes tool',
                'category' => 'Transcription',
                'url' => 'https://otter.ai',
                'image_url' => 'https://otter.ai/favicon.ico',
                'tags' => ['AI', 'Transcription', 'Meetings', 'Notes'],
                'rating' => 4.0,
                'price_tier' => 2,
                'is_featured' => false,
            ],
            [
                'name' => 'Runway ML',
                'description' => 'Creative AI tools for video editing, image generation, and content creation',
                'category' => 'Video Editing',
                'url' => 'https://runwayml.com',
                'image_url' => 'https://runwayml.com/favicon.ico',
                'tags' => ['AI', 'Video', 'Editing', 'Creative'],
                'rating' => 4.3,
                'price_tier' => 2,
                'is_featured' => false,
            ],
        ];

        foreach ($sampleTools as $toolData) {
            AiTool::create([
                ...$toolData,
                'user_id' => $users->random()->id,
            ]);
        }

        $this->command->info('AI Tools seeded successfully!');
    }
}
