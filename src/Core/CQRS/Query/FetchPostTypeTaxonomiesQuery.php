<?php

namespace ACPT_Lite\Core\CQRS\Query;

class FetchPostTypeTaxonomiesQuery implements QueryInterface
{
    /**
     * @var string
     */
    private string $postType;

    /**
     * @param string $postType
     */
    public function __construct(string $postType)
    {
        $this->postType = $postType;
    }

    /**
     * @return array<int, mixed>
     */
    public function execute(): array
    {
        $data = [];
        $taxonomies = get_object_taxonomies($this->postType, 'objects');

        foreach ($taxonomies as $taxonomy) {
            if ($taxonomy->public === true) {
                $options = [];

                if ($this->postType === 'post') {
                    $terms = get_categories([
                        'taxonomy' => $taxonomy->name,
                        'hide_empty' => false,
                    ]);
                } else {
                    $terms = get_terms([
                        'taxonomy' => $taxonomy->name,
                        'hide_empty' => false,
                    ]);
                }

                if (is_wp_error($terms)) {
                    continue;
                }

                foreach ($terms as $term) {
                    $options[] = [
                        'label' => $term->name,
                        'value' => $term->term_id
                    ];
                }

                $data[] = [
                    "label" => $taxonomy->name,
                    "options" => $options
                ];
            }
        }

        return $data;
    }
}
