const { combineRgb } = require('@companion-module/base')
const { INPUTS, TEST_PATTERNS } = require('./osc-addresses')

// All presets below target every projector ("All"), matching each action's
// target/groupName options - duplicate the preset and switch Target to Group
// on the button if you need a per-group version.
function targetAllOptions() {
	return { target: 'all', groupName: '' }
}

// Test patterns that are a solid full-screen fill: color the button to match, with a
// contrasting text color picked per-color (not a generic luminance formula - there are
// only 8 of these, so it's just hardcoded).
// Dark on/off tones for Power and Shutter - a hint of state without the eye strain of a
// fully saturated red/green fill.
const DARK_GREEN = combineRgb(0, 90, 0)
const DARK_RED = combineRgb(120, 0, 0)

const SOLID_COLOR_STYLES = {
	white: { bgcolor: combineRgb(255, 255, 255), color: combineRgb(0, 0, 0) },
	black: { bgcolor: combineRgb(0, 0, 0), color: combineRgb(255, 255, 255) },
	red: { bgcolor: combineRgb(255, 0, 0), color: combineRgb(255, 255, 255) },
	green: { bgcolor: combineRgb(0, 255, 0), color: combineRgb(0, 0, 0) },
	blue: { bgcolor: combineRgb(0, 0, 255), color: combineRgb(255, 255, 255) },
	cyan: { bgcolor: combineRgb(0, 255, 255), color: combineRgb(0, 0, 0) },
	magenta: { bgcolor: combineRgb(255, 0, 255), color: combineRgb(255, 255, 255) },
	yellow: { bgcolor: combineRgb(255, 255, 0), color: combineRgb(0, 0, 0) },
}

// Cross-hatch patterns are a grid of colored lines on a black field, not a solid fill -
// coloring the whole button background would misrepresent them. Tint just the text to
// the pattern's color instead, as a hint without the misrepresentation.
const CROSS_HATCH_TEXT_COLORS = {
	'cross-hatch': combineRgb(255, 255, 255),
	'cross-hatch-red': combineRgb(255, 0, 0),
	'cross-hatch-green': combineRgb(0, 255, 0),
	'cross-hatch-blue': combineRgb(0, 0, 255),
	'cross-hatch-cyan': combineRgb(0, 255, 255),
	'cross-hatch-magenta': combineRgb(255, 0, 255),
	'cross-hatch-yellow': combineRgb(255, 255, 0),
}

module.exports = function (self) {
	const baseStyle = {
		size: '14',
		color: combineRgb(255, 255, 255),
		bgcolor: combineRgb(0, 0, 0),
	}

	const structure = [
		{ id: 'power', name: 'Power', definitions: ['powerOn', 'powerOff'] },
		{ id: 'shutter', name: 'Shutter', definitions: ['shutterOpen', 'shutterClose'] },
		{ id: 'input', name: 'Input', definitions: INPUTS.map((input) => `input-${input.id}`) },
		{
			id: 'testpattern',
			name: 'Test Pattern',
			definitions: TEST_PATTERNS.map((pattern) => `testpattern-${pattern.id}`),
		},
		{
			id: 'lens',
			name: 'Lens / Focus / Zoom',
			definitions: ['focusNear', 'focusFar', 'zoomIn', 'zoomOut', 'lensHome', 'lensCalibration'],
		},
		{
			id: 'monitoring',
			name: 'Monitoring',
			definitions: ['status', 'statusOnline', 'statusOffline', 'statusWarning'],
		},
	]

	const definitions = {
		powerOn: {
			type: 'simple',
			name: 'Power On All',
			style: { ...baseStyle, bgcolor: DARK_GREEN, text: 'Power\nOn' },
			steps: [{ down: [{ actionId: 'power', options: { ...targetAllOptions(), state: 'on' } }], up: [] }],
			feedbacks: [],
		},
		powerOff: {
			type: 'simple',
			name: 'Power Off All',
			style: { ...baseStyle, bgcolor: DARK_RED, text: 'Power\nOff' },
			steps: [{ down: [{ actionId: 'power', options: { ...targetAllOptions(), state: 'off' } }], up: [] }],
			feedbacks: [],
		},

		shutterOpen: {
			type: 'simple',
			name: 'Shutter Open All',
			style: { ...baseStyle, bgcolor: DARK_GREEN, text: 'Shutter\nOpen' },
			steps: [{ down: [{ actionId: 'shutter', options: { ...targetAllOptions(), state: 'open' } }], up: [] }],
			feedbacks: [],
		},
		shutterClose: {
			type: 'simple',
			name: 'Shutter Close All',
			style: { ...baseStyle, bgcolor: DARK_RED, text: 'Shutter\nClose' },
			steps: [{ down: [{ actionId: 'shutter', options: { ...targetAllOptions(), state: 'close' } }], up: [] }],
			feedbacks: [],
		},

		...Object.fromEntries(
			INPUTS.map((input) => [
				`input-${input.id}`,
				{
					type: 'simple',
					name: `Input: ${input.label}`,
					style: { ...baseStyle, text: input.label },
					steps: [{ down: [{ actionId: 'selectInput', options: { ...targetAllOptions(), input: input.id } }], up: [] }],
					feedbacks: [],
				},
			]),
		),

		...Object.fromEntries(
			TEST_PATTERNS.map((pattern) => [
				`testpattern-${pattern.id}`,
				{
					type: 'simple',
					name: `Test Pattern: ${pattern.label}`,
					style: {
						...baseStyle,
						size: 11,
						...SOLID_COLOR_STYLES[pattern.id],
						...(CROSS_HATCH_TEXT_COLORS[pattern.id] !== undefined
							? { color: CROSS_HATCH_TEXT_COLORS[pattern.id] }
							: {}),
						text: `Pattern\n${pattern.label}`,
					},
					steps: [
						{
							down: [{ actionId: 'setTestPattern', options: { ...targetAllOptions(), pattern: pattern.id } }],
							up: [],
						},
					],
					feedbacks: [],
				},
			]),
		),

		focusNear: {
			type: 'simple',
			name: 'Focus Near',
			style: { ...baseStyle, text: 'Focus\nNear' },
			steps: [
				{
					down: [{ actionId: 'focus', options: { ...targetAllOptions(), direction: 'near', speed: 'normal' } }],
					up: [],
				},
			],
			feedbacks: [],
		},
		focusFar: {
			type: 'simple',
			name: 'Focus Far',
			style: { ...baseStyle, text: 'Focus\nFar' },
			steps: [
				{
					down: [{ actionId: 'focus', options: { ...targetAllOptions(), direction: 'far', speed: 'normal' } }],
					up: [],
				},
			],
			feedbacks: [],
		},
		zoomIn: {
			type: 'simple',
			name: 'Zoom In',
			style: { ...baseStyle, text: 'Zoom\nIn' },
			steps: [
				{
					down: [{ actionId: 'zoom', options: { ...targetAllOptions(), direction: 'in', speed: 'normal' } }],
					up: [],
				},
			],
			feedbacks: [],
		},
		zoomOut: {
			type: 'simple',
			name: 'Zoom Out',
			style: { ...baseStyle, text: 'Zoom\nOut' },
			steps: [
				{
					down: [{ actionId: 'zoom', options: { ...targetAllOptions(), direction: 'out', speed: 'normal' } }],
					up: [],
				},
			],
			feedbacks: [],
		},
		lensHome: {
			type: 'simple',
			name: 'Lens Home',
			style: { ...baseStyle, text: 'Lens\nHome' },
			steps: [{ down: [{ actionId: 'lensHome', options: { ...targetAllOptions() } }], up: [] }],
			feedbacks: [],
		},
		lensCalibration: {
			type: 'simple',
			name: 'Lens Calibration',
			style: { ...baseStyle, text: 'Lens\nCalibrate' },
			steps: [{ down: [{ actionId: 'lensCalibration', options: { ...targetAllOptions() } }], up: [] }],
			feedbacks: [],
		},

		// One combined overview button (single color, all three values) alongside the
		// per-metric colored buttons below - Companion's button style only has one `color`
		// for the whole button, so getting Online/Offline/Warning each in their own color
		// needs a separate button per metric; this one is for an at-a-glance summary instead.
		status: {
			type: 'simple',
			name: 'Status',
			style: {
				...baseStyle,
				size: 11, // renders as ~26pt in Companion - numeric sizes come out roughly 2x what you pass
				text: `Online: $(${self.label}:status_online)\nOffline: $(${self.label}:status_offline)\nWarning: $(${self.label}:status_warning)`,
			},
			steps: [{ down: [{ actionId: 'requestStatusNow', options: {} }], up: [] }],
			feedbacks: [
				{ feedbackId: 'hasOffline', options: {}, style: { bgcolor: combineRgb(255, 102, 0) } },
				{ feedbackId: 'hasWarning', options: {}, style: { bgcolor: combineRgb(200, 0, 0) } },
			],
		},
		statusOnline: {
			type: 'simple',
			name: 'Status: Online',
			style: {
				...baseStyle,
				size: 13, // renders as ~26pt in Companion - numeric sizes come out roughly 2x what you pass
				color: combineRgb(0, 200, 0),
				text: `Online: \n$(${self.label}:status_online)`,
			},
			// Pressing the button forces an immediate refresh instead of waiting for the next heartbeat.
			steps: [{ down: [{ actionId: 'requestStatusNow', options: {} }], up: [] }],
			feedbacks: [],
		},
		statusOffline: {
			type: 'simple',
			name: 'Status: Offline',
			style: {
				...baseStyle,
				size: 13,
				color: combineRgb(255, 0, 0),
				text: `Offline: \n$(${self.label}:status_offline)`,
			},
			steps: [{ down: [{ actionId: 'requestStatusNow', options: {} }], up: [] }],
			feedbacks: [{ feedbackId: 'hasOffline', options: {}, style: { bgcolor: combineRgb(255, 0, 0) } }],
		},
		statusWarning: {
			type: 'simple',
			name: 'Status: Warning',
			style: {
				...baseStyle,
				size: 13,
				color: combineRgb(255, 165, 0),
				text: `Warning: \n$(${self.label}:status_warning)`,
			},
			steps: [{ down: [{ actionId: 'requestStatusNow', options: {} }], up: [] }],
			feedbacks: [{ feedbackId: 'hasWarning', options: {}, style: { bgcolor: combineRgb(255, 102, 0) } }],
		},
	}

	self.setPresetDefinitions(structure, definitions)
}
