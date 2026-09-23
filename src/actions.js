const {
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
	STATUS_REQUEST_ADDRESS,
} = require('./osc-addresses')

// ProjectorGrid derives OSC addresses from display names the same way for both group
// names and custom command names: lowercase, with spaces/other characters replaced by
// hyphens. E.g. the group "Stage Left" is addressed as "stage-left", "Group 1" as
// "group-1". Users type the name as shown in ProjectorGrid's UI; we convert it here so
// they don't have to work out the slug by hand.
function slugify(value) {
	return String(value || '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

// Every action (except "Request Status Now") is sent either to all projectors or to a
// named group. This pair of options is shared by all of them.
function targetOptions() {
	return [
		{
			type: 'dropdown',
			id: 'target',
			label: 'Target',
			default: 'all',
			disableAutoExpression: true,
			choices: [
				{ id: 'all', label: 'All' },
				{ id: 'group', label: 'Group' },
			],
		},
		{
			type: 'textinput',
			id: 'groupName',
			label: 'Group name',
			default: '',
			isVisibleExpression: '$(options:target) == "group"',
			tooltip:
				'The group\'s name as shown in ProjectorGrid, e.g. "Stage Left" - converted to "stage-left" automatically',
		},
	]
}

// Builds the full OSC address for a targeted command, e.g. buildAddress(options, 'power/on')
// -> '/pgrid/all/power/on' or '/pgrid/group/stage-left/power/on'.
function buildAddress(options, command) {
	if (options.target === 'group') {
		return `/pgrid/group/${slugify(options.groupName)}/${command}`
	}
	return `/pgrid/all/${command}`
}

module.exports = function (self) {
	self.setActionDefinitions({
		power: {
			name: 'Power',
			options: [...targetOptions(), { type: 'dropdown', id: 'state', label: 'State', default: 'on', choices: ON_OFF }],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `power/${action.options.state}`))
			},
		},

		shutter: {
			name: 'Shutter',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'state', label: 'State', default: 'open', choices: OPEN_CLOSE },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `shutter/${action.options.state}`))
			},
		},

		shutterFadeIn: {
			name: 'Set Shutter Fade-In Duration',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'duration', label: 'Duration', default: '0', choices: FADE_DURATIONS },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `shutter-fade-in/${action.options.duration}`))
			},
		},

		shutterFadeOut: {
			name: 'Set Shutter Fade-Out Duration',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'duration', label: 'Duration', default: '0', choices: FADE_DURATIONS },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `shutter-fade-out/${action.options.duration}`))
			},
		},

		osd: {
			name: 'OSD',
			options: [...targetOptions(), { type: 'dropdown', id: 'state', label: 'State', default: 'on', choices: ON_OFF }],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `osd/${action.options.state}`))
			},
		},

		selectInput: {
			name: 'Select Input',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'input', label: 'Input', default: 'hdmi1', choices: INPUTS },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `input/${action.options.input}`))
			},
		},

		lensShift: {
			name: 'Lens Shift',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'direction', label: 'Direction', default: 'up', choices: LENS_SHIFT_DIRECTIONS },
				{ type: 'dropdown', id: 'speed', label: 'Speed', default: 'normal', choices: MOTOR_SPEEDS },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `lens/shift/${action.options.direction}/${action.options.speed}`))
			},
		},

		lensHome: {
			name: 'Lens Home',
			options: [...targetOptions()],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, 'lens/home'))
			},
		},

		lensCalibration: {
			name: 'Lens Calibration',
			options: [...targetOptions()],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, 'lens/calibration'))
			},
		},

		focus: {
			name: 'Focus',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'direction', label: 'Direction', default: 'near', choices: FOCUS_DIRECTIONS },
				{ type: 'dropdown', id: 'speed', label: 'Speed', default: 'normal', choices: MOTOR_SPEEDS },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `focus/${action.options.direction}/${action.options.speed}`))
			},
		},

		zoom: {
			name: 'Zoom',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'direction', label: 'Direction', default: 'in', choices: ZOOM_DIRECTIONS },
				{ type: 'dropdown', id: 'speed', label: 'Speed', default: 'normal', choices: MOTOR_SPEEDS },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `zoom/${action.options.direction}/${action.options.speed}`))
			},
		},

		setTestPattern: {
			name: 'Set Test Pattern',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'pattern', label: 'Pattern', default: 'off', choices: TEST_PATTERNS },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `testpattern/${action.options.pattern}`))
			},
		},

		setPictureMode: {
			name: 'Set Picture Mode',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'mode', label: 'Mode', default: 'standard', choices: PICTURE_MODES },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `picture-mode/${action.options.mode}`))
			},
		},

		setBackColor: {
			name: 'Set Back Color',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'color', label: 'Color', default: 'blue', choices: BACK_COLORS },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `back-color/${action.options.color}`))
			},
		},

		setStartupLogo: {
			name: 'Set Startup Logo',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'logo', label: 'Logo', default: 'default-logo', choices: STARTUP_LOGOS },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `startup-logo/${action.options.logo}`))
			},
		},

		setProjectionMethod: {
			name: 'Set Projection Method',
			options: [
				...targetOptions(),
				{ type: 'dropdown', id: 'method', label: 'Method', default: 'front-desk', choices: PROJECTION_METHODS },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `projection/${action.options.method}`))
			},
		},

		quadPixelDrive: {
			name: 'Quad Pixel Drive',
			options: [...targetOptions(), { type: 'dropdown', id: 'state', label: 'State', default: 'on', choices: ON_OFF }],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `quad-pixel/${action.options.state}`))
			},
		},

		customCommand: {
			name: 'Custom Command',
			options: [
				...targetOptions(),
				{
					type: 'static-text',
					id: 'slugHint',
					label: ' ',
					value:
						'Enter the command name as shown in ProjectorGrid\'s Custom tab, e.g. "Warm Up Sequence" - converted to "warm-up-sequence" automatically.',
				},
				{ type: 'textinput', id: 'slug', label: 'Command name', default: '' },
			],
			callback: async (action) => {
				self.sendOsc(buildAddress(action.options, `custom/${slugify(action.options.slug)}`))
			},
		},

		requestStatusNow: {
			name: 'Request Status Now',
			// No target options here on purpose - this is a global command, not routed to all/group.
			options: [],
			callback: async () => {
				self.sendOsc(STATUS_REQUEST_ADDRESS)
			},
		},
	})
}
