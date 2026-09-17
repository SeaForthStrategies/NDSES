<?php
get_header();

$community_slug = get_query_var('ndses_community');
$slug = ndses_current_slug();

if ($community_slug) {
    get_template_part('template-parts/page', 'community', ['community_slug' => $community_slug]);
} elseif (in_array($slug, ['residential', 'commercial', 'dumpster-rentals', 'dumpster-calculator', 'faqs', 'about', 'contact', 'make-a-payment', 'whats-new', 'special-events'], true)) {
    get_template_part('template-parts/page', $slug);
} elseif ($slug === 'photo-credits') {
    ?>
    <section class="section">
        <div class="container content-body">
            <h1>Photo Credits</h1>
            <?php
            while (have_posts()) {
                the_post();
                the_content();
            }
            ?>
        </div>
    </section>
    <?php
} else {
    ndses_render_hero($slug);
    ?>
    <section class="section">
        <div class="container content-body">
            <?php
            while (have_posts()) {
                the_post();
                the_content();
            }
            ?>
        </div>
    </section>
    <?php
}

get_footer();

