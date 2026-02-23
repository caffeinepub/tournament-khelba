# Specification

## Summary
**Goal:** Implement a secure admin access control system using Internet Identity principal IDs to restrict admin panel access.

**Planned changes:**
- Add backend storage for admin principal IDs that persists across canister upgrades
- Create backend functions: isAdmin (query), addAdmin (update), removeAdmin (update), and getMyPrincipal (query)
- Update frontend useAdminCheck hook to call real backend isAdmin function
- Block non-admin users from accessing AdminDashboard with redirect and error message
- Hide Admin navigation link for non-admin users in Header
- Create AdminSetup component for initial admin configuration with principal ID display and copy button
- Add Admin Management section to AdminDashboard for viewing, adding, and removing admin principals

**User-visible outcome:** Only users with their Internet Identity principal ID in the admin list can access the admin panel. New deployments start with an empty admin list, allowing the first user to add themselves as admin. Admins can manage the list of authorized principals through the admin dashboard.
