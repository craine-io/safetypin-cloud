#!/usr/bin/env node

/**
 * Script to automatically fix common ESLint errors in the codebase
 * Run with: node fix-lint.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}=== SafetyPin ESLint Auto-Fix Tool ===${colors.reset}`);
console.log(`${colors.yellow}This tool will automatically fix common linting issues.\n${colors.reset}`);

// Run ESLint with --fix option
try {
  console.log(`${colors.blue}Running ESLint auto-fix...${colors.reset}`);
  
  // Fix common issues automatically
  execSync('npx eslint --fix .', { stdio: 'inherit' });
  
  console.log(`\n${colors.green}✓ Basic auto-fixes have been applied.${colors.reset}`);
} catch (error) {
  console.log(`\n${colors.yellow}Some issues were fixed, but others need manual attention.${colors.reset}`);
}

// Fix specific issues that ESLint can't automatically fix
console.log(`\n${colors.blue}Fixing unused variables...${colors.reset}`);

// Function to process TypeScript files and fix unused vars
function fixUnusedVars(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== 'dist') {
      fixUnusedVars(fullPath);
      continue;
    }
    
    // Only process TypeScript files
    if (!file.isFile() || !file.name.endsWith('.ts')) {
      continue;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    // Fix unused variables by prefixing with underscore
    const unusedVarPattern = /(?:let|const|var|function|interface|class|type) ([a-zA-Z0-9]+)[\s\S]*?never used/g;
    const unusedArgPattern = /\(([^)]+)\)[\s\S]*?never used/g;
    
    // Process file content for errors
    try {
      // Run ESLint on this file to get errors
      const lintOutput = execSync(`npx eslint --no-eslintrc --parser @typescript-eslint/parser --plugin @typescript-eslint --rule '{"@typescript-eslint/no-unused-vars":"error"}' "${fullPath}" -f json`, { encoding: 'utf8' });
      const lintResult = JSON.parse(lintOutput);
      
      if (lintResult.length > 0 && lintResult[0].messages) {
        for (const message of lintResult[0].messages) {
          if (message.ruleId === '@typescript-eslint/no-unused-vars') {
            // Extract variable name
            const variableName = message.message.match(/'([^']+)'/);
            if (variableName && variableName[1]) {
              const varName = variableName[1];
              if (!varName.startsWith('_')) {
                // Rename the variable by adding an underscore prefix
                const newVarName = `_${varName}`;
                const regex = new RegExp(`\\b${varName}\\b`, 'g');
                const newContent = content.replace(regex, newVarName);
                
                if (newContent !== content) {
                  content = newContent;
                  modified = true;
                  console.log(`  ${colors.green}✓ Fixed unused variable '${varName}' -> '${newVarName}' in ${fullPath}${colors.reset}`);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      // Continue to next file if there's an error
      console.log(`  ${colors.red}× Error analyzing ${fullPath}: ${error.message}${colors.reset}`);
      continue;
    }
    
    // Write changes back to file if modified
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

// Run the fix
try {
  fixUnusedVars(path.join(__dirname, 'src'));
  console.log(`\n${colors.green}✓ Unused variable fixes applied where possible.${colors.reset}`);
} catch (error) {
  console.log(`\n${colors.red}× Error fixing unused variables: ${error.message}${colors.reset}`);
}

console.log(`\n${colors.magenta}=== Next Steps ===${colors.reset}`);
console.log(`${colors.cyan}1. Run 'npm run lint' to see remaining issues${colors.reset}`);
console.log(`${colors.cyan}2. Fix additional warnings manually${colors.reset}`);
console.log(`${colors.cyan}3. Consider running the TypeScript checker with 'npx tsc --noEmit' to find type issues${colors.reset}`);
