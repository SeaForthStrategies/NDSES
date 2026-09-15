<?php
/**
 * Server-side proxy for OpenStreetMap Nominatim geocoding.
 * Free, no API key. Nominatim's usage policy requires requests to carry a
 * real identifying User-Agent, which browsers can't set themselves, so this
 * runs server-side via wp_remote_get() instead of calling Nominatim from JS.
 */

if (!defined('ABSPATH')) {
    exit;
}

const NDSES_SERVICE_COUNTIES = ['Walworth', 'Rock', 'Jefferson', 'Waukesha', 'Kenosha'];

function ndses_handle_geocode_request(): void
{
    $query = isset($_GET['q']) ? sanitize_text_field(wp_unslash($_GET['q'])) : '';

    if (mb_strlen($query) < 3) {
        wp_send_json(['results' => []]);
    }

    $params = [
        'format' => 'jsonv2',
        'q' => $query,
        'countrycodes' => 'us',
        'addressdetails' => 1,
        'limit' => 5,
    ];

    $response = wp_remote_get('https://nominatim.openstreetmap.org/search?' . http_build_query($params), [
        'headers' => [
            'User-Agent' => 'NDSES-Website/1.0 (info@ndses.com)',
            'Accept-Language' => 'en',
        ],
        'timeout' => 8,
    ]);

    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        wp_send_json(['results' => []], 502);
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    $results = [];

    if (is_array($body)) {
        foreach ($body as $item) {
            $county = $item['address']['county'] ?? null;
            $results[] = [
                'label' => $item['display_name'] ?? '',
                'lat' => (float) ($item['lat'] ?? 0),
                'lon' => (float) ($item['lon'] ?? 0),
                'county' => $county ? preg_replace('/ County$/', '', $county) : null,
                'state' => $item['address']['state'] ?? null,
            ];
        }
    }

    wp_send_json(['results' => $results]);
}

add_action('wp_ajax_ndses_geocode', 'ndses_handle_geocode_request');
add_action('wp_ajax_nopriv_ndses_geocode', 'ndses_handle_geocode_request');
