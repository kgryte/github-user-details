'use strict';

var userinfo = require( './../lib' );

var opts = {
	'usernames': [
		'kgryte',
		'planeshifter',
		'rgizz'
	],
	'useragent': 'beep-boop-bop',
	'token': '<your_token_goes_here>'
};

userinfo( opts, clbk );

function clbk( error, results, info ) {
	if ( info ) {
		console.error( info );
	}
	if ( error ) {
		throw new Error( error.message );
	}
	console.dir( results );
}