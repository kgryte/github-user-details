'use strict';

// MODULES //

var tape = require( 'tape' );
var copy = require( 'utils-copy' );
var updatelimit = require( './../lib/updatelimit.js' );


// FUNCTIONS //

function setup() {
	return {
		'limit': 5000,
		'remaining': 4995,
		'reset': Date.now()
	};
}


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.equal( typeof updatelimit, 'function', 'main export is a function' );
	t.end();
});

tape( 'if the first argument is `undefined`, the function returns the second argument', function test( t ) {
	var info;
	var out;
	info = setup();
	out = updatelimit( out, info );
	t.deepEqual( out, info, 'returns the second argument' );
	t.end();
});

tape( 'if provided rate limit info which contains an old reset time, the function does nothing', function test( t ) {
	var ratelimit;
	var expected;
	var actual;
	var info;

	ratelimit = setup();

	info = {
		'reset': ratelimit.reset-100,
		'remaining': 4990,
		'limit': 5000
	};

	expected = copy( ratelimit );
	actual = updatelimit( ratelimit, info );

	t.deepEqual( actual, expected, 'does not update rate limit information' );
	t.end();
});

tape( 'if provided rate limit info containing a new reset time, the function will update both the reset time and the remaining request limit', function test( t ) {
	var ratelimit;
	var expected;
	var actual;
	var info;

	ratelimit = setup();

	info = {
		'reset': ratelimit.reset+100,
		'remaining': 4999,
		'limit': 5000
	};

	expected = copy( ratelimit );
	expected.remaining = info.remaining;
	expected.reset = info.reset;

	actual = updatelimit( ratelimit, info );
	t.deepEqual( actual, expected, 'updates the reset time and remaining request limit' );
	t.end();
});

tape( 'if the reset time is the same and the rate limit info indicates fewer remaining requests, the function will update the number of remaining requests', function test( t ) {
	var ratelimit;
	var expected;
	var actual;
	var info;

	ratelimit = setup();

	info = {
		'reset': ratelimit.reset,
		'remaining': 4990,
		'limit': 5000
	};

	expected = copy( ratelimit );
	expected.remaining = info.remaining;

	actual = updatelimit( ratelimit, info );

	t.deepEqual( actual, expected, 'updates the number of remaining requests' );
	t.end();
});

tape( 'if rate limit info contains an outdated remaining limit (e.g., due to a request arriving out-of-order), the function does nothing', function test( t ) {
	var ratelimit;
	var expected;
	var actual;
	var info;

	ratelimit = setup();

	info = {
		'reset': ratelimit.reset,
		'remaining': ratelimit.remaining+2,
		'limit': 5000
	};

	expected = copy( ratelimit );

	actual = updatelimit( ratelimit, info );

	t.deepEqual( actual, expected, 'does not update rate limit information' );
	t.end();
});