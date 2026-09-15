<?php
/**
 * Reusable template output helpers.
 */

if (!defined('ABSPATH')) {
    exit;
}

function ndses_render_hero(?string $slug = null): void
{
    $hero = ndses_page_hero($slug);
    $image = $hero['image'] ?? '';
    $image_url = is_array($image) && isset($image['url']) ? $image['url'] : ($image ? ndses_asset((string) $image) : '');
    ?>
    <section class="hero-section">
        <div class="container hero-grid<?php echo $image_url ? '' : ' hero-grid--no-media'; ?>">
            <div class="hero-copy">
                <p class="eyebrow"><?php echo esc_html($hero['eyebrow'] ?? 'NDS Environmental Solutions'); ?></p>
                <h1><?php echo esc_html($hero['heading'] ?? get_the_title()); ?></h1>
                <p class="hero-text"><?php echo esc_html($hero['description'] ?? ''); ?></p>
                <div class="hero-actions">
                    <?php ndses_button('Get a Quote', home_url('/contact')); ?>
                    <?php ndses_button('Call NDS', ndses_phone_href(), 'button button-secondary'); ?>
                    <?php if ($slug === 'home' || $slug === 'dumpster-rentals') : ?>
                        <?php ndses_button('Rent a Dumpster', home_url('/dumpster-rentals'), 'button button-ghost'); ?>
                    <?php endif; ?>
                </div>
            </div>
            <?php if ($image_url) : ?>
            <div class="hero-media">
                <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr(($hero['heading'] ?? 'NDS Environmental Solutions') . ' visual'); ?>">
            </div>
            <?php endif; ?>
        </div>
    </section>
    <?php
}

function ndses_render_service_cards(): void
{
    ?>
    <section class="section">
        <div class="container">
            <div class="section-heading">
                <p class="eyebrow">Our Services</p>
                <h2>Choose the service you need</h2>
            </div>
            <div class="card-grid three">
                <?php foreach (ndses_data()['services'] as $service) : ?>
                    <article class="feature-card media-card">
                        <img src="<?php echo ndses_asset($service['image']); ?>" alt="<?php echo esc_attr($service['title']); ?>">
                        <div>
                            <h3><?php echo esc_html($service['title']); ?></h3>
                            <p><?php echo esc_html($service['body']); ?></p>
                            <a href="<?php echo esc_url(home_url($service['url'])); ?>" class="text-link">Explore service</a>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php
}

function ndses_material_list_items(array $material_lists, string $heading): array
{
    foreach ($material_lists as $list) {
        if (($list['heading'] ?? '') === $heading) {
            return array_map(static fn ($row) => $row['item'] ?? '', $list['items'] ?? []);
        }
    }

    return [];
}

function ndses_render_dumpster_cards(): void
{
    $posts = function_exists('get_field')
        ? get_posts(['post_type' => 'dumpster_size', 'numberposts' => -1, 'orderby' => 'menu_order title', 'order' => 'ASC'])
        : [];

    if (empty($posts)) {
        ?>
        <div class="card-grid four">
            <?php foreach (ndses_data()['dumpsters'] as $dumpster) : ?>
                <article class="feature-card dumpster-card">
                    <img src="<?php echo ndses_asset($dumpster['image']); ?>" alt="<?php echo esc_attr($dumpster['name']); ?>">
                    <p class="kicker"><?php echo esc_html($dumpster['capacity']); ?></p>
                    <h3><?php echo esc_html($dumpster['name']); ?></h3>
                    <?php ndses_list($dumpster['uses'], 'compact-list'); ?>
                    <p class="small-note">Includes: <?php echo esc_html(implode(', ', $dumpster['included'])); ?>.</p>
                    <?php ndses_button('Request This Size', home_url('/contact?service=dumpster&size=' . $dumpster['slug']), 'button button-small'); ?>
                </article>
            <?php endforeach; ?>
        </div>
        <?php
        return;
    }

    ?>
    <div class="card-grid four">
        <?php foreach ($posts as $dumpster_post) :
            $capacity = get_field('truck_loads', $dumpster_post->ID) ?: get_field('capacity', $dumpster_post->ID);
            $dimensions = get_field('dimensions', $dumpster_post->ID);
            $material_lists = get_field('material_lists', $dumpster_post->ID) ?: [];
            $uses = ndses_material_list_items($material_lists, 'Ideal For');
            $included = ndses_material_list_items($material_lists, 'Included');
            $image = get_field('field_ndses_image', $dumpster_post->ID);
            $image_url = is_array($image) && !empty($image['url']) ? $image['url'] : '';
            ?>
            <article class="feature-card dumpster-card">
                <?php if ($image_url) : ?><img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr(get_the_title($dumpster_post)); ?>"><?php endif; ?>
                <?php if ($capacity) : ?><p class="kicker"><?php echo esc_html($capacity); ?></p><?php endif; ?>
                <h3><?php echo esc_html(get_the_title($dumpster_post)); ?></h3>
                <?php if ($uses) : ?><?php ndses_list($uses, 'compact-list'); ?><?php endif; ?>
                <?php if ($dimensions) : ?><p class="small-note"><strong>Dimensions:</strong> <?php echo esc_html($dimensions); ?></p><?php endif; ?>
                <?php if ($included) : ?><p class="small-note">Includes: <?php echo esc_html(implode(', ', $included)); ?>.</p><?php endif; ?>
                <?php ndses_button('Request This Size', home_url('/contact?service=dumpster&size=' . $dumpster_post->post_name), 'button button-small'); ?>
            </article>
        <?php endforeach; ?>
    </div>
    <?php
}

function ndses_render_faqs(?string $category = null): void
{
    $groups = ndses_data()['faqs'];
    if ($category && isset($groups[$category])) {
        $groups = [$category => $groups[$category]];
    }
    ?>
    <div class="faq-stack">
        <?php foreach ($groups as $label => $faqs) : ?>
            <section class="faq-group" id="<?php echo esc_attr(sanitize_title($label)); ?>">
                <h2><?php echo esc_html($label); ?></h2>
                <?php foreach ($faqs as $faq) : ?>
                    <details class="faq-item">
                        <summary><?php echo esc_html($faq[0]); ?></summary>
                        <p><?php echo esc_html($faq[1]); ?></p>
                    </details>
                <?php endforeach; ?>
            </section>
        <?php endforeach; ?>
    </div>
    <?php
}

function ndses_render_service_area_map(): void
{
    ?>
    <section class="section map-section">
        <div class="container split">
            <div>
                <p class="eyebrow">Service Area</p>
                <h2>Local coverage with room to confirm your address</h2>
                <p>NDS serves residential routes in core Walworth County communities and offers commercial and roll-off service in select nearby counties. Call to confirm service at your exact address.</p>
                <?php ndses_button('Check My Address', home_url('/contact')); ?>
            </div>
            <div class="map-panel" aria-label="NDS service area map placeholder">
                <?php foreach (ndses_data()['service_areas'] as $area) : ?>
                    <span class="map-pin" style="left: <?php echo esc_attr((string) $area['x']); ?>%; top: <?php echo esc_attr((string) $area['y']); ?>%;" title="<?php echo esc_attr($area['name']); ?>"></span>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php
}

function ndses_print_schema(): void
{
    $settings = ndses_data()['settings'];
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'LocalBusiness',
        'name' => $settings['company_name'],
        'telephone' => $settings['phone'],
        'email' => $settings['email'],
        'address' => [
            '@type' => 'PostalAddress',
            'streetAddress' => '1635 Mound Rd',
            'addressLocality' => 'Delavan',
            'addressRegion' => 'WI',
            'postalCode' => '53115',
        ],
        'areaServed' => $settings['service_area'],
    ];

    echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES) . '</script>';
}

