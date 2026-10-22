<?php ndses_render_hero('special-events'); ?>
<section class="section">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow"><?php echo esc_html(ndses_sec('options', 'eyebrow', 'special-events')); ?></p>
            <h2><?php echo esc_html(ndses_sec('options', 'heading', 'special-events')); ?></h2>
        </div>
        <div class="card-grid three">
            <?php foreach ([1, 2, 3] as $n) : ?>
                <article class="feature-card">
                    <h3><?php echo esc_html(ndses_sec('options', "card{$n}_title", 'special-events')); ?></h3>
                    <p><?php echo esc_html(ndses_sec('options', "card{$n}_body", 'special-events')); ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<section class="section soft-section" id="quote">
    <div class="container split">
        <div>
            <p class="eyebrow"><?php echo esc_html(ndses_sec('quote', 'eyebrow', 'special-events')); ?></p>
            <h2><?php echo esc_html(ndses_sec('quote', 'heading', 'special-events')); ?></h2>
            <p><?php echo esc_html(ndses_sec('quote', 'body', 'special-events')); ?></p>
        </div>
        <?php ndses_render_inquiry_form('event'); ?>
    </div>
</section>
