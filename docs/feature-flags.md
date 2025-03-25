# SafetyPin Feature Flags System

This document explains the feature flag system implemented in SafetyPin to differentiate between the OSS and commercial editions.

## Overview

SafetyPin uses a feature flag system to control which features are available in different editions of the application. This allows us to maintain a single codebase while providing different feature sets for:

- SafetyPin OSS (Open Source Edition) - AGPL v3.0 license for non-commercial use
- SafetyPin Cloud (Commercial Cloud Edition) - Commercial license
- SafetyPin Enterprise (Commercial Enterprise Edition) - Commercial license

## Implementation

The feature flag system is implemented in the following files:

1. `safetypin-frontend/src/config/features.ts` - Core feature flag configuration
2. `safetypin-frontend/src/utils/licenseUtils.ts` - Helper functions for checking edition and features

### Feature Configuration

The `features.ts` file contains:
- Enum defining the available editions (OSS, CLOUD, ENTERPRISE)
- Configuration for which features are enabled in each edition
- Helper functions to check if a feature is enabled

### License Utilities

The `licenseUtils.ts` file provides convenience functions:
- `isOssEdition()` - Check if running the OSS edition
- `isPaidEdition()` - Check if running a paid edition
- `isEdition(edition)` - Check for a specific edition
- `isBillingEnabled()` - Check if billing features are enabled
- `getEditionName()` - Get a display name for the current edition
- `isUnlimited(feature)` - Check if a specific feature has unlimited usage
- `getLicenseType()` - Get license information for display

## Usage

### Checking if a Feature is Available

In component code, you can check if a feature is available using:

```typescript
import { features } from '../config/features';

// Example: Only show billing UI if billing is enabled
{features.billing && <BillingComponent />}
```

### Using Helper Functions

For more semantic code, use the helper functions:

```typescript
import { isPaidEdition, isBillingEnabled } from '../utils/licenseUtils';

// Example: Only show premium features in paid editions
{isPaidEdition() && <PremiumFeature />}

// Example: Conditional rendering of billing components
{isBillingEnabled() ? <BillingComponent /> : <OssInfoComponent />}
```

## Feature Flag List

Current feature flags include:

| Feature | Description | OSS | Cloud | Enterprise |
|---------|-------------|-----|-------|------------|
| billing | Billing & subscription features | ❌ | ✅ | ✅ |
| maxServers | Maximum server limit (-1 = unlimited) | -1 | Plan-based | -1 |
| maxStorage | Maximum storage limit in GB (-1 = unlimited) | -1 | Plan-based | -1 |
| multiTenant | Multi-tenant capabilities | ❌ | ✅ | ✅ |
| advancedSecurity | Advanced security features | ❌ | ✅ | ✅ |
| advancedAnalytics | Advanced analytics and reporting | ❌ | ✅ | ✅ |

## Adding New Feature Flags

To add a new feature flag:

1. Add the feature to the `FeatureFlags` interface in `features.ts`
2. Configure the feature for each edition in the `featureConfig` object
3. If needed, add helper functions to `licenseUtils.ts`

## Changing Editions

The current edition is set in `features.ts` with:

```typescript
export const currentEdition: AppEdition = AppEdition.OSS;
```

For development, you can change this to test different editions.

In production, this will be determined by a license key validation system (not yet implemented).

## Future Improvements

Planned improvements to the feature flag system:

1. License key validation for commercial editions
2. Server-side feature flag management
3. More granular feature controls
4. Admin UI for managing features in multi-tenant deployments
