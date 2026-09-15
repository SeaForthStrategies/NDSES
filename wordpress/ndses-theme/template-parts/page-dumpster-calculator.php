<?php ndses_render_hero('dumpster-calculator'); ?>
<section class="section">
    <div class="container calculator-shell" data-calculator>
        <form class="calculator-form">
            <label>Service address <input type="text" name="address" placeholder="Enter service address"></label>
            <label>Project type
                <select name="project">
                    <option>Home/Garage Cleanout</option>
                    <option>Home Remodel</option>
                    <option>Bathroom/Kitchen Demo</option>
                    <option>Roofing/Siding Teardown</option>
                    <option>Concrete, Dirt, and Rocks</option>
                    <option>Other</option>
                </select>
            </label>
            <fieldset>
                <legend>Materials</legend>
                <?php foreach (['Mixed Household Trash', 'Construction Debris', 'Wood', 'Other Heavy Materials'] as $material) : ?>
                    <label class="check-row"><input type="checkbox" name="materials" value="<?php echo esc_attr($material); ?>"> <?php echo esc_html($material); ?></label>
                <?php endforeach; ?>
            </fieldset>
            <button class="button button-primary" type="submit">Recommend a Size</button>
        </form>
        <aside class="calculator-result" aria-live="polite">
            <p class="eyebrow">Recommendation</p>
            <h2>Start with the 15 Yard Dumpster</h2>
            <p>Choose project details to update the recommendation. You can still compare all sizes below.</p>
            <p class="small-note">This is a 15 day rental. If you use a credit card for payment, there will be a 3% fee. Dimensions may vary slightly, but capacity remains the same.</p>
            <?php ndses_button('Request Quote', home_url('/contact?service=dumpster')); ?>
        </aside>
    </div>
</section>
<section class="section soft-section">
    <div class="container">
        <?php ndses_render_dumpster_cards(); ?>
    </div>
</section>

