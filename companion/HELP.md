## ProjectorGrid OSC

Controls ProjectorGrid over its OSC integration - every projector at once, or a named group.

### Setup

This module talks OSC over UDP in both directions, so two things need to line up between this connection's config and ProjectorGrid's own OSC settings:

1. **ProjectorGrid IP** and **Target Port** — point these at the machine running ProjectorGrid and the port it listens on for incoming OSC commands.
2. **Listen Port** — in ProjectorGrid's OSC output settings, set its "Send IP" to the IP of the machine running Companion, and its "Send Port" to match this module's **Listen Port**. This is how the module receives the status variables below and detects whether ProjectorGrid is reachable.

Defaults: Target Port `7000`, Listen Port `9000` - adjust to match your ProjectorGrid instance if it uses different ports.

The connection status shown in Companion reflects whether ProjectorGrid is actually responding (not just whether the local socket opened): it goes to "Disconnected" if no status message has arrived for a while, and recovers automatically once ProjectorGrid starts responding again - no need to re-enable the connection.

### Actions

Every action (except _Request Status Now_) has a **Target** option: `All` sends the command to every projector, `Group` sends it to a single named group - enter the group's OSC name (its OSC address in ProjectorGrid without the `/group/` prefix) in the field that appears.

Covers: Power, Shutter (open/close + fade-in/fade-out duration), OSD, Input select, Lens Shift/Home/Calibration, Focus, Zoom, Test Pattern, Picture Mode, Back Color, Startup Logo, Projection Method, Quad Pixel Drive, and a Custom Command action for commands you've defined in ProjectorGrid's Custom tab (enter the slug shown in its OSC address preview).

_Request Status Now_ asks ProjectorGrid to immediately resend the three status variables below, bypassing its normal change detection.

### Variables

- `status_online` — number of connected projectors
- `status_offline` — number of offline projectors
- `status_warning` — number of projectors with an error or unauthorized status
