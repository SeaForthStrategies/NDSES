<?php ndses_render_hero('whats-new'); ?>
<section class="section">
    <div class="container">
        <div class="card-grid notice-grid">
            <?php foreach (ndses_data()['notices'] as $notice) : ?>
                <article class="feature-card notice-card">
                    <p class="kicker"><?php echo esc_html($notice['type']); ?> · <?php echo esc_html($notice['date']); ?></p>
                    <h2><?php echo esc_html($notice['title']); ?></h2>
                    <p><?php echo esc_html($notice['body']); ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

