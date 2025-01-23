<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Visibility;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Core\Shortcodes\ACPT\DTO\ShortcodePayload;
use ACPT_Lite\Utils\Checker\FieldVisibilityChecker;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Wordpress\Users;

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
        if($this->payload->parent){
            return $this->formatKey(Strings::toDBFormat($this->payload->box).'_'.Strings::toDBFormat($this->payload->parent));
        }

        return $this->formatKey(Strings::toDBFormat($this->payload->box).'_'.Strings::toDBFormat($this->payload->field));
    }

	/**
	 * @param $key
	 *
	 * @return string
	 */
    protected function formatKey($key)
    {
	    if($this->payload->belongsTo === MetaTypes::OPTION_PAGE){
		    return Strings::toDBFormat($this->payload->id).'_'.$key;
	    }

	    return $key;
    }

    /**
     * @return bool
     */
    protected function isAChildElement()
    {
        return $this->payload->parent !== null and $this->payload->index !== null;
    }

	/**
	 * @return bool
	 */
    protected function isABlockElement()
    {
	    return $this->isAChildElement() and $this->payload->blockName !== null and $this->payload->blockIndex !== null;
    }

	/**
	 * @param $groupRawValue
	 * @param $field
	 *
	 * @return mixed|null
	 */
    protected function getBlockElementValue($groupRawValue, $field)
    {
    	if(empty($groupRawValue)){
    		return null;
	    }

	    if(isset($groupRawValue['blocks']) and
	       isset($groupRawValue['blocks'][$this->payload->blockIndex]) and
	       isset($groupRawValue['blocks'][$this->payload->blockIndex][$this->payload->blockName]) and
	       isset($groupRawValue['blocks'][$this->payload->blockIndex][$this->payload->blockName][Strings::toDBFormat($field)]) and
	       isset($groupRawValue['blocks'][$this->payload->blockIndex][$this->payload->blockName][Strings::toDBFormat($field)][$this->payload->index])
	    ){
		    return $groupRawValue['blocks'][$this->payload->blockIndex][$this->payload->blockName][Strings::toDBFormat($field)][$this->payload->index];
	    }

	    return null;
    }

    /**
     * @return array
     */
    protected function getBeforeAndAfter()
    {
        $before = null;
        $after  = null;

        if($this->metaBoxFieldModel){
            $advanced_options = $this->metaBoxFieldModel->getAdvancedOptions();

            foreach ($advanced_options as $advanced_option){
                if($advanced_option->getKey() === 'after'){
                    $after = $advanced_option->getValue();
                }

                if($advanced_option->getKey() === 'before'){
                    $before = $advanced_option->getValue();
                }
            }
        }

        return [
            'after' => $after,
            'before' => $before,
        ];
    }

    /**
     * @return bool
     */
    protected function isFieldVisible()
    {
        if($this->metaBoxFieldModel !== null and $this->payload->id !== null){
	        return FieldVisibilityChecker::check(
	        	Visibility::IS_FRONTEND,
		        $this->payload->id,
		        $this->payload->belongsTo,
		        $this->metaBoxFieldModel
	        );
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
	 * @param array $data
	 *
	 * @return string
	 */
	protected function renderList(array $data = [])
	{
		$render = $this->payload->render;
		$separator = $this->payload->separator;
		$classes = $this->payload->classes;
		$list = $this->payload->list;

		if($this->payload->preview){
			return implode(", ", $data);
		}

		$renderedList = [];

		foreach ($data as $item){
			$item = ($render === 'label') ? $this->metaBoxFieldModel->getOptionLabel($item) : $item;
			$renderedList[] = $this->addBeforeAndAfter($item);
		}

		if($list === 'ul'){
			$return = '<ul>';

			foreach ($renderedList as $element){
				$return .= '<li class="'.$classes.'">'.esc_html($element).'</li>';
			}

			$return .= '</ul>';

			return $return;
		}

		if($list === 'ol'){
			$return = '<ol>';

			foreach ($renderedList as $element){
				$return .= '<li class="'.$classes.'">'.esc_html($element).'</li>';
			}

			$return .= '</ol>';

			return $return;
		}

		$separator = $separator ?? ',';

		return implode($separator, $renderedList);
	}

	/**
	 * @param $postId
	 *
	 * @return string
	 */
	protected function renderPost($postId)
	{
		if(!is_numeric($postId)){
			return null;
		}

		return '<a href="'.get_the_permalink($postId).'" target="_blank">'.get_the_title($postId).'</a>';
	}

	/**
	 * @param $termId
	 *
	 * @return string
	 */
	protected function renderTerm($termId)
	{
		if(!is_numeric($termId)){
			return null;
		}

		$termId = (int)$termId;
		$term = get_term($termId);

		if($term instanceof \WP_Term){

			$link = get_term_link($termId);

			if(is_string($link)){
				return '<a href="'.$link.'" target="_blank">'.$term->name.'</a>';
			}

			return  $term->name;
		}

		return null;
	}

	/**
	 * @param $userId
	 *
	 * @return string
	 */
	protected function renderUser($userId)
	{
		if(!is_numeric($userId)){
			return null;
		}

		if( !function_exists('get_user_by') ) {
			include_once( ABSPATH . 'wp-includes/pluggable.php' );
		}

		$userId = (int)$userId;
		$user = get_user_by('id',$userId);

		if($user instanceof \WP_User){

			$link = get_edit_user_link($userId);

			if(is_string($link)){
				return '<a href="'.$link.'" target="_blank">'.Users::getUserLabel($user).'</a>';
			}

			return Users::getUserLabel($user);
		}

		return null;
	}

	/**
	 * @param $optionPageId
	 *
	 * @return string|null
	 */
	protected function renderOptionPage($optionPageId)
	{
		try {
			$page = OptionPageRepository::getById($optionPageId);

			if($page !== null){
				return $page->getMenuTitle();
			}

			return null;
		} catch (\Exception $exception){
			return null;
		}
	}

	/**
	 * @return mixed|null
	 */
	protected function fetchRawData()
	{
		if($this->isABlockElement()){

			@$groupRawValue = $this->fetchMeta($this->getKey());
			$field = Strings::toDBFormat($this->payload->field);
			$data = $this->getBlockElementValue($groupRawValue, $field);

			if($data !== null and isset($data['value'])){
				return $data;
			}

			return null;
		}

		if($this->isAChildElement()){

			@$groupRawValue = $this->fetchMeta($this->getKey());

			if($groupRawValue === null or $groupRawValue === ''){

				// check if is a repeater nested inside a repeater
				$key = $this->formatKey(Strings::toDBFormat($this->payload->box).'_'.Strings::toDBFormat($this->metaBoxFieldModel->getRootParentField()->getName()));
				@$groupRawValue = $this->fetchMeta($key);

				if($groupRawValue === null or $groupRawValue === ''){
					return null;
				}

				$parent = $this->payload->parent;
				$index = explode(".", $this->payload->index);
				$field = $this->payload->field;

				if(count($index) !== 2){
					return null;
				}

				if(
					isset($groupRawValue[$parent]) and
					isset($groupRawValue[$parent][$index[0]]) and
					isset($groupRawValue[$parent][$index[0]][$field]) and
					isset($groupRawValue[$parent][$index[0]][$field][$index[1]])
				){
					$data = $groupRawValue[$parent][$index[0]][$field][$index[1]];

					return $data;
				}
			}

			$field = Strings::toDBFormat($this->payload->field);

			if(isset($groupRawValue[$field]) and isset($groupRawValue[$field][$this->payload->index])){
				$data = $groupRawValue[$field][$this->payload->index];

				return $data;
			}

			return null;
		}

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