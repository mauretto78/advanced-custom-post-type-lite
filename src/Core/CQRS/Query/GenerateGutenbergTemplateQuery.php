<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\MetaTypes;

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

		if(isset($this->field['belongsTo']) and $this->field['belongsTo'] === MetaTypes::TAXONOMY){
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

		return [];
	}
}