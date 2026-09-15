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

/**
 * Site settings admin screens.
 *
 * `acf_add_options_page()` -- the usual way to give a set of ACF fields a
 * dedicated wp-admin screen -- is an ACF PRO feature. Only free ACF is
 * installed here, so that call was always a silent no-op (guarded by the
 * function_exists() check below): no menu item was ever registered, and
 * `/wp-admin/admin.php?page=ndses-site-settings` has never resolved to
 * anything. This isn't a regression, just a paid feature that was never
 * actually available.
 *
 * Free ACF does ship `acf_form()` -- a standalone field-group renderer
 * normally used for front-end forms -- which works just as well for a
 * custom admin screen. Field values still live in the same place either
 * way (post_id 'option', i.e. the wp_options table), which is what
 * ndses_setting() and the rest of the site already read from, so no data
 * migration is needed -- this only replaces the missing editing screen.
 */
function ndses_settings_pages(): array
{
    return [
        'ndses-site-settings' => [
            'page_title' => 'NDSES Site Settings',
            'menu_title' => 'Site Settings',
            'field_groups' => ['group_ndses_site_settings', 'group_ndses_integration_placeholders'],
        ],
        'ndses-site-settings-integrations' => [
            'page_title' => 'Integration Settings',
            'menu_title' => 'Integrations',
            'field_groups' => ['group_ndses_integration_placeholders'],
            'parent' => 'ndses-site-settings',
        ],
    ];
}

add_action('admin_menu', function () {
    if (!function_exists('acf_form_head')) {
        return;
    }

    $render = function (array $page) {
        return function () use ($page) {
            echo '<div class="wrap"><h1>' . esc_html($page['page_title']) . '</h1>';
            acf_form([
                'id' => 'ndses-settings-form',
                'post_id' => 'option',
                'field_groups' => $page['field_groups'],
                'submit_value' => 'Save Settings',
                'updated_message' => 'Settings saved.',
            ]);
            echo '</div>';
        };
    };

    foreach (ndses_settings_pages() as $slug => $page) {
        if (empty($page['parent'])) {
            $hook = add_menu_page($page['page_title'], $page['menu_title'], 'edit_posts', $slug, $render($page), 'dashicons-admin-generic', 59);
        } else {
            $hook = add_submenu_page($page['parent'], $page['page_title'], $page['menu_title'], 'edit_posts', $slug, $render($page));
        }

        // acf_form_head() enqueues ACF's admin assets and processes the
        // POST-back on save -- both need to happen before this screen's
        // own HTML is output, so it's hooked to the page's load event
        // rather than called inline in the render callback above.
        if ($hook) {
            add_action("load-{$hook}", 'acf_form_head');
        }
    }
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

/**
 * PayEngine payments. Card/bank details are tokenized client-side via
 * PayEngine's SecureFields JS SDK (see inc/payengine.php for the embed +
 * theme.js for the submit handler) — this endpoint only ever sees the
 * resulting token, never raw card or bank numbers.
 *
 * Auth against PayEngine is `Authorization: Basic <secret key>` (PayEngine's
 * own non-standard use of the "Basic" scheme — just the literal word
 * "Basic" plus the raw secret key), confirmed against the authenticated
 * merchant API reference at docs.payengine.co/merchant-api-reference.
 *
 * The secret key is stored as an ACF field on the Make a Payment page
 * itself (id 158) rather than the site's options page, because this
 * install's custom options-page admin menu entry isn't registering
 * (pre-existing bug, unrelated to this feature) — Pages > Make a Payment
 * has a "PayEngine Secret Key" field in the sidebar instead.
 */
add_action('rest_api_init', function () {
    register_rest_route('ndses/v1', '/payments/charge', [
        'methods' => 'POST',
        'permission_callback' => '__return_true',
        'callback' => 'ndses_handle_payment_charge',
    ]);
});

function ndses_payengine_credentials(): ?array
{
    $secret = get_field('payengine_secret_key', 158);
    $api_url = get_option('ndses_payengine_api_url');
    $merchant_id = get_option('ndses_payengine_merchant_id');

    if (!$secret || !$api_url || !$merchant_id) {
        return null;
    }

    return ['secret' => $secret, 'api_url' => rtrim((string) $api_url, '/'), 'merchant_id' => $merchant_id];
}

/** PayEngine's order_number field only accepts [a-zA-Z0-9], max 20 chars. */
function ndses_payengine_order_number(string $account_number): string
{
    $clean = preg_replace('/[^a-zA-Z0-9]/', '', $account_number);
    $clean = substr((string) $clean, 0, 20);

    return $clean !== '' ? $clean : 'NDSES';
}

function ndses_handle_payment_charge(WP_REST_Request $request)
{
    $body = $request->get_json_params();
    if (!is_array($body)) {
        return new WP_Error('invalid_body', 'Invalid request body.', ['status' => 400]);
    }

    $token = sanitize_text_field($body['token'] ?? '');
    $payment_method = sanitize_text_field($body['paymentMethod'] ?? 'card');
    $amount = (string) ($body['amount'] ?? '');
    $account_number = sanitize_text_field($body['accountNumber'] ?? '');
    $email = sanitize_email($body['email'] ?? '');

    if ($token === '' || !preg_match('/^\d+(\.\d{1,2})?$/', $amount) || mb_strlen($account_number) < 3) {
        return new WP_Error('validation_failed', 'Payment information is incomplete.', ['status' => 400]);
    }

    $creds = ndses_payengine_credentials();
    if (!$creds) {
        return rest_ensure_response([
            'mode' => 'placeholder',
            'message' => ($payment_method === 'ach' ? 'ACH' : 'Card') . ' payments are not available yet. Please contact NDSES for current payment options.',
        ]);
    }

    $rate_key = 'ndses_pay_rl_' . md5(ndses_get_client_ip());
    $count = (int) get_transient($rate_key);
    if ($count >= 10) {
        return new WP_Error('rate_limited', 'Too many attempts. Please try again shortly.', ['status' => 429]);
    }
    set_transient($rate_key, $count + 1, 10 * MINUTE_IN_SECONDS);

    $order_number = ndses_payengine_order_number($account_number);
    $description = 'NDSES account ' . $account_number;
    $metadata = ['accountNumber' => $account_number, 'email' => $email];

    if ($payment_method === 'ach') {
        $endpoint = $creds['api_url'] . '/api/payment/ach';
        $data = [
            'transactionAmount' => number_format((float) $amount, 2, '.', ''),
            'accountToken' => $token,
            'order_number' => $order_number,
            'internalTransactionID' => $account_number,
            'description' => $description,
            'metadata' => $metadata,
        ];
    } else {
        $endpoint = $creds['api_url'] . '/api/payment/sale';
        $data = [
            'transactionAmount' => number_format((float) $amount, 2, '.', ''),
            'cardToken' => $token,
            'currencyCode' => 'USD',
            'order_number' => $order_number,
            'internalTransactionID' => $account_number,
            'description' => $description,
            'metadata' => $metadata,
        ];
    }

    $response = wp_remote_post($endpoint, [
        'timeout' => 20,
        'headers' => [
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . $creds['secret'],
        ],
        'body' => wp_json_encode(['merchant_id' => $creds['merchant_id'], 'data' => $data]),
    ]);

    if (is_wp_error($response)) {
        error_log('PayEngine charge request failed: ' . $response->get_error_message());

        return rest_ensure_response(['mode' => 'error', 'message' => 'We could not reach the payment processor. Please try again shortly.']);
    }

    $status = wp_remote_retrieve_response_code($response);
    $json = json_decode(wp_remote_retrieve_body($response), true);

    if ($status < 200 || $status >= 300 || !is_array($json) || !empty($json['error'])) {
        error_log('PayEngine charge failed: HTTP ' . $status . ' ' . wp_remote_retrieve_body($response));

        return rest_ensure_response(['mode' => 'error', 'message' => 'We could not process the payment. Please try again shortly.']);
    }

    $sale_response = $json['data']['SaleResponse'] ?? $json['data']['AchResponse'] ?? null;
    $transaction_id = $json['data']['TransactionID'] ?? $json['data']['ID'] ?? null;

    if (($sale_response['status'] ?? '') === 'PASS' && $transaction_id) {
        return rest_ensure_response([
            'mode' => 'success',
            'message' => 'Thank you! Your payment has been received.',
            'transactionId' => $transaction_id,
        ]);
    }

    return rest_ensure_response([
        'mode' => 'declined',
        'message' => 'Payment failed. Please try again or contact NDSES.',
    ]);
}
