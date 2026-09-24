const { combineRgb } = require('@companion-module/base')

module.exports = function (self) {
	self.setFeedbackDefinitions({
		hasWarning: {
			type: 'boolean',
			name: 'Has Warning',
			description: 'True when Projector Grid reports at least one projector with an error or unauthorized status',
			defaultStyle: {
				bgcolor: combineRgb(200, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return Number(self.getVariableValue('status_warning')) > 0
			},
		},

		hasOffline: {
			type: 'boolean',
			name: 'Has Offline',
			description: 'True when Projector Grid reports at least one offline projector',
			defaultStyle: {
				bgcolor: combineRgb(255, 102, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return Number(self.getVariableValue('status_offline')) > 0
			},
		},
	})
}
