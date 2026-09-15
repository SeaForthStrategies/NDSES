<?php ndses_render_hero('dumpster-rentals'); ?>
<section class="section">
    <div class="container">
        <div class="section-heading row-heading">
            <div>
                <p class="eyebrow">Size Guide</p>
                <h2>Find the right size dumpster for you</h2>
            </div>
            <?php ndses_button('Use Calculator', home_url('/dumpster-calculator'), 'button button-secondary'); ?>
        </div>
        <?php ndses_render_dumpster_cards(); ?>
    </div>
</section>
<section class="section soft-section" id="materials">
    <div class="container split">
        <article class="feature-card">
            <h2>Accepted Materials</h2>
            <?php ndses_list(ndses_data()['accepted_materials']); ?>
        </article>
        <article class="feature-card">
            <h2>Not Accepted Materials</h2>
            <?php ndses_list(ndses_data()['prohibited_materials'], 'danger-list'); ?>
        </article>
    </div>
</section>
<section class="section">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Rental Process</p>
            <h2>Four simple steps</h2>
        </div>
        <div class="process-grid">
            <?php foreach ([['Request A Quote', 'Tell us about your project so we can help you find the dumpster that fits your needs.'], ['Schedule Delivery', 'Call NDS to schedule delivery at the right location.'], ['Fill It Up', 'Fill the dumpster during your 15 day rental period.'], ['We Pick It Up', 'Call when you are done and NDS will haul everything away.']] as $index => $step) : ?>
                <article class="process-step">
                    <span><?php echo esc_html((string) ($index + 1)); ?></span>
                    <h3><?php echo esc_html($step[0]); ?></h3>
                    <p><?php echo esc_html($step[1]); ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<section class="section soft-section" id="quote">
    <div class="container split">
        <div>
            <p class="eyebrow">Rental Inquiry</p>
            <h2>Request a dumpster</h2>
            <p>Arriving from "Request This Size"? The size you picked carries over automatically.</p>
        </div>
        <?php ndses_render_inquiry_form('dumpster'); ?>
    </div>
</section>
