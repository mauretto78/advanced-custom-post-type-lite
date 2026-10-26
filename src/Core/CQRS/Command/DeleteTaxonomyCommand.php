<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\TaxonomyRepository;

class DeleteTaxonomyCommand implements CommandInterface
{
    /**
     * @var string
     */
    private string $taxonomy;

    /**
     * DeleteTaxonomyCommand constructor.
     *
     * @param string $taxonomy
     */
    public function __construct(string $taxonomy)
    {
        $this->taxonomy = $taxonomy;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute(): void
    {
        TaxonomyRepository::delete($this->taxonomy);
        unregister_taxonomy($this->taxonomy);
        flush_rewrite_rules();
    }
}
