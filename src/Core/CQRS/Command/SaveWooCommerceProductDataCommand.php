<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

class SaveWooCommerceProductDataCommand implements CommandInterface
{
    /**
     * @var array<string, mixed>
     */
    private array $data;

    /**
     * SaveTaxonomyCommand constructor.
     *
     * @param array<string, mixed> $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute(): void
    {
        $id = (isset($this->data['id']) && WooCommerceProductDataRepository::exists($this->data['id'])) ? $this->data['id'] : Uuid::v4();

        $visibility = [];

        for ($i=0;$i < 6; $i++) {
            if (isset($this->data['visibility_'.$i]) && $this->data['visibility_'.$i] !== false) {
                $visibility[] = $this->data['visibility_'.$i];
            }
        }

        $model = new WooCommerceProductDataModel(
            $id,
            $this->data['product_data_name'],
            $this->resolveIcon($id),
            $visibility,
            $this->data['show_ui']
        );

        WooCommerceProductDataRepository::save($model);
    }

    /**
     * The icon picker submits an empty array (not the already-selected value) when
     * left untouched on Edit - `$this->data['icon'][0]` would then be undefined and
     * fall through to null, which the `icon` column (NOT NULL) rejects. Fall back to
     * whatever is already stored for this record instead of overwriting it.
     *
     * @param string $id
     *
     * @return string|array<mixed>
     */
    private function resolveIcon(string $id)
    {
        $icon = $this->data['icon'];

        if (is_array($icon) && empty($icon)) {
            $existing = WooCommerceProductDataRepository::exists($id) ? WooCommerceProductDataRepository::get(['id' => $id]) : [];

            return !empty($existing) ? $existing[0]->getIcon() : '';
        }

        return is_array($icon) ? $icon[0] : $icon;
    }
}
