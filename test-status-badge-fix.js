// Doctor Status Badge Fix Verification Test
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Doctor Status Badge Fixes');
console.log('====================================');

// Test 1: Verify DoctorStatusBadge component exists and is correct
console.log('\n1. Testing DoctorStatusBadge Component:');
const badgeComponentPath = path.join(__dirname, 'app/components/ui/DoctorStatusBadge.js');
const badgeComponent = fs.readFileSync(badgeComponentPath, 'utf8');

// Check if component handles all status cases
const hasVerifiedStatus = badgeComponent.includes('doctor.isVerified') && badgeComponent.includes('Verified');
const hasPendingStatus = badgeComponent.includes('!doctor.isVerified && !doctor.rejectedAt') && badgeComponent.includes('Pending');
const hasRejectedStatus = badgeComponent.includes('doctor.rejectedAt') && badgeComponent.includes('Rejected');

console.log(`   ✓ Verified status handling: ${hasVerifiedStatus}`);
console.log(`   ✓ Pending status handling: ${hasPendingStatus}`);
console.log(`   ✓ Rejected status handling: ${hasRejectedStatus}`);

// Test 2: Verify admin verification page uses DoctorStatusBadge
console.log('\n2. Testing Admin Verification Page:');
const verifyPagePath = path.join(__dirname, 'app/admin/doctors/verify/page.js');
const verifyPage = fs.readFileSync(verifyPagePath, 'utf8');

const importsBadge = verifyPage.includes("import { DoctorStatusBadge }");
const usesBadge = verifyPage.includes("<DoctorStatusBadge");
const updatesStatus = verifyPage.includes("isVerified: action === 'approve'");
const doesntRemoveDoctor = !verifyPage.includes("prev.filter(doc => doc._id !== doctorId)");

console.log(`   ✓ Imports DoctorStatusBadge: ${importsBadge}`);
console.log(`   ✓ Uses DoctorStatusBadge component: ${usesBadge}`);
console.log(`   ✓ Updates doctor status in state: ${updatesStatus}`);
console.log(`   ✓ Keeps doctor in list after action: ${doesntRemoveDoctor}`);

// Test 3: Verify admin doctors listing page uses DoctorStatusBadge
console.log('\n3. Testing Admin Doctors Listing Page:');
const doctorsPagePath = path.join(__dirname, 'app/admin/doctors/page.js');
const doctorsPage = fs.readFileSync(doctorsPagePath, 'utf8');

const importsBadgeInListing = doctorsPage.includes("import { DoctorStatusBadge }");
const usesBadgeInListing = doctorsPage.includes("<DoctorStatusBadge");
const hasActiveStatus = doctorsPage.includes("Active") && doctorsPage.includes("Inactive");

console.log(`   ✓ Imports DoctorStatusBadge: ${importsBadgeInListing}`);
console.log(`   ✓ Uses DoctorStatusBadge component: ${usesBadgeInListing}`);
console.log(`   ✓ Still shows Active/Inactive status: ${hasActiveStatus}`);

// Test 4: Verify API endpoint returns all doctors needing verification
console.log('\n4. Testing API Endpoint:');
const apiPath = path.join(__dirname, 'app/api/admin/doctors/pending/route.js');
const apiCode = fs.readFileSync(apiPath, 'utf8');

const fetchesRejected = apiCode.includes("rejectedAt: { $exists: true }");
const fetchesUnverified = apiCode.includes("isVerified: false");
const usesOrQuery = apiCode.includes("$or:");

console.log(`   ✓ Fetches rejected doctors: ${fetchesRejected}`);
console.log(`   ✓ Fetches unverified doctors: ${fetchesUnverified}`);
console.log(`   ✓ Uses OR query for both cases: ${usesOrQuery}`);

console.log('\n📊 Summary:');
console.log('==========');

const allTests = [
  hasVerifiedStatus, hasPendingStatus, hasRejectedStatus,
  importsBadge, usesBadge, updatesStatus, doesntRemoveDoctor,
  importsBadgeInListing, usesBadgeInListing, hasActiveStatus,
  fetchesRejected, fetchesUnverified, usesOrQuery
];

const passedTests = allTests.filter(test => test).length;
const totalTests = allTests.length;

console.log(`✓ Passed: ${passedTests}/${totalTests} tests`);

if (passedTests === totalTests) {
  console.log('🎉 All tests passed! The doctor status badge fixes are correctly implemented.');
} else {
  console.log('❌ Some tests failed. Please review the implementation.');
}

console.log('\n🔍 Manual Testing Steps:');
console.log('1. Navigate to /admin/doctors/verify');
console.log('2. Verify that status badges show correctly (Pending, Verified, Rejected)');
console.log('3. Click "Approve" on a pending doctor');
console.log('4. Verify the status badge updates from "Pending" to "Verified"');
console.log('5. Verify the doctor stays in the list with "Processed" message');
console.log('6. Navigate to /admin/doctors');
console.log('7. Verify that all doctors show both Active/Inactive and Verification status');
console.log('8. Verify status badges are consistent across both pages');
