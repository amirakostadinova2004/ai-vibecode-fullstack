<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    protected $google2fa;

    public function __construct(Google2FA $google2fa)
    {
        $this->google2fa = $google2fa;
    }

    /**
     * Generate a new 2FA secret and QR code for setup
     */
    public function generateSecret(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Generate a new secret key
        $secretKey = $this->google2fa->generateSecretKey();
        
        // Create QR code data
        $companyName = config('app.name', 'RateMyAI');
        $companyEmail = $user->email;
        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            $companyName,
            $companyEmail,
            $secretKey
        );

        return response()->json([
            'secret_key' => $secretKey,
            'qr_code_url' => $qrCodeUrl,
            'manual_entry_key' => $secretKey
        ]);
    }

    /**
     * Enable 2FA for the user
     */
    public function enable(Request $request): JsonResponse
    {
        $request->validate([
            'secret' => 'required|string',
            'code' => 'required|string|size:6'
        ]);

        $user = $request->user();
        $secret = $request->input('secret');
        $code = $request->input('code');

        // Verify the code
        if (!$this->google2fa->verifyKey($secret, $code)) {
            return response()->json([
                'message' => 'Invalid verification code'
            ], 422);
        }

        // Generate recovery codes
        $recoveryCodes = $this->generateRecoveryCodes();

        // Save 2FA settings
        $user->update([
            'two_factor_enabled' => true,
            'two_factor_secret' => encrypt($secret),
            'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes)),
            'two_factor_confirmed_at' => now()
        ]);

        return response()->json([
            'message' => 'Two-factor authentication enabled successfully',
            'recovery_codes' => $recoveryCodes
        ]);
    }

    /**
     * Disable 2FA for the user
     */
    public function disable(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string'
        ]);

        $user = $request->user();

        // Verify password
        if (!Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'Invalid password'
            ], 422);
        }

        // Disable 2FA
        $user->update([
            'two_factor_enabled' => false,
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null
        ]);

        return response()->json([
            'message' => 'Two-factor authentication disabled successfully'
        ]);
    }

    /**
     * Verify 2FA code during login
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $user = $request->user();
        $code = $request->input('code');

        // Check if user has 2FA enabled
        if (!$user->two_factor_enabled || !$user->two_factor_secret) {
            return response()->json([
                'message' => 'Two-factor authentication is not enabled'
            ], 422);
        }

        $secret = decrypt($user->two_factor_secret);

        // Verify the code
        if (!$this->google2fa->verifyKey($secret, $code)) {
            return response()->json([
                'message' => 'Invalid verification code'
            ], 422);
        }

        return response()->json([
            'message' => 'Two-factor authentication verified successfully'
        ]);
    }

    /**
     * Generate new recovery codes
     */
    public function regenerateRecoveryCodes(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->two_factor_enabled) {
            return response()->json([
                'message' => 'Two-factor authentication is not enabled'
            ], 422);
        }

        $recoveryCodes = $this->generateRecoveryCodes();

        $user->update([
            'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes))
        ]);

        return response()->json([
            'message' => 'Recovery codes regenerated successfully',
            'recovery_codes' => $recoveryCodes
        ]);
    }

    /**
     * Verify recovery code
     */
    public function verifyRecoveryCode(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $user = $request->user();
        $code = $request->input('code');

        if (!$user->two_factor_enabled || !$user->two_factor_recovery_codes) {
            return response()->json([
                'message' => 'No recovery codes available'
            ], 422);
        }

        $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);

        // Find and remove the used recovery code
        $codeIndex = array_search($code, $recoveryCodes);
        if ($codeIndex === false) {
            return response()->json([
                'message' => 'Invalid recovery code'
            ], 422);
        }

        // Remove the used code
        unset($recoveryCodes[$codeIndex]);
        $recoveryCodes = array_values($recoveryCodes); // Re-index array

        // Update recovery codes
        $user->update([
            'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes))
        ]);

        return response()->json([
            'message' => 'Recovery code verified successfully'
        ]);
    }

    /**
     * Get 2FA status for the user
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'two_factor_enabled' => $user->two_factor_enabled,
            'has_recovery_codes' => !empty($user->two_factor_recovery_codes)
        ]);
    }

    /**
     * Generate recovery codes
     */
    private function generateRecoveryCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = strtoupper(Str::random(10));
        }
        return $codes;
    }
}