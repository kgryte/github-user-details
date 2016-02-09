'use strict';

// MODULES //

var factory = require( './factory.js' );


// USER DETAILS //

/**
* FUNCTION: userinfo( opts, clbk )
*	Gets user details.
*
* @param {Object} opts - function options
* @param {String[]} opts.usernames - Github usernames
* @param {String} [opts.token] - Github access token
* @param {String} [opts.useragent] - user agent string
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Void}
*/
function userinfo( opts, clbk ) {
	factory( opts, clbk )();
} // end FUNCTION userinfo()


// EXPORTS //

module.exports = userinfo;
