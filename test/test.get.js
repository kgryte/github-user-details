'use strict';

// MODULES //

var tape = require( 'tape' );
var assert = require( 'chai' ).assert;
var proxyquire = require( 'proxyquire' );
var get = require( './../lib/get.js' );


// FIXTURES //

var data = require( './fixtures/data.json' );
var info = require( './fixtures/info.json' );
var getOpts = require( './fixtures/opts.js' );


// TESTS //

tape( 'file exports a function', function test( t ) {
	t.equal( typeof get, 'function', 'export is a function' );
	t.end();
});

tape( 'function returns an error to a provided callback if an error is encountered when fetching user details', function test( t ) {
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'@kgryte/github-get': request
	});

	opts = getOpts();
	get( opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk({
				'status': 500,
				'message': 'bad request'
			});
		}
	}

	function done( error ) {
		t.equal( error.status, 500, 'equal status' );
		t.equal( error.message, 'bad request', 'equal message' );
		t.end();
	}
});

tape( 'the function returns a JSON object upon attempting to resolve all specified usernames', function test( t ) {
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'@kgryte/github-get': request
	});

	opts = getOpts();
	get( opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, data[0], info );
		}
	}

	function done( error, data ) {
		if ( error ) {
			t.ok( false, error.message );
		} else {
			t.equal( typeof data, 'object', 'returns an object' );
		}
		t.end();
	}
});

tape( 'the returned JSON object has a `meta` field which contains meta data documenting how many packages were successfully resolved', function test( t ) {
	var expected;
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'@kgryte/github-get': request
	});

	expected = {
		'meta': {
			'total': 1,
			'success': 1,
			'failure': 0
		},
		'data': {
			'kgryte': data[ 0 ]
		},
		'failures': {}
	};

	opts = getOpts();
	get( opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, data[ 0 ], info );
		}
	}

	function done( error, data ) {
		if ( error ) {
			t.ok( false, error.message );
		} else {
			t.equal( data.meta.total, 1, 'returns total' );
			t.equal( data.meta.success, 1, 'returns number of successes' );
			t.equal( data.meta.failure, 0, 'returns number of failures' );
		}
		t.end();
	}
});

tape( 'the returned JSON object has a `data` field which contains a username hash with user info', function test( t ) {
	var expected;
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'@kgryte/github-get': request
	});

	expected = {
		'meta': {
			'total': 1,
			'success': 1,
			'failure': 0
		},
		'data': {
			'kgryte': data[ 0 ]
		},
		'failures': {}
	};

	opts = getOpts();
	get( opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, data[ 0 ], info );
		}
	}

	function done( error, data ) {
		if ( error ) {
			t.ok( false, error.message );
		} else {
			assert.deepEqual( data, expected );
			t.ok( true, 'deep equal' );
		}
		t.end();
	}
});

tape( 'when unable to resolve user details, the returned JSON object has a `failures` field which contains a username hash with error messages', function test( t ) {
	var expected;
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'@kgryte/github-get': request
	});

	expected = {
		'meta': {
			'total': 1,
			'success': 0,
			'failure': 1
		},
		'data': {},
		'failures': {
			'kgryte': 'Not Found'
		}
	};

	opts = getOpts();
	get( opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			var err = {
				'status': 404,
				'message': 'Not Found'
			};
			clbk( err, null, info );
		}
	}

	function done( error, data ) {
		if ( error ) {
			t.ok( false, error.message );
		} else {
			assert.deepEqual( data, expected );
			t.ok( true, 'deep equal' );
		}
		t.end();
	}
});

tape( 'the function resolves multiple users', function test( t ) {
	var expected;
	var count;
	var opts;
	var get;

	get = proxyquire( './../lib/get.js', {
		'@kgryte/github-get': request
	});

	opts = getOpts();
	opts.usernames = [
		'kgryte',
		'planeshifter',
		'unknown_username'
	];
	count = -1;

	expected = {
		'meta': {
			'total': 3,
			'success': 2,
			'failure': 1
		},
		'data': {
			'kgryte': data[ 0 ],
			'planeshifter': data[ 1 ]
		},
		'failures': {
			'unknown_username': 'Not Found'
		}
	};

	get( opts, done );

	function request( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			var err;
			count += 1;
			if ( count < 2 ) {
				return clbk( null, data[ count ], info );
			}
			if ( count === 2 ) {
				err = {
					'status': 404,
					'message': 'Not Found'
				};
				return clbk( err, null, info );
			}
		}
	}

	function done( error, data ) {
		if ( error ) {
			t.ok( false, error.message );
		} else {
			assert.deepEqual( data, expected );
			t.ok( true, 'deep equal' );
		}
		t.end();
	}
});
