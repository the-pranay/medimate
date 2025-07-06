const fs = require('fs');
const path = require('path');

console.log('🔍 Doctor Appointments Code Analysis');
console.log('=' .repeat(50));

// Read the doctor-appointments page file
const filePath = path.join(__dirname, 'app', 'doctor-appointments', 'page.js');

try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    console.log('✅ Successfully read doctor-appointments page file');
    console.log('\n📋 Analyzing useEffect implementation...\n');
    
    // Check for critical patterns
    const checks = [
        {
            name: 'useEffect dependencies',
            pattern: /useEffect\([^}]+\},\s*\[([^\]]*)\]/g,
            description: 'Checking useEffect dependency arrays'
        },
        {
            name: 'retryCount in dependencies',
            pattern: /useEffect\([^}]+\},\s*\[[^\]]*retryCount[^\]]*\]/g,
            description: 'Looking for retryCount in useEffect dependencies (should be REMOVED)'
        },
        {
            name: 'useRef for retryCount',
            pattern: /retryCountRef\s*=\s*useRef\(/g,
            description: 'Checking for useRef implementation for retryCount'
        },
        {
            name: 'Interval cleanup',
            pattern: /return\s*\(\)\s*=>\s*\{[^}]*clearInterval[^}]*\}/g,
            description: 'Checking for proper interval cleanup'
        },
        {
            name: 'loadAppointments function',
            pattern: /const\s+loadAppointments\s*=\s*async/g,
            description: 'Checking for loadAppointments function definition'
        },
        {
            name: 'setInterval usage',
            pattern: /setInterval\s*\(/g,
            description: 'Checking for setInterval usage'
        }
    ];
    
    let issuesFound = [];
    let goodPatterns = [];
    
    checks.forEach(check => {
        const matches = [...fileContent.matchAll(check.pattern)];
        
        if (check.name === 'retryCount in dependencies') {
            if (matches.length > 0) {
                issuesFound.push(`❌ ${check.name}: Found retryCount in dependencies (SHOULD BE REMOVED)`);
                matches.forEach((match, index) => {
                    console.log(`   Issue ${index + 1}: ${match[0]}`);
                });
            } else {
                goodPatterns.push(`✅ ${check.name}: No retryCount in dependencies (GOOD)`);
            }
        } else {
            if (matches.length > 0) {
                goodPatterns.push(`✅ ${check.name}: Found (${matches.length} occurrences)`);
                if (check.name === 'useEffect dependencies') {
                    matches.forEach((match, index) => {
                        console.log(`   Dependencies ${index + 1}: [${match[1]}]`);
                    });
                }
            } else {
                if (check.name !== 'useRef for retryCount') {
                    issuesFound.push(`⚠️  ${check.name}: Not found`);
                }
            }
        }
    });
    
    // Detailed analysis
    console.log('\n📊 ANALYSIS RESULTS:');
    console.log('-' .repeat(30));
    
    console.log('\n✅ GOOD PATTERNS FOUND:');
    goodPatterns.forEach(pattern => console.log(`   ${pattern}`));
    
    if (issuesFound.length > 0) {
        console.log('\n❌ ISSUES FOUND:');
        issuesFound.forEach(issue => console.log(`   ${issue}`));
    } else {
        console.log('\n✅ NO ISSUES FOUND');
    }
    
    // Extract and analyze the useEffect block
    const useEffectMatches = [...fileContent.matchAll(/useEffect\s*\([^}]+\},\s*\[[^\]]*\]/gs)];
    
    console.log('\n🔍 DETAILED useEffect ANALYSIS:');
    console.log('-' .repeat(30));
    
    useEffectMatches.forEach((match, index) => {
        console.log(`\nEffect #${index + 1}:`);
        const effectContent = match[0];
        
        // Check dependencies
        const depsMatch = effectContent.match(/\[([^\]]*)\]/);
        if (depsMatch) {
            const deps = depsMatch[1].trim();
            console.log(`   Dependencies: [${deps}]`);
            
            if (deps.includes('retryCount')) {
                console.log(`   ❌ PROBLEM: retryCount found in dependencies`);
            } else {
                console.log(`   ✅ GOOD: No retryCount in dependencies`);
            }
        }
        
        // Check for loadAppointments call
        if (effectContent.includes('loadAppointments')) {
            console.log(`   ✅ Calls loadAppointments`);
        }
        
        // Check for setInterval
        if (effectContent.includes('setInterval')) {
            console.log(`   ✅ Uses setInterval for periodic updates`);
        }
        
        // Check for cleanup
        if (effectContent.includes('clearInterval')) {
            console.log(`   ✅ Has proper cleanup function`);
        }
    });
    
    // Final verdict
    console.log('\n' + '=' .repeat(50));
    console.log('🎯 FINAL VERDICT');
    console.log('=' .repeat(50));
    
    const hasRetryCountInDeps = fileContent.match(/useEffect\([^}]+\},\s*\[[^\]]*retryCount[^\]]*\]/);
    const hasUseRef = fileContent.includes('retryCountRef') && fileContent.includes('useRef');
    const hasCleanup = fileContent.includes('clearInterval');
    
    if (hasRetryCountInDeps) {
        console.log('🚨 INFINITE RELOAD RISK DETECTED');
        console.log('❌ retryCount is still in useEffect dependencies');
        console.log('❌ This WILL cause infinite reloads');
        console.log('\n🔧 REQUIRED FIX:');
        console.log('   Remove retryCount from useEffect dependency array');
        console.log('   Use retryCountRef.current instead');
    } else if (hasUseRef && hasCleanup) {
        console.log('✅ INFINITE RELOAD FIX CONFIRMED');
        console.log('✅ retryCount removed from useEffect dependencies');
        console.log('✅ useRef implementation present');
        console.log('✅ Proper cleanup functions present');
        console.log('✅ Code should NOT have infinite reload issues');
    } else {
        console.log('⚠️  PARTIAL IMPLEMENTATION');
        console.log('⚠️  Some patterns missing, manual review needed');
    }
    
} catch (error) {
    console.error('❌ Error reading file:', error.message);
}

console.log('\n' + '=' .repeat(50));
