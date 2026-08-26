<?php
/**
 * Plugin Name: NDSES CMS Structure
 * Description: Registers NDSES custom post types, ACF options pages, and local field groups.
 * Version: 0.1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', function () {
    $types = [
        'service' => ['Services', 'Service'],
        'community' => ['Communities', 'Community'],
        'dumpster_size' => ['Dumpster Sizes', 'Dumpster Size'],
        'faq' => ['FAQs', 'FAQ'],
        'document' => ['Documents', 'Document'],
        'service_notice' => ['Service Notices', 'Service Notice'],
    ];

    foreach ($types as $slug => $labels) {
        register_post_type($slug, [
            'labels' => ['name' => $labels[0], 'singular_name' => $labels[1]],
            'public' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => str_replace('_', '', $slug),
            'graphql_plural_name' => str_replace('_', '', $slug) . 's',
            'menu_icon' => $slug === 'service_notice' ? 'dashicons-warning' : 'dashicons-admin-page',
            'supports' => ['title', 'editor', 'thumbnail', 'revisions'],
            'has_archive' => $slug === 'service_notice',
            'rewrite' => ['slug' => str_replace('_', '-', $slug)],
        ]);
    }
});

add_action('acf/init', function () {
    if (!function_exists('acf_add_options_page')) {
        return;
    }

    acf_add_options_page(['page_title' => 'NDSES Site Settings', 'menu_title' => 'Site Settings', 'menu_slug' => 'ndses-site-settings']);
    acf_add_options_sub_page(['page_title' => 'Header Settings', 'menu_title' => 'Header', 'parent_slug' => 'ndses-site-settings']);
    acf_add_options_sub_page(['page_title' => 'Footer Settings', 'menu_title' => 'Footer', 'parent_slug' => 'ndses-site-settings']);
    acf_add_options_sub_page(['page_title' => 'Operations Settings', 'menu_title' => 'Operations', 'parent_slug' => 'ndses-site-settings']);
    acf_add_options_sub_page(['page_title' => 'Integration Settings', 'menu_title' => 'Integrations', 'parent_slug' => 'ndses-site-settings']);
});

add_filter('acf/settings/save_json', function () {
    return __DIR__ . '/acf-json';
});

add_filter('acf/settings/load_json', function ($paths) {
    $paths[] = __DIR__ . '/acf-json';
    return $paths;
});
