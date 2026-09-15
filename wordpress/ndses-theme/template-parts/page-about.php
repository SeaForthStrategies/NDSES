<?php ndses_render_hero('about'); ?>
<section class="section">
    <div class="container split">
        <div>
            <p class="eyebrow">Our History</p>
            <h2>Built for local service</h2>
            <p>Our full company story is coming soon. In the meantime, reach out any time &mdash; we're happy to tell you more about NDS over the phone.</p>
        </div>
        <div class="quote-panel">
            <h3>Our Mission</h3>
            <p><?php echo esc_html(ndses_data()['mission']); ?></p>
        </div>
    </div>
</section>
<section class="section soft-section">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Meet The Team</p>
            <h2>Team profiles coming soon</h2>
        </div>
        <div class="card-grid three">
            <?php foreach (['Leadership', 'Customer Service', 'Operations'] as $role) : ?>
                <article class="feature-card placeholder-card">
                    <h3><?php echo esc_html($role); ?></h3>
                    <p>We're putting together team profiles for this section &mdash; check back soon.</p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

