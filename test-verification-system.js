#!/usr/bin/env node

/**
 * Doctor Verification System Test Script
 * Tests all components of the verification system step by step
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DOCTOR VERIFICATION SYSTEM - COMPREHENSIVE TEST');
console.log('=' .repeat(60));

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function logTest(testName, status, message) {
  const timestamp = new Date().toLocaleTimeString();
  const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  
  console.log(`${statusIcon} [${timestamp}] ${testName}: ${message}`);
  
  testResults.tests.push({
    name: testName,
    status,
    message,
    timestamp
  });
  
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.warnings++;
}

function checkFileExists(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  logTest(
    `File Check: ${description}`,
    exists ? 'PASS' : 'FAIL',
    exists ? `File exists: ${filePath}` : `File missing: ${filePath}`
  );
  return exists;
}

function checkFileContent(filePath, searchText, description) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
      logTest(description, 'FAIL', `File does not exist: ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasContent = content.includes(searchText);
    
    logTest(
      description,
      hasContent ? 'PASS' : 'FAIL',
      hasContent ? `Found required content` : `Missing: "${searchText}"`
    );
    return hasContent;
  } catch (error) {
    logTest(description, 'FAIL', `Error reading file: ${error.message}`);
    return false;
  }
}

console.log('\n📋 STEP 1: CHECKING CORE FILES');
console.log('-'.repeat(40));

// Check if all required files exist
const requiredFiles = [
  {
    path: 'app/api/admin/doctors/pending/route.js',
    description: 'Admin API - Get Pending Doctors'
  },
  {
    path: 'app/api/admin/doctors/[doctorId]/route.js',
    description: 'Admin API - Verify Doctor'
  },
  {
    path: 'app/admin/doctors/verify/page.js',
    description: 'Admin Verification Page'
  },
  {
    path: 'app/doctor/verification-pending/page.js',
    description: 'Doctor Pending Page'
  },
  {
    path: 'lib/models/User.js',
    description: 'User Model'
  },
  {
    path: 'app/api/auth/login/route.js',
    description: 'Login API'
  },
  {
    path: 'app/api/auth/register/route.js',
    description: 'Registration API'
  }
];

requiredFiles.forEach(file => {
  checkFileExists(file.path, file.description);
});

console.log('\n📋 STEP 2: CHECKING API IMPLEMENTATIONS');
console.log('-'.repeat(40));

// Check API implementations
const apiChecks = [
  {
    file: 'app/api/admin/doctors/pending/route.js',
    search: 'role: \'doctor\', isVerified: false',
    description: 'Pending Doctors API - Query Logic'
  },
  {
    file: 'app/api/admin/doctors/[doctorId]/route.js',
    search: 'isVerified: true',
    description: 'Verify Doctor API - Approval Logic'
  },
  {
    file: 'app/api/auth/login/route.js',
    search: 'role === \'doctor\' && !user.isVerified',
    description: 'Login API - Verification Check'
  },
  {
    file: 'app/api/auth/register/route.js',
    search: 'isVerified: false',
    description: 'Registration API - Default Verification Status'
  }
];

apiChecks.forEach(check => {
  checkFileContent(check.file, check.search, check.description);
});

console.log('\n📋 STEP 3: CHECKING DATABASE SCHEMA');
console.log('-'.repeat(40));

// Check User model updates
const schemaChecks = [
  {
    file: 'lib/models/User.js',
    search: 'verifiedBy:',
    description: 'User Model - VerifiedBy Field'
  },
  {
    file: 'lib/models/User.js',
    search: 'verifiedAt:',
    description: 'User Model - VerifiedAt Field'
  },
  {
    file: 'lib/models/User.js',
    search: 'rejectedBy:',
    description: 'User Model - RejectedBy Field'
  },
  {
    file: 'lib/models/User.js',
    search: 'rejectionReason:',
    description: 'User Model - RejectionReason Field'
  }
];

schemaChecks.forEach(check => {
  checkFileContent(check.file, check.search, check.description);
});

console.log('\n📋 STEP 4: CHECKING UI COMPONENTS');
console.log('-'.repeat(40));

// Check UI implementations
const uiChecks = [
  {
    file: 'app/admin/doctors/verify/page.js',
    search: 'handleDoctorAction',
    description: 'Admin UI - Doctor Action Handler'
  },
  {
    file: 'app/doctor/verification-pending/page.js',
    search: 'verification-pending',
    description: 'Doctor Pending UI - Page Implementation'
  },
  {
    file: 'app/components/Admin/AdminDashboard.js',
    search: '/admin/doctors/verify',
    description: 'Admin Dashboard - Verification Link'
  },
  {
    file: 'app/register/page.js',
    search: 'pending admin verification',
    description: 'Registration - Verification Message'
  }
];

uiChecks.forEach(check => {
  checkFileContent(check.file, check.search, check.description);
});

console.log('\n📋 STEP 5: CHECKING DASHBOARD PROTECTIONS');
console.log('-'.repeat(40));

// Check dashboard protections
const protectionChecks = [
  {
    file: 'app/doctor/dashboard/page.js',
    search: 'verification-pending',
    description: 'Doctor Dashboard - Verification Check'
  },
  {
    file: 'app/doctor/appointments/page.js',
    search: 'verification-pending',
    description: 'Doctor Appointments - Verification Check'
  }
];

protectionChecks.forEach(check => {
  checkFileContent(check.file, check.search, check.description);
});

console.log('\n📋 STEP 6: RUNNING SERVER CONNECTIVITY TEST');
console.log('-'.repeat(40));

// Check if package.json exists for server test
if (checkFileExists('package.json', 'Package.json for server test')) {
  logTest(
    'Server Test Preparation',
    'PASS',
    'Ready to test server endpoints (manual step required)'
  );
} else {
  logTest(
    'Server Test Preparation',
    'FAIL',
    'Cannot prepare server test - package.json missing'
  );
}

console.log('\n📊 TEST SUMMARY');
console.log('=' .repeat(60));
console.log(`✅ Tests Passed: ${testResults.passed}`);
console.log(`❌ Tests Failed: ${testResults.failed}`);
console.log(`⚠️  Warnings: ${testResults.warnings}`);
console.log(`📊 Total Tests: ${testResults.tests.length}`);

const successRate = ((testResults.passed / testResults.tests.length) * 100).toFixed(1);
console.log(`📈 Success Rate: ${successRate}%`);

if (testResults.failed > 0) {
  console.log('\n❌ FAILED TESTS:');
  testResults.tests
    .filter(test => test.status === 'FAIL')
    .forEach(test => {
      console.log(`   • ${test.name}: ${test.message}`);
    });
}

console.log('\n🔧 NEXT STEPS FOR MANUAL TESTING:');
console.log('1. Start the development server: npm run dev');
console.log('2. Test doctor registration flow');
console.log('3. Test unverified doctor login');
console.log('4. Test admin verification interface');
console.log('5. Test post-verification doctor access');

// Generate detailed report
const reportPath = path.join(__dirname, 'verification-test-report.json');
try {
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results: testResults,
    environment: {
      nodeVersion: process.version,
      platform: process.platform
    }
  }, null, 2));
  
  console.log(`\n📄 Detailed report saved: ${reportPath}`);
} catch (error) {
  console.log(`\n❌ Could not save report: ${error.message}`);
}

console.log('\n' + '='.repeat(60));
process.exit(testResults.failed > 0 ? 1 : 0);
