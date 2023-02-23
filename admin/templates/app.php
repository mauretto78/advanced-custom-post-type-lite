<div class="acpt-container is-wrapper">
    <div id="acpt-admin-app"></div>
</div>
<script>
    document.globals = {
        plugin_version: "<?php echo ACPT_LITE_PLUGIN_VERSION; ?>",
        site_url: "<?php echo site_url(); ?>",
        admin_url: "<?php echo admin_url(); ?>",
        ajax_url: "<?php echo admin_url( 'admin-ajax.php' ); ?>",
        rest_route_url: "<?php echo "/?rest_route=/acpt/v1"; ?>",
        http_referer: "<?php echo (isset($_SERVER['HTTP_REFERER'])) ? $_SERVER['HTTP_REFERER'] : ''; ?>",
    };
</script>