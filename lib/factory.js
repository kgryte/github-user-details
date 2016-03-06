'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' );
var merge = require( 'utils-merge2' );
var validate = require( './validate.js' );
var defaults = require( './defaults.json' );
var get = require( './get.js' );


// FACTORY //

/**
* FUNCTION: factory( options, clbk )
*	Returns a function for fetching user details.
*
* @param {Object} options - function options
* @param {String[]} options.usernames - Github usernames
* @param {String} [options.token] - Github access token
* @param {String} [options.useragent] - user agent string
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Function} function for getting user details
*/
function factory( options, clbk ) {
	var opts;
	var err;
	opts = merge( {}, defaults );
	err = validate( opts, options );
	if ( err ) {
		throw err;
	}
	if ( !isFunction( clbk ) ) {
		throw new TypeError( 'invalid input argument. Callback argument must be a function. Value: `' + clbk + '`.' );
	}
	/**
	* FUNCTION: userinfo()
	*	Gets user details.
	*
	* @returns {Void}
	*/
	return function userinfo() {
		get( opts, done );
		/**
		* FUNCTION: done( error, results, info )
		*	Callback invoked after query completion.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {Object} results - query results
		* @param {Object} info - response info
		* @returns {Void}
		*/
		function done( error, results, info ) {
			error = error || null;
			results = results || null;
			info = info || null;
			clbk( error, results, info );
		} // end FUNCTION done()
	}; // end FUNCTION userinfo()
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;
