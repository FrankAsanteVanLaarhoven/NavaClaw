---
name: Calendar Management
description: Native skill for reading, parsing, and scheduling events autonomously via CalDAV or local standard formats.
---

# Calendar Management Skill

1. You can manage the user's schedule. When asked to check the calendar, retrieve the upcoming events for the next 7 days.
2. Use standard CalDAV protocols or parse local `.ics` files configured in the workspace context.
3. If an event conflicts with an existing appointment, immediately notify the user of the overlap and propose 3 alternative times.
4. When drafting a new event, ensure you capture:
   - Start and End times
   - Timezone
   - Participants
   - Location or Meeting Link
   - Brief Description
5. Present the parsed daily itinerary cleanly within the ephemeral UI.
