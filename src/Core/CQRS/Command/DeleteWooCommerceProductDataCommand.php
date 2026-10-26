<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

class DeleteWooCommerceProductDataCommand implements CommandInterface
{
    /**
     * @var string
     */
    private string $id;

    /**
     * DeleteTemplateCommand constructor.
     *
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
        WooCommerceProductDataRepository::delete($this->id);
    }
}
