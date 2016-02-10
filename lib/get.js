'use strict';

// MODULES //

var debug = require( 'debug' )( 'github-user-details:get' );
var request = require( '@kgryte/github-get' );
var updateRateLimit = require( './updatelimit.js' );


// VARIABLES //

var NUM_CONCURRENT_REQUESTS = 20; // FIXME: heuristic


// GET //

/**
* FUNCTION: get( opts, clbk )
*	Get user details.
*
* @param {Object} opts - options
* @param {Function} clbk - callback to invoke after getting user details
* @returns {Void}
*/
function get( opts, clbk ) {
	var ratelimit;
	var scount;
	var fcount;
	var count;
	var users;
	var out;
	var idx;
	var len;
	var i;

	// Output data store:
	out = {};
	out.meta = {};
	out.data = {};
	out.failures = {};

	// Number of completed requests:
	count = 0;
	scount = 0; // success
	fcount = 0; // failures

	// Request id:
	idx = 0;

	users = opts.usernames;
	len = users.length;

	debug( 'Number of usernames: %d.', len );
	out.meta.total = len;

	debug( 'Beginning queries...' );
	for ( i = 0; i < NUM_CONCURRENT_REQUESTS; i++ ) {
		next();
	}
	/**
	* FUNCTION: next()
	*	Requests user details data for the next username in the queue. Once requests for all desired usernames have completed, invokes the provided callback.
	*
	* @private
	* @returns {Void}
	*/
	function next() {
		var u;
		if ( count === len ) {
			debug( 'Finished all queries.' );
			out.meta.success = scount;
			out.meta.failure = fcount;
			return clbk( null, out, ratelimit );
		}
		if ( idx < len ) {
			u = users[ idx ];
			debug( 'Querying for username: `%s` (%d).', u, idx );
			opts.pathname = '/users/' + u;
			request( opts, onResponse( u, idx ) );
			idx += 1;
		}
	} // end FUNCTION next()

	/**
	* FUNCTION: onResponse( username, idx )
	*	Returns a response callback.
	*
	* @private
	* @param {String} username - username
	* @param {Number} idx - request index
	* @returns {Function} response callback
	*/
	function onResponse( username, idx ) {
		/**
		* FUNCTION: onResponse( error, details, info )
		*	Callback invoked upon receiving a request response.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {Object} details - response data
		* @param {Object} info - rate limit info
		* @returns {Void}
		*/
		return function onResponse( error, details, info ) {
			debug( 'Response received for username: `%s` (%d).', username, idx );
			if ( arguments.length === 1 ) {
				debug( 'Encountered an application-level error for username `%s` (%d): %s', username, idx, error.message );
				return clbk( error );
			}
			ratelimit = updateRateLimit( ratelimit, info );
			if ( error ) {
				debug( 'Failed to resolve username `%s` (%d): %s', username, idx, error.message );
				out.failures[ username ] = error.message;
				fcount += 1;
			} else {
				debug( 'Successfully resolved username `%s` (%d).', username, idx );
				out.data[ username ] = details;
				scount += 1;
			}
			count += 1;
			debug( 'Request %d of %d complete.', count, len );
			next();
		}; // end FUNCTION onResponse()
	} // end FUNCTION onResponse()
} // end FUNCTION get()


// EXPORTS //

module.exports = get;
