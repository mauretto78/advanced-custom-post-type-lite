<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\SettingsRepository;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Integrations\WooCommerce\ACPT_Lite_WooCommerce;

class SaveSettingsCommand implements CommandInterface
{
    /**
     * @var array<string, mixed>
     */
    private array $settings;

    /**
     * SaveOptionPagesCommand constructor.
     *
     * @param array<string, mixed> $settings
     */
    public function __construct(array $settings = [])
    {
        $this->settings = $settings;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute(): void
    {
        $deleteUnusedTables = false;

        foreach ($this->settings as $key => $value) {
            $id = (SettingsRepository::getSingle($key) !== null) ? SettingsRepository::getSingle($key)->getId() : Uuid::v4();
            $value = (is_array($value)) ? json_encode($value) : $value;

            $model = SettingsModel::hydrateFromArray([
                'id' => $id,
                'key' => $key,
                'value' => $value
            ]);

            SettingsRepository::save($model);

            if ($key === SettingsModel::DELETE_UNUSED_TABLES && $value == 1) {
                $deleteUnusedTables = true;
            }
        }

        if ($deleteUnusedTables) {
            $this->removeOrCreateFeatureTables($this->settings);
        } else {
            ACPT_Lite_DB::removeOrCreateFeatureTables(SettingsModel::ENABLE_META);
            ACPT_Lite_DB::removeOrCreateFeatureTables(SettingsModel::ENABLE_CPT);
            ACPT_Lite_DB::removeOrCreateFeatureTables(SettingsModel::ENABLE_TAX);
            ACPT_Lite_DB::removeOrCreateFeatureTables("woocommerce");
        }
    }

    /**
     * Delete unused tables
     *
     * @param array<string, mixed> $settings
     *
     * @throws \Exception
     */
    private function removeOrCreateFeatureTables(array $settings = []): void
    {
        foreach ($settings as $key => $value) {
            $action = $value == 1 ? "create" : "delete";
            ACPT_Lite_DB::removeOrCreateFeatureTables($key, $action);
        }

        // WooCommerce
        $wooCommerceAction = !ACPT_Lite_WooCommerce::active() ? "delete" : "create";
        ACPT_Lite_DB::removeOrCreateFeatureTables("woocommerce", $wooCommerceAction);
    }
}
