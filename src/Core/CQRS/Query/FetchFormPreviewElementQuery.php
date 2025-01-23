<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Core\Models\Form\FormFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\Meta;

class FetchFormPreviewElementQuery implements QueryInterface
{
	private $field;

	/**
	 * @var null
	 */
	private $previewElement;

	public function __construct($field, $previewElement = null)
	{
		$this->field = $field;
		$this->previewElement = $previewElement;
	}

	/**
	 * @inheritDoc
	 * @throws \Exception
	 */
	public function execute()
	{
		if($this->previewElement === null){
			return $this->field['extra']['defaultValue'];
		}

		if(!isset($this->previewElement['id'])){
			return $this->field['extra']['defaultValue'];
		}

		if(!isset($this->previewElement['belong'])){
			return $this->field['extra']['defaultValue'];
		}

		if(!isset($this->previewElement['find'])){
			return $this->field['extra']['defaultValue'];
		}

		// is a ACPT field
		if(!empty($this->field['metaFieldId'])){
			$metaFieldModel = MetaRepository::getMetaFieldById($this->field['metaFieldId']);

            if($metaFieldModel === null){
                return null;
            }

            switch ($this->field['type']){

                case FormFieldModel::CURRENCY_TYPE:
                    return [
                        'currencyValue' => Meta::fetch($this->previewElement['id'], $this->previewElement['belong'], $metaFieldModel->getDbName()),
                        'currency' => Meta::fetch($this->previewElement['id'], $this->previewElement['belong'], $metaFieldModel->getDbName()."_currency"),
                    ];

                case FormFieldModel::LENGTH_TYPE:
                    return [
                        'lengthValue' => Meta::fetch($this->previewElement['id'], $this->previewElement['belong'], $metaFieldModel->getDbName()),
                        'length' => Meta::fetch($this->previewElement['id'], $this->previewElement['belong'], $metaFieldModel->getDbName()."_length"),
                    ];

                case FormFieldModel::WEIGHT_TYPE:
                    return [
                        'weightValue' => Meta::fetch($this->previewElement['id'], $this->previewElement['belong'], $metaFieldModel->getDbName()),
                        'weight' => Meta::fetch($this->previewElement['id'], $this->previewElement['belong'], $metaFieldModel->getDbName()."_weight"),
                    ];

                case FormFieldModel::URL_TYPE:
                    return [
                        'url' => Meta::fetch($this->previewElement['id'], $this->previewElement['belong'], $metaFieldModel->getDbName()),
                        'urlLabel' => Meta::fetch($this->previewElement['id'], $this->previewElement['belong'], $metaFieldModel->getDbName()."_label"),
                    ];

                default:
                    return Meta::fetch($this->previewElement['id'], $this->previewElement['belong'], $metaFieldModel->getDbName());
            }
		}

		// is a WordPress field
		switch ($this->field['type']){

			// WORDPRESS_POST_THUMBNAIL
			case FormFieldModel::WORDPRESS_POST_THUMBNAIL:
				return get_the_post_thumbnail_url($this->previewElement['id']);

			// WORDPRESS_POST_TITLE
			case FormFieldModel::WORDPRESS_POST_TITLE:
				return get_the_title($this->previewElement['id']);

			// WORDPRESS_POST_CONTENT
			case FormFieldModel::WORDPRESS_POST_CONTENT:
				return get_the_content(null, false, $this->previewElement['id']);

			// WORDPRESS_POST_EXCERPT
			case FormFieldModel::WORDPRESS_POST_EXCERPT:
				return get_the_excerpt($this->previewElement['id']);

			// WORDPRESS_POST_DATE
			case FormFieldModel::WORDPRESS_POST_DATE:
				return get_the_date('Y-m-d', $this->previewElement['id']);

			// WORDPRESS_POST_AUTHOR
			case FormFieldModel::WORDPRESS_POST_AUTHOR:
				return get_post_field( 'post_author', $this->previewElement['id'] );

			// WORDPRESS_TERM_NAME
			case FormFieldModel::WORDPRESS_TERM_NAME:
				$term = get_term( $this->previewElement['id'] );

				if($term instanceof \WP_Term){
					return $term->name;
				}

			// WORDPRESS_TERM_DESCRIPTION
			case FormFieldModel::WORDPRESS_TERM_DESCRIPTION:
				$term = get_term( $this->previewElement['id'] );

				if($term instanceof \WP_Term){
					return $term->description;
				}

			// WORDPRESS_TERM_SLUG
			case FormFieldModel::WORDPRESS_TERM_SLUG:
				$term = get_term( $this->previewElement['id'] );

				if($term instanceof \WP_Term){
					return $term->slug;
				}

			// WORDPRESS_USER_EMAIL
			case FormFieldModel::WORDPRESS_USER_EMAIL:
				$userData = get_userdata( $this->previewElement['id'] );

				return $userData->user_email;

			// WORDPRESS_USER_FIRST_NAME
			case FormFieldModel::WORDPRESS_USER_FIRST_NAME:
				$userData = get_userdata( $this->previewElement['id'] );

				return $userData->first_name;

			// WORDPRESS_USER_LAST_NAME
			case FormFieldModel::WORDPRESS_USER_LAST_NAME:
				$userData = get_userdata( $this->previewElement['id'] );

				return $userData->last_name;

			// WORDPRESS_USER_USERNAME
			case FormFieldModel::WORDPRESS_USER_USERNAME:
				$userData = get_userdata( $this->previewElement['id'] );

				return $userData->display_name;

			// WORDPRESS_USER_BIO
			case FormFieldModel::WORDPRESS_USER_BIO:
				$userData = get_userdata( $this->previewElement['id'] );

				return $userData->description;

			default:
				return $this->field['extra']['defaultValue'];
		}
	}
}