#!/usr/bin/env node

/**
 * This script automates the release process for SafetyPin Cloud:
 * - Updates version numbers in package.json files
 * - Updates version.md file
 * - Creates a git tag for the release
 * 
 * Usage:
 *   node create-release.js <version>
 * 
 * Example:
 *   node create-release.js 0.1.0-alpha.1
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get version from command line args
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Error: Version number is required.');
  console.error('Usage: node create-release.js <version>');
  console.error('Example: node create-release.js 0.1.0-alpha.1');
  process.exit(1);
}

// Validate version format
const versionRegex = /^\d+\.\d+\.\d+(-alpha\.\d+|-beta\.\d+|-rc\.\d+)?$/;
if (!versionRegex.test(newVersion)) {
  console.error('Error: Invalid version format.');
  console.error('Version should follow semantic versioning: major.minor.patch[-alpha.n|-beta.n|-rc.n]');
  console.error('Example: 0.1.0-alpha.1, 0.2.0-beta.3, 1.0.0-rc.1, 1.0.0');
  process.exit(1);
}

// Main function 
async function updateVersions() {
  console.log(`Preparing release for version ${newVersion}...`);
  
  // Update package.json files
  const packagePaths = [
    path.resolve(__dirname, '../package.json'),
    path.resolve(__dirname, '../safetypin-frontend/package.json'),
    path.resolve(__dirname, '../safetypin-backend/package.json')
  ];
  
  for (const packagePath of packagePaths) {
    if (fs.existsSync(packagePath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        packageJson.version = newVersion;
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
        console.log(`Updated version in ${packagePath}`);
      } catch (err) {
        console.error(`Error updating ${packagePath}:`, err);
        process.exit(1);
      }
    }
  }
  
  // Update version.md
  try {
    const versionPath = path.resolve(__dirname, '../docs/version.md');
    let versionContent = fs.readFileSync(versionPath, 'utf8');
    
    // Update current version
    versionContent = versionContent.replace(/Current Version: .*/, `Current Version: ${newVersion}`);
    
    // Add to version history if not already there
    const today = new Date().toISOString().split('T')[0];
    const releaseType = newVersion.includes('-alpha') ? 'Alpha' :
                       newVersion.includes('-beta') ? 'Beta' :
                       newVersion.includes('-rc') ? 'Release Candidate' : 'Stable';
    
    const historyEntry = `| ${newVersion} | ${today} | ${releaseType} release |`;
    
    if (!versionContent.includes(historyEntry)) {
      const historyRegex = /(## Version History\n\n\| Version \| Release Date \| Description \|\n\|---------|--------------|-------------\|)/;
      versionContent = versionContent.replace(
        historyRegex,
        `$1\n| ${newVersion} | ${today} | ${releaseType} release |`
      );
    }
    
    fs.writeFileSync(versionPath, versionContent);
    console.log(`Updated ${versionPath}`);
  } catch (err) {
    console.error('Error updating version.md:', err);
    process.exit(1);
  }
  
  // Update README badge
  try {
    const readmePath = path.resolve(__dirname, '../README.md');
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Update version badge
    const escapedVersion = newVersion.replace(/-/g, '--');
    readmeContent = readmeContent.replace(
      /!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-[^-]*-blue\)/,
      `![Version](https://img.shields.io/badge/version-${escapedVersion}-blue)`
    );
    
    fs.writeFileSync(readmePath, readmeContent);
    console.log(`Updated README badge`);
  } catch (err) {
    console.error('Error updating README badge:', err);
    process.exit(1);
  }
  
  // Ask for confirmation before creating git tag
  rl.question(`\nDo you want to create git tag v${newVersion}? (y/n): `, (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      try {
        // Create git tag
        execSync(`git add .`);
        execSync(`git commit -m "Release v${newVersion}"`);
        execSync(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
        console.log(`\nCreated git tag v${newVersion}`);
        console.log('\nNext steps:');
        console.log(`1. Push the changes: git push origin main`);
        console.log(`2. Push the tag: git push origin v${newVersion}`);
        console.log('3. GitHub Actions will automatically create a release based on this tag');
      } catch (err) {
        console.error('Error creating git tag:', err);
      }
    } else {
      console.log('\nGit tag not created. You can manually create it later with:');
      console.log(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
    }
    rl.close();
  });
}

updateVersions();
