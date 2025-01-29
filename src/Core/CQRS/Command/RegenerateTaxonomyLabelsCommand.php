<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\TaxonomyRepository;

class RegenerateTaxonomyLabelsCommand implements CommandInterface
{
    /**
     * @var
     */
    private string $taxonomy;

    /**
     * RegenerateTaxonomyLabelsCommand constructor.
     * @param string $taxonomy
     */
    public function __construct(string $taxonomy)
    {
        $this->taxonomy = $taxonomy;
    }

    /**
     * @return array|mixed
     * @throws \Exception
     */
    public function execute()
    {
        $taxonomyModel = TaxonomyRepository::get([
            'taxonomy' => $this->taxonomy,
        ]);

        if(empty($taxonomyModel)){
            throw new \Exception("Taxonomy not found");
        }

        $taxonomyModel = $taxonomyModel[0];
        $labels = $taxonomyModel->defaultLabels();
        $taxonomyModel->setLabels($labels);

        TaxonomyRepository::save($taxonomyModel);
    }
}