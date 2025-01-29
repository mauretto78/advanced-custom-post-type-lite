<?php

namespace ACPT_Lite\Core\Validators;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;

class VisibilityConditionValidator
{
    /**
     * @param MetaFieldModel $metaField
     * @param array $visibilityConditions
     *
     * @return bool
     * @throws \Exception
     */
    public static function validate(MetaFieldModel $metaField, array $visibilityConditions = [])
    {
        if(empty($visibilityConditions)){
            return true;
        }

        $allowedValueTypes = [
            MetaFieldModel::RATING_TYPE,
            MetaFieldModel::NUMBER_TYPE,
            MetaFieldModel::TEXT_TYPE,
            MetaFieldModel::TEXTAREA_TYPE,
            MetaFieldModel::CHECKBOX_TYPE,
            MetaFieldModel::RADIO_TYPE,
            MetaFieldModel::SELECT_TYPE,
            MetaFieldModel::SELECT_MULTI_TYPE,
            MetaFieldModel::DATE_TYPE,
            MetaFieldModel::TIME_TYPE,
            MetaFieldModel::URL_TYPE,
            MetaFieldModel::PHONE_TYPE,
            MetaFieldModel::EMAIL_TYPE,
            MetaFieldModel::COLOR_TYPE,
            MetaFieldModel::CURRENCY_TYPE,
            MetaFieldModel::WEIGHT_TYPE,
            MetaFieldModel::LENGTH_TYPE,
            MetaFieldModel::TOGGLE_TYPE,
        ];

        foreach ($visibilityConditions as $index => $visibilityCondition){

            $isLast = $index === (count($visibilityConditions)-1);
            $typeEnum = $visibilityCondition['type']['type'];
            $typeValue = $visibilityCondition['type']['value'];
            $operator = isset($visibilityCondition['operator']) ? $visibilityCondition['operator'] : '=';
            $value = $visibilityCondition['value'];

            $metaFieldPostType = null;
            $metaFieldTaxonomy = null;

            if($metaField->getBox()->belongsToCustomPostType()){
                $metaFieldPostType = $metaField->getBox()->getPostType();
            }

            if($metaField->getBox()->belongsToTaxonomy()){
                $metaFieldTaxonomy = $metaField->getBox()->getTaxonomy();
            }

            if(!$isLast and empty($visibilityCondition['logic'])){
                throw new \Exception('Missing logic [AND/OR]');
            }

            // validate VALUE
            if($typeEnum === 'VALUE'){
                self::validateValue($metaField, $operator, $allowedValueTypes);
            }

            // validate POST_ID
            if($typeEnum === 'POST_ID'){

                $values = trim($value);
                $values = explode(",", $values);

                $allowedOperators = [
                    '=',
                    '!=',
                    'IN',
                    'NOT_IN',
                ];

                if(!in_array($operator, $allowedOperators)){
                    throw new \Exception($operator . ' operator is not allowed for this field');
                }

                foreach ($values as $value){
                    if($metaField->getBox()->belongsToCustomPostType() and $metaFieldPostType !== null){
                        $postType = get_post_type($value);

                        if($postType === null){
                            throw new \Exception($value . ' is not a valid post ID');
                        }

                        if($postType !== $metaFieldPostType){
                            throw new \Exception('The post with ID ' . $value . ' is not a `' . $postType . '` post type');
                        }
                    }
                }
            }

            // validate TERM_ID
	        if($typeEnum === 'TERM_ID'){

		        $values = trim($value);
		        $values = explode(",", $values);

		        $allowedOperators = [
			        '=',
			        '!=',
			        'IN',
			        'NOT_IN',
		        ];

		        if(!in_array($operator, $allowedOperators)){
			        throw new \Exception($operator . ' operator is not allowed for this field');
		        }

		        foreach ($values as $value){
			        if($metaField->getBox()->belongsToTaxonomy() and $metaFieldTaxonomy !== null){
				        $term = get_term($value);

				        if($term === null){
					        throw new \Exception($value . ' is not a valid term ID');
				        }

				        if($term->taxonomy !== $metaFieldTaxonomy){
					        throw new \Exception('The term with ID ' . $value . ' is not a `' . $term->taxonomy . '` taxonomy');
				        }
			        }
		        }
	        }

            // validate TAXONOMY
            if($typeEnum === 'TAXONOMY'){

                $allowedOperators = [
                    'EMPTY',
                    'NOT_EMPTY',
                    'IN',
                    'NOT_IN',
                ];

                if(!in_array($operator, $allowedOperators)){
                    throw new \Exception($operator . ' operator is not allowed for this field');
                }

                $values = trim($value);
                $values = explode(",", $values);

                foreach ($values as $value){
                    $term = get_term($value);

                    if($term === null){
                        throw new \Exception($value . ' id not a valid term ID');
                    }

                    $termIds = [];

                    if($metaField->getBox()->belongsToCustomPostType()){
                        // get taxonomy terms for this custom post type
                        $taxonomies = get_object_taxonomies($metaFieldPostType, 'objects');

                        if(empty($taxonomies)){
                            throw new \Exception($metaFieldPostType . ' does not have any associated taxonomy');
                        }

                        // get the terms for the taxonomy
                        foreach ($taxonomies as $taxonomy){
                        	if($taxonomy->public){
		                        if($metaFieldPostType === 'post'){
			                        $taxonomyTerms = get_categories([
				                        'taxonomy' => $taxonomy->name,
				                        'hide_empty' => false,
			                        ]);
		                        } else {
			                        $taxonomyTerms = get_terms([
				                        'taxonomy' => $taxonomy->name,
				                        'hide_empty' => false,
			                        ]);
		                        }

		                        foreach ($taxonomyTerms as $taxonomyTerm){
			                        $termIds[] = $taxonomyTerm->term_id;
		                        }

		                        if(!in_array($term->term_id, $termIds)){
			                        throw new \Exception($term->term_id . ' does not belong to a Taxonomy belonging to this Custom post type');
		                        }
	                        }
                        }
                    }

                    if($metaField->getBox()->belongsToTaxonomy()){

                        if($metaFieldTaxonomy === 'category'){
                            $taxonomyTerms = get_categories([
                                'taxonomy' => $metaFieldTaxonomy,
                                'hide_empty' => false,
                            ]);
                        } else {
                            $taxonomyTerms = get_terms([
                                'taxonomy' => $metaFieldTaxonomy,
                                'hide_empty' => false,
                            ]);
                        }

                        foreach ($taxonomyTerms as $taxonomyTerm){
                            $termIds[] = $taxonomyTerm->term_id;
                        }

                        if(!in_array($term->term_id, $termIds)){
                            throw new \Exception($term->term_id . ' does not belong to a Taxonomy belonging to this Custom post type');
                        }
                    }
                }
            }

            // validate OTHER_FIELDS
            if($typeEnum === 'OTHER_FIELDS'){

                $otherMetaField = MetaRepository::getMetaFieldById($typeValue,  true);

                if($otherMetaField === null){
                    throw new \Exception('Related meta field not found');
                }

                self::validateValue($otherMetaField, $operator, $allowedValueTypes);
            }
        }
    }

    /**
     * @param MetaFieldModel $metaField
     * @param string            $operator
     * @param array             $allowedValueTypes
     *
     * @throws \Exception
     */
    private static function validateValue(MetaFieldModel $metaField, $operator, $allowedValueTypes)
    {
        $fieldType = $metaField->getType();
        $numericTypes = [
            MetaFieldModel::RATING_TYPE,
            MetaFieldModel::NUMBER_TYPE,
            MetaFieldModel::CURRENCY_TYPE,
            MetaFieldModel::WEIGHT_TYPE,
            MetaFieldModel::LENGTH_TYPE,
            MetaFieldModel::DATE_TIME_TYPE,
            MetaFieldModel::DATE_TYPE,
            MetaFieldModel::TIME_TYPE,
        ];

        $toggleTypes = [
            MetaFieldModel::TOGGLE_TYPE,
        ];

        if(!in_array($fieldType, $allowedValueTypes)){
            throw new \Exception($fieldType . ' type is not allowed');
        }

        if(in_array($fieldType, $numericTypes)){
            $allowedOperators = [
                '=',
                '!=',
                '<',
                '>',
                '<=',
                '>=',
                'LIKE',
                'NOT_LIKE',
                'BLANK',
                'NOT_BLANK',
            ];
        } elseif (in_array($fieldType, $toggleTypes)) {
            $allowedOperators = [
                'CHECKED',
                'NOT_CHECKED',
            ];
        } else {
            $allowedOperators = [
                '=',
                '!=',
                'LIKE',
                'NOT_LIKE',
                'BLANK',
                'NOT_BLANK',
            ];
        }

        if(!in_array($operator, $allowedOperators)){
            throw new \Exception($operator . ' operator is not allowed for this field');
        }
    }
}