/**
 * Feature flag configuration for SafetyPin Cloud
 * This file controls which features are enabled in different versions of the application
 */

export enum AppEdition {
  OSS = 'oss',
  CLOUD = 'cloud',
  ENTERPRISE = 'enterprise',
}

// Default to OSS edition for the open source version
export const currentEdition: AppEdition = AppEdition.OSS;

// Features available in each edition
interface FeatureFlags {
  // Billing and subscription features
  billing: boolean;

  // Maximum number of servers allowed (unlimited = -1)
  maxServers: number;

  // Maximum storage limit in GB (unlimited = -1)
  maxStorage: number;

  // Other potential feature flags
  multiTenant: boolean;
  advancedSecurity: boolean;
  advancedAnalytics: boolean;
}

// Feature configuration for each edition
const featureConfig: Record<AppEdition, FeatureFlags> = {
  [AppEdition.OSS]: {
    billing: false,
    maxServers: -1, // Unlimited in OSS
    maxStorage: -1, // Unlimited in OSS
    multiTenant: false,
    advancedSecurity: false,
    advancedAnalytics: false,
  },
  [AppEdition.CLOUD]: {
    billing: true,
    maxServers: -1, // Based on plan in Cloud edition
    maxStorage: -1, // Based on plan in Cloud edition
    multiTenant: true,
    advancedSecurity: true,
    advancedAnalytics: true,
  },
  [AppEdition.ENTERPRISE]: {
    billing: true,
    maxServers: -1,
    maxStorage: -1,
    multiTenant: true,
    advancedSecurity: true,
    advancedAnalytics: true,
  },
};

// Get current feature flags based on edition
export const features: FeatureFlags = featureConfig[currentEdition];

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (featureName: keyof FeatureFlags): boolean => {
  return features[featureName] === true;
};

// Helper function to get feature limits
export const getFeatureLimit = (limitName: 'maxServers' | 'maxStorage'): number => {
  return features[limitName];
};
