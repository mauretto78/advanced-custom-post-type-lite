<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Command\AbstractMetaFieldValueCommand;
use ACPT_Lite\Core\Generators\Meta\TableFieldGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\OptionPage\OptionPageModel;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Utils\PHP\Address;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

class FetchMetaFieldValueQuery extends AbstractMetaFieldValueCommand implements QueryInterface
{
    /**
     * @return mixed
     * @throws \Exception
     */
    public function execute()
    {
        // Prevent any error if one of those functions is undefined:
        if( !function_exists('get_user_by') ) {
            include_once( ABSPATH . 'wp-includes/pluggable.php' );
        }

        if( !function_exists('get_term') ) {
            include_once( ABSPATH . 'wp-includes/taxonomy.php' );
        }

        $saved_field_type = $this->getData('_type') ?? $this->fieldModel->getType();
        $saved_field_value = $this->getData();

        if(empty($saved_field_value)){
            return null;
        }

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

        $return = (isset($this->args['return']) and !empty($this->args['return'])) ? $this->args['return'] : 'object';

        switch ($saved_field_type){

            // ADDRESS_TYPE
            case MetaFieldModel::ADDRESS_TYPE:

                $lat = $this->getData('_lat');
                $lng = $this->getData('_lng');
                $city = $this->getData('_city');

                return $this->formatRawValue([
                    'address' => $this->formatRawValue($saved_field_value, $after, $before),
                    'city' => $city,
                    'lat'  => $lat,
                    'lng'  => $lng,
                ], $after, $before);

            // ADDRESS_MULTI_TYPE
            case MetaFieldModel::ADDRESS_MULTI_TYPE:

                $addresses = Address::fetchMulti($saved_field_value);
                $lat = Address::fetchMulti($this->getData('_lat'));
                $lng = Address::fetchMulti($this->getData('_lng'));
                $city = Address::fetchMulti($this->getData('_city'));

                $values = [];

                foreach ($addresses as $index => $address){
                    $values[] = [
                        'address' => $this->formatRawValue($address, $after, $before),
                        'city' => $city[$index] ?? null,
                        'lat'  => $lat[$index] ?? null,
                        'lng'  => $lng[$index] ?? null,
                    ];
                }

                return $this->formatRawValue($values, $after, $before);

            // CURRENCY_TYPE
            case MetaFieldModel::CURRENCY_TYPE:

                $unit = $this->getData('_currency');

                return $this->formatRawValue([
                    'amount' => $this->formatRawValue($saved_field_value, $after, $before),
                    'unit' => $unit
                ], $after, $before);

            // DATE_TYPE
            case MetaFieldModel::DATE_TYPE:

                $dateFormat = $this->fieldModel->getAdvancedOption('date_format') ?? get_option('date_format');
                $saved_date = new \DateTime($saved_field_value);
                $date = date_i18n($dateFormat, $saved_date->getTimestamp());

                return $this->formatRawValue($date, $after, $before);

            // DATE_TIME_TYPE
            case MetaFieldModel::DATE_TIME_TYPE:

                $dateFormat = $this->fieldModel->getAdvancedOption('date_format') ?? get_option('date_format');
                $timeFormat = $this->fieldModel->getAdvancedOption('time_format') ?? get_option('time_format');
                $saved_datetime = new \DateTime($saved_field_value);
                $datetime = date_i18n($dateFormat . ' ' . $timeFormat, $saved_datetime->getTimestamp());

                return $this->formatRawValue($datetime, $after, $before);

            // TIME_TYPE
            case MetaFieldModel::TIME_TYPE:

                $timeFormat = $this->fieldModel->getAdvancedOption('time_format') ?? get_option('time_format');
                $saved_time = new \DateTime($saved_field_value);
                $time = date_i18n($timeFormat, $saved_time->getTimestamp());

                return $this->formatRawValue($time, $after, $before);

            // DATE_RANGE_TYPE
            case MetaFieldModel::DATE_RANGE_TYPE:

                if(!is_string($saved_field_value)){
                    return [];
                }

                $saved_field_value = explode(" - ", $saved_field_value);

                if(count($saved_field_value) !== 2){
                    return [];
                }

                $dateFormat = $this->fieldModel->getAdvancedOption('date_format') ?? get_option('date_format');
                $saved_from = new \DateTime($saved_field_value[0]);
                $saved_to = new \DateTime($saved_field_value[1]);
                $from = date_i18n($dateFormat, $saved_from->getTimestamp());
                $to = date_i18n($dateFormat, $saved_to->getTimestamp());

                return $this->formatRawValue([
                    $this->formatRawValue($from, $after, $before),
                    $this->formatRawValue($to, $after, $before),
                ], $after, $before);

            // GALLERY_TYPE
            case MetaFieldModel::GALLERY_TYPE:

                $id = $this->getAttachmentId();

                if(!empty($id)){
                    $ids = explode(",", $id);
                    $gallery = [];

                    foreach ($ids as $_id){
                        $wpAttachment = $this->getAttachment($_id, $return);
                        $gallery[] = $wpAttachment;
                    }

                    return $this->formatRawValue($gallery, $after, $before);
                }

                if(is_array($saved_field_value)){

                    $gallery = [];

                    foreach ($saved_field_value as $image){
                        $wpAttachment = $this->getAttachment($image, $return);
                        $gallery[] = $wpAttachment;
                    }

                    return $this->formatRawValue($gallery, $after, $before);
                }

                $wpAttachment = $this->getAttachment($saved_field_value, $return);

                return $this->formatRawValue($wpAttachment, $after, $before);

            // FILE_TYPE
            case MetaFieldModel::FILE_TYPE:

                $label = $this->getData('_label');
                $id = $this->getAttachmentId();

                if(!empty($id)){
                    $wpAttachment = $this->getAttachment($id, $return);
                } else {
                    $wpAttachment = $this->getAttachment($saved_field_value, $return);
                }

                return $this->formatRawValue([
                    'after' => $after,
                    'before' => $before,
                    'file' => $wpAttachment,
                    'label' => $label
                ], $after, $before);

            // IMAGE_TYPE
            // VIDEO_TYPE
            case MetaFieldModel::IMAGE_TYPE:
            case MetaFieldModel::VIDEO_TYPE:

                $id = $this->getAttachmentId();
                if(!empty($id)){
                    return $this->formatRawValue($this->getAttachment($id, $return), $after, $before);
                }

                return $this->formatRawValue($this->getAttachment($saved_field_value, $return), $after, $before);

            // LENGTH_TYPE
            case MetaFieldModel::LENGTH_TYPE:

                $unit = $this->getData('_length');

                return $this->formatRawValue([
                    'length' => $this->formatRawValue($saved_field_value, $after, $before),
                    'unit' => $unit
                ], $after, $before);

            // EDITOR_TYPE
            case MetaFieldModel::EDITOR_TYPE:
                return wpautop($this->formatRawValue($saved_field_value, $after, $before));

            // LIST_TYPE
            case MetaFieldModel::CHECKBOX_TYPE:
            case MetaFieldModel::SELECT_MULTI_TYPE:
            case MetaFieldModel::LIST_TYPE:

                $return = [];
                if(is_array($saved_field_value)){
                    foreach ($saved_field_value as $value){
                        $return[] = $this->formatRawValue($value, $after, $before);
                    }
                }

                return $this->formatRawValue($return, $after, $before);

            // NUMBER_TYPE
            case MetaFieldModel::NUMBER_TYPE:
            case MetaFieldModel::RANGE_TYPE:
                $saved_field_value = Strings::convertStringToNumber($saved_field_value);

                return $this->formatRawValue($saved_field_value, $after, $before);

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

                        if(is_array($values)){
                            foreach ($values as $postId){
                                if($return === 'raw'){
                                    $obj = [
                                        'type' => MetaTypes::CUSTOM_POST_TYPE,
                                        'id' => $postId,
                                    ];
                                } else {
                                    $obj = $this->getPost($postId, $return);
                                }

                                $return_obj[] = $obj;
                            }
                        }

                        break;

                    case MetaTypes::TAXONOMY:

                        if(is_array($values)){
                            foreach ($values as $termId){
                                if($return === 'raw'){
                                    $obj = [
                                        'type' => MetaTypes::TAXONOMY,
                                        'id' => $termId,
                                    ];
                                } else {
                                    $obj = $this->getTerm($termId, $return);
                                }

                                $return_obj[] = $obj;
                            }
                        }

                        break;

                    case MetaTypes::OPTION_PAGE:

                        if(is_array($values)){
                            foreach ($values as $menuSlug){
                                if($return === 'raw'){
                                    $obj = [
                                        'type' => MetaTypes::OPTION_PAGE,
                                        'id' => $menuSlug,
                                    ];
                                } else {
                                    $obj = $this->getOptionPage($menuSlug, $return);
                                }

                                $return_obj[] = $obj;
                            }
                        }

                        break;

                    case MetaTypes::USER:

                        if(is_array($values)){
                            foreach ($values as $userId){
                                if($return === 'raw'){
                                    $obj = [
                                        'type' => MetaTypes::USER,
                                        'id' => $userId,
                                    ];
                                } else {
                                    $obj = $this->getUser($userId, $return);
                                }

                                $return_obj[] = $obj;
                            }
                        }

                        break;
                }

                return $this->formatRawValue($return_obj, $after, $before);

            // POST_OBJECT
            case MetaFieldModel::POST_OBJECT_TYPE:
                $value = $this->getPost($saved_field_value, $return);

                return $this->formatRawValue($value, $after, $before);

            // POST_OBJECT_MULTI
            case MetaFieldModel::POST_OBJECT_MULTI_TYPE:

                $posts_obj = [];

                if(!is_array($saved_field_value)){
                    return $this->formatRawValue($posts_obj, $after, $before);
                }

                foreach ($saved_field_value as $post_id){
                    $posts_obj[] = $this->getPost($post_id, $return);
                }

                return $this->formatRawValue($posts_obj, $after, $before);

            // FLEXIBLE TYPE
            case MetaFieldModel::FLEXIBLE_CONTENT_TYPE:
                return $this->getNestedBlockValues($saved_field_value);

            // REPEATER_TYPE
            case MetaFieldModel::REPEATER_TYPE:
                return $this->getRepeaterValues($saved_field_value);

            case MetaFieldModel::PHONE_TYPE:
                $dial = $this->getData('_dial');

                if(!empty($dial)){
                    $saved_field_value = str_replace('+'.$dial,"", $saved_field_value);
                    $saved_field_value =  '+'.$dial. ' ' .$saved_field_value;
                }

                return $this->formatRawValue($saved_field_value, $after, $before);

            // TERM_OBJECT
            case MetaFieldModel::TERM_OBJECT_TYPE:
                $value = $this->getTerm($saved_field_value, $return);

                return $this->formatRawValue($value, $after, $before);

            // TERM_OBJECT_MULTI
            case MetaFieldModel::TERM_OBJECT_MULTI_TYPE:

                $terms_obj = [];

                if(!is_array($saved_field_value)){
                    return $this->formatRawValue($terms_obj, $after, $before);
                }

                foreach ($saved_field_value as $term_id){
                    $terms_obj[] = $this->getTerm($term_id, $return);
                }

                return $this->formatRawValue($terms_obj, $after, $before);

            // WEIGHT_TYPE
            case MetaFieldModel::WEIGHT_TYPE:

                $unit = $this->getData('_weight');

                return $this->formatRawValue([
                    'weight' => $this->formatRawValue($saved_field_value, $after, $before),
                    'unit' => $unit
                ], $after, $before);

            // COUNTRY
            case MetaFieldModel::COUNTRY_TYPE:
                $country = $this->getData('_country');

                return $this->formatRawValue([
                    'value' => $this->formatRawValue($saved_field_value, $after, $before),
                    'country' => $country
                ], $after, $before);

            // URL
            case MetaFieldModel::URL_TYPE:
                $label = $this->getData('_label');

                return $this->formatRawValue([
                    'after' => $after,
                    'before' => $before,
                    'url' => $saved_field_value,
                    'label' => $label
                ], $after, $before);

            // USER
            case MetaFieldModel::USER_TYPE:
                $value = $this->getUser($saved_field_value, $return);

                return $this->formatRawValue($value, $after, $before);

            // USER_MULTI
            case MetaFieldModel::USER_MULTI_TYPE:

                $users_obj = [];

                if(!is_array($saved_field_value)){
                    return $this->formatRawValue($users_obj, $after, $before);
                }

                foreach ($saved_field_value as $user_id){
                    $users_obj[] = $this->getUser($user_id, $return);
                }

                return $this->formatRawValue($users_obj, $after, $before);

            // DEFAULT VALUE
            default:
                return $this->formatRawValue($saved_field_value, $after, $before);
        }
    }

    /**
     * @return string|null
     */
    private function getAttachmentId()
    {
        // legacy format
        if(!empty($this->getData('_id')) and is_numeric($this->getData('_id'))){
            return $this->getData('_id');
        }

        // current format
        return $this->getData('_attachment_id') ?? null;
    }

    /**
     * @param $before
     * @param $value
     * @param $after
     *
     * @return array|string
     */
    private function formatRawValue($value, $after = null, $before = null)
    {
        $raw = (isset($this->args['raw']) and $this->args['raw'] == true) ? true : false;

        if($raw){
            return [
                'before' => $before,
                'value' => $value,
                'after' => $after,
            ];
        }

        if(is_string($value)){
            return $before.$value.$after;
        }

        return $value;
    }

    /**
     * @param $saved_field_value
     *
     * @return array|bool
     */
    private function getNestedBlockValues($saved_field_value)
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
                            $values['blocks'][$block_index][$block_name][$i]['blocks'][$block_field_index][$nested_block_name][] = $this->getNestedBlockValues($block_field_value);
                        } elseif(!isset($block_field_value['value'])){
                            // nested repeaters in block
                            $values['blocks'][$block_index][$block_name][$block_field_name][$block_field_index] = $this->getRepeaterValues($block_field_value);
                        } else {
                            $values['blocks'][$block_index][$block_name][$block_field_value['original_name']][$block_field_index] = $this->getNestedRepeaterFieldValue($block_field_value);
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
     *
     * @return array|bool
     */
    private function getRepeaterValues($saved_field_value)
    {
        if(!is_array($saved_field_value)) {
            return false;
        }

        $values = [];

        // this is needed for values nested inside a nested repeater
        unset($saved_field_value['original_name']);
        unset($saved_field_value['type']);

        $keys = array_keys($saved_field_value);

        if(empty($keys)){
            return $values;
        }

        $firstKey = $keys[0];

        if(isset($saved_field_value[$firstKey]) and is_array($saved_field_value[$firstKey])){
            $firstElement = $saved_field_value[$firstKey];

            for ($i=0; $i<count($firstElement); $i++){
                $element = [];

                foreach (array_keys($saved_field_value) as $index => $key){

                    $nestedBefore = null;
                    $nestedAfter = null;
                    $nestedFieldModal = $this->fieldModel->getChild($key);

                    if($nestedFieldModal !== null and $nestedFieldModal->canHaveAfterAndBefore()){
                        $nestedBefore = $nestedFieldModal->getAdvancedOption("before");
                        $nestedAfter = $nestedFieldModal->getAdvancedOption("after");
                    }

                    if(isset($saved_field_value[$key]) and isset($saved_field_value[$key][$i])){
                        $rawData = $saved_field_value[$key][$i];

                        if(isset($rawData['blocks'])){
                            // block nested in repeater
                            $element[$key][] = $this->getNestedBlockValues($rawData);
                        } elseif(!isset($rawData['value'])){
                            // repeater nested in repeater
                            $element[$key][] = $this->getRepeaterValues($rawData);
                        } else {
                            if(isset($rawData['original_name'])){
                                $element[$rawData['original_name']] = $this->getNestedRepeaterFieldValue($rawData);
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
     *
     * @return WPAttachment|array|mixed|null
     */
    private function getNestedRepeaterFieldValue(array $rawData = [])
    {
        if(!isset($rawData['type'])){
            return null;
        }

        if(!isset($rawData['original_name'])){
            return null;
        }

        $return = (isset($this->args['return']) and !empty($this->args['return'])) ? $this->args['return'] : 'object';
        $type = is_array($rawData['type']) ? $rawData['type'][0] : $rawData['type'];
        $value = $rawData['value'];
        $id = (isset($rawData['id'])) ? $rawData['id'] : null;

        $before = null;
        $after = null;
        $nestedFieldModal = $this->fieldModel->getChild($rawData['original_name']);

        if($nestedFieldModal !== null and $nestedFieldModal->canHaveAfterAndBefore()){
            $before = $nestedFieldModal->getAdvancedOption("before");
            $after = $nestedFieldModal->getAdvancedOption("after");
        }

        switch ($type){

            // ADDRESS_TYPE
            case MetaFieldModel::ADDRESS_TYPE:
                return [
                    'address' => $this->formatRawValue($value, $after, $before),
                    'lat' => $rawData['lat'],
                    'lng' => $rawData['lng'],
                ];

            // ADDRESS_MULTI_TYPE
            case MetaFieldModel::ADDRESS_MULTI_TYPE:

                $addresses = Address::fetchMulti($value);
                $lat = Address::fetchMulti($rawData['lat']);
                $lng = Address::fetchMulti($rawData['lng']);
                $values = [];

                foreach ($addresses as $index => $address){
                    $values[] = [
                        'address' => $this->formatRawValue($address, $after, $before),
                        'lat'  => $lat[$index] ?? null,
                        'lng'  => $lng[$index] ?? null,
                    ];
                }

                return $this->formatRawValue($values, $after, $before);

            // CURRENCY_TYPE
            case MetaFieldModel::CURRENCY_TYPE:
                return $this->formatRawValue([
                    'amount' => $this->formatRawValue($value, $after, $before),
                    'unit' => $rawData['currency'],
                ], $after, $before);

            // GALLERY_TYPE
            case MetaFieldModel::GALLERY_TYPE:

                if(!empty($id)){
                    $ids = explode(',', $id);

                    $gallery = [];

                    foreach ($ids as $_id){
                        $wpAttachment = $this->getAttachment($_id, $return);
                        if($wpAttachment !== null){
                            $gallery[] = $wpAttachment;
                        }
                    }

                    return $this->formatRawValue($gallery, $after, $before);
                }

                if(is_array($value)){
                    $gallery = [];

                    foreach ($value as $image){
                        $wpAttachment = $this->getAttachment($image, $return);
                        if($wpAttachment !== null){
                            $gallery[] = $wpAttachment;
                        }
                    }

                    return $this->formatRawValue($gallery, $after, $before);
                }

                $wpAttachment = $this->getAttachment($value, $return);

                if(empty($wpAttachment)){
                    return null;
                }

                return $this->formatRawValue($wpAttachment, $after, $before);

            // FILE_TYPE
            case MetaFieldModel::FILE_TYPE:

                $label = (isset($rawData['label']) and !empty($rawData['label'])) ? $rawData['label'] : null;

                if(!empty($id)){
                    $wpAttachment = $this->getAttachment($id, $return);
                } else {
                    $wpAttachment = $this->getAttachment($value, $return);
                }

                return $this->formatRawValue([
                    'after' => $after,
                    'before' => $before,
                    'file' => $wpAttachment,
                    'label' => $label
                ], $after, $before);

            // IMAGE_TYPE
            // VIDEO_TYPE
            case MetaFieldModel::IMAGE_TYPE:
            case MetaFieldModel::VIDEO_TYPE:

                if(!empty($id)){
                    return $this->getAttachment($id, $return);
                }

                $wpAttachment = $this->getAttachment($value, $return);

                if(empty($wpAttachment)){
                    return null;
                }

                return $this->formatRawValue($wpAttachment, $after, $before);

            // LENGTH_TYPE
            case MetaFieldModel::LENGTH_TYPE:
                return $this->formatRawValue([
                    'length' => $this->formatRawValue($value, $after, $before),
                    'unit' => $rawData['length'],
                ], $after, $before);

            // NUMBER_TYPE
            case MetaFieldModel::NUMBER_TYPE:
                return $this->formatRawValue(Strings::convertStringToNumber($value), $after, $before);

            // WEIGHT_TYPE
            case MetaFieldModel::WEIGHT_TYPE:
                return $this->formatRawValue([
                    'weight' => $this->formatRawValue($value, $after, $before),
                    'unit' => $rawData['weight'],
                ], $after, $before);

            // TABLE_TYPE
            case MetaFieldModel::TABLE_TYPE:
                $generator = new TableFieldGenerator($value);

                return $this->formatRawValue($generator->generate(), $after, $before);

            // PHONE_TYPE
            case MetaFieldModel::PHONE_TYPE:
                $dial = $rawData['dial'];

                if(!empty($dial)){
                    return '+'.$dial. ' ' .$value;
                }

                return $this->formatRawValue($value, $after, $before);

            // URL_TYPE
            case MetaFieldModel::URL_TYPE:
                return $this->formatRawValue([
                    'after' => $after,
                    'before' => $before,
                    'url' => $value,
                    'label' => (isset($rawData['label']) and !empty($rawData['label'])) ? $rawData['label'] : null,
                ], $after, $before);

            default:
                return $this->formatRawValue($value, $after, $before);
        }
    }

    /**
     * @param $postId
     * @param string $return
     * @return int|\WP_Post|null
     */
    private function getPost($postId, $return = 'object')
    {
        if($return === 'raw'){
            return (int)$postId;
        }

        return get_post($postId);
    }

    /**
     * @param $termId
     * @param string $return
     * @return int|\WP_Term|null
     */
    private function getTerm($termId, $return = 'object')
    {
        if($return === 'raw'){
            return (int)$termId;
        }

        return get_term($termId);
    }

    /**
     * @param $userId
     * @param string $return
     * @return int|\WP_User
     */
    private function getUser($userId, $return = 'object')
    {
        if($return === 'raw'){
            return (int)$userId;
        }

        return get_user_by('id', $userId);
    }

    /**
     * @param $optionPage
     * @param string $return
     * @return OptionPageModel|string|null
     */
    private function getOptionPage($optionPage, $return = 'object')
    {
        if($return === 'raw'){
            return (string)$optionPage;
        }

        try {
            return OptionPageRepository::getByMenuSlug($optionPage);
        } catch (\Exception $exception){
            return null;
        }
    }

    /**
     * @param $id
     * @param string $return
     * @return WPAttachment|int|null
     */
    private function getAttachment($id, $return = 'object')
    {
        // if $id is the media ID
        if(is_numeric($id)){

            if($return === 'raw'){
                return (int)$id;
            }

            $wpAttachment = WPAttachment::fromId($id);

            if($wpAttachment->isEmpty()){
                return null;
            }

            return $wpAttachment;
        }

        // if $id is the media URL
        $wpAttachment = WPAttachment::fromUrl($id);

        if($wpAttachment->isEmpty()){
            return null;
        }

        if($return === 'raw'){
            return (int)$wpAttachment->getId();
        }

        return $wpAttachment;
    }
}