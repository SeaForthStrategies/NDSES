<?php ndses_render_hero('commercial'); ?>
<section class="section">
    <div class="container split">
        <div>
            <p class="eyebrow">Areas We Service</p>
            <h2>Commercial service across select Southern Wisconsin counties</h2>
            <?php ndses_list(['Walworth County', 'Rock County', 'Jefferson County', 'Waukesha County', 'Kenosha County']); ?>
            <p class="small-note">We service select areas of each county. Please call <?php echo esc_html(ndses_setting('phone')); ?> to see if we service your area.</p>
        </div>
        <div class="quote-panel">
            <h3>Flexible collection schedules</h3>
            <?php ndses_list(['Monthly', 'Every other week', '2 times per week', '3 times per week', '4 times per week', '5 times per week'], 'compact-list'); ?>
        </div>
    </div>
</section>
<section class="section soft-section">
    <div class="container">
        <?php ndses_render_service_area_map(['Commercial', 'Roll-off']); ?>
    </div>
</section>
<section class="section soft-section" id="containers">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Container Options</p>
            <h2>Find the right size dumpster for your business</h2>
        </div>
        <div class="card-grid five">
            <?php foreach (ndses_data()['commercial_containers'] as $container) : ?>
                <article class="feature-card">
                    <h3><?php echo esc_html($container['name']); ?></h3>
                    <p><?php echo esc_html($container['body']); ?></p>
                    <?php ndses_list($container['ideal'], 'compact-list'); ?>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<section class="section" id="recycling">
    <div class="container split">
        <div>
            <h2>Commercial recycling</h2>
            <p>Recycling services can be paired with your trash services.</p>
            <?php ndses_list(['Cardboard', 'Paper', 'Plastic', 'Aluminum', 'Mixed recycling']); ?>
        </div>
        <div>
            <h2>Industries we serve</h2>
            <?php ndses_list(['Restaurants', 'Offices', 'Retail Stores', 'Apartment Complexes', 'Schools', 'Manufacturing', 'Churches']); ?>
        </div>
    </div>
</section>
<section class="cta-band">
    <div class="container cta-inner">
        <div>
            <h2>Need commercial service priced?</h2>
            <p>Call or send details and NDS will help choose the right container and schedule.</p>
        </div>
        <?php ndses_button('Request A Free Quote', home_url('/contact?service=commercial')); ?>
    </div>
</section>

