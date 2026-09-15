<?php ndses_render_hero('contact'); ?>
<section class="section">
    <div class="container contact-grid">
        <form class="site-form" data-inquiry-form novalidate>
            <div class="honeypot-field" aria-hidden="true">
                <label for="contact-website">Leave this field blank</label>
                <input id="contact-website" type="text" name="website" tabindex="-1" autocomplete="off">
            </div>
            <label>Name <input required type="text" name="name"></label>
            <label>Email <input required type="email" name="email"></label>
            <label>Phone <input required type="tel" name="phone"></label>
            <label>Service address <input type="text" name="serviceAddress"></label>
            <label>Service type
                <select required name="serviceType">
                    <option value="">Select one</option>
                    <option>Residential Trash & Recycling</option>
                    <option>Commercial Trash & Recycling</option>
                    <option>Dumpster Rental</option>
                    <option>General Question</option>
                </select>
            </label>
            <label>Message <textarea required minlength="10" name="message" rows="5"></textarea></label>
            <p class="form-status" role="status"></p>
            <button class="button button-primary" type="submit">Send Request</button>
        </form>
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

