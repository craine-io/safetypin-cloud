import { AppEdition, currentEdition, features } from '../config/features';

/**
 * License utilities for SafetyPin OSS/Cloud editions
 * These helper functions make it easy to check edition type and feature availability
 */

/**
 * Check if the current edition is OSS
 */
export const isOssEdition = (): boolean => {
  return currentEdition === AppEdition.OSS;
};

/**
 * Check if the current edition is a paid edition (Cloud or Enterprise)
 */
export const isPaidEdition = (): boolean => {
  return currentEdition === AppEdition.CLOUD || currentEdition === AppEdition.ENTERPRISE;
};

/**
 * Check if a specific edition is active
 */
export const isEdition = (edition: AppEdition): boolean => {
  return currentEdition === edition;
};

/**
 * Check if billing features are enabled
 */
export const isBillingEnabled = (): boolean => {
  return features.billing;
};

/**
 * Get the edition name as a string
 */
export const getEditionName = (): string => {
  switch (currentEdition) {
    case AppEdition.OSS:
      return 'Open Source Edition';
    case AppEdition.CLOUD:
      return 'Cloud Edition';
    case AppEdition.ENTERPRISE:
      return 'Enterprise Edition';
    default:
      return 'Unknown Edition';
  }
};

/**
 * Check if a feature is limited by the current edition
 * @param featureName The name of the feature to check
 * @returns True if the feature is unlimited
 */
export const isUnlimited = (featureName: 'maxServers' | 'maxStorage'): boolean => {
  return features[featureName] === -1;
};

/**
 * Get the license type for display purposes
 */
export const getLicenseType = (): string => {
  if (isOssEdition()) {
    return 'AGPL v3.0 (Non-Commercial Use)';
  } else {
    return 'Commercial License';
  }
};
