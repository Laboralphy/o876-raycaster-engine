const config = require('../config-loader/index');

const STRINGS = {
	en: {
		service: {
			hello: 'SERVER',
			listening: 'server port is : ',
			connected: 'client connected (client "%s")',
			disconnected: 'client disconnected (client "%s")',
			level_loaded: 'level loaded successfully (client "%s" level "%s")',
			plugin_loaded: 'plugin "%s" has been loaded',
			could_not_emit: 'error while sending packet (event "%s" client "%s")'
		},

		login: {
			granted: 'client has logged in (client "%s" nickname "%s")',
			denied: 'client access denied (client "%s" nickname "%s")',
		},

		game: {
			building_level: 'building area (id "%s")',
			level_built: 'area built (id "%s")',
			player_created: 'client\'s mobile instance created (id "%s")',
			player_auth: 'client\'s identity transmitted to game system (id "%s")',
			player_data_loaded: 'client\'s data loaded (id "%s")',
			player_downloading_area: 'transmitting area to client (id "%s" area "%s")',
			player_downloading_resource: 'client is requesting resource (client "%s" type "%s" resource "%s")'
		},

		txat: {
			user_said: '[%s] %s (%s): %s',
			invalid_channel: 'client send message to a wrong channel (client "%s" channel "%s")'
		}
	}
};

module.exports = STRINGS.en;