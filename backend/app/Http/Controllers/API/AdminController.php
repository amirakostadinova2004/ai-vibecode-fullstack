<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AiTool;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use App\Services\CacheService;

class AdminController extends Controller
{
    public function __construct()
    {
        // Middleware handled in routes
    }

    public function stats()
    {

        $stats = [
            'totalUsers' => CacheService::getUsersCount(),
            'totalTools' => CacheService::getTotalToolsCount(),
            'totalReviews' => CacheService::getReviewsCount(),
            'pendingTools' => CacheService::getPendingToolsCount(),
            'pendingReviews' => 0, // Will implement review approval later
            'usersByRole' => User::selectRaw('role, count(*) as count')
                ->groupBy('role')
                ->pluck('count', 'role'),
            'recentUsers' => User::latest()->take(5)->get(['id', 'name', 'email', 'role', 'created_at']),
            'recentReviews' => Review::with(['user', 'aiTool'])
                ->latest()
                ->take(5)
                ->get()
        ];

        return response()->json($stats);
    }

    public function users()
    {

        $users = User::select(['id', 'name', 'email', 'role', 'created_at', 'updated_at'])
            ->latest()
            ->paginate(20);

        return response()->json($users);
    }

    public function createUser(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,frontend,backend,user'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        // Clear cache after creating user
        CacheService::clearUsersCache();
        
        return response()->json([
            'message' => 'User created successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ]
        ], 201);
    }

    public function updateUser(Request $request, $id)
    {

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:admin,frontend,backend,user'
        ]);

        $user = User::findOrFail($id);
        
        // Prevent admins from changing owner roles
        if ($request->has('role') && $request->role === 'owner') {
            return response()->json(['error' => 'Cannot change user to owner role'], 403);
        }

        $user->update($request->only(['name', 'email', 'role']));

        // Clear cache after updating user
        CacheService::clearUsersCache();
        
        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->fresh()
        ]);
    }

    public function deleteUser($id)
    {

        $user = User::findOrFail($id);
        
        // Prevent deleting the current user
        if ($user->id === Auth::id()) {
            return response()->json(['error' => 'Cannot delete your own account'], 400);
        }

        // Prevent admins from deleting owners
        if ($user->role === 'owner') {
            return response()->json(['error' => 'Cannot delete owner account'], 403);
        }

        $user->delete();
        
        // Clear cache after deleting user
        CacheService::clearUsersCache();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function reviews()
    {

        $reviews = Review::with(['user:id,name', 'aiTool:id,name'])
            ->latest()
            ->paginate(20);

        return response()->json($reviews);
    }

    public function approveReview($id)
    {

        $review = Review::findOrFail($id);
        $review->update(['approved_at' => now()]);

        return response()->json(['message' => 'Review approved successfully']);
    }

    public function rejectReview($id)
    {

        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Review rejected and deleted']);
    }

    public function contentManagement()
    {

        $pendingTools = AiTool::with(['user', 'reviews'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(20);

        return response()->json($pendingTools);
    }

    public function approveTool($id)
    {

        $tool = AiTool::findOrFail($id);
        $tool->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => Auth::id()
        ]);
        
        // Clear cache after approving tool
        CacheService::clearAiToolsCache();

        return response()->json(['message' => 'Tool approved successfully']);
    }

    public function rejectTool($id)
    {

        $tool = AiTool::findOrFail($id);
        $tool->update([
            'status' => 'rejected',
            'approved_at' => now(),
            'approved_by' => Auth::id()
        ]);
        
        // Clear cache after rejecting tool
        CacheService::clearAiToolsCache();

        return response()->json(['message' => 'Tool rejected successfully']);
    }
}
