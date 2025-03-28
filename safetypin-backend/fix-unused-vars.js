#!/usr/bin/env node

/**
 * Simple script to fix the most common unused variable errors
 * Run with: node fix-unused-vars.js
 */

const fs = require('fs');
const path = require('path');

// Files with unused variable issues identified in lint output
const filesToFix = [
  'src/index.ts',
  'src/lib/database/encryption.ts',
  'src/lib/database/migrator.ts',
  'src/lib/repositories/__tests__/postgres/user-postgres.repository.test.ts',
  'src/lib/repositories/audit.repository.ts',
  'src/lib/repositories/mfa.repository.ts',
  'src/lib/repositories/postgres/audit-postgres.repository.ts',
  'src/lib/repositories/postgres/base-postgres.repository.ts',
  'src/lib/repositories/postgres/cloud-postgres.repository.ts',
  'src/lib/repositories/postgres/identity-provider-postgres.repository.ts',
  'src/lib/repositories/postgres/mfa-postgres.repository.ts',
  'src/lib/repositories/postgres/organization-postgres.repository.ts',
  'src/lib/repositories/postgres/permission-postgres.repository.ts',
  'src/lib/repositories/postgres/session-postgres.repository.ts',
  'src/lib/repositories/postgres/user-postgres.repository.ts',
  'src/server.ts',
  'src/test/mocks/database.mock.ts',
];

// Known unused variables to fix (based on lint output)
const variablesToFix = {
  'src/index.ts': ['server'],
  'src/lib/database/encryption.ts': ['KEY_LENGTH', 'oldKey'],
  'src/lib/database/migrator.ts': ['Pool'],
  'src/lib/repositories/__tests__/postgres/user-postgres.repository.test.ts': ['mockTransaction'],
  'src/lib/repositories/audit.repository.ts': ['BaseRepository'],
  'src/lib/repositories/mfa.repository.ts': ['BackupCode'],
  'src/lib/repositories/postgres/audit-postgres.repository.ts': ['PoolClient', 'transaction'],
  'src/lib/repositories/postgres/base-postgres.repository.ts': ['Pool', 'index'],
  'src/lib/repositories/postgres/cloud-postgres.repository.ts': ['CredentialStatus', 'dto'],
  'src/lib/repositories/postgres/identity-provider-postgres.repository.ts': ['originalQuery'],
  'src/lib/repositories/postgres/mfa-postgres.repository.ts': ['BackupCode', 'transaction', 'originalQuery'],
  'src/lib/repositories/postgres/organization-postgres.repository.ts': ['originalQuery'],
  'src/lib/repositories/postgres/permission-postgres.repository.ts': ['originalQuery'],
  'src/lib/repositories/postgres/session-postgres.repository.ts': ['transaction', 'originalQuery'],
  'src/lib/repositories/postgres/user-postgres.repository.ts': ['originalQuery'],
  'src/server.ts': ['next'],
  'src/test/mocks/database.mock.ts': ['params'],
};

// Fix unused variables by prefixing with underscore
function fixUnusedVariables() {
  let totalFixed = 0;
  
  for (const file of filesToFix) {
    const fullPath = path.join(__dirname, file);
    
    // Skip if file doesn't exist
    if (!fs.existsSync(fullPath)) {
      console.log(`Warning: File not found - ${file}`);
      continue;
    }
    
    // Read file content
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    // Fix each variable in the file
    const varsToFix = variablesToFix[file] || [];
    for (const varName of varsToFix) {
      // Don't modify variables that are already prefixed
      if (varName.startsWith('_')) continue;
      
      // Create pattern to match variable declaration
      // This is a simple pattern and might need adjustment
      const patterns = [
        new RegExp(`\\b(const|let|var)\\s+${varName}\\b`, 'g'),
        new RegExp(`\\bfunction\\s+${varName}\\b`, 'g'),
        new RegExp(`\\b(class|interface|type)\\s+${varName}\\b`, 'g'),
        new RegExp(`\\(([^)]*)\\b${varName}\\b([^)]*)\\)`, 'g')
      ];
      
      for (const pattern of patterns) {
        const newContent = content.replace(pattern, (match) => {
          // For function param matches, need more careful replacement
          if (match.startsWith('(') && match.endsWith(')')) {
            return match.replace(new RegExp(`\\b${varName}\\b`, 'g'), `_${varName}`);
          }
          // For normal variable declaration
          return match.replace(new RegExp(`\\b${varName}\\b`), `_${varName}`);
        });
        
        if (newContent !== content) {
          content = newContent;
          modified = true;
          console.log(`Fixed: ${varName} -> _${varName} in ${file}`);
          totalFixed++;
          break;  // Use first pattern that matched
        }
      }
    }
    
    // Save changes
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
  
  return totalFixed;
}

// Run the fix
console.log('Fixing unused variables...');
const fixedCount = fixUnusedVariables();
console.log(`Done! Fixed ${fixedCount} variables.`);
console.log('Next step: Run "npm run lint" to see if all issues are resolved.');
