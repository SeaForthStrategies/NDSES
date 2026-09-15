<?php
get_header();
ndses_render_hero('home');
ndses_render_service_cards();
?>
<section class="section soft-section">
    <div class="container split">
        <div>
            <p class="eyebrow">Why NDS</p>
            <h2>Waste solutions from a local team that knows the routes</h2>
            <p>We understand that effective waste management is critical to the quality of life in Wisconsin's towns and cities. Whether you're looking for dependable residential trash pickup or tailored commercial waste solutions, NDS is committed to responsive service.</p>
        </div>
        <div class="quote-panel">
            <h3>Our Mission</h3>
            <p><?php echo esc_html(ndses_data()['mission']); ?></p>
        </div>
    </div>
</section>
<section class="section">
    <div class="container">
        <div class="section-heading row-heading">
            <div>
                <p class="eyebrow">Dumpster Sizing</p>
                <h2>Primary roll-off sizes at a glance</h2>
            </div>
            <?php ndses_button('Open Calculator', home_url('/dumpster-calculator'), 'button button-secondary'); ?>
        </div>
        <?php ndses_render_dumpster_cards(); ?>
    </div>
</section>
<section class="section soft-section">
    <div class="container">
        <?php ndses_render_service_area_map(); ?>
    </div>
</section>
<section class="section">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Frequently Asked</p>
        </div>
        <?php ndses_render_faqs('Dumpster Rentals'); ?>
    </div>
</section>
<section class="cta-band">
    <div class="container cta-inner">
        <div>
            <h2>Ready to request service or a quote?</h2>
            <p>Tell NDS what you need and the team will help route the request.</p>
        </div>
        <?php ndses_button('Contact NDS', home_url('/contact')); ?>
    </div>
</section>
<?php get_footer(); ?>

