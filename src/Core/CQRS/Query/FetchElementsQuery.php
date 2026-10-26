<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

class FetchElementsQuery implements QueryInterface
{
    /**
     * @var string
     */
    private string $belongsTo;

    /**
     * @var string|null
     */
    private ?string $exclude = null;

    /**
     * @param string      $belongsTo
     * @param string|null $exclude
     */
    public function __construct(string $belongsTo, ?string $exclude = null)
    {
        $this->belongsTo = $belongsTo;
        $this->exclude = $exclude;
    }

    /**
     * @return array<int, mixed>
     * @throws \Exception
     */
    public function execute(): array
    {
        $result = [];

        if ($this->belongsTo === MetaTypes::CUSTOM_POST_TYPE) {
            $cpts = CustomPostTypeRepository::get([
                'exclude' => $this->exclude
            ]);

            foreach ($cpts as $cpt) {
                $result[] = [
                    'label' => $cpt->getName(),
                    'value' => $cpt->getName()
                ];
            }
        }

        if ($this->belongsTo === MetaTypes::TAXONOMY) {
            $taxs = TaxonomyRepository::get([
                'exclude' => $this->exclude
            ]);

            foreach ($taxs as $tax) {
                $result[] = [
                    'label' => $tax->getSlug(),
                    'value' => $tax->getSlug()
                ];
            }
        }

        return $result;
    }
}
