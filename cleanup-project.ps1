# 🧹 MediMate Project Cleanup Script

# Files and folders to remove (development/testing artifacts)
$filesToRemove = @(
    # Test and diagnostic files
    "admin-dashboard-updates.md",
    "alternative-realtime-solution.js",
    "AUTO_REFRESH_FIX.md",
    "build-error-fixes.md",
    "cleanup.ps1",
    "CLEANUP_COMPLETE.md",
    "create-verified-doctor.js",
    "DEMO_PAGE_IMPLEMENTATION.md",
    "DEMO_PAGE_UPDATES.md",
    "deployment-summary.js",
    "diagnose-video-messaging.js",
    "direct-verify-doctor.js",
    "doctor-status-badge-fix.md",
    "doctor-status-badge-implementation-summary.md",
    "doctor-verification-complete-fix.md",
    "doctor-verification-status-fixes.md",
    "doctor-verification-system-status.md",
    "DOCTOR_VERIFICATION_SYSTEM.md",
    "final-communication-test.js",
    "final-feature-test.js",
    "final-status.js",
    "FINAL_SERVICES_CLEANUP.md",
    "HOMEPAGE_FEATURES_CONTACT_UPDATES.md",
    "HOMEPAGE_FOOTER_UPDATES.md",
    "ISSUE_FIXES_SUMMARY.md",
    "manual-test-status-badge-fixes.js",
    "manual-testing-guide.js",
    "PATIENT_BOOKING_FIX.md",
    "PDF_EXPORT_COMPREHENSIVE_FIX.md",
    "PDF_EXPORT_FIX.md",
    "prescription-path-fix-summary.md",
    "production-ready-verification.js",
    "quick-test.js",
    "REALTIME_FEATURES_COMPLETE.md",
    "server.js",
    "SERVICES_AUTHENTICATION_UPDATE.md",
    "SERVICES_PAGE_ENHANCEMENT.md",
    "setup-test-accounts.js",
    "simplified-messaging-approach.js",
    "socket-server-package.json",
    "socket-server-production.js",
    "socket-server.js",
    "test-admin-features.md",
    "test-doctor-patient-communication.js",
    "test-full-communication.js",
    "test-pdf.html",
    "test-prescription-path-fix.js",
    "test-realtime-features.js",
    "test-render-server.js",
    "test-socket-setup.js",
    "test-status-badge-fix.js",
    "test-verification-system.js",
    "troubleshoot-chunk-error.js",
    "ui-enhancements-summary.md",
    "verification-error-fix.md",
    "verification-system-final-check.md",
    "verification-system-final-status.md",
    "verification-test-report.json",
    "verify-doctor.js",
    "verify-production-ready.js",
    
    # Socket.IO deployment folders (no longer needed)
    "socket-deployment",
    "socket-server-deploy",
    "railway-deploy",
    
    # Duplicate config files
    "postcss.config.js"
)

Write-Host "🧹 Cleaning up MediMate project structure..." -ForegroundColor Green
Write-Host ""

$removedCount = 0

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        if (Test-Path $file -PathType Container) {
            Write-Host "🗂️  Removing folder: $file" -ForegroundColor Yellow
            Remove-Item $file -Recurse -Force
        } else {
            Write-Host "🗑️  Removing file: $file" -ForegroundColor Gray
            Remove-Item $file -Force
        }
        $removedCount++
    }
}

Write-Host ""
Write-Host "✅ Cleanup complete! Removed $removedCount items" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Clean project structure maintained:" -ForegroundColor Cyan
Write-Host "   ├── app/                    (Main application code)"
Write-Host "   ├── lib/                    (Utilities and configs)"
Write-Host "   ├── contexts/               (React contexts)"
Write-Host "   ├── public/                 (Static assets)"
Write-Host "   ├── .env files              (Environment configs)"
Write-Host "   ├── next.config.js          (Next.js config)"
Write-Host "   ├── package.json            (Dependencies)"
Write-Host "   ├── tailwind.config.js      (Styling config)"
Write-Host "   ├── vercel.json             (Deployment config)"
Write-Host "   └── Documentation files     (Deployment guides)"
Write-Host ""
Write-Host "🚀 Your MediMate project is now clean and production-ready!" -ForegroundColor Green
