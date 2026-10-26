<div class="acpt-container <?php echo ACPT_LITE_SKIN; ?> <?php echo (is_rtl() === true) ? "rtl" : ""; ?>" dir="<?php echo (is_rtl() === true) ? "rtl" : "ltr"; ?>">
    <div id="acpt-admin-app"></div>
</div>
<?php
if(ACPT_LITE_SKIN === 'dark' || ACPT_LITE_SKIN === 'midnight' || ACPT_LITE_SKIN === 'airy'):

    switch (ACPT_LITE_SKIN) {
        case 'dark':
            $footerBg = '#1d2327';
            $footerColor = '#ddd';
            $footerLinkColor = '#00a1ba';
            $footerLinkHoverColor = '#007e91';
            break;

        case 'midnight':
            $footerBg = '#070d17';
            $footerColor = '#e8f2f8';
            $footerLinkColor = '#22d3ee';
            $footerLinkHoverColor = '#1fc2db';
            break;

        case 'airy':
            $footerBg = '#f5f0fb';
            $footerColor = '#1e1a26';
            $footerLinkColor = '#0b7685';
            $footerLinkHoverColor = '#0a6d7a';
            break;
    }

    ?>
    <!-- ACPT <?php echo strtoupper(ACPT_LITE_SKIN); ?> SKIN -->
    <style>
        #wpfooter, #wpcontent {
            background: <?php echo $footerBg; ?>;
            color: <?php echo $footerColor; ?>;
        }

        #wpfooter a {
            color: <?php echo $footerLinkColor; ?>;
        }

        #wpfooter a:hover,
        #wpfooter a:focus {
            color: <?php echo $footerLinkHoverColor; ?>;
        }

        ul#adminmenu a.wp-has-current-submenu:after  {
            border-right-color: <?php echo $footerBg; ?>;
        }
    </style>
<?php endif; ?>