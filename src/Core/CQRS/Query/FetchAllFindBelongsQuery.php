<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\MimeTypes;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Wordpress\Translator;

class FetchAllFindBelongsQuery implements QueryInterface
{
	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		return [
            MetaTypes::CUSTOM_POST_TYPE => $this->postTypes()[MetaTypes::CUSTOM_POST_TYPE],
            BelongsTo::PARENT_POST_ID => $this->postTypes()[BelongsTo::PARENT_POST_ID],
            BelongsTo::POST_ID => $this->postTypes()[BelongsTo::POST_ID],
            BelongsTo::POST_CAT => $this->categories(),
            BelongsTo::POST_TEMPLATE => $this->pageTemplates(),
            MetaTypes::TAXONOMY => $this->taxonomies()[MetaTypes::TAXONOMY],
            BelongsTo::TERM_ID => $this->taxonomies()[BelongsTo::TERM_ID],
            BelongsTo::POST_TAX => $this->taxonomies()[BelongsTo::POST_TAX],
            MetaTypes::MEDIA => $this->mimeTypes(),
            MetaTypes::META => $this->metaGroups(),
            MetaTypes::USER => $this->allUsers(),
            BelongsTo::USER_ID => $this->users(),
            'woo_product_data' => $this->productData(),
        ];
	}

    /**
     * @return array
     */
	private function nullValue()
    {
        return [
            'value' => null,
            'label' => Translator::translate("Select"),
        ];
    }

    /**
     * @return array
     */
    private function mimeTypes()
    {
        $data = [$this->nullValue()];
        $mimeTypes = MimeTypes::ALLOWED_VALUES;

        usort($mimeTypes, function ($a, $b){
            return strtolower($a) <=> strtolower($b);
        });

        foreach ($mimeTypes as $mimeType){
            $data[]  = [
                'value' => $mimeType,
                'label' => $mimeType,
            ];
        }

        return $data;
    }

    /**
     * @return array
     */
    private function pageTemplates()
    {
        $data = [$this->nullValue()];
        $templates = wp_get_theme()->get_page_templates();

        foreach ($templates as $file => $template){
            $data[]  = [
                'value' => $file,
                'label' => $template,
            ];
        }

        return $data;
    }

    /**
     * @return array
     */
    private function categories()
    {
        $data = [$this->nullValue()];
        $categories = get_categories([
            "orderby" => "name",
            "hide_empty" => false
        ]);

        usort($categories, function (\WP_Term $a, \WP_Term $b){
            return strtolower($a->name) <=> strtolower($b->name);
        });

        foreach ($categories as $category){
            $data[]  = [
                'value' => $category->term_id,
                'label' => $category->name,
            ];
        }

        return $data;
    }

    /**
     * @return array
     */
    private function allUsers()
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
     * @return array
     */
    private function users()
    {
        $data = [$this->nullValue()];
        $users = get_users([
            'fields' => [
                'ID',
                'display_name',
            ]
        ]);

        usort($users, function (\stdClass $a, \stdClass $b){
            return strtolower($a->display_name) <=> strtolower($b->display_name);
        });

        /** @var \WP_User $user */
        foreach ($users as $user){
            $data[]  = [
                'value' => $user->id,
                'label' => $user->display_name,
            ];
        }

        return $data;
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function metaGroups()
    {
        $data = [$this->nullValue()];
        $metaGroups = MetaRepository::get([
            'lazy' => true
        ]);

        foreach ($metaGroups as $metaGroup){
            $data[]  = [
                'value' => $metaGroup->getId(),
                'label' => $metaGroup->getUIName(),
            ];
        }

        return $data;
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function productData()
    {
        $data = [$this->nullValue()];
        $data = apply_filters( 'add_woo_product_data_to_acpt_list', $data );

        return $data;
    }

    /**
     * @return array
     */
    private function taxonomies()
    {
        $data = [
            MetaTypes::TAXONOMY => [$this->nullValue()],
            BelongsTo::POST_TAX => [$this->nullValue()],
            BelongsTo::TERM_ID => [$this->nullValue()],
        ];

        $taxonomies = get_taxonomies(['public' => true], 'objects');

        usort($taxonomies, function (\WP_Taxonomy $a, \WP_Taxonomy $b){
            return strtolower($a->label) <=> strtolower($b->label);
        });

        /** @var \WP_Taxonomy $taxonomy */
        foreach ($taxonomies as $taxonomy){
            $data[MetaTypes::TAXONOMY][]  = [
                'value' => $taxonomy->name,
                'label' => $taxonomy->label,
            ];

            $terms = [];
            $queriedTerms = get_terms([
                'taxonomy'   => $taxonomy->name,
                'hide_empty' => false,
                'orderby'    => 'name',
                'order'      => 'ASC',
                'fields' => 'id=>name',
            ]);

            foreach ($queriedTerms as $termId => $queriedTerm){
                if(is_string($queriedTerm)) {
                    $terms[] = [
                        'label' => $queriedTerm,
                        'value' => $termId,
                    ];
                }
            }

            if(!empty($terms)){
                $taxGroup = [
                    'label' => $taxonomy->name,
                    'options' => $terms
                ];

                $data[BelongsTo::POST_TAX][] = $taxGroup;
                $data[BelongsTo::TERM_ID][] = $taxGroup;
            }
        }

        return $data;
    }

    /**
     * @return array
     */
    private function postTypes()
    {
        $data = [
            MetaTypes::CUSTOM_POST_TYPE => [$this->nullValue()],
            BelongsTo::PARENT_POST_ID => [$this->nullValue()],
            BelongsTo::POST_ID => [$this->nullValue()],
        ];

        $customPostTypes = get_post_types([
            'public' => true,
        ], 'objects');

        // Add other cpt to the list from integrations with third parts plugins
        $customPostTypes = apply_filters( 'add_cpt_to_acpt_list', $customPostTypes );

        usort($customPostTypes, function (\WP_Post_Type $a, \WP_Post_Type $b){
            return strtolower($a->label) <=> strtolower($b->label);
        });

        /** @var \WP_Post_Type $customPostType */
        foreach ($customPostTypes as $customPostType){

            $toBeExcluded = [
                'attachment'
            ];

            if(!in_array($customPostType->name, $toBeExcluded)){
                $data[MetaTypes::CUSTOM_POST_TYPE][]  = [
                    'value' => $customPostType->name,
                    'label' => $customPostType->label,
                ];

                $posts = [];
                $parentPosts = [];

                $queriedPosts = get_posts([
                    'numberposts' => -1,
                    'orderby' => 'title',
                    'order' => 'ASC',
                    'post_type' => $customPostType->name,
                ]);

                foreach ($queriedPosts as $queriedPost){

                    if($queriedPost->post_parent == 0){
                        $parentPosts[] = [
                            'label' => $queriedPost->post_title ." (#".$queriedPost->ID.")",
                            'value' => $queriedPost->ID,

                        ];
                    }

                    $posts[] = [
                        'label' => $queriedPost->post_title ." (#".$queriedPost->ID.")",
                        'value' => $queriedPost->ID,
                    ];
                }

                if(!empty($parentPosts)){
                    $data[BelongsTo::PARENT_POST_ID][] = [
                        'label' => $customPostType->name,
                        'options' => $parentPosts
                    ];
                }

                if(!empty($posts)){
                    $data[BelongsTo::POST_ID][] = [
                        'label' => $customPostType->name,
                        'options' => $posts
                    ];
                }
            }
        }

        return $data;
    }
}