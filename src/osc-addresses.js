// Reference tables for the ProjectorGrid OSC command set.
// See PLAN.md section 1 / the ProjectorGrid OSC Reference doc for the source of truth.

const ON_OFF = [
	{ id: 'on', label: 'On' },
	{ id: 'off', label: 'Off' },
]

const OPEN_CLOSE = [
	{ id: 'open', label: 'Open' },
	{ id: 'close', label: 'Close' },
]

const FADE_DURATIONS = [
	{ id: '0', label: '0 s (instant)' },
	{ id: '0.5', label: '0.5 s' },
	{ id: '1', label: '1 s' },
	{ id: '1.5', label: '1.5 s' },
	{ id: '2', label: '2 s' },
	{ id: '3', label: '3 s' },
	{ id: '5', label: '5 s' },
	{ id: '7', label: '7 s' },
	{ id: '10', label: '10 s' },
]

const INPUTS = [
	{ id: 'hdmi1', label: 'HDMI 1' },
	{ id: 'hdmi2', label: 'HDMI 2' },
	{ id: 'sdi1', label: 'SDI 1' },
	{ id: 'sdi2', label: 'SDI 2' },
	{ id: 'digital-link', label: 'Digital Link' },
	{ id: 'dvi-d', label: 'DVI-D' },
	{ id: 'displayport', label: 'DisplayPort' },
	{ id: 'computer1', label: 'Computer 1' },
	{ id: 'computer2', label: 'Computer 2' },
	{ id: 'video', label: 'Video' },
	{ id: 'yc', label: 'Y/C' },
]

const LENS_SHIFT_DIRECTIONS = [
	{ id: 'up', label: 'Up' },
	{ id: 'down', label: 'Down' },
	{ id: 'left', label: 'Left' },
	{ id: 'right', label: 'Right' },
]

const MOTOR_SPEEDS = [
	{ id: 'slow', label: 'Slow' },
	{ id: 'normal', label: 'Normal' },
	{ id: 'fast', label: 'Fast' },
]

const FOCUS_DIRECTIONS = [
	{ id: 'near', label: 'Near' },
	{ id: 'far', label: 'Far' },
]

const ZOOM_DIRECTIONS = [
	{ id: 'in', label: 'In (Tele)' },
	{ id: 'out', label: 'Out (Wide)' },
]

const TEST_PATTERNS = [
	{ id: 'off', label: 'Off' },
	{ id: 'white', label: 'White' },
	{ id: 'black', label: 'Black' },
	{ id: 'red', label: 'Red' },
	{ id: 'green', label: 'Green' },
	{ id: 'blue', label: 'Blue' },
	{ id: 'cyan', label: 'Cyan' },
	{ id: 'magenta', label: 'Magenta' },
	{ id: 'yellow', label: 'Yellow' },
	{ id: 'window', label: 'Window' },
	{ id: 'reversed-window', label: 'Reversed Window' },
	{ id: 'color-bars-vertical', label: 'Color Bars (Vertical)' },
	{ id: 'color-bars-horizontal', label: 'Color Bars (Horizontal)' },
	{ id: 'focus', label: 'Focus' },
	{ id: 'aspect-frame', label: 'Aspect Frame' },
	{ id: 'cross-hatch', label: 'Cross-Hatch (White)' },
	{ id: 'cross-hatch-red', label: 'Cross-Hatch (Red)' },
	{ id: 'cross-hatch-green', label: 'Cross-Hatch (Green)' },
	{ id: 'cross-hatch-blue', label: 'Cross-Hatch (Blue)' },
	{ id: 'cross-hatch-cyan', label: 'Cross-Hatch (Cyan)' },
	{ id: 'cross-hatch-magenta', label: 'Cross-Hatch (Magenta)' },
	{ id: 'cross-hatch-yellow', label: 'Cross-Hatch (Yellow)' },
	{ id: 'circle', label: 'Circle' },
]

const PICTURE_MODES = [
	{ id: 'dynamic', label: 'Dynamic' },
	{ id: 'natural', label: 'Natural' },
	{ id: 'standard', label: 'Standard' },
	{ id: 'cinema', label: 'Cinema' },
	{ id: 'graphic', label: 'Graphic' },
	{ id: 'dicom-sim', label: 'DICOM Simulation' },
	{ id: 'rec709', label: 'Rec.709' },
	{ id: 'user', label: 'User' },
]

const BACK_COLORS = [
	{ id: 'blue', label: 'Blue' },
	{ id: 'black', label: 'Black' },
	{ id: 'user-logo', label: 'User Logo' },
	{ id: 'default-logo', label: 'Default Logo' },
]

const STARTUP_LOGOS = [
	{ id: 'off', label: 'Off' },
	{ id: 'user-logo', label: 'User Logo' },
	{ id: 'default-logo', label: 'Default Logo' },
]

const PROJECTION_METHODS = [
	{ id: 'front-desk', label: 'Front / Desk' },
	{ id: 'rear-desk', label: 'Rear / Desk' },
	{ id: 'front-ceiling', label: 'Front / Ceiling' },
	{ id: 'rear-ceiling', label: 'Rear / Ceiling' },
	{ id: 'front-auto', label: 'Front / Auto' },
	{ id: 'rear-auto', label: 'Rear / Auto' },
]

// Status messages ProjectorGrid pushes back to the module (see main.js handleIncoming).
const STATUS_ADDRESSES = {
	ONLINE: '/pgrid/status/online',
	OFFLINE: '/pgrid/status/offline',
	WARNING: '/pgrid/status/warning',
}

// The liveness probe: asks ProjectorGrid to resend all three status values immediately.
const STATUS_REQUEST_ADDRESS = '/pgrid/status'

module.exports = {
	ON_OFF,
	OPEN_CLOSE,
	FADE_DURATIONS,
	INPUTS,
	LENS_SHIFT_DIRECTIONS,
	MOTOR_SPEEDS,
	FOCUS_DIRECTIONS,
	ZOOM_DIRECTIONS,
	TEST_PATTERNS,
	PICTURE_MODES,
	BACK_COLORS,
	STARTUP_LOGOS,
	PROJECTION_METHODS,
	STATUS_ADDRESSES,
	STATUS_REQUEST_ADDRESS,
}
