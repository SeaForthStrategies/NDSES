<?php ndses_render_hero('about'); ?>
<section class="section">
    <div class="container split">
        <div>
            <p class="eyebrow">Our History</p>
            <h2>Our Story</h2>
            <p>Founded in the fall of 2024 by Dustin Nieuwenhuis, NDS Environmental Solutions, LLC was built on a simple belief: our community deserves reliable, honest waste collection from a company that puts its customers first.</p>
            <p>For Dustin, waste management has always been a family business. Growing up in the industry gave him firsthand experience and a deep understanding of what it takes to provide dependable service.</p>
            <p>In January 2025, NDS officially began serving the Delavan, Wisconsin area, offering residential and commercial waste collection along with temporary and permanent roll-off dumpster services.</p>
            <p>Today, our team brings together experienced waste management professionals and family members who share the same commitment to quality service, strong relationships, and taking care of the communities we call home.</p>
        </div>
        <div class="quote-panel">
            <h3>Our Mission</h3>
            <p><?php echo esc_html(ndses_data()['mission']); ?></p>
        </div>
    </div>
</section>
<section class="section soft-section">
    <div class="container">
        <?php ndses_render_service_area_map(); ?>
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

