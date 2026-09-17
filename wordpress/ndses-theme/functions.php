<?php
/**
 * NDSES theme bootstrap.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('NDSES_THEME_VERSION', '2.0.7');
define('NDSES_THEME_DIR', get_template_directory());

require_once NDSES_THEME_DIR . '/inc/data.php';
require_once NDSES_THEME_DIR . '/inc/helpers.php';
require_once NDSES_THEME_DIR . '/inc/template-tags.php';
require_once NDSES_THEME_DIR . '/inc/geocode.php';

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('custom-logo');

    register_nav_menus([
        'primary' => __('Primary Navigation', 'ndses'),
        'footer' => __('Footer Navigation', 'ndses'),
    ]);
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('ndses-theme', get_theme_file_uri('/assets/css/theme.css'), [], NDSES_THEME_VERSION);

    $theme_deps = [];
    if (ndses_current_slug() === 'make-a-payment') {
        $public_key = get_option('ndses_payengine_public_key');
        $host = get_option('ndses_payengine_host') ?: 'https://console.payengine.dev';

        if ($public_key) {
            wp_enqueue_script('payengine-securefields', $host . '/js/1.0.0/securefields.min.js?key=' . urlencode((string) $public_key), [], null, true);
            $theme_deps[] = 'payengine-securefields';
        }
    }

    $recaptcha_site_key = function_exists('get_field') ? get_field('recaptcha_site_key', 'ndses-site-settings') : '';
    if ($recaptcha_site_key) {
        wp_enqueue_script('recaptcha-v3', 'https://www.google.com/recaptcha/api.js?render=' . urlencode((string) $recaptcha_site_key), [], null, true);
        $theme_deps[] = 'recaptcha-v3';
    }

    wp_enqueue_script('ndses-theme', get_theme_file_uri('/assets/js/theme.js'), $theme_deps, NDSES_THEME_VERSION, true);
    wp_localize_script('ndses-theme', 'ndsesData', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'restUrl' => esc_url_raw(rest_url('ndses/v1/')),
        'serviceCounties' => NDSES_SERVICE_COUNTIES,
        'phone' => ndses_setting('phone'),
        'recaptchaSiteKey' => $recaptcha_site_key ?: '',
    ]);
});

add_action('init', function () {
    add_rewrite_rule('^residential/([^/]+)/?$', 'index.php?pagename=residential&ndses_community=$matches[1]', 'top');
});

add_filter('query_vars', function ($vars) {
    $vars[] = 'ndses_community';
    return $vars;
});

add_action('wp_head', function () {
    if (is_admin()) {
        return;
    }

    ndses_print_schema();
}, 30);

