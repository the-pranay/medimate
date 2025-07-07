# MediMate Project Cleanup Script
# This script removes all testing files, documentation, and old folders

Write-Host "🧹 Starting MediMate Project Cleanup..." -ForegroundColor Green

# Define arrays of files and folders to remove
$oldFolders = @(
    "app\admin-dashboard",
    "app\admin-database", 
    "app\admin-doctors",
    "app\admin-features",
    "app\admin-monitoring",
    "app\admin-patients",
    "app\admin-profile",
    "app\admin-reports",
    "app\admin-settings",
    "app\admin-users",
    "app\doctor-appointments",
    "app\doctor-dashboard",
    "app\doctor-dashboard-simple",
    "app\doctor-messages",
    "app\doctor-patients",
    "app\doctor-prescriptions",
    "app\doctor-reports",
    "app\patient-appointments",
    "app\patient-dashboard",
    "app\patient-doctors",
    "app\patient-messages",
    "app\patient-prescriptions",
    "app\patient-reports",
    "app\debug-auth",
    "app\demo",
    "app\env-test",
    "scripts"
)

$testFiles = @(
    "analyze-doctor-appointments-code.js",
    "create-favicon-ico.js",
    "create-favicon.js", 
    "create-ico.js",
    "dashboard-test.html",
    "debug-dashboard.html",
    "debug-doctor-registration.js",
    "favicon-generator.html",
    "final-audit-script.js",
    "final-test.js",
    "functionality-test-suite.html",
    "generate-demo-hash.js",
    "generate-keys.js",
    "login-test.html",
    "manual-verification.js",
    "payment-verification.js",
    "test-all-requirements.js",
    "test-api-endpoints.js",
    "test-api.html",
    "test-appointment-apis.js",
    "test-appointment-flow.js",
    "test-appointments-api.mjs",
    "test-appointments-endpoint.js",
    "test-auth-apis.js",
    "test-auth-flow.js",
    "test-booking-process.js",
    "test-bug-fixes.js",
    "test-complete-flow.js",
    "test-comprehensive-features.js",
    "test-comprehensive-fixes.js",
    "test-dashboard-buttons.js",
    "test-dashboard-flow.js",
    "test-doctor-e2e.js",
    "test-doctor-registration-api.js",
    "test-doctor-registration.js",
    "test-duplicate-registration.js",
    "test-e2e-appointment-flow-fixed.js",
    "test-e2e-appointment-flow.js",
    "test-e2e-logout.js",
    "test-env.js",
    "test-final-comprehensive.js",
    "test-flow-new.js",
    "test-flow.js",
    "test-full-user-flow.js",
    "test-hash.js",
    "test-infinite-reload-detection.js",
    "test-jwt-debug.js",
    "test-login-api.html",
    "test-login.js",
    "test-logout-comprehensive.js",
    "test-logout-functionality.js",
    "test-messaging-system.js",
    "test-mongodb-connection.js",
    "test-patient-e2e.js",
    "test-patient-registration-api.js",
    "test-patient-registration.js",
    "test-payment-flow.js",
    "test-payment.js",
    "test-payment.mjs",
    "test-photo-upload.mjs",
    "test-profile-api.html",
    "test-profile-photo-upload.js",
    "test-registration-dashboard.html",
    "test-registration-to-dashboard.js",
    "test-registration.js",
    "test-upload-cloudinary.js",
    "test-vercel.js",
    "verify-fixes.sh",
    "vercel-env-vars.txt",
    "manual-test-guide.md"
)

$documentationFiles = @(
    "ADMIN_DASHBOARD_COMPLETE_FIXES.md",
    "ADMIN_FIXES_SUMMARY.md",
    "ADMIN_PROFILE_FIXES.md",
    "ALL_FIXES_COMPLETE.md",
    "API_KEYS_SETUP.md",
    "APPOINTMENT_AUTO_RELOAD_FIX.md",
    "APPOINTMENT_VIDEO_FIXES.md",
    "BACKEND_README.md",
    "BOOKING_PROCESS_ANALYSIS.md",
    "BUG_FIXES_COMPLETE.md",
    "BUILD_SUCCESS_SUMMARY.md",
    "CLOUDINARY_INTEGRATION.md",
    "COMPLETE_FIXES_REPORT.md",
    "CONSOLE_ERRORS_FIX_SUMMARY.md",
    "DOCTOR_APPOINTMENTS_FINAL_ANALYSIS.md",
    "E2E-TEST-RESULTS.md",
    "ENVIRONMENT_SETUP.md",
    "FEATURES_COMPLETE.md",
    "FINAL_COMPLETION_SUMMARY.md",
    "FINAL_FIXES_SUMMARY.md",
    "FINAL_SETUP_CHECKLIST.md",
    "FINAL_STATUS_CHECK.md",
    "FIXES-COMPLETED.md",
    "FOLDER_REORGANIZATION_STATUS.md",
    "FOLDER_REORGANIZATION_STATUS_COMPLETE.md",
    "FONT_PRELOAD_WARNING_ANALYSIS.md",
    "FUNCTIONALITY_AUDIT_REPORT.md",
    "HEALTHCARE_LOADERS_GUIDE.md",
    "IMPLEMENTATION_COMPLETE.md",
    "INFINITE_RELOAD_FIX_ANALYSIS.md",
    "INFINITE_RELOAD_TEST_REPORT.md",
    "LOADER_IMPLEMENTATION_PLAN.md",
    "LOADER_IMPLEMENTATION_STATUS.md",
    "LOGOUT_FUNCTIONALITY_AUDIT_REPORT.md",
    "MEDIMATE_COMPLETION_SUMMARY.md",
    "NAVBAR_FIXES_SUMMARY.md",
    "NULL_OBJECT_ERROR_FIXES.md",
    "OPTIMIZED_SETUP_SUMMARY.md",
    "PAYMENT_SUCCESS_GUIDE.md",
    "PAYMENT_WORKFLOW_DOCUMENTATION.md",
    "PRIORITY_SETUP.md",
    "PROFILE_FIXES_SUMMARY.md",
    "PROFILE_SYSTEM_SUMMARY.md",
    "PROJECT_COMPLETION_REPORT.md",
    "PROJECT_REORGANIZATION_COMPLETE.md",
    "RAZORPAY_FIX_SUMMARY.md",
    "RAZORPAY_TEST_MODE_GUIDE.md",
    "RAZORPAY_WEBHOOK_CONFIG.md",
    "REDIRECT_LOOP_FIX.md",
    "REGISTRATION_TEST_RESULTS.md",
    "SYSTEM_STATUS_REPORT.md",
    "TEXT_VISIBILITY_FIXES_SUMMARY.md",
    "THREE_ISSUES_FIXED.md",
    "UPLOAD_FIX_DOCUMENTATION.md",
    "UPLOAD_FIX_SUMMARY.md",
    "VERCEL_DEPLOYMENT_GUIDE.md",
    "VERCEL_FIX_SUMMARY.md",
    "WEBHOOK_SETUP.md"
)

# Remove old folders
Write-Host "🗂️ Removing old folders..." -ForegroundColor Yellow
$removedFolders = 0
foreach ($folder in $oldFolders) {
    $path = "d:\medimate\$folder"
    if (Test-Path $path) {
        try {
            Remove-Item -Path $path -Recurse -Force
            Write-Host "  ✅ Removed: $folder" -ForegroundColor Green
            $removedFolders++
        } catch {
            Write-Host "  ❌ Failed to remove: $folder - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Remove test files
Write-Host "🧪 Removing test files..." -ForegroundColor Yellow
$removedTestFiles = 0
foreach ($file in $testFiles) {
    $path = "d:\medimate\$file"
    if (Test-Path $path) {
        try {
            Remove-Item -Path $path -Force
            Write-Host "  ✅ Removed: $file" -ForegroundColor Green
            $removedTestFiles++
        } catch {
            Write-Host "  ❌ Failed to remove: $file - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Remove documentation files
Write-Host "📄 Removing documentation files..." -ForegroundColor Yellow
$removedDocFiles = 0
foreach ($file in $documentationFiles) {
    $path = "d:\medimate\$file"
    if (Test-Path $path) {
        try {
            Remove-Item -Path $path -Force
            Write-Host "  ✅ Removed: $file" -ForegroundColor Green
            $removedDocFiles++
        } catch {
            Write-Host "  ❌ Failed to remove: $file - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Summary
Write-Host "`n🎉 Cleanup completed!" -ForegroundColor Green
Write-Host "  📁 Folders removed: $removedFolders" -ForegroundColor Cyan
Write-Host "  🧪 Test files removed: $removedTestFiles" -ForegroundColor Cyan
Write-Host "  📄 Documentation files removed: $removedDocFiles" -ForegroundColor Cyan
Write-Host "  🎯 Total items removed: $($removedFolders + $removedTestFiles + $removedDocFiles)" -ForegroundColor Cyan

Write-Host "`n✅ MediMate project is now clean and ready for production!" -ForegroundColor Green
