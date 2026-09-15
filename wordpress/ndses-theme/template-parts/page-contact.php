<?php ndses_render_hero('contact'); ?>
<section class="section">
    <div class="container contact-grid">
        <?php ndses_render_inquiry_form('general'); ?>
        <aside class="quote-panel">
            <h2>Contact Card</h2>
            <p><?php echo esc_html(ndses_setting('legal_name')); ?><br><?php echo esc_html(ndses_setting('address')); ?></p>
            <p><a href="<?php echo esc_url(ndses_phone_href()); ?>"><?php echo esc_html(ndses_setting('phone')); ?></a><br><a href="mailto:<?php echo esc_attr(ndses_setting('email')); ?>"><?php echo esc_html(ndses_setting('email')); ?></a></p>
            <h3>Office Hours</h3>
            <?php foreach ((array) ndses_setting('hours', []) as $line) : ?>
                <p><?php echo esc_html(is_array($line) ? ($line['line'] ?? '') : $line); ?></p>
            <?php endforeach; ?>
        </aside>
    </div>
</section>

