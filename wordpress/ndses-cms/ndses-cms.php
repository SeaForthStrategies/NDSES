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
        'service_area' => ['Service Areas', 'Service Area'],
        'schedule_item' => ['Schedule Items', 'Schedule Item'],
    ];

    foreach ($types as $slug => $labels) {
        register_post_type($slug, [
            'labels' => ['name' => $labels[0], 'singular_name' => $labels[1]],
            'public' => true,
            'show_in_rest' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => str_replace('_', '', $slug),
            'graphql_plural_name' => str_replace('_', '', $slug) . 's',
            'menu_icon' => $slug === 'service_notice' ? 'dashicons-warning' : 'dashicons-admin-page',
            'supports' => ['title', 'editor', 'thumbnail', 'revisions'],
            'has_archive' => $slug === 'service_notice',
            'rewrite' => ['slug' => str_replace('_', '-', $slug)],
        ]);
    }

    register_post_type('form_submission', [
        'labels' => ['name' => 'Form Submissions', 'singular_name' => 'Form Submission'],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => false,
        'menu_icon' => 'dashicons-email-alt',
        'supports' => ['title'],
        'capability_type' => 'post',
    ]);
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

/**
 * ACF options-page REST exposure (acf/v3/options/...) requires ACF PRO's
 * REST integration, which isn't installed here. This site only has free
 * ACF, so expose the site-settings option fields through a small custom
 * route instead.
 */
add_action('rest_api_init', function () {
    register_rest_route('ndses/v1', '/settings', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function () {
            if (!function_exists('get_field')) {
                return new WP_Error('acf_unavailable', 'ACF is not active.', ['status' => 500]);
            }

            $keys = [
                'company_name', 'legal_name', 'phone', 'email', 'address',
                'mailing_address', 'hours', 'service_area', 'facebook',
                'instagram', 'header_logo', 'footer_logo',
                'footer_description', 'copyright_text', 'social_links',
            ];

            $settings = [];
            foreach ($keys as $key) {
                $settings[$key] = get_field($key, 'ndses-site-settings');
            }

            return rest_ensure_response($settings);
        },
    ]);
});

/**
 * Quote/contact form intake. Stores each submission as a private
 * form_submission post (so NDS always has a record even if the email
 * bounces or lands in spam) and emails a notification.
 */
add_action('rest_api_init', function () {
    register_rest_route('ndses/v1', '/forms', [
        'methods' => 'POST',
        'permission_callback' => '__return_true',
        'callback' => 'ndses_handle_form_submission',
    ]);
});

function ndses_get_client_ip(): string
{
    foreach (['HTTP_X_FORWARDED_FOR', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            return trim(explode(',', sanitize_text_field(wp_unslash($_SERVER[$key])))[0]);
        }
    }

    return '0.0.0.0';
}

function ndses_handle_form_submission(WP_REST_Request $request)
{
    $body = $request->get_json_params();
    if (!is_array($body)) {
        return new WP_Error('invalid_body', 'Invalid request body.', ['status' => 400]);
    }

    // Honeypot: a field real visitors never see or fill in. Bots that
    // auto-fill every input trip it. Respond as if it succeeded so bots
    // don't learn the field is being checked.
    if (!empty($body['website'])) {
        return rest_ensure_response(['ok' => true]);
    }

    $rate_key = 'ndses_form_rl_' . md5(ndses_get_client_ip());
    $count = (int) get_transient($rate_key);
    if ($count >= 5) {
        return new WP_Error('rate_limited', 'Too many submissions. Please try again in a few minutes.', ['status' => 429]);
    }
    set_transient($rate_key, $count + 1, 10 * MINUTE_IN_SECONDS);

    $name = sanitize_text_field($body['name'] ?? '');
    $email = sanitize_email($body['email'] ?? '');
    $message = sanitize_textarea_field($body['message'] ?? '');
    $form_type = sanitize_text_field($body['formType'] ?? 'general');

    if (mb_strlen($name) < 2 || !is_email($email) || mb_strlen($message) < 10) {
        return new WP_Error('validation_failed', 'Please provide a valid name, email, and message.', ['status' => 400]);
    }

    $extra_fields = [
        'Phone' => sanitize_text_field($body['phone'] ?? ''),
        'Service type' => sanitize_text_field($body['serviceType'] ?? ''),
        'Service address' => sanitize_text_field($body['serviceAddress'] ?? ''),
        'Selected dumpster size' => sanitize_text_field($body['selectedDumpsterSize'] ?? ''),
        'Event date' => sanitize_text_field($body['eventDate'] ?? ''),
    ];

    $post_id = wp_insert_post([
        'post_type' => 'form_submission',
        'post_title' => sprintf('%s inquiry from %s (%s)', ucfirst($form_type), $name, current_time('Y-m-d H:i')),
        'post_status' => 'publish',
        'post_content' => $message,
        'meta_input' => array_merge(
            ['name' => $name, 'email' => $email, 'form_type' => $form_type],
            array_filter($extra_fields)
        ),
    ], true);

    if (is_wp_error($post_id)) {
        return new WP_Error('storage_failed', 'Could not store submission.', ['status' => 500]);
    }

    $notify_to = get_field('email', 'ndses-site-settings') ?: get_option('admin_email');
    $lines = ["Name: {$name}", "Email: {$email}"];
    foreach (array_filter($extra_fields) as $label => $value) {
        $lines[] = "{$label}: {$value}";
    }
    $lines[] = '';
    $lines[] = 'Message:';
    $lines[] = $message;

    wp_mail(
        $notify_to,
        sprintf('[NDS Website] New %s inquiry from %s', $form_type, $name),
        implode("\n", $lines),
        ['Reply-To: ' . $name . ' <' . $email . '>']
    );

    return rest_ensure_response(['ok' => true, 'id' => $post_id]);
}
