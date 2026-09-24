const { combineRgb } = require('@companion-module/base')
const { INPUTS, TEST_PATTERNS } = require('./osc-addresses')

// All presets below target every projector ("All"), matching each action's
// target/groupName options - duplicate the preset and switch Target to Group
// on the button if you need a per-group version.
function targetAllOptions() {
	return { target: 'all', groupName: '' }
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
		{ id: 'monitoring', name: 'Monitoring', definitions: ['status'] },
	]

	const definitions = {
		powerOn: {
			type: 'simple',
			name: 'Power On All',
			style: { ...baseStyle, text: 'Power\nOn' },
			steps: [{ down: [{ actionId: 'power', options: { ...targetAllOptions(), state: 'on' } }], up: [] }],
			feedbacks: [],
		},
		powerOff: {
			type: 'simple',
			name: 'Power Off All',
			style: { ...baseStyle, text: 'Power\nOff' },
			steps: [{ down: [{ actionId: 'power', options: { ...targetAllOptions(), state: 'off' } }], up: [] }],
			feedbacks: [],
		},

		shutterOpen: {
			type: 'simple',
			name: 'Shutter Open All',
			style: { ...baseStyle, text: 'Shutter\nOpen' },
			steps: [{ down: [{ actionId: 'shutter', options: { ...targetAllOptions(), state: 'open' } }], up: [] }],
			feedbacks: [],
		},
		shutterClose: {
			type: 'simple',
			name: 'Shutter Close All',
			style: { ...baseStyle, text: 'Shutter\nClose' },
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
					style: { ...baseStyle, size: 11, text: `Pattern\n${pattern.label}` },
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

		status: {
			type: 'simple',
			name: 'Status',
			style: {
				...baseStyle,
				size: 13, // renders as ~26pt in Companion - numeric sizes come out roughly 2x what you pass
				text: `Online: $(${self.label}:status_online)\nOffline: $(${self.label}:status_offline)\nWarn: $(${self.label}:status_warning)`,
			},
			// Pressing the button forces an immediate refresh instead of waiting for the next heartbeat.
			steps: [{ down: [{ actionId: 'requestStatusNow', options: {} }], up: [] }],
			feedbacks: [
				{ feedbackId: 'hasOffline', options: {}, style: { bgcolor: combineRgb(255, 102, 0) } },
				{ feedbackId: 'hasWarning', options: {}, style: { bgcolor: combineRgb(200, 0, 0) } },
			],
		},
	}

	self.setPresetDefinitions(structure, definitions)
}
