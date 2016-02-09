User Details
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Get user [details][github-user-details] for one or more users.


## Installation

``` bash
$ npm install github-user-details
```


## Usage

``` javascript
var userinfo = require( 'github-user-details' );
```

<a name="userinfo"></a>
#### userinfo( opts, clbk )

Gets user [details][github-user-details] for one or more users.

``` javascript
var opts = {
	'usernames': [
		'kgryte',
		'planeshifter',
		'unknown_username'
	]
};

userinfo( opts, clbk );

function clbk( error, results, info ) {
	// Check for rate limit information...
	if ( info ) {
		console.error( 'Limit: %d', info.limit );
		console.error( 'Remaining: %d', info.remaining );
		console.error( 'Reset: %s', (new Date( info.reset*1000 )).toISOString() );
	}
	if ( error ) {
		throw new Error( error.message );
	}
	console.dir( results );
	/*
		{
			"meta": {
				"total": 3,
				"success": 2,
				"failure": 1
			},
			"data": {
				"kgryte": {...},
				"planeshifter": {...}
			},
			"failures": {
				"unknown_username": "Not Found"
			}
		}
	*/
}
```

The `function` accepts the following `options`:
*	__usernames__: `array` of Github usernames (*required*).
*	__token__: Github [access token][github-token].
*	__useragent__: [user agent][github-user-agent] `string`.

To [authenticate][github-oauth2] with Github, set the [`token`][github-token] option.

``` javascript
var opts = {
	'usernames': ['kgryte'],
	'token': 'tkjorjk34ek3nj4!'
};

userinfo( opts, clbk );
```

To specify a [user agent][github-user-agent], set the `useragent` option.

``` javascript
var opts = {
	'usernames': ['kgryte','planeshifter'],
	'useragent': 'hello-github!'
};

userinfo( opts, clbk );
```


#### userinfo.factory( options, clbk )

Creates a reusable `function`.

``` javascript
var opts = {
	'usernames': ['kgryte','planeshifter'],
	'token': 'tkjorjk34ek3nj4!'
};

var get = userinfo.factory( opts, clbk );

get();
get();
get();
// ...
```

The factory method accepts the same `options` as [`userinfo()`](#userinfo).


## Notes

*	If the module encounters an application-level `error` (e.g., no network connection, etc), that `error` is returned immediately to the provided `callback`.
*	If the module encounters a downstream `error` (e.g., timeout, reset connection, etc), that `error` is included in the returned results under the `failures` field.
*	[Rate limit][github-rate-limit] information includes the following:
	-	__limit__: maximum number of requests a consumer is permitted to make per hour.
	-	__remaining__: number of remaining requests.
	-	__reset__: time at which the current [rate limit][github-rate-limit] window resets in [UTC seconds][unix-time].


---
## Examples

``` javascript
var userinfo = require( 'github-user-details' );

var opts = {
	'usernames': [
		'kgryte',
		'planeshifter',
		'rgizz'
	],
	'useragent': 'beep-boop-bop',
	'token': 'tkjorjk34ek3nj4!'
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
```

To run the example code from the top-level application directory,

``` bash
$ DEBUG=* node ./examples/index.js
```

__Note__: in order to run the example, you will need to obtain an access [token][github-token] and modify the `token` option accordingly.


---
## CLI

### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g github-user-details
```


### Usage

``` bash
Usage: ghuserinfo [options] user1 user2 ...

Options:

  -h,  --help               Print this message.
  -V,  --version            Print the package version.
       --token token        Github access token.
  -ua, --useragent ua       User agent.
```


### Notes

*	In addition to the [`token`][github-token] option, the [token][github-token] may also be specified by a [`GITHUB_TOKEN`][github-token] environment variable. The command-line option __always__ takes precedence.
*	If a user's [details][github-user-details] are successfully resolved, the user info is written to `stdout`.
*	If a user's [details][github-user-details] cannot be resolved due to a downstream `error` (failure), the `username` (and its associated `error`) is written to `sterr`.
*	Output order is __not__ guaranteed to match input order.
*	[Rate limit][github-rate-limit] information is written to `stderr`.


### Examples

Setting the access [token][github-token] using the command-line option:

``` bash
$ DEBUG=* ghuserinfo --token <token> kgryte planeshifter
# => {...}
```

Setting the access [token][github-token] using an environment variable:

``` bash
$ DEBUG=* GITHUB_TOKEN=<token> ghuserinfo kgryte planeshifter
# => {...}
```

For local installations, modify the command to point to the local installation directory; e.g., 

``` bash
$ DEBUG=* ./node_modules/.bin/ghuserinfo --token <token> kgryte planeshifter
# => {...}
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ DEBUG=* node ./bin/cli --token <token> kgryte planeshifter
# => {...}
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/github-user-details.svg
[npm-url]: https://npmjs.org/package/github-user-details

[build-image]: http://img.shields.io/travis/kgryte/github-user-details/master.svg
[build-url]: https://travis-ci.org/kgryte/github-user-details

[coverage-image]: https://img.shields.io/codecov/c/github/kgryte/github-user-details/master.svg
[coverage-url]: https://codecov.io/github/kgryte/github-user-details?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/github-user-details.svg
[dependencies-url]: https://david-dm.org/kgryte/github-user-details

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/github-user-details.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/github-user-details

[github-issues-image]: http://img.shields.io/github/issues/kgryte/github-user-details.svg
[github-issues-url]: https://github.com/kgryte/github-user-details/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com

[unix-time]: http://en.wikipedia.org/wiki/Unix_time

[github-get]: https://github.com/kgryte/github-get
[github-user-details]: https://developer.github.com/v3/users/
[github-api]: https://developer.github.com/v3/
[github-token]: https://github.com/settings/tokens/new
[github-oauth2]: https://developer.github.com/v3/#oauth2-token-sent-in-a-header
[github-user-agent]: https://developer.github.com/v3/#user-agent-required
[github-rate-limit]: https://developer.github.com/v3/rate_limit/