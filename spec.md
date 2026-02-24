# Specification

## Summary
**Goal:** Automatically assign the first authenticated user as super admin, eliminating the need for manual principal ID entry.

**Planned changes:**
- Update backend so that if no super admin is set, the first authenticated principal to call an admin-check or initialization function is automatically stored as super admin in stable state, persisting across canister upgrades.
- Ensure subsequent logins never overwrite an already-assigned super admin.
- After login on the frontend, silently attempt to claim super admin; if successful, show a success toast ("You have been assigned as Super Admin") and redirect to the admin dashboard.
- Update the AdminSetup page to remove the manual principal ID input field, replacing it with an explanatory message about auto-assignment and a "Log In & Claim Super Admin" button that triggers Internet Identity login.
- If a super admin is already assigned and the current user is not super admin, show an appropriate message on the AdminSetup page with no claim attempt.

**User-visible outcome:** The first user to log in via Internet Identity is automatically assigned as super admin without needing to know or enter their principal ID. They are redirected to the admin dashboard immediately with a confirmation toast.
