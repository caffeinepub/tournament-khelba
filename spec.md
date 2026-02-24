# Specification

## Summary
**Goal:** Add a Room ID/Password system to tournaments with admin-controlled visibility timing, and enable full admin editing of all tournament fields.

**Planned changes:**
- Extend the tournament data model with `roomId`, `roomPassword`, and `roomVisibilityMinutes` fields (all optional, defaulting to empty/zero)
- Add an admin-only `updateTournament` backend function that allows editing all tournament fields including the new room credential fields
- Update the migration module to default new fields on existing tournament records
- Replace the admin tournament creation-only panel with a full management UI listing all tournaments, each with an Edit button opening a pre-filled form (includes Room ID, Room Password, and Visibility Window fields)
- Add a `useUpdateTournament` React Query mutation hook that calls `updateTournament` and invalidates relevant queries on success
- In TournamentDetailPage, auto-reveal Room ID and Password to registered participants when current time is within the configured visibility window before start; show a countdown before the window opens; hide credentials entirely from non-registered users; include copy-to-clipboard buttons; update in real time via polling/interval

**User-visible outcome:** Admins can edit any tournament at any time including setting a Room ID and Password with a configurable reveal window. Registered participants automatically see room credentials when the visibility window opens (with a live countdown before it does), while non-registered users never see credentials.
