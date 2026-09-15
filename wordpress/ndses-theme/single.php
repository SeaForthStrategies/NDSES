<?php
get_header();
ndses_render_hero();
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
<?php get_footer(); ?>

