'use strict';

// MODULES //

var debug = require( 'debug' )( 'github-user-details:updatelimit' );


// UPDATE RATE LIMIT //

/**
* FUNCTION: update( curr, info )
*	Updates rate limit info.
*
* @private
* @param {Object|Void} curr - current rate limit info
* @param {Object} info - response rate limit info
* @returns {Object} rate limit info
*/
function update( curr, info ) {
	// Initialize rate limit info if this is the first time we have received any rate limit information...
	if ( curr === void 0 ) {
		debug( 'Reset: %s. Remaining: %s.', info.reset, info.remaining );
		return info;
	}
	// Only consider responses having the latest reset time...
	if ( info.reset < curr.reset ) {
		debug( 'Response has an old reset time and does not contain any new rate limit information. Reset: %s. Remaining: %s.', curr.reset, curr.remaining );
		return curr;
	}
	// Account for the rate limit being reset during a query sequence...
	if ( info.reset > curr.reset ) {
		debug( 'Rate limit was reset during query sequence. Reset: %s. Remaining: %s.', info.reset, info.remaining );
		return info;
	}
	// Account for responses having the same reset time arriving out-of-order (i.e., a response indicating a higher remaining limit arriving after a response indicating a lower remaining limit)...
	if ( info.remaining < curr.remaining ) {
		debug( 'Reset: %s. Remaining: %s.', info.reset, info.remaining );
		return info;
	}
	debug( 'Reset: %s. Remaining: %s.', curr.reset, curr.remaining );
	return curr;
} // end FUNCTION update()


// EXPORTS //

module.exports = update;