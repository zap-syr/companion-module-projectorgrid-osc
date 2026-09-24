const { InstanceBase, Regex, InstanceStatus } = require('@companion-module/base')
const osc = require('osc')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const UpdatePresets = require('./presets')
const { STATUS_ADDRESSES, STATUS_REQUEST_ADDRESS } = require('./osc-addresses')

// How often we probe ProjectorGrid for a status update while idle.
const HEARTBEAT_INTERVAL_MS = 10000
// How long without any incoming status message before we consider the link down.
const STALE_TIMEOUT_MS = 20000
// How long to wait before retrying a socket that failed to bind.
const REBIND_DELAY_MS = 5000

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.socket = null
		this.heartbeatTimer = null
		this.rebindTimer = null
		this.connectionOk = false
		this.lastMessageAt = 0

		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()

		this.updateStatus(InstanceStatus.Connecting)
		this.openSocket()
	}

	async configUpdated(config) {
		this.config = config
		this.stopHeartbeat()
		this.closeSocket()
		this.connectionOk = false
		this.updateStatus(InstanceStatus.Connecting)
		this.openSocket()
	}

	async destroy() {
		this.stopHeartbeat()
		if (this.rebindTimer) {
			clearTimeout(this.rebindTimer)
			this.rebindTimer = null
		}
		this.closeSocket()
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'targetHost',
				label: 'Target IP',
				width: 6,
				default: '192.168.0.1',
				regex: Regex.IP,
			},
			{
				type: 'number',
				id: 'targetPort',
				label: 'Target Port',
				width: 3,
				default: 7000,
				min: 1,
				max: 65535,
			},
			{
				type: 'number',
				id: 'listenPort',
				label: 'Receive Port',
				width: 3,
				default: 9000,
				min: 1,
				max: 65535,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	updatePresets() {
		UpdatePresets(this)
	}

	// --- OSC connection handling -------------------------------------------------
	// Sending goes through Companion's own OSC sender (this.oscSend) - there is no
	// outgoing socket for us to manage at all. Receiving uses a Companion-hosted
	// shared UDP socket bound to the configured listen port: this (rather than
	// binding our own dgram/osc socket) is required so that multiple instances of
	// this module can all listen on the same fixed port without fighting over it.

	openSocket() {
		this.socket = this.createSharedUdpSocket('udp4', (message) => this.handleIncomingBuffer(message))

		this.socket.on('listening', () => {
			this.log('debug', `Listening for ProjectorGrid status on port ${this.config.listenPort}`)
			this.startHeartbeat()
		})

		this.socket.on('error', (err) => {
			this.log('error', `UDP socket error: ${err.message}`)
			this.connectionOk = false
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.stopHeartbeat()
			this.closeSocket()
			this.scheduleRebind()
		})

		this.socket.bind(this.config.listenPort)
	}

	closeSocket() {
		if (this.socket) {
			try {
				this.socket.close()
			} catch (err) {
				// socket may already be closed/never bound - safe to ignore
			}
			this.socket.removeAllListeners()
			this.socket = null
		}
	}

	scheduleRebind() {
		if (this.rebindTimer) return
		this.rebindTimer = setTimeout(() => {
			this.rebindTimer = null
			this.openSocket()
		}, REBIND_DELAY_MS)
	}

	sendOsc(address) {
		try {
			this.oscSend(this.config.targetHost, this.config.targetPort, address, [])
		} catch (err) {
			this.log('error', `Failed to send ${address}: ${err.message}`)
		}
	}

	startHeartbeat() {
		this.stopHeartbeat()
		// Probe immediately - setInterval alone would wait a full HEARTBEAT_INTERVAL_MS
		// before the first request, leaving the connection sitting on "Connecting" for no
		// reason right after the socket opens.
		this.checkLiveness()
		this.heartbeatTimer = setInterval(() => this.checkLiveness(), HEARTBEAT_INTERVAL_MS)
	}

	stopHeartbeat() {
		if (this.heartbeatTimer) {
			clearInterval(this.heartbeatTimer)
			this.heartbeatTimer = null
		}
	}

	// Runs on every heartbeat tick: flags the link as down if it's gone quiet for too
	// long, then probes again regardless - so the module keeps trying and recovers on
	// its own as soon as ProjectorGrid starts responding again.
	checkLiveness() {
		const isStale = Date.now() - this.lastMessageAt > STALE_TIMEOUT_MS
		if (isStale && this.connectionOk) {
			this.connectionOk = false
			this.updateStatus(InstanceStatus.Disconnected, 'No response from ProjectorGrid')
		}
		this.sendOsc(STATUS_REQUEST_ADDRESS)
	}

	handleIncomingBuffer(buffer) {
		let message
		try {
			message = osc.readPacket(buffer, {})
		} catch (err) {
			this.log('debug', `Ignoring malformed OSC packet: ${err.message}`)
			return
		}
		this.handleIncoming(message)
	}

	handleIncoming(message) {
		this.lastMessageAt = Date.now()
		if (!this.connectionOk) {
			this.connectionOk = true
			this.updateStatus(InstanceStatus.Ok)
		}

		const value = message.args?.[0]
		switch (message.address) {
			case STATUS_ADDRESSES.ONLINE:
				this.setVariableValues({ status_online: value })
				break
			case STATUS_ADDRESSES.OFFLINE:
				this.setVariableValues({ status_offline: value })
				this.checkFeedbacks('hasOffline')
				break
			case STATUS_ADDRESSES.WARNING:
				this.setVariableValues({ status_warning: value })
				this.checkFeedbacks('hasWarning')
				break
			default:
				this.log('debug', `Unhandled OSC message: ${message.address}`)
		}
	}
}

module.exports = ModuleInstance
module.exports.UpgradeScripts = UpgradeScripts
