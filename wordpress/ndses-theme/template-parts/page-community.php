<?php
$slug = $args['community_slug'] ?? '';
$community = ndses_data()['communities'][$slug] ?? null;

if (!$community) {
    ndses_render_hero('residential');
    echo '<section class="section"><div class="container"><p>Community details are not available yet.</p></div></section>';
    return;
}
?>
<section class="hero-section">
    <div class="container hero-grid">
        <div class="hero-copy">
            <p class="eyebrow"><?php echo esc_html($community['type']); ?> Residential Service</p>
            <h1><?php echo esc_html($community['name']); ?></h1>
            <p class="hero-text"><?php echo esc_html($community['description']); ?></p>
            <div class="hero-actions">
                <?php ndses_button('Request Service', home_url('/contact?service=residential')); ?>
                <?php ndses_button('Call NDS', ndses_phone_href(), 'button button-secondary'); ?>
            </div>
        </div>
        <div class="quote-panel schedule-card">
            <h2>Service Information</h2>
            <p><strong>Service Day:</strong> <?php echo esc_html($community['service_day']); ?></p>
            <p><strong>Trash:</strong> <?php echo esc_html($community['trash_schedule']); ?></p>
            <p><strong>Recycling:</strong> <?php echo esc_html($community['recycling_schedule']); ?></p>
        </div>
    </div>
</section>
<?php if ($slug === 'town-of-walworth') : ?>
<section class="section">
    <div class="container">
        <img class="zone-map-image" src="<?php echo esc_url(get_theme_file_uri('/assets/images/walworth-recycling-zone-map.png')); ?>" alt="Town of Walworth recycling service map showing North and South collection zones" width="482" height="512" loading="lazy">
    </div>
</section>
<?php endif; ?>
<section class="section">
    <div class="container split">
        <div>
            <h2>Service Guidelines</h2>
            <?php ndses_list($community['guidelines']); ?>
        </div>
        <div>
            <h2>Bulk Item Guidance</h2>
            <p><?php echo esc_html($community['bulk_policy']); ?></p>
            <div class="two-column-list">
                <div>
                    <h3>Accepted</h3>
                    <?php ndses_list($community['bulk_accepted'], 'compact-list'); ?>
                </div>
                <div>
                    <h3>Not accepted</h3>
                    <?php ndses_list($community['bulk_not_accepted'], 'compact-list danger-list'); ?>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="section soft-section">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Recycling</p>
            <h2>What belongs in recycling</h2>
        </div>
        <div class="card-grid three">
            <article class="feature-card">
                <h3>Accepted</h3>
                <?php ndses_list($community['accepted_recycling'], 'compact-list'); ?>
            </article>
            <article class="feature-card">
                <h3>Not accepted</h3>
                <?php ndses_list($community['recycling_not_accepted'], 'compact-list danger-list'); ?>
            </article>
            <article class="feature-card">
                <h3>Never accepted</h3>
                <?php ndses_list($community['recycling_never_accepted'], 'compact-list danger-list'); ?>
            </article>
        </div>
    </div>
</section>

