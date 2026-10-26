<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Includes\ACPT_Lite_Loader;
use JetBrains\PhpStorm\NoReturn;

/**
 * Abstract base for admin page generators (OptionPage, TableRecord, …).
 * Extracts the shared WordPress menu-registration boilerplate so concrete
 * subclasses only need to implement addMenuPage() and renderPage().
 */
abstract class AbstractAdminPageGenerator extends AbstractGenerator
{
    /**
     * @var ACPT_Lite_Loader
     */
    protected ACPT_Lite_Loader $loader;

    /**
     * @var bool
     */
    protected bool $lazy;

    /**
     * Register page into admin_menu hook.
     */
    public function registerPage(): void
    {
        $this->loader->addAction('admin_menu', $this, 'addMenuPage', 99);
    }

    /**
     * Concrete subclasses call add_menu_page / add_submenu_page here.
     */
    abstract public function addMenuPage(): void;

    /**
     * WordPress safe redirect helper.
     *
     * @param string $menuSlug
     *
     * @return void
     */
    protected function safeRedirect(string $menuSlug): void
    {
        // Mirrors FormGenerator::safeRedirect()'s CLI guard: under PHPUnit (CLI
        // SAPI), redirecting via exit() would kill the test process before any
        // assertion runs. In CLI mode this is a no-op instead, so a handler's
        // side effects (or lack thereof) up to this point remain assertable.
        if (php_sapi_name() === 'cli') {
            return;
        }

        wp_safe_redirect(
            esc_url(
                site_url('/wp-admin/admin.php?page=' . $menuSlug)
            )
        );

        exit();
    }
}
