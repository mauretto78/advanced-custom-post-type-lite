<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\Wordpress\Users;

class GenerateGutenbergTemplateQuery implements QueryInterface
{
	/**
	 * @var array
	 */
	private $field;

	/**
	 * @var null
	 */
	private $contextId;
	/**
	 * @var array
	 */
	private array $attributes;

	/**
	 * GenerateGutenbergTemplateQuery constructor.
	 *
	 * @param $field
	 * @param $contextId
	 * @param array $attributes
	 */
	public function __construct($field, $contextId = null, $attributes = [])
	{
		$this->field = $field;
		$this->contextId = $contextId;
		$this->attributes = $attributes;
	}

	/**
	 * @return array|mixed
	 */
	public function execute()
	{
		$findValue = null;

		if(isset($this->field['belongsTo']) and $this->field['belongsTo'] === MetaTypes::OPTION_PAGE){
			$find = 'option_page';
			$findValue = $this->field['find'];
		} elseif(isset($this->field['belongsTo']) and $this->field['belongsTo'] === MetaTypes::TAXONOMY){
			$find = 'term_id';
			$termId = null;

			// Front-end rendering
			$queriedObject = get_queried_object();
			if($queriedObject instanceof \WP_Term){
				$termId = $queriedObject->term_id;
			}

			// try to calculate $termId from HTTP_REFERER (AJAX request)
			if($termId === null){
				$referer = $_SERVER['HTTP_REFERER'];
				$parsedReferer = parse_url($referer);
				parse_str(  $parsedReferer['query'], $parsedRefererArray );

				$prefix = wp_get_theme()->get_stylesheet()."//".$this->field['find']."-";
				$taxonomySlug = str_replace($prefix, "", $parsedRefererArray['postId']);

				$term = get_term_by('slug', $taxonomySlug, $this->field['find'] );
				$termId = $term->term_id;
			}

			$findValue = ($this->contextId !== null and $this->contextId < 99999999999999999) ? (int)$this->contextId : (int)$termId;

		} else {
			global $post;

			$find = 'post_id';
			$findValue = ($this->contextId !== null and $this->contextId < 99999999999999999) ? (int)$this->contextId : (int)$post->ID;
		}

		// static preview if no context is available
		if(empty($findValue)){
			return [
				[
					'core/paragraph', ['content' => '{acpt_'.$this->field['box'].'_'.$this->field['field'].'}' ]
				]
			];
		}

		$rawData = get_acpt_field([
			$find => $findValue,
			'box_name' => $this->field['box'],
			'field_name' => $this->field['field'],
		]);

		if(empty($rawData)){
			return [];
		}

		switch ($this->field['type']){

			// POST_TYPE
			case MetaFieldModel::POST_TYPE:

				if(empty($rawData)){
					return [];
				}

				$templates = [];

				foreach ($rawData as $datum){

					if($datum instanceof \WP_Post){
						$templateType = $this->attributes['templateType'] ?? 'title-excerpt';
						$templates[] = $this->generateSinglePostTemplate($templateType, $datum);
					}

					if($datum instanceof \WP_Term){
						$templateType = $this->attributes['templateType'] ?? 'link';
						$templates = [$this->generateTermsTemplate($templateType, $rawData)];
					}

					if($datum instanceof \WP_User){
						$templateType = $this->attributes['templateType'] ?? 'avatar-name';
						$templates[] = $this->generateSingleUserTemplate($templateType, $datum);
					}
				}

				return $this->generateTemplate($templates);

			// POST_OBJECT_TYPE
			case MetaFieldModel::POST_OBJECT_TYPE:

				if(!$rawData instanceof \WP_Post){
					return [];
				}

				$templateType = $this->attributes['templateType'] ?? 'title-excerpt';
				$templates = $this->generateSinglePostTemplate($templateType, $rawData);

				return $this->generateTemplate([$templates]);


			// POST_OBJECT_MULTI_TYPE
			case MetaFieldModel::POST_OBJECT_MULTI_TYPE:

				if(empty($rawData)){
					return [];
				}

				$templateType = $this->attributes['templateType'] ?? 'title-excerpt';
				$templates = [];

				/** @var \WP_Post $post */
				foreach ($rawData as $post){
					$templates[] =  $this->generateSinglePostTemplate($templateType, $post);
				}

				return $this->generateTemplate($templates);

			// TERM_OBJECT_TYPE
			case MetaFieldModel::TERM_OBJECT_TYPE:

				if(!$rawData instanceof \WP_Term){
					return [];
				}

				$templateType = $this->attributes['templateType'] ?? 'link';
				$templates = $this->generateTermsTemplate($templateType, [$rawData]);

				return $this->generateTemplate([$templates]);

			// TERM_OBJECT_MULTI_TYPE
			case MetaFieldModel::TERM_OBJECT_MULTI_TYPE:

				if(empty($rawData)){
					return [];
				}

				$templateType = $this->attributes['templateType'] ?? 'link';
				$templates =  $this->generateTermsTemplate($templateType, $rawData);

				return $this->generateTemplate([$templates]);

			// USER_TYPE
			case MetaFieldModel::USER_TYPE:

				if(!$rawData instanceof \WP_User){
					return [];
				}

				$templateType = $this->attributes['templateType'] ?? 'avatar-name';
				$templates = $this->generateSingleUserTemplate($templateType, $rawData);

				return $this->generateTemplate([$templates]);

			// USER_MULTI_TYPE
			case MetaFieldModel::USER_MULTI_TYPE:

				if(empty($rawData)){
					return [];
				}

				$templateType = $this->attributes['templateType'] ?? 'avatar-name';
				$templates = [];

				/** @var \WP_User $post */
				foreach ($rawData as $user){
					$templates[] =  $this->generateSingleUserTemplate($templateType, $user);
				}

				return $this->generateTemplate($templates);

			// FLEXIBLE_CONTENT_TYPE
			case MetaFieldModel::FLEXIBLE_CONTENT_TYPE:

				if(!isset($rawData['blocks'])){
					return [];
				}

				$blockItems = [];

				foreach ($rawData['blocks'] as $blockIndex => $blocks){

					$childrenBlocks = [];


					foreach ($blocks as $blockName => $blockRawData){

						$firstIndex = array_keys($blockRawData)[0];
						$childrenFieldsCount = count($blockRawData[$firstIndex]);

						for ($i = 0; $i < $childrenFieldsCount; $i++){

							$children = [];
							foreach ($blockRawData as $child => $childrenRawData){

								$blockSettings = array_filter($this->field['blocks'], function ($element) use ($blockName, $child) {
									return $element['name'] === $blockName;
								});

								if(!empty($blockSettings)){

									$blockSettings = Arrays::reindex($blockSettings);
									$childField = array_filter($blockSettings[0]['fields'], function ($el) use($child) {
										return $child === $el['field'];
									});

									if(!empty($childField)){
										$childField = array_values($childField);
										$childField = $childField[0];
										$childField['index'] = $i;
										$childField['block_name'] = $blockName;
										$childField['block_index'] = $blockIndex;

										$children[] = [ 'advanced-custom-post-type/basic-block', [ "field" => json_encode($childField) ] ];
									}
								}
							}

							$childrenBlocks[] = [
								'core/group',
								[
									'allowedBlocks' => $this->allowedBlocks()
								],
								$children
							];
						}
					}

					$blockItems[] = [
						'core/group',
						[
							'allowedBlocks' => $this->allowedBlocks()
						],
						$childrenBlocks
					];
				}

				return $blockItems;

			// REPEATER_TYPE
			case MetaFieldModel::REPEATER_TYPE:

				$items = [];

				foreach ($rawData as $index => $childrenRawData){

					$children = [];

					foreach ($childrenRawData as $child => $value){

						$childField = array_filter($this->field['children'], function ($element) use ($child) {
							return $child === $element['field'];
						});

						if(!empty($childField)){
							$childField = array_values($childField);
							$childField = $childField[0];
							$childField['index'] = $index;

							$children[] = [ 'advanced-custom-post-type/basic-block', [ "field" => json_encode($childField) ] ];
						}
					}

					$items[] = [
						'core/group',
						[
							'allowedBlocks' => $this->allowedBlocks()
						],
						$children
					];
				}

				return $items;
		}

		return [];
	}

	/**
	 * @param $templateType
	 * @param \WP_Post $post
	 *
	 * @return array
	 */
	private function generateSinglePostTemplate($templateType, \WP_Post $post)
	{
		switch ($templateType){
			case 'title-excerpt':
				return [
					'core/column',
					[],
					[
						[
							'core/heading', [
								'level' => 3,
								'content' => '<a href="'.get_permalink($post->ID).'">'.$post->post_title.'</a>'
							]
						],
						[
							'core/paragraph', ['content' => get_the_excerpt($post->ID)]
						]
					]
				];

			case 'title-image-excerpt':
				return [
					'core/column',
					[],
					[
						[
							'core/heading', [
								'level' => 3,
								'content' => '<a href="'.get_permalink($post->ID).'">'.$post->post_title.'</a>'
							]
						],
						[
							'core/image', ['url' => get_the_post_thumbnail_url($post->ID) ]
						],
						[
							'core/paragraph', ['content' => get_the_excerpt($post->ID)]
						]
					]
				];

			case 'title':
				return [
					'core/column',
					[],
					[
						[
							'core/paragraph', ['content' => $post->post_title ]
						]
					]
				];

			case 'link':
				return [
					'core/column',
					[],
					[
						[
							'core/paragraph', ['content' => '<a href="'.get_permalink($post->ID).'">'.$post->post_title.'</a>']
						]
					]
				];

			case 'title-image':
				return [
					'core/column',
					[],
					[
						[
							'core/image', ['url' => get_the_post_thumbnail_url($post->ID) ]
						],
						[
							'core/heading', [
								'level' => 3,
								'content' => '<a href="'.get_permalink($post->ID).'">'.$post->post_title.'</a>'
							]
						],
					]
				];

			default:
				return [];
		}
	}

	/**
	 * @param $templateType
	 * @param \WP_Term[] $terms
	 *
	 * @return array
	 */
	private function generateTermsTemplate($templateType, array $terms = [])
	{
		switch ($templateType){

			case 'title':

				$termNames = [];
				foreach ($terms as $term){
					if($term instanceof \WP_Term){
						$termNames[] = $term->name;
					}
				}

				return [
					'core/column',
					[],
					[
						[
							'core/paragraph', ['content' => implode(", ", $termNames) ]
						]
					]
				];

			case 'link':

				$termLinks = [];
				foreach ($terms as $term){
					if($term instanceof \WP_Term){
						$termLinks[] = '<a href="'.get_term_link($term->term_id).'">'.$term->name.'</a>';
					}
				}

				return [
					'core/column',
					[],
					[
						[
							'core/paragraph', ['content' => implode(", ", $termLinks) ]
						]
					]
				];

			default:
				return [];
		}
	}

	/**
	 * @param $templateType
	 * @param \WP_User $user
	 *
	 * @return array
	 */
	private function generateSingleUserTemplate($templateType, \WP_User $user)
	{
		switch ($templateType){

			case 'avatar':
				return [
					'core/column',
					[],
					[
						[
							'core/paragraph', ['content' => Users::getAvatar($user, 48) ]
						]
					]
				];

			case 'avatar-name':
				return [
					'core/column',
					[],
					[
						[
							'core/paragraph', ['content' => Users::getAvatar($user, 48). ' <span>'. Users::getUserLabel($user) . '</span>' ]
						]
					]
				];

			case 'avatar-name-bio':
				return [
					'core/column',
					[],
					[
						[
							'core/heading', [
								'level' => 3,
								'content' => Users::getAvatar($user, 48). ' <span>'. Users::getUserLabel($user) . '</span>'
							]
						],
						[
							'core/paragraph', ['content' => Users::getBio($user) ]
						]
					]
				];

			case 'name-bio':
				return [
					'core/column',
					[],
					[
						[
							'core/heading', [
								'level' => 3,
								'content' => Users::getUserLabel($user)
							]
						],
						[
							'core/paragraph', ['content' => Users::getBio($user) ]
						]
					]
				];

			case 'name':
				return [
					'core/column',
					[],
					[
						[
							'core/paragraph', ['content' => Users::getUserLabel($user) ]
						]
					]
				];

			default:
				return [];
		}
	}

	/**
	 * @param $templates
	 * @param int $numberOfColumns
	 *
	 * @return array
	 */
	private function generateTemplate($templates, $numberOfColumns = 3)
	{
		$columns = [];
		$templates = array_chunk($templates, $numberOfColumns);

		foreach ($templates as $templateChunk){
			$columns[] = [
				'core/columns',
				[],
				$templateChunk
			];
		}

		return $columns;
	}

	/**
	 * @return array
	 */
	private function allowedBlocks()
	{
		return [
			'core/archives',
			'core/audio',
			'core/button',
			'core/buttons',
			'core/categories',
			'core/code',
			'core/column',
			'core/columns',
			'core/coverImage',
			'core/embed',
			'core/file',
			'core/group',
			'core/freeform',
			'core/paragraph',
			'core/image',
			'core/heading',
			'core/gallery',
			'core/list',
			'core/quote',
			'core/shortcode',
			'core/archives',
			'core/audio',
			'core/button',
			'core/buttons',
			'core/calendar',
			'core/categories',
			'core/code',
			'core/columns',
			'core/column',
			'core/cover',
			'core/embed',
			'core/file',
			'core/group',
			'core/freeform',
			'core/html',
			'core/media-text',
			'core/latest-comments',
			'core/latest-posts',
			'core/missing',
			'core/more',
			'core/nextpage',
			'core/page-list',
			'core/preformatted',
			'core/pullquote',
			'core/rss',
			'core/search',
			'core/separator',
			'core/block',
			'core/social-links',
			'core/social-link',
			'core/spacer',
			'core/table',
			'core/tag-cloud',
			'core/text-columns',
			'core/verse',
			'core/video',
			'core/site-logo',
			'core/site-tagline',
			'core/site-title',
			'core/query',
			'core/post-template',
			'core/query-title',
			'core/query-pagination',
			'core/query-pagination-next',
			'core/query-pagination-numbers',
			'core/query-pagination-previous',
			'core/post-title',
			'core/post-content',
			'core/post-date',
			'core/post-excerpt',
			'core/post-featured-image',
			'core/post-terms',
			'core/loginout'
		];
	}
}