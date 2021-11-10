<?php
/**
 * Plugin Name: WPGraphiQL 2.0
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

	// Extensions looking to extend GraphiQL can hook in here,
	// after the window object is established, but before the App renders
	do_action( 'enqueue_graphiql_extension' );

	// Enqueue the assets for the Explorer before enqueueing the app,
	// so that the JS in the exporter that hooks into the app will be available
	// by time the app is enqueued
	$explorer_asset_file = include( plugin_dir_path( __FILE__ ) . 'build/codeExporter.asset.php');

	wp_enqueue_script(
		'wp-graphiql-explorer', // Handle.
		plugins_url( 'build/explorer.js', __FILE__ ),
		array_merge( ['wp-graphiql'], $explorer_asset_file['dependencies'] ),
		$explorer_asset_file['version'],
		true
	);

	wp_enqueue_style(
		'wp-graphiql-explorer',
		plugins_url( 'build/explorer.css', __FILE__ ),
		[ 'wp-components' ],
		$explorer_asset_file['version']
	);

	// Enqueue the assets for the exporter before enqueueing the app,
	// so that the JS in the exporter that hooks into the app will be available
	// by time the app is enqueued
	$exporter_asset_file = include( plugin_dir_path( __FILE__ ) . 'build/codeExporter.asset.php');

	wp_enqueue_script(
		'wp-graphiql-code-exporter', // Handle.
		plugins_url( 'build/codeExporter.js', __FILE__ ),
		array_merge( ['wp-graphiql'], $exporter_asset_file['dependencies'] ),
		$exporter_asset_file['version'],
		true
	);

	wp_enqueue_style(
		'wp-graphiql-code-exporter',
		plugins_url( 'build/codeExporter.css', __FILE__ ),
		[ 'wp-components' ],
		$exporter_asset_file['version']
	);

	$auth_switch_asset_file = include( plugin_dir_path( __FILE__ ) . 'build/authSwitch.asset.php');

	wp_enqueue_script(
		'wp-graphiql-auth-switch', // Handle.
		plugins_url( 'build/authSwitch.js', __FILE__ ),
		array_merge( ['wp-graphiql'], $auth_switch_asset_file['dependencies'] ),
		$auth_switch_asset_file['version'],
		true
	);

//	wp_enqueue_style(
//		'wp-graphiql-auth-switch',
//		plugins_url( 'build/authSwitch.css', __FILE__ ),
//		[ 'wp-components' ],
//		$auth_switch_asset_file['version']
//	);

	$document_tabs_file = include( plugin_dir_path( __FILE__ ) . 'build/documentTabs.asset.php');

	wp_enqueue_script(
		'wp-graphiql-document-tabs', // Handle.
		plugins_url( 'build/documentTabs.js', __FILE__ ),
		array_merge( ['wp-graphiql'], $document_tabs_file['dependencies'] ),
		$document_tabs_file['version'],
		true
	);

//	wp_enqueue_style(
//		'wp-graphiql-auth-switch',
//		plugins_url( 'build/authSwitch.css', __FILE__ ),
//		[ 'wp-components' ],
//		$auth_switch_asset_file['version']
//	);

	$app_asset_file = include( plugin_dir_path( __FILE__ ) . 'build/app.asset.php');

	wp_enqueue_script(
		'wp-graphiql-app', // Handle.
		plugins_url( 'build/app.js', __FILE__ ),
		array_merge( ['wp-graphiql', 'wp-graphiql-explorer', 'wp-graphiql-code-exporter'], $app_asset_file['dependencies'] ),
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

});
