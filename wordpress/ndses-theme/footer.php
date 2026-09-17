</main>
<footer class="site-footer">
    <div class="container footer-grid">
        <div>
            <?php if (has_custom_logo()) : ?>
                <div class="brand footer-brand"><?php the_custom_logo(); ?></div>
            <?php else : ?>
                <img class="footer-logo" src="<?php echo ndses_asset('nds-logo-primary.png'); ?>" alt="NDS Environmental Solutions">
            <?php endif; ?>
            <p><?php echo esc_html(ndses_setting('footer_description', 'Local waste management for homes, businesses, communities, projects, and events in Southern Wisconsin.')); ?></p>
        </div>
        <div>
            <h2>Contact</h2>
            <p><?php echo esc_html(ndses_setting('legal_name')); ?><br><?php echo esc_html(ndses_setting('address')); ?><br><?php echo esc_html(ndses_setting('mailing_address')); ?></p>
            <p><a href="<?php echo esc_url(ndses_phone_href()); ?>"><?php echo esc_html(ndses_setting('phone')); ?></a><br><a href="mailto:<?php echo esc_attr(ndses_setting('email')); ?>"><?php echo esc_html(ndses_setting('email')); ?></a></p>
        </div>
        <div>
            <h2>Office Hours</h2>
            <?php foreach ((array) ndses_setting('hours', []) as $line) : ?>
                <p><?php echo esc_html(is_array($line) ? ($line['line'] ?? '') : $line); ?></p>
            <?php endforeach; ?>
        </div>
        <div>
            <h2>Quick Links</h2>
            <ul class="footer-links">
                <li><a href="<?php echo esc_url(home_url('/residential')); ?>">Residential</a></li>
                <li><a href="<?php echo esc_url(home_url('/commercial')); ?>">Commercial</a></li>
                <li><a href="<?php echo esc_url(home_url('/dumpster-rentals')); ?>">Dumpster Rentals</a></li>
                <li><a href="<?php echo esc_url(home_url('/faqs')); ?>">FAQs</a></li>
            </ul>
        </div>
    </div>
    <div class="container footer-bottom">
        <p><?php echo esc_html(ndses_setting('copyright_text', 'Copyright ' . date('Y') . ' NDS Environmental Solutions, LLC. All rights reserved.')); ?></p>
        <p>
            <a href="<?php echo esc_url(home_url('/privacy-policy')); ?>">Privacy Policy</a>
            &middot;
            <a href="<?php echo esc_url(home_url('/terms')); ?>">Terms &amp; Content Sources</a>
            &middot;
            <a href="<?php echo esc_url(home_url('/photo-credits')); ?>">Photo Credits</a>
        </p>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>

