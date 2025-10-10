<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\AiTool;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ai_tool_id' => 'required|exists:ai_tools,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Check if user already reviewed this tool
        $existingReview = Review::where('user_id', $user->id)
            ->where('ai_tool_id', $request->ai_tool_id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this tool. You can update your existing review.'
            ], 409);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'ai_tool_id' => $request->ai_tool_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Load the user relationship for the response
        $review->load('user');

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review
        ], 201);
    }

    public function update(Request $request, Review $review): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Check if the review belongs to the authenticated user
        if ($review->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to update this review'
            ], 403);
        }

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Load the user relationship for the response
        $review->load('user');

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review
        ]);
    }

    public function destroy(Request $request, Review $review): JsonResponse
    {
        $user = $request->user();

        // Check if the review belongs to the authenticated user
        if ($review->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this review'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully'
        ]);
    }
}
