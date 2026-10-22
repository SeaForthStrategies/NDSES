<?php
get_header();
ndses_render_hero('home');
ndses_render_service_cards();
?>
<section class="section soft-section">
    <div class="container split">
        <div>
            <p class="eyebrow"><?php echo esc_html(ndses_sec('why', 'eyebrow', 'home')); ?></p>
            <h2><?php echo esc_html(ndses_sec('why', 'heading', 'home')); ?></h2>
            <p><?php echo esc_html(ndses_sec('why', 'body', 'home')); ?></p>
        </div>
        <div class="quote-panel">
            <h3><?php echo esc_html(ndses_sec('why', 'mission_heading', 'home')); ?></h3>
            <p><?php echo esc_html(ndses_get_mission()); ?></p>
        </div>
    </div>
</section>
<section class="section">
    <div class="container">
        <div class="section-heading row-heading">
            <div>
                <p class="eyebrow"><?php echo esc_html(ndses_sec('sizes', 'eyebrow', 'home')); ?></p>
                <h2><?php echo esc_html(ndses_sec('sizes', 'heading', 'home')); ?></h2>
            </div>
            <?php ndses_button(ndses_sec('sizes', 'button', 'home'), home_url('/dumpster-calculator'), 'button button-secondary'); ?>
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
            <p class="eyebrow"><?php echo esc_html(ndses_sec('faq', 'eyebrow', 'home')); ?></p>
        </div>
        <?php ndses_render_faqs('Dumpster Rentals'); ?>
    </div>
</section>
<?php get_footer(); ?>
