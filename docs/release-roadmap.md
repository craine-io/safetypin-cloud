# SafetyPin Release Roadmap

This document outlines the planned release schedule for the SafetyPin application, detailing the features and milestones for each version.

For information about the release process and how versions are created, see the [Release Process](./release-process.md) documentation.

## Release Strategy

SafetyPin follows a semantic versioning approach with the following pre-release stages:
- **Alpha (0.x.0-alpha.x)**: Initial development versions, feature incomplete with potential breaking changes
- **Beta (0.x.0-beta.x)**: Feature complete for the planned release, but undergoing testing and refinement
- **Release Candidate (0.x.0-rc.x)**: Final testing before official release
- **Release (0.x.0)**: Stable version ready for production use

## Current Development Status

Based on the project todos and completed work, we are currently in the alpha stage of development, with a focus on building core functionality.

## Release Schedule

### v0.1.0-alpha.1 (Current Target)
**Focus: Core Functionality and Database Layer**

**Estimated Timeline: Q2 2025**

**Features:**
- Complete database schema implementation
- Repository pattern implementation for all data access
- Backend API skeleton with core endpoints
- Basic authentication (local)
- Docker containerization for development
- Initial frontend with basic pages and navigation

**Status:** In Progress
- Database schema and repositories partially completed
- Docker containerization completed
- Basic frontend structure established

### v0.1.0-alpha.2
**Focus: Authentication and Service Layer**

**Estimated Timeline: Q3 2025**

**Features:**
- Complete authentication services (User, Auth, SSO, MFA)
- API implementation for authentication operations
- JWT validation and security middleware
- Frontend authentication UI components
- Initial implementation of SSO providers
- Testing infrastructure and initial test coverage

### v0.1.0-alpha.3
**Focus: Cloud Provider Integration - AWS**

**Estimated Timeline: Q3 2025**

**Features:**
- Cloud provider abstraction layer
- AWS integration (S3, Transfer Family)
- Server management functionality
- Initial file browser interface
- Basic dashboard with metrics

### v0.1.0-beta.1
**Focus: Multi-cloud Support and HIPAA Compliance**

**Estimated Timeline: Q4 2025**

**Features:**
- Complete multi-cloud support (AWS, Azure, GCP)
- Unified cloud provider interface
- HIPAA compliance features:
  - Comprehensive audit logging
  - Data encryption for sensitive fields
  - IP address restrictions
  - Session management and security features
- Provider-specific security configurations

### v0.1.0-beta.2
**Focus: User Experience and Performance**

**Estimated Timeline: Q4 2025**

**Features:**
- Enhanced dashboard and UI improvements
- Performance optimizations for critical operations
- Caching strategy implementation
- Extended test coverage
- Documentation for administrators and users

### v0.1.0-rc.1
**Focus: Stability and Final Testing**

**Estimated Timeline: Q1 2026**

**Features:**
- Bug fixes and stability improvements
- Performance fine-tuning
- Security hardening
- Comprehensive test coverage
- Complete user and developer documentation

### v0.1.0 (First Stable Release)
**Estimated Timeline: Q1 2026**

**Features:**
- All planned v0.1 features stable and tested
- Production-ready deployment
- Complete documentation
- Support for all planned cloud providers
- HIPAA-compliant security features

## Future Releases (Preliminary)

### v0.2.0
**Focus: Advanced Features and Integrations**

**Potential Features:**
- Webhook integrations
- API extensions for third-party integration
- Advanced analytics and reporting
- Enhanced file management capabilities
- Additional cloud provider support

### v1.0.0
**Focus: Production-Ready Enterprise Release**

**Potential Features:**
- Enterprise-grade scalability
- Advanced compliance features
- Complete multi-cloud support
- Comprehensive administration tools
- Extended monitoring and alerting capabilities

## Revision History

- **March 28, 2025**: Initial release roadmap created

## Notes

This roadmap is subject to change based on feedback, priorities, and resource availability. Timelines are estimates and may be adjusted as development progresses.
