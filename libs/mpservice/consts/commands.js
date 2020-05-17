/**
 * Ces constantes sont utilisées lors de la transmission des commandes du joueur vers le serveur
 */

const UP 				= 1 << 0;
const RIGHT 			= 1 << 1;
const DOWN 				= 1 << 2;
const LEFT 				= 1 << 3;
const ACTIVATE 			= 1 << 4;
const PRIMARY_ACTION 	= 1 << 5;
const TERTIARY_ACTION 	= 1 << 6;
const SECONDARY_ACTION 	= 1 << 7;
const COMMAND_0			= 1 << 8;
const COMMAND_1			= 1 << 9;
const COMMAND_2			= 1 << 10;
const COMMAND_3			= 1 << 11;
const COMMAND_4			= 1 << 12;
const COMMAND_5			= 1 << 13;
const COMMAND_6			= 1 << 14;
const LAST_COMMAND		= COMMAND_6;

module.exports = {
	UP,
	RIGHT,
	LEFT,
	DOWN,
	ACTIVATE,
	PRIMARY_ACTION,
	TERTIARY_ACTION,
	SECONDARY_ACTION,
	COMMAND_0,
	COMMAND_1,
	COMMAND_2,
	COMMAND_3,
	COMMAND_4,
	COMMAND_5,
	COMMAND_6,
	LAST_COMMAND
};