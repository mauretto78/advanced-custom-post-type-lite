<?php

namespace ACPT_Lite\Core\Shortcodes\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Shortcodes\DTO\ShortcodePayload;
use ACPT_Lite\Constants\MetaTypes;

abstract class AbstractField
{
	/**
	 * @var ShortcodePayload
	 */
	protected $payload;

	/**
	 * @var AbstractMetaBoxFieldModel|null
	 */
	private $metaBoxFieldModel;

	/**
	 * AbstractField constructor.
	 * @param ShortcodePayload $payload
	 * @throws \Exception
	 */
	public function __construct(ShortcodePayload $payload)
	{
		$this->payload = $payload;

		$this->metaBoxFieldModel = MetaRepository::getMetaFieldByName([
			'belongsTo' => $payload->belongsTo,
			'find' => ($payload->find !== null) ? $payload->find : null,
			'boxName' => $this->payload->box,
			'fieldName' => $this->payload->field,
		]);
	}

	/**
	 * @return string
	 */
	protected function getKey()
	{
		return Strings::toDBFormat($this->payload->box).'_'.Strings::toDBFormat($this->payload->field);
	}

	/**
	 * @param $key
	 * @param bool $single
	 *
	 * @return array|string|null
	 */
	protected function fetchMeta($key, $single = true)
	{
		$fetched = null;

		switch ($this->payload->belongsTo){
			case MetaTypes::CUSTOM_POST_TYPE:
				$fetched = get_post_meta($this->payload->id, $key, $single);
				break;

			case MetaTypes::TAXONOMY:
				$fetched = get_term_meta($this->payload->id, $key, $single);
				break;

			case MetaTypes::USER:
				$fetched = get_user_meta($this->payload->id, $key, $single);
				break;
		}

		return $fetched;
	}

	/**
	 * Method for rendering the shortcode
	 *
	 * @return mixed
	 */
	abstract public function render();
}