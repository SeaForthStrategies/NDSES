<?php
/**
 * Site header.
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main">Skip to content</a>
<div class="announcement">
    <div class="container announcement-inner">
        <span>No urgent service alerts are active.</span>
        <a href="<?php echo esc_url(home_url('/whats-new')); ?>">View updates</a>
    </div>
</div>
<header class="site-header">
    <div class="container nav-shell">
        <?php if (has_custom_logo()) : ?>
            <div class="brand"><?php the_custom_logo(); ?></div>
        <?php else : ?>
            <a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="NDS Environmental Solutions home">
                <img src="<?php echo ndses_asset('nds-logo-primary.png'); ?>" alt="NDS Environmental Solutions">
            </a>
        <?php endif; ?>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu">Menu</button>
        <nav class="primary-nav" id="primary-menu" aria-label="Primary navigation">
            <?php
            if (has_nav_menu('primary')) {
                wp_nav_menu(['theme_location' => 'primary', 'container' => false, 'menu_class' => 'menu']);
            } else {
                echo '<ul class="menu">';
                foreach (ndses_data()['nav'] as $item) {
                    echo '<li><a href="' . esc_url(home_url($item['url'])) . '">' . esc_html($item['label']) . '</a></li>';
                }
                echo '</ul>';
            }
            ?>
        </nav>
        <div class="nav-actions">
            <a class="pay-link" href="<?php echo esc_url(home_url('/make-a-payment')); ?>">Pay</a>
            <?php ndses_button('Quote', home_url('/contact'), 'button button-small'); ?>
            <a class="phone-link" href="<?php echo esc_url(ndses_phone_href()); ?>"><?php echo esc_html(ndses_setting('phone')); ?></a>
        </div>
    </div>
</header>
<main id="main">

