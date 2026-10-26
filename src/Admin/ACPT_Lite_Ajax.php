<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Core\API\AJAX\Controllers\AbstractController;
use ACPT_Lite\Core\API\AJAX\Controllers\BulkActionController;
use ACPT_Lite\Core\API\AJAX\Controllers\CacheController;
use ACPT_Lite\Core\API\AJAX\Controllers\CustomPostTypeController;
use ACPT_Lite\Core\API\AJAX\Controllers\GlobalsController;
use ACPT_Lite\Core\API\AJAX\Controllers\LicenseController;
use ACPT_Lite\Core\API\AJAX\Controllers\MetaController;
use ACPT_Lite\Core\API\AJAX\Controllers\PermissionController;
use ACPT_Lite\Core\API\AJAX\Controllers\TaxonomyController;
use ACPT_Lite\Core\API\AJAX\Controllers\WordPressController;
use ACPT_Lite\Core\API\AJAX\Middleware\AdminPermissionsMiddleware;
use ACPT_Lite\Core\API\AJAX\Middleware\AjaxNonceVerifierMiddleware;
use ACPT_Lite\Core\API\AJAX\Middleware\EditorPermissionsMiddleware;
use ACPT_Lite\Utils\PHP\Request;

/**
 * The admin ajax handler
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/admin
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Ajax
{
    public const ACTION_PREFIX = 'wp_ajax_';
    public const ACTION_PREFIX_NO_PRIV = 'wp_ajax_nopriv_';

    /**
     * @var Request
     */
    protected Request $request;

    /**
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @return array<int, mixed>
     */
    public function routes(): array
    {
        $adminAuth = [new AdminPermissionsMiddleware()];
        $editorAuth = [new EditorPermissionsMiddleware()];
        $authWithNonce = [new AdminPermissionsMiddleware(), new AjaxNonceVerifierMiddleware()];
        $public = [];

        return [
            // A
            $this->route('assocPostTypeToTaxonomyAction', CustomPostTypeController::class, $adminAuth),
            $this->route('assocTaxonomyToPostTypeAction', CustomPostTypeController::class, $adminAuth),

            // B
            $this->route('bulkActionsAction', BulkActionController::class, $adminAuth),

            // C
            $this->route('cacheConnectionTestAction', CacheController::class, $adminAuth),
            $this->route('cacheStatsAction', CacheController::class, $adminAuth),
            $this->route('checkMetaBoxFieldNameAction', MetaController::class, $adminAuth),
            $this->route('checkMetaBoxNameAction', MetaController::class, $adminAuth),
            $this->route('checkPostTypeNameAction', WordPressController::class, $adminAuth),
            $this->route('checkTaxonomySlugAction', TaxonomyController::class, $adminAuth),
            $this->route('copyMetaBoxAction', MetaController::class, $adminAuth),
            $this->route('copyMetaBoxesAction', MetaController::class, $adminAuth),
            $this->route('copyMetaFieldAction', MetaController::class, $adminAuth),
            $this->route('copyMetaFieldsAction', MetaController::class, $adminAuth),

            // D
            $this->route('deleteCacheItemAction', CacheController::class, $adminAuth),
            $this->route('deleteCustomPostTypeAction', CustomPostTypeController::class, $adminAuth),
            $this->route('deleteMetaAction', MetaController::class, $adminAuth),
            $this->route('deleteTaxonomyAction', TaxonomyController::class, $adminAuth),
            $this->route('doShortcodeAction', MetaController::class, $editorAuth),
            $this->route('duplicateAction', BulkActionController::class, $adminAuth),

            // F
            $this->route('fetchAllFindBelongsAction', MetaController::class, $editorAuth),
            $this->route('fetchAllMetaAction', MetaController::class, $editorAuth),
            $this->route('fetchAttachmentsAction', WordPressController::class, $adminAuth),
            $this->route('fetchCommentsAction', WordPressController::class, $adminAuth),
            $this->route('fetchCustomPostTypesAction', CustomPostTypeController::class, $adminAuth),
            $this->route('fetchElementsAction', MetaController::class, $editorAuth),
            $this->route('fetchFindAction', MetaController::class, $editorAuth),
            $this->route('fetchFindFromBelongsToAction', MetaController::class, $editorAuth),
            $this->route('fetchMetaAction', MetaController::class, $editorAuth),
            $this->route('fetchMetaFieldAction', MetaController::class, $editorAuth),
            $this->route('fetchMetaFieldsFlatMapAction', MetaController::class, $editorAuth),
            $this->route('fetchMetaFieldsFromBelongsToAction', MetaController::class, $editorAuth),
            $this->route('fetchMetaValueAction', MetaController::class, $editorAuth),
            $this->route('fetchPageTemplatesAction', WordPressController::class, $adminAuth),
            $this->route('fetchPostStatusesAction', WordPressController::class, $adminAuth),
            $this->route('fetchPostTypeTaxonomiesAction', CustomPostTypeController::class, $editorAuth),
            $this->route('fetchPostTypePostsAction', WordPressController::class, $editorAuth),
            $this->route('fetchPostTypesAction', WordPressController::class, $editorAuth),
            $this->route('fetchPreviewLinkAction', MetaController::class, $adminAuth),
            $this->route('fetchRegisteredTaxonomiesAction', TaxonomyController::class, $editorAuth),
            $this->route('fetchSettingsAction', PermissionController::class, $adminAuth),
            $this->route('fetchTaxonomiesAction', TaxonomyController::class, $adminAuth),
            $this->route('fetchTermsAction', TaxonomyController::class, $editorAuth),
            $this->route('fetchUsersAction', WordPressController::class, $editorAuth),
            $this->route('flushCacheAction', CacheController::class, $adminAuth),

            // G
            $this->route('generateGutenbergTemplateAction', MetaController::class, $adminAuth),
            $this->route('globalSettingsAction', GlobalsController::class, $adminAuth),

            // H
            $this->route('healthCheckAction', GlobalsController::class, $adminAuth),

            // I

            // L
            // Any logged-in user: the field scripts load on every edit screen, and the
            // translations they fetch are not admin data (#1412)
            $this->route('languagesAction', LicenseController::class, $public),

            // R
            $this->route('regeneratePostLabelsAction', CustomPostTypeController::class, $adminAuth),
            $this->route('regenerateTaxonomyLabelsAction', TaxonomyController::class, $adminAuth),
            $this->route('resetCustomPostTypesAction', CustomPostTypeController::class, $adminAuth),
            $this->route('resetTaxonomiesAction', TaxonomyController::class, $adminAuth),
            $this->route('runRepairAction', GlobalsController::class, $adminAuth),

            // S
            $this->route('saveCustomPostTypeAction', CustomPostTypeController::class, $adminAuth),
            $this->route('saveMetaAction', MetaController::class, $adminAuth),
            $this->route('saveSettingsAction', PermissionController::class, $authWithNonce),
            $this->route('saveTaxonomyAction', TaxonomyController::class, $adminAuth),
            $this->route('sluggifyAction', WordPressController::class, $editorAuth),
            $this->route('syncPostsAction', CustomPostTypeController::class, $adminAuth),
            $this->route('syncTaxonomiesAction', TaxonomyController::class, $adminAuth),
        ];
    }

    /**
     * @param string                           $action
     * @param class-string<AbstractController> $controllerClass
     * @param array<int, mixed>                $middlewares
     * @param bool                             $isNoPriv
     * @return array{0: string, 1: class-string<AbstractController>, 2: string, 3: array<int, mixed>}
     */
    protected function route(string $action, string $controllerClass, array $middlewares = [], bool $isNoPriv = false): array
    {
        return [$this->prefixAction($action, $isNoPriv), $controllerClass, $action, $middlewares];
    }

    /**
     * Prefixes the given action with a predefined constant based on the privilege flag.
     *
     * @param string $action
     * @param bool $isNoPriv
     * @return string
     */
    protected function prefixAction(string $action, bool $isNoPriv = false): string
    {
        if ($isNoPriv) {
            return self::ACTION_PREFIX_NO_PRIV . $action;
        }

        return self::ACTION_PREFIX . $action;
    }
}
