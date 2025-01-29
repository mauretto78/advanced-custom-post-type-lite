<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

class DuplicateWooCommerceProductDataCommand implements CommandInterface
{
    /**
     * @var string
     */
    private $id;

    /**
     * DuplicateWooCommerceProductDataCommand constructor.
     * @param $id
     */
    public function __construct($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed|void
     * @throws \Exception
     */
    public function execute()
    {
        $productData = WooCommerceProductDataRepository::get([
            'id' => $this->id
        ]);

        if(empty($productData)){
            throw new \Exception("Product data not found");
        }

        $productDataModel = $productData[0];
        $newProductDataModel = $productDataModel->duplicate();

        WooCommerceProductDataRepository::save($newProductDataModel);
    }
}