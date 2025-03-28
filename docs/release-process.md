# SafetyPin Release Process

This document describes the process for creating new releases of the SafetyPin application.

## Release Workflow

SafetyPin uses a semi-automated release process:

1. **Prepare Changes**: Complete and test all changes for the new release
2. **Update Version**: Run the release script to update version numbers and create a git tag
3. **Push to GitHub**: Push changes and tag to GitHub
4. **Automated Release**: GitHub Actions creates a release automatically
5. **Post-Release**: Update roadmap and plan for the next release

## Creating a Release

### Prerequisites

- All changes for the release have been completed and tested
- All changes have been committed to the appropriate branch (usually `main` for releases)
- You have appropriate permissions to push to the repository

### Steps

1. **Run the Release Script**:

   From the project root directory, run:

   ```bash
   # Using npm script
   npm run release <version>
   ```

   or

   ```bash
   # Using batch file (Windows)
   create-release.bat <version>
   ```

   or

   ```bash
   # Direct node execution
   node scripts/create-release.js <version>
   ```

   Replace `<version>` with the new version number (e.g., `0.1.0-alpha.1`).

   The script will:
   - Update version numbers in all package.json files
   - Update the version.md file
   - Update the version badge in the README.md
   - Offer to create a git commit and tag for the release

2. **Push Changes to GitHub**:

   ```bash
   # Push the commit
   git push origin main

   # Push the tag
   git push origin v<version>
   ```

   Replace `<version>` with the version number you just created.

3. **Monitor GitHub Actions**:

   Once the tag is pushed, GitHub Actions will automatically:
   - Build the project
   - Run tests
   - Generate release notes from commits
   - Create a GitHub Release with appropriate labels

4. **Verify the Release**:

   - Check the "Releases" section on GitHub to ensure the release was created correctly
   - Verify that the release notes accurately describe the changes
   - Confirm the release has the correct version number and tag

## Version Numbering

SafetyPin follows [semantic versioning](https://semver.org/) with the following format:

`major.minor.patch[-alpha.n|-beta.n|-rc.n]`

- **Major**: Significant changes with backward-incompatible API modifications
- **Minor**: New features that are backward compatible
- **Patch**: Bug fixes and minor improvements that are backward compatible
- **Prerelease identifiers**:
  - `-alpha.n`: Alpha releases (incomplete features, major bugs possible)
  - `-beta.n`: Beta releases (feature complete for the version, testing in progress)
  - `-rc.n`: Release candidates (potentially ready for release, only critical bug fixes)

### Examples:

- `0.1.0-alpha.1`: First alpha release of version 0.1.0
- `0.1.0-beta.2`: Second beta release of version 0.1.0
- `0.1.0-rc.1`: First release candidate for version 0.1.0
- `0.1.0`: Stable release of version 0.1.0

## Release Schedule

For information about the scheduled releases and their content, see the [Release Roadmap](./release-roadmap.md).

## Troubleshooting

### GitHub Actions Failure

If the GitHub Actions workflow fails:

1. Check the Actions tab in GitHub to see specific error messages
2. Fix the issues in your local repository
3. Create a new version or push changes to the existing tag:
   ```bash
   # Update an existing tag
   git tag -f v<version>
   git push --force origin v<version>
   ```

### Script Errors

If the release script encounters errors:

1. Check the error messages for specific issues
2. Make manual corrections if necessary
3. You can run the script again with the same version number to retry

## Manual Release Process

If you need to create a release manually:

1. Update version numbers in:
   - Root package.json
   - Frontend package.json
   - Backend package.json

2. Update docs/version.md with the new version

3. Update version badge in README.md

4. Commit changes:
   ```bash
   git add .
   git commit -m "Release v<version>"
   ```

5. Create annotated tag:
   ```bash
   git tag -a v<version> -m "Release v<version>"
   ```

6. Push changes and tag:
   ```bash
   git push origin main
   git push origin v<version>
   ```

7. Create a release manually through the GitHub web interface
