<?php ndses_render_hero('about'); ?>
<section class="section">
    <div class="container split">
        <div>
            <p class="eyebrow"><?php echo esc_html(ndses_sec('story', 'eyebrow', 'about')); ?></p>
            <h2><?php echo esc_html(ndses_sec('story', 'heading', 'about')); ?></h2>
            <?php echo ndses_get_our_story_html(); ?>
        </div>
        <div class="quote-panel">
            <h3><?php echo esc_html(ndses_sec('story', 'mission_heading', 'about')); ?></h3>
            <p><?php echo esc_html(ndses_get_mission()); ?></p>
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
            <p class="eyebrow"><?php echo esc_html(ndses_sec('team', 'eyebrow', 'about')); ?></p>
            <h2><?php echo esc_html(ndses_sec('team', 'heading', 'about')); ?></h2>
        </div>
        <div class="card-grid three">
            <?php foreach ([1, 2, 3] as $n) :
                $name = ndses_sec('team', "member{$n}_name", 'about');
                $photo = ndses_sec_image('team', "member{$n}_photo", 'about');
                ?>
                <article class="feature-card<?php echo $photo ? ' team-card' : ' placeholder-card'; ?>">
                    <?php ndses_sec_img('team', "member{$n}_photo", 'team-photo', $name, 'about'); ?>
                    <h3><?php echo esc_html($name); ?></h3>
                    <p><?php echo esc_html(ndses_sec('team', "member{$n}_body", 'about')); ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
