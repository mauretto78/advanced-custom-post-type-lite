<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Shortcodes\ACPT\DTO\ShortcodePayload;
use ACPT_Lite\Utils\Data\Meta;

abstract class AbstractField
{
    /**
     * @var ShortcodePayload
     */
    protected $payload;

    /**
     * @var MetaFieldModel|null
     */
    protected $metaBoxFieldModel;

    /**
     * AbstractField constructor.
     * @param ShortcodePayload $payload
     * @throws \Exception
     */
    public function __construct(ShortcodePayload $payload)
    {
        $this->payload = $payload;

        $this->metaBoxFieldModel = MetaRepository::getMetaFieldByName([
            'boxName' => $this->payload->box,
            'fieldName' => $this->payload->field,
        ]);
    }

    /**
     * @return string
     */
    protected function getKey()
    {
        return $this->formatKey(Strings::toDBFormat($this->payload->box).'_'.Strings::toDBFormat($this->payload->field));
    }

	/**
	 * @param $key
	 *
	 * @return string
	 */
    protected function formatKey($key)
    {
	    return $key;
    }

    /**
     * @return array
     */
    protected function getBeforeAndAfter()
    {
        return [
            'after' => null,
            'before' => null,
        ];
    }

    /**
     * @return bool
     */
    protected function isFieldVisible()
    {
        if($this->payload->preview){
            return true;
        }

        return true;
    }

    /**
     * @param $value
     *
     * @return string
     */
    protected function addBeforeAndAfter($value)
    {
        $beforeAndAfter = $this->getBeforeAndAfter();

        return $beforeAndAfter['before'].$value.$beforeAndAfter['after'];
    }

    /**
     * @param $key
     * @param bool $single
     *
     * @return array|string|null
     */
    protected function fetchMeta($key, $single = true)
    {
	    return Meta::fetch($this->payload->id, $this->payload->belongsTo, $key, $single);
    }

	/**
	 * @param $format
	 * @param \DateTime $date
	 *
	 * @return string
	 */
	protected function formatDate($format, \DateTime $date)
	{
		return date_i18n($format, $date->getTimestamp());
	}

	/**
	 * @return mixed|null
	 */
	protected function fetchRawData()
	{
		$value = [
			'value' => $this->fetchMeta($this->getKey())
		];

		foreach (ExtraFields::ALLOWED_VALUES as $extra){
			if($this->fetchMeta($this->getKey().'_'.$extra)){
				$value[$extra] = $this->fetchMeta($this->getKey().'_'.$extra);
			}
		}

		return $value;
	}

    /**
     * Method for rendering the shortcode
     *
     * @return mixed
     */
    abstract public function render();
}