<?php
/**
 * Plugin Name: WPGraphiQL 2.0
 * Version: 0.1.4
 * Description: This is the temporary home of the WPGraphiQL 2.0 plugin which will eventually be merged into WPGraphQL core. New features will be iterated on in this repo and progressively added to WPGraphQL core.
 * Plugin URI: https://github.com/wp-graphql/wp-graphiql-2
 * Author: WPGraphQL
 * Author URI: https://wpgraphql.com
 * License: GPL-3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.en.html
 * Requires PHP: 7.1
 * Tested up to: 5.8
 * Text Domain: wp-graphiql
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dequeue GraphiQL from the main WPGraphQL plugin
 */
add_action( 'admin_init', function() {
	global $graphiql;

	// prevent normal GraphiQL from loading
	remove_action( 'admin_enqueue_scripts', [ $graphiql, 'enqueue_graphiql' ], 10 );

}, 99 );

/**
 * Enqueue the scripts to load WPGraphiQL 2.0 in place of WPGraphiQL that ships with WPGraphQL core
 */
add_action( 'admin_enqueue_scripts', function() {

	if ( null === get_current_screen() || ! strpos( get_current_screen()->id, 'graphiql' ) ) {
		return;
	}

	$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

	// Setup some globals that can be used by GraphiQL
	// and extending scripts
	wp_enqueue_script(
		'wp-graphiql', // Handle.
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	$app_asset_file = include( plugin_dir_path( __FILE__ ) . 'build/app.asset.php');

	wp_enqueue_script(
		'wp-graphiql-app', // Handle.
		plugins_url( 'build/app.js', __FILE__ ),
		array_merge( ['wp-graphiql'], $app_asset_file['dependencies'] ),
		$app_asset_file['version'],
		true
	);

	wp_enqueue_style(
		'wp-graphiql-app',
		plugins_url( 'build/app.css', __FILE__ ),
		[ 'wp-components' ],
		$app_asset_file['version']
	);

	wp_localize_script(
		'wp-graphiql',
		'wpGraphiQLSettings',
		[
			'nonce'           => wp_create_nonce( 'wp_rest' ),
			'graphqlEndpoint' => trailingslashit( site_url() ) . 'index.php?' . \WPGraphQL\Router::$route,
			'avatarUrl' => 0 !== get_current_user_id() ? get_avatar_url( get_current_user_id() ) : null,
			'externalFragments' => apply_filters( 'graphiql_external_fragments', [] )
		]
	);

	// Extensions looking to extend GraphiQL can hook in here,
	// after the window object is established, but before the App renders
	do_action( 'enqueue_graphiql_extension' );


});

/**
 * Enqueue extension styles and scripts
 *
 * These extensions are part of WPGraphiQL core, but were built in a way
 * to showcase how extension APIs can be used to extend WPGraphiQL
 */
add_action( 'enqueue_graphiql_extension', 'graphiql_enqueue_query_composer' );
add_action( 'enqueue_graphiql_extension', 'graphiql_enqueue_auth_switch' );
add_action( 'enqueue_graphiql_extension', 'graphiql_enqueue_fullscreen_toggle' );

/**
 * Enqueue the GraphiQL Auth Switch extension, which adds a button to the GraphiQL toolbar
 * that allows the user to switch between the logged in user and the current user
 */
function graphiql_enqueue_auth_switch() {

	$auth_switch_asset_file = include( plugin_dir_path( __FILE__ ) . 'build/graphiqlAuthSwitch.asset.php');

	wp_enqueue_script(
		'wp-graphiql-auth-switch', // Handle.
		plugins_url( 'build/graphiqlAuthSwitch.js', __FILE__ ),
		array_merge( ['wp-graphiql', 'wp-graphiql-app'], $auth_switch_asset_file['dependencies'] ),
		$auth_switch_asset_file['version'],
		true
	);
}

/**
 * Enqueue the Query Composer extension, which adds a button to the GraphiQL toolbar
 * that allows the user to open the Query Composer and compose a query with a form-based UI
 */
function graphiql_enqueue_query_composer() {

	// Enqueue the assets for the Explorer before enqueueing the app,
	// so that the JS in the exporter that hooks into the app will be available
	// by time the app is enqueued
	$composer_asset_file = include( plugin_dir_path( __FILE__ ) . 'build/graphiqlQueryComposer.asset.php');

	wp_enqueue_script(
		'wp-graphiql-query-composer', // Handle.
		plugins_url( 'build/graphiqlQueryComposer.js', __FILE__ ),
		array_merge( ['wp-graphiql', 'wp-graphiql-app'], $composer_asset_file['dependencies'] ),
		$composer_asset_file['version'],
		true
	);

	wp_enqueue_style(
		'wp-graphiql-query-composer',
		plugins_url( 'build/graphiqlQueryComposer.css', __FILE__ ),
		[ 'wp-components' ],
		$composer_asset_file['version']
	);

}

/**
 * Enqueue the GraphiQL Fullscreen Toggle extension, which adds a button to the GraphiQL toolbar
 * that allows the user to toggle the fullscreen mode
 */
function graphiql_enqueue_fullscreen_toggle() {

	$fullscreen_toggle_asset_file = include( plugin_dir_path( __FILE__ ) . 'build/graphiqlFullscreenToggle.asset.php');

	wp_enqueue_script(
		'wp-graphiql-fullscreen-toggle', // Handle.
		plugins_url( 'build/graphiqlFullscreenToggle.js', __FILE__ ),
		array_merge( ['wp-graphiql', 'wp-graphiql-app'], $fullscreen_toggle_asset_file['dependencies'] ),
		$fullscreen_toggle_asset_file['version'],
		true
	);

	wp_enqueue_style(
		'wp-graphiql-fullscreen-toggle',
		plugins_url( 'build/graphiqlFullscreenToggle.css', __FILE__ ),
		[ 'wp-components' ],
		$fullscreen_toggle_asset_file['version']
	);

}
