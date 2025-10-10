<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AiTool;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Services\CacheService;

class AiToolController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AiTool::with('user');
        
        // Only show approved tools for regular users
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            $query->where('status', 'approved');
        }
        
        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        
        // Filter by price tier
        if ($request->has('price_tier')) {
            $query->where('price_tier', $request->price_tier);
        }
        
        // Search by name or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        $tools = $query->orderBy('is_featured', 'desc')
                      ->orderBy('rating', 'desc')
                      ->paginate(12);
        
        return response()->json($tools);
    }

    public function myTools(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $query = AiTool::where('user_id', $user->id);
        
        // Filter by status if requested
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $tools = $query->orderBy('created_at', 'desc')
                      ->paginate(20);

        return response()->json($tools);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'url' => 'required|url',
            'image_url' => 'nullable|url',
            'tags' => 'nullable|array',
            'rating' => 'nullable|numeric|min:0|max:5',
            'price_tier' => 'required|integer|in:1,2,3',
            'is_featured' => 'boolean',
            // Note: status is not validated here as it's set automatically to 'pending'
        ]);

        $tool = AiTool::create([
            ...$request->all(),
            'user_id' => $request->user()->id,
            'status' => 'pending', // New tools start as pending
        ]);

        // Clear cache after creating new tool
        CacheService::clearAiToolsCache();
        
        return response()->json([
            'message' => 'AI Tool added successfully',
            'tool' => $tool->load('user')
        ], 201);
    }

    public function show(AiTool $aiTool): JsonResponse
    {
        return response()->json($aiTool->load(['user', 'reviews.user']));
    }

    public function update(Request $request, AiTool $aiTool): JsonResponse
    {
        // Check if user can update this tool
        if ($aiTool->user_id !== $request->user()->id && !in_array($request->user()->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string|max:255',
            'url' => 'sometimes|url',
            'image_url' => 'nullable|url',
            'tags' => 'nullable|array',
            'rating' => 'nullable|numeric|min:0|max:5',
            'price_tier' => 'sometimes|integer|in:1,2,3',
            'is_featured' => 'boolean',
        ]);

        $aiTool->update($request->all());
        
        // Clear cache after updating tool
        CacheService::clearAiToolsCache();

        return response()->json([
            'message' => 'AI Tool updated successfully',
            'tool' => $aiTool->load('user')
        ]);
    }

    public function destroy(Request $request, AiTool $aiTool): JsonResponse
    {
        // Check if user can delete this tool
        if ($aiTool->user_id !== $request->user()->id && !in_array($request->user()->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $aiTool->delete();
        
        // Clear cache after deleting tool
        CacheService::clearAiToolsCache();

        return response()->json(['message' => 'AI Tool deleted successfully']);
    }

    public function categories(): JsonResponse
    {
        $categories = CacheService::getCategories();
        
        return response()->json($categories);
    }
}
