<?php
/**
 * Theme helper functions.
 */

if (!defined('ABSPATH')) {
    exit;
}

function ndses_setting(string $key, mixed $fallback = ''): mixed
{
    if (function_exists('get_field')) {
        $value = get_field($key, 'option');
        if ($value !== null && $value !== false && $value !== '') {
            return $value;
        }
    }

    return ndses_data()['settings'][$key] ?? $fallback;
}

function ndses_page_field(string $field, mixed $fallback = ''): mixed
{
    if (function_exists('get_field')) {
        $value = get_field($field);
        if ($value !== null && $value !== false && $value !== '') {
            return $value;
        }
    }

    return $fallback;
}

function ndses_asset(string $filename): string
{
    return esc_url(get_theme_file_uri('/assets/images/' . ltrim($filename, '/')));
}

function ndses_phone_href(): string
{
    return 'tel:' . preg_replace('/[^0-9+]/', '', (string) ndses_setting('phone'));
}

function ndses_current_slug(): string
{
    if (is_front_page()) {
        return 'home';
    }

    $community = get_query_var('ndses_community');
    if ($community) {
        return 'residential';
    }

    return get_post_field('post_name') ?: 'home';
}

function ndses_page_hero(?string $slug = null): array
{
    $slug = $slug ?: ndses_current_slug();
    $fallback = ndses_data()['pages'][$slug] ?? ndses_data()['pages']['home'];
    $acf_hero = ndses_page_field('hero', []);

    if (is_array($acf_hero) && !empty($acf_hero)) {
        return [
            'eyebrow' => $acf_hero['eyebrow'] ?? $fallback['eyebrow'],
            'heading' => $acf_hero['heading'] ?? $fallback['heading'],
            'description' => $acf_hero['description'] ?? $fallback['description'],
            'image' => $acf_hero['image'] ?? ($fallback['image'] ?? ''),
        ];
    }

    return $fallback;
}

function ndses_button(string $label, string $url, string $class = 'button button-primary'): void
{
    printf('<a class="%s" href="%s">%s</a>', esc_attr($class), esc_url($url), esc_html($label));
}

function ndses_list(array $items, string $class = 'check-list'): void
{
    echo '<ul class="' . esc_attr($class) . '">';
    foreach ($items as $item) {
        echo '<li>' . esc_html($item) . '</li>';
    }
    echo '</ul>';
}

