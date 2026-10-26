<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Utils\Wordpress\Files;
use ACPT_Lite\Utils\Wordpress\Posts;
use ACPT_Lite\Utils\Wordpress\Terms;
use ACPT_Lite\Utils\Wordpress\Translator;

class FetchAllFindBelongsQuery implements QueryInterface
{
    /**
     * @return array<string, mixed>
     * @throws \Exception
     */
    public function execute(): array
    {
        $postTypes = $this->postTypes();
        $taxonomies = $this->taxonomies();

        return [
            MetaTypes::CUSTOM_POST_TYPE => $postTypes[MetaTypes::CUSTOM_POST_TYPE],
            BelongsTo::PARENT_POST_ID => $postTypes[BelongsTo::PARENT_POST_ID],
            BelongsTo::POST_ID => $postTypes[BelongsTo::POST_ID],
            BelongsTo::POST_CAT => $this->categories(),
            BelongsTo::POST_TEMPLATE => $this->pageTemplates(),
            BelongsTo::POST_FORMAT => $this->postFormats(),
            MetaTypes::TAXONOMY => $taxonomies[MetaTypes::TAXONOMY],
            BelongsTo::TERM_ID => $taxonomies[BelongsTo::TERM_ID],
            BelongsTo::POST_TAX => $taxonomies[BelongsTo::POST_TAX],
            MetaTypes::MEDIA => $this->mimeTypes(),
            MetaTypes::META => $this->metaGroups(),
            MetaTypes::FIELDS => $this->metaFieldSlugs(),
            MetaTypes::USER => $this->allUsers(),
            BelongsTo::USER_ID => $this->users(),
            'post_statuses' => $this->postStatues(),
            'woo_product_data' => $this->productData(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function nullValue(): array
    {
        return [
            'value' => null,
            'label' => Translator::translate("Select"),
        ];
    }

    /**
     * @return array<int, mixed>
     */
    private function mimeTypes(): array
    {
        $data = [$this->nullValue()];
        $mimeTypes = Files::getMimeType();

        foreach ($mimeTypes as $mimeType) {
            $data[]  = [
                'value' => $mimeType,
                'label' => $mimeType,
            ];
        }

        return $data;
    }

    /**
     * @return array<int, mixed>
     */
    private function pageTemplates(): array
    {
        $data = [$this->nullValue()];
        $templates = wp_get_theme()->get_page_templates();

        foreach ($templates as $file => $template) {
            $data[]  = [
                'value' => $file,
                'label' => $template,
            ];
        }

        return $data;
    }

    /**
     * @return array<int, mixed>
     */
    private function postFormats(): array
    {
        $data = [$this->nullValue()];
        $formats = get_post_format_strings();

        foreach ($formats as $slug => $label) {
            $data[]  = [
                'value' => $slug,
                'label' => $label,
            ];
        }

        return $data;
    }

    /**
     * @return array<int, mixed>
     */
    private function categories(): array
    {
        $data = [$this->nullValue()];
        $categories = get_categories([
            "orderby" => "name",
            "hide_empty" => false
        ]);

        usort($categories, function (\WP_Term $a, \WP_Term $b) {
            return strtolower($a->name) <=> strtolower($b->name);
        });

        foreach ($categories as $category) {
            $data[]  = [
                'value' => $category->term_id,
                'label' => $category->name,
            ];
        }

        return $data;
    }

    /**
     * @return array<int, mixed>
     */
    private function allUsers(): array
    {
        return [
            $this->nullValue(),
            [
                'value' => null,
                'label' => Translator::translate('User'),
            ]
        ];
    }

    /**
     * @return array<int, mixed>
     */
    private function users(): array
    {
        $data = [$this->nullValue()];
        $users = get_users([
            'fields' => [
                'ID',
                'display_name',
            ]
        ]);

        usort($users, function (\stdClass $a, \stdClass $b) {
            return strtolower($a->display_name) <=> strtolower($b->display_name);
        });

        /** @var \WP_User $user */
        foreach ($users as $user) {
            $data[]  = [
                'value' => $user->ID,
                'label' => $user->display_name,
            ];
        }

        return $data;
    }

    /**
     * @return array<int, mixed>
     */
    private function postStatues(): array
    {
        $statues = [];

        foreach (get_post_statuses() as $key => $label) {
            $statues[] = [
                'value' => $key,
                'label' => $label
            ];
        }

        return $statues;
    }

    /**
     * @return array<int, mixed>
     * @throws \Exception
     */
    private function metaGroups(): array
    {
        $data = [$this->nullValue()];

        $metaGroups = MetaRepository::get([
            'lazy' => true
        ]);

        foreach ($metaGroups as $metaGroup) {
            $data[]  = [
                'value' => $metaGroup->getId(),
                'label' => $metaGroup->getUIName(),
            ];
        }

        return $data;
    }

    /**
     * Get all parent fields slugs
     *
     * @return array<int, mixed>
     * @throws \Exception
     */
    private function metaFieldSlugs(): array
    {
        $data = [$this->nullValue()];

        $fields = MetaRepository::getFieldDBNames();

        foreach ($fields as $field) {
            $data[]  = [
                'value' => $field['id'],
                'label' => $field['box_name']."_".$field['field_name'],
            ];
        }

        return $data;
    }

    /**
     * @return array<int, mixed>
     * @throws \Exception
     */
    private function productData(): array
    {
        $data = [$this->nullValue()];
        $data = apply_filters('add_woo_product_data_to_acpt_list', $data);

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    private function taxonomies(): array
    {
        try {
            $data = [
                MetaTypes::TAXONOMY => [$this->nullValue()],
                BelongsTo::POST_TAX => [$this->nullValue()],
                BelongsTo::TERM_ID => [$this->nullValue()],
            ];

            $taxonomies = get_taxonomies(['show_ui' => true], 'objects');

            // Add ACPT taxonomies
            $acptTaxonomis = TaxonomyRepository::get([]);

            foreach ($acptTaxonomis as $acptTaxonomy) {
                if (!taxonomy_exists($acptTaxonomy->getSlug())) {
                    $tax = new \WP_Taxonomy($acptTaxonomy->getSlug(), 'page');
                    $tax->label = $acptTaxonomy->getSlug();
                    $taxonomies[] = $tax;
                }
            }

            usort($taxonomies, function (\WP_Taxonomy $a, \WP_Taxonomy $b) {
                return strtolower($a->label) <=> strtolower($b->label);
            });

            /** @var \WP_Taxonomy $taxonomy */
            foreach ($taxonomies as $taxonomy) {
                $data[MetaTypes::TAXONOMY][]  = [
                    'value' => $taxonomy->name,
                    'label' => Terms::formatTaxonomyLabel($taxonomy),
                ];

                $terms = [];
                $queriedTerms = get_terms([
                    'taxonomy'   => $taxonomy->name,
                    'hide_empty' => false,
                    'orderby'    => 'name',
                    'order'      => 'ASC',
                    'fields' => 'id=>name',
                ]);

                if (is_wp_error($queriedTerms)) {
                    continue;
                }

                foreach ($queriedTerms as $termId => $queriedTerm) {
                    // @phpstan-ignore-next-line function.alreadyNarrowedType
                    if (is_string($queriedTerm)) {
                        $terms[] = [
                                'label' => $queriedTerm,
                                'value' => $termId,
                        ];
                    }
                }

                if (!empty($terms)) {
                    $taxGroup = [
                        'label' => Terms::formatTaxonomyLabel($taxonomy),
                        'taxonomy' => $taxonomy->name,
                        'options' => $terms
                    ];

                    $data[BelongsTo::POST_TAX][] = $taxGroup;
                    $data[BelongsTo::TERM_ID][] = $taxGroup;
                }
            }

            return $data;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return [
                MetaTypes::TAXONOMY => [$this->nullValue()],
                BelongsTo::POST_TAX => [$this->nullValue()],
                BelongsTo::TERM_ID => [$this->nullValue()],
            ];
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function postTypes(): array
    {
        try {
            $data = [
                MetaTypes::CUSTOM_POST_TYPE => [$this->nullValue()],
                BelongsTo::PARENT_POST_ID => [$this->nullValue()],
                BelongsTo::POST_ID => [$this->nullValue()],
            ];

            $customPostTypes = get_post_types([
                    'public' => true,
            ], 'objects');

            // Add other cpt to the list from integrations with third parts plugins
            $customPostTypes = apply_filters('add_cpt_to_acpt_list', $customPostTypes);

            // Add ACPT post types
            $acptCustomPostTypes = CustomPostTypeRepository::get([]);

            foreach ($acptCustomPostTypes as $acptCustomPostType) {
                if (!post_type_exists($acptCustomPostType->getName())) {
                    $postType = new \WP_Post_Type($acptCustomPostType->getName());
                    $postType->name = $acptCustomPostType->getName();
                    $postType->label = $acptCustomPostType->getPlural();

                    $customPostTypes[] = $postType;
                }
            }

            // force only \WP_Post_Type objects in the array because some plugins
            // may add other types of data to the list through the 'add_cpt_to_acpt_list' filter
            $customPostTypes = array_filter(
                $customPostTypes,
                fn ($item) => $item instanceof \WP_Post_Type
            );

            usort($customPostTypes, function (\WP_Post_Type $a, \WP_Post_Type $b) {
                return strtolower($a->label) <=> strtolower($b->label);
            });

            foreach ($customPostTypes as $customPostType) {
                $toBeExcluded = [
                    'attachment'
                ];

                if (!in_array($customPostType->name, $toBeExcluded)) {
                    $data[MetaTypes::CUSTOM_POST_TYPE][]  = [
                        'value' => $customPostType->name,
                        'label' => $customPostType->label,
                    ];

                    $posts = [];
                    $parentPosts = [];

                    $postsFromCache = Posts::getPostsByTypeFromCache($customPostType->name);

                    foreach ($postsFromCache as $p) {
                        $id = $p->ID;
                        $title = $p->post_title;
                        $parent = $p->post_parent;

                        if ($parent == 0) {
                            $parentPosts[] = [
                                'label' => $title ." (#".$id.")",
                                'value' => $id,
                            ];
                        }

                        $posts[] = [
                            'label' => $title ." (#".$id.")",
                            'value' => $id,
                        ];
                    }

                    if (!empty($parentPosts)) {
                        $data[BelongsTo::PARENT_POST_ID][] = [
                            'label' => $customPostType->name,
                            'options' => $parentPosts
                        ];
                    }

                    if (!empty($posts)) {
                        $data[BelongsTo::POST_ID][] = [
                            'label' => $customPostType->name,
                            'options' => $posts
                        ];
                    }
                }
            }

            return $data;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return [
                MetaTypes::CUSTOM_POST_TYPE => [$this->nullValue()],
                BelongsTo::PARENT_POST_ID => [$this->nullValue()],
                BelongsTo::POST_ID => [$this->nullValue()],
            ];
        }
    }
}
