<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

class DuplicateWooCommerceProductDataCommand implements CommandInterface
{
    /**
     * @var string
     */
    private string $id;

    /**
     * DuplicateWooCommerceProductDataCommand constructor.
     * @param string $id
     */
    public function __construct(string $id)
    {
        $this->id = $id;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute(): void
    {
        $productData = WooCommerceProductDataRepository::get([
            'id' => $this->id
        ]);

        if (empty($productData)) {
            throw new \Exception("Product data not found");
        }

        $productDataModel = $productData[0];
        $newProductDataModel = $productDataModel->duplicate();

        WooCommerceProductDataRepository::save($newProductDataModel);
    }
}
