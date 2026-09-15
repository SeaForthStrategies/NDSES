<?php ndses_render_hero('residential'); ?>
<section class="section">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Community Schedules</p>
            <h2>Select your community</h2>
        </div>
        <div class="card-grid five">
            <?php foreach (ndses_data()['communities'] as $slug => $community) : ?>
                <article class="feature-card">
                    <p class="kicker"><?php echo esc_html($community['type']); ?></p>
                    <h3><?php echo esc_html($community['name']); ?></h3>
                    <p><strong><?php echo esc_html($community['service_day']); ?></strong> collection</p>
                    <a class="text-link" href="<?php echo esc_url(home_url('/residential/' . $slug)); ?>">View details</a>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<section class="section soft-section">
    <div class="container split">
        <div>
            <p class="eyebrow">Pickup Expectations</p>
            <h2>Simple rules that keep collection moving</h2>
            <?php ndses_list(['Bag all trash.', 'Place materials roadside by 5:30am.', 'Keep cans under 60 pounds.', 'Check the calendar for holiday delays.']); ?>
        </div>
        <div class="quote-panel">
            <h3>Accepted recycling</h3>
            <?php ndses_list(ndses_data()['communities']['town-of-delavan']['accepted_recycling'], 'compact-list'); ?>
        </div>
    </div>
</section>
<section class="section">
    <div class="container">
        <?php ndses_render_faqs('Residential Trash & Recycling'); ?>
    </div>
</section>

