<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

class SaveWooCommerceProductDataCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private array $data;

	/**
	 * SaveTaxonomyCommand constructor.
	 *
	 * @param array $data
	 */
	public function __construct(array $data)
	{
		$this->data = $data;
	}

	/**
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		$id = (isset($this->data['id']) and WooCommerceProductDataRepository::exists($this->data['id'])) ? $this->data['id'] : Uuid::v4();

		$visibility = [];

		for ($i=0;$i < 6; $i++){
			if(isset($this->data['visibility_'.$i]) and $this->data['visibility_'.$i] !== false){
				$visibility[] = $this->data['visibility_'.$i];
			}
		}

		$model = new WooCommerceProductDataModel(
			$id,
			$this->data['product_data_name'],
			(is_array($this->data['icon']) ? $this->data['icon'][0] : $this->data['icon']),
			$visibility,
			$this->data['show_ui']
		);

		WooCommerceProductDataRepository::save($model);
	}
}