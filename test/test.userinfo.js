'use strict';

// MODULES //

var tape = require( 'tape' );
var assert = require( 'chai' ).assert;
var proxyquire = require( 'proxyquire' );
var userinfo = require( './../lib/userinfo.js' );


// FIXTURES //

var getOpts = require( './fixtures/opts.js' );
var data = require( './fixtures/data.json' );
var info = require( './fixtures/info.json' );
var results = {
	'meta': {
		'total': 2,
		'success': 2,
		'failure': 0
	},
	'data': {
		'kgryte': data[ 0 ],
		'planeshifter': data[ 1 ]
	},
	'failures': {}
};


// TESTS //

tape( 'file exports a function', function test( t ) {
	t.equal( typeof userinfo, 'function', 'export is a function' );
	t.end();
});

tape( 'function returns an error to a provided callback if an error is encountered when fetching user details', function test( t ) {
	var userinfo;
	var opts;

	userinfo = proxyquire( './../lib/userinfo.js', {
		'./factory.js': factory
	});

	opts = getOpts();
	userinfo( opts, done );

	function factory( opts, clbk ) {
		return function userinfo() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk({
					'status': 404,
					'message': 'beep'
				});
			}
		};
	}

	function done( error ) {
		t.equal( error.status, 404, 'equal status' );
		t.equal( error.message, 'beep', 'equal message' );
		t.end();
	}
});

tape( 'functions returns a username hash containing user details to a provided callback', function test( t ) {
	var expected;
	var userinfo;
	var opts;

	userinfo = proxyquire( './../lib/userinfo.js', {
		'./factory.js': factory
	});

	expected = results;

	opts = getOpts();
	userinfo( opts, done );

	function factory( opts, clbk ) {
		return function userinfo() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk( null, results, info );
			}
		};
	}

	function done( error, results ) {
		assert.deepEqual( results, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});

tape( 'function returns rate limit info to a provided callback', function test( t ) {
	var expected;
	var userinfo;
	var opts;

	userinfo = proxyquire( './../lib/userinfo.js', {
		'./factory.js': factory
	});

	expected = info;

	opts = getOpts();
	userinfo( opts, done );

	function factory( opts, clbk ) {
		return function userinfo() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk( null, results, info );
			}
		};
	}

	function done( error, results, info ) {
		assert.deepEqual( info, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});

tape( 'function supports requesting user details without authentication (no token)', function test( t ) {
	var expected;
	var userinfo;
	var opts;

	userinfo = proxyquire( './../lib/userinfo.js', {
		'./factory.js': factory
	});

	expected = results;

	opts = getOpts();
	delete opts.token;

	userinfo( opts, done );

	function factory( opts, clbk ) {
		return function userinfo() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk( null, results, info );
			}
		};
	}

	function done( error, results ) {
		assert.deepEqual( results, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});
