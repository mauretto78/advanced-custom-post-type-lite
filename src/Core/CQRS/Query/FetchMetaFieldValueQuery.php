<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Command\AbstractMetaFieldValueCommand;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

class FetchMetaFieldValueQuery extends AbstractMetaFieldValueCommand implements QueryInterface
{
	/**
	 * @return mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		$saved_field_type = $this->getData('_type');
		$saved_field_value = $this->getData();

		$before = null;
		$after  = null;

		$advanced_options = $this->fieldModel->getAdvancedOptions();

		if(is_array($advanced_options)){
			foreach ($advanced_options as $advanced_option){
				if($advanced_option->getKey() === 'after'){
					$after = $advanced_option->getValue();
				}

				if($advanced_option->getKey() === 'before'){
					$before = $advanced_option->getValue();
				}
			}
		}

		switch ($saved_field_type){

			case MetaFieldModel::ADDRESS_TYPE:

				$lat = $unit = $this->getData('_lat');
				$lng = $unit = $this->getData('_lng');
				$city = $unit = $this->getData('_city');

				return [
					'address' => $before.$saved_field_value.$after,
					'city' => $city,
					'lat'  => $lat,
					'lng'  => $lng,
				];

			// CURRENCY_TYPE
			case MetaFieldModel::CURRENCY_TYPE:

				$unit = $this->getData('_currency');

				return [
					'amount' => $before.$saved_field_value.$after,
					'unit' => $unit
				];

			// DATE_RANGE_TYPE
			case MetaFieldModel::DATE_RANGE_TYPE:

				$saved_field_value = explode(" - ", $saved_field_value);

				return [
					$before.$saved_field_value[0].$after,
					$before.$saved_field_value[1].$after,
				];

			// GALLERY_TYPE
			case MetaFieldModel::GALLERY_TYPE:

				$id = $this->getData('_id');

				if(!empty($id)){
					$ids = explode(",", $id);
					$gallery = [];

					foreach ($ids as $_id){
						$wpAttachment = WPAttachment::fromId($_id);
						$gallery[] = $wpAttachment;
					}

					return $gallery;
				}

				if(is_array($saved_field_value)){

					$gallery = [];

					foreach ($saved_field_value as $image){
						$wpAttachment = WPAttachment::fromUrl($image);
						$gallery[] = $wpAttachment;
					}

					return $gallery;
				}

				$wpAttachment = WPAttachment::fromUrl($saved_field_value);

				return $wpAttachment;

			// FILE_TYPE
			case MetaFieldModel::FILE_TYPE:

				$label = $this->getData('_label');
				$id = $this->getData('_id');

				if(!empty($id)){
					$wpAttachment = WPAttachment::fromId($id);
				} else {
					$wpAttachment = WPAttachment::fromUrl($saved_field_value);
				}

				return [
					'after' => $after,
					'before' => $before,
					'file' => (!$wpAttachment->isEmpty() ? $wpAttachment : null),
					'label' => $label
				];

			// IMAGE_TYPE
			// VIDEO_TYPE
			case MetaFieldModel::IMAGE_TYPE:
			case MetaFieldModel::VIDEO_TYPE:

				$id = $this->getData('_id');

				if(!empty($id)){
					return WPAttachment::fromId($id);
				}

				return  WPAttachment::fromUrl($saved_field_value);

			// LENGTH_TYPE
			case MetaFieldModel::LENGTH_TYPE:

				$unit = $this->getData('_length');

				return [
					'length' => $before.$saved_field_value.$after,
					'unit' => $unit
				];

			// EDITOR_TYPE
			case MetaFieldModel::EDITOR_TYPE:
				return wpautop($before.$saved_field_value.$after);

			// LIST_TYPE
			case MetaFieldModel::CHECKBOX_TYPE:
			case MetaFieldModel::SELECT_MULTI_TYPE:
			case MetaFieldModel::LIST_TYPE:

				$return = [];
				if(is_array($saved_field_value)){
					foreach ($saved_field_value as $value){
						$return[] = $before.$value.$after;
					}
				}

				return $return;

			// NUMBER_TYPE
			case MetaFieldModel::NUMBER_TYPE:
			case MetaFieldModel::RANGE_TYPE:
				$saved_field_value = Strings::convertStringToNumber($saved_field_value);

				if(empty($before) and empty($after)){
					return $saved_field_value;
				}

				return $before.$saved_field_value.$after;

			// POST_TYPE
			case MetaFieldModel::POST_TYPE:

				if(empty($this->fieldModel->getRelations())){
					return [];
				}

				$relation = $this->fieldModel->getRelations()[0];
				$values = (is_string($saved_field_value)) ? explode(",", $saved_field_value) : $saved_field_value;
				$return_obj = [];

				switch ($relation->to()->getType()){
					case MetaTypes::CUSTOM_POST_TYPE:
						foreach ($values as $postId){
							$return_obj[] = get_post($postId);
						}

						break;

					case MetaTypes::TAXONOMY:

						foreach ($values as $termId){
							$return_obj[] = get_term($termId);
						}

						break;

					case MetaTypes::OPTION_PAGE:

						foreach ($values as $menuSlug){
							$return_obj[] = OptionPageRepository::getByMenuSlug($menuSlug);
						}

						break;

					case MetaTypes::USER:

						foreach ($values as $userId){
							$return_obj[] = get_user_by('id', $userId);
						}

						break;
				}

				return $return_obj;

			// POST_OBJECT
			case MetaFieldModel::POST_OBJECT_TYPE:
				return get_post($saved_field_value);

			// POST_OBJECT_MULTI
			case MetaFieldModel::POST_OBJECT_MULTI_TYPE:

				$posts_obj = [];

				if(!is_array($saved_field_value)){
					return $posts_obj;
				}

				foreach ($saved_field_value as $post_id){
					$posts_obj[] = get_post($post_id);
				}

				return $posts_obj;

			// FLEXIBLE TYPE
			case MetaFieldModel::FLEXIBLE_CONTENT_TYPE:
				return $this->getNestedBlockValues($saved_field_value, $before, $after);

			// REPEATER_TYPE
			case MetaFieldModel::REPEATER_TYPE:
				return $this->getRepeaterValues($saved_field_value, $before, $after);

			case MetaFieldModel::PHONE_TYPE:
				$dial = $this->getData('_dial');

				if(!empty($dial)){
					$saved_field_value = str_replace('+'.$dial,"", $saved_field_value);

					return '+'.$dial. ' ' .$saved_field_value;
				}

				return $saved_field_value;

			// TERM_OBJECT
			case MetaFieldModel::TERM_OBJECT_TYPE:
				return get_term($saved_field_value);

			// TERM_OBJECT_MULTI
			case MetaFieldModel::TERM_OBJECT_MULTI_TYPE:

				$terms_obj = [];

				if(!is_array($saved_field_value)){
					return $terms_obj;
				}

				foreach ($saved_field_value as $term_id){
					$terms_obj[] = get_term($term_id);
				}

				return $terms_obj;

			// WEIGHT_TYPE
			case MetaFieldModel::WEIGHT_TYPE:

				$unit = $this->getData('_weight');

				return [
					'weight' => $before.$saved_field_value.$after,
					'unit' => $unit
				];

			// COUNTRY
			case MetaFieldModel::COUNTRY_TYPE:
				$country = $this->getData('_country');

				return [
					'value' => $before.$saved_field_value.$after,
					'country' => $country
				];

			// URL
			case MetaFieldModel::URL_TYPE:
				$label = $this->getData('_label');

				return [
					'after' => $after,
					'before' => $before,
					'url' => $saved_field_value,
					'label' => $label
				];

			// USER
			case MetaFieldModel::USER_TYPE:
				return get_user_by('id', $saved_field_value);

			// USER_MULTI
			case MetaFieldModel::USER_MULTI_TYPE:

				$users_obj = [];

				if(!is_array($saved_field_value)){
					return $users_obj;
				}

				foreach ($saved_field_value as $user_id){
					$users_obj[] = get_user_by('id', $user_id);
				}

				return $users_obj;

			// DEFAULT VALUE
			default:
				return $before.$saved_field_value.$after;
		}
	}

	/**
	 * @param $saved_field_value
	 * @param null $before
	 * @param null $after
	 *
	 * @return array|bool
	 */
	private function getNestedBlockValues($saved_field_value, $before = null, $after = null)
	{
		if(!is_array($saved_field_value) or !isset($saved_field_value['blocks'])) {
			return false;
		}

		$values = [];

		foreach ($saved_field_value['blocks'] as $block_index => $block){

			if(!is_array($block)) {
				return false;
			}

			$i = 0;
			foreach ($block as $block_name => $block_fields){
				foreach ($block_fields as $block_field_name => $block_field){
					foreach ($block_field as $block_field_index => $block_field_value){
						if(isset($block_field_value['blocks'])){
							// nested blocks in block
							$nested_block_name = @array_keys($block_field_value['blocks'][0])[0];
							$values['blocks'][$block_index][$block_name][$i]['blocks'][$block_field_index][$nested_block_name][] = $this->getNestedBlockValues($block_field_value, $before, $after);
						} elseif(!isset($block_field_value['value'])){
							// nested repeaters in block
							$values['blocks'][$block_index][$block_name][$block_field_name][$block_field_index] = $this->getRepeaterValues($block_field_value, $before, $after);
						} else {
							$values['blocks'][$block_index][$block_name][$block_field_value['original_name']][$block_field_index] = $this->getNestedRepeaterFieldValue($block_field_value, $before, $after);
						}
					}
				}

				$i++;
			}
		}

		return $values;
	}

	/**
	 * @param $saved_field_value
	 * @param null $before
	 * @param null $after
	 *
	 * @return array|bool
	 */
	private function getRepeaterValues($saved_field_value, $before = null, $after = null)
	{
		if(!is_array($saved_field_value)) {
			return false;
		}

		$values = [];

		$keys = array_keys($saved_field_value);
		$firstKey = $keys[0];

		if(isset($saved_field_value[$firstKey]) and is_array($saved_field_value[$firstKey])){
			$firstElement = $saved_field_value[$firstKey];

			for ($i=0; $i<count($firstElement); $i++){
				$element = [];
				foreach (array_keys($saved_field_value) as $index => $key){

					if(isset($saved_field_value[$key]) and isset($saved_field_value[$key][$i])){
						$rawData = $saved_field_value[$key][$i];

						if(isset($rawData['blocks'])){
							// block nested in repeater
							$element[$key][] = $this->getNestedBlockValues($rawData, $before, $after);
						} elseif(!isset($rawData['value'])){
							// repeater nested in repeater
							$element[$key][] =  $this->getRepeaterValues($rawData, $before, $after);
						} else {
							if(isset($rawData['original_name'])){
								$element[$rawData['original_name']] =  $this->getNestedRepeaterFieldValue($rawData, $before, $after);
							}
						}
					}
				}

				$values[] = $element;
			}
		}

		return $values;
	}

	/**
	 * @param array $rawData
	 * @param null $before
	 * @param null $after
	 *
	 * @return WPAttachment|array|mixed|null
	 */
	private function getNestedRepeaterFieldValue(array $rawData = [], $before = null, $after = null)
	{
		$type = is_array($rawData['type']) ? $rawData['type'][0] : $rawData['type'];
		$value = $rawData['value'];
		$id = (isset($rawData['id'])) ? $rawData['id'] : null;

		switch ($type){

			case MetaFieldModel::ADDRESS_TYPE:
				return [
					'address' => $before.$value.$after,
					'lat' => $rawData['lat'],
					'lng' => $rawData['lng'],
				];

			case MetaFieldModel::CURRENCY_TYPE:
				return [
					'amount' => $before.$value.$after,
					'unit' => $rawData['currency'],
				];

			case MetaFieldModel::GALLERY_TYPE:

				if(!empty($id)){
					$ids = explode(',', $id);

					$gallery = [];

					foreach ($ids as $_id){
						$wpAttachment = WPAttachment::fromId($_id);
						if(!$wpAttachment->isEmpty()){
							$gallery[] = $wpAttachment;
						}
					}

					return $gallery;
				}

				if(is_array($value)){
					$gallery = [];

					foreach ($value as $image){
						$wpAttachment = WPAttachment::fromUrl($image);
						if(!$wpAttachment->isEmpty()){
							$gallery[] = $wpAttachment;
						}
					}

					return $gallery;
				}

				$wpAttachment = WPAttachment::fromUrl($value);

				if($wpAttachment->isEmpty()){
					return null;
				}

				return $wpAttachment;

			case MetaFieldModel::FILE_TYPE:

				$label = (isset($rawData['label']) and !empty($rawData['label'])) ? $rawData['label'] : null;

				if(!empty($id)){
					$wpAttachment = WPAttachment::fromId($id);
				} else {
					$wpAttachment = WPAttachment::fromUrl($value);
				}

				return [
					'after' => $after,
					'before' => $before,
					'file' => (!$wpAttachment->isEmpty() ? $wpAttachment : null),
					'label' => $label
				];

			case MetaFieldModel::IMAGE_TYPE:
			case MetaFieldModel::VIDEO_TYPE:

				if(!empty($id)){
					return WPAttachment::fromId($id);
				}

				$wpAttachment = WPAttachment::fromUrl($value);

				if($wpAttachment->isEmpty()){
					return null;
				}

				return $wpAttachment;

			case MetaFieldModel::LENGTH_TYPE:
				return [
					'length' => $before.$value.$after,
					'unit' => $rawData['length'],
				];

			case MetaFieldModel::NUMBER_TYPE:
				return Strings::convertStringToNumber($value);

			case MetaFieldModel::WEIGHT_TYPE:
				return [
					'weight' => $before.$value.$after,
					'unit' => $rawData['weight'],
				];

			case MetaFieldModel::PHONE_TYPE:
				$dial = $rawData['dial'];

				if(!empty($dial)){
					return '+'.$dial. ' ' .$value;
				}

				return $value;

			case MetaFieldModel::URL_TYPE:
				return [
					'after' => $after,
					'before' => $before,
					'url' => $value,
					'label' => (isset($rawData['label']) and !empty($rawData['label'])) ? $rawData['label'] : null,
				];

			default:
				return $value;
		}
	}
}