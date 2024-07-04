<?php

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

class ACPT_Divi_Dynamic_Content
{
    const ALLOWED_TYPES = [
	    MetaFieldModel::ADDRESS_TYPE,
        MetaFieldModel::CHECKBOX_TYPE,
        MetaFieldModel::COLOR_TYPE,
        MetaFieldModel::CURRENCY_TYPE,
        MetaFieldModel::DATE_TYPE,
        MetaFieldModel::DATE_TIME_TYPE,
        MetaFieldModel::DATE_RANGE_TYPE,
        MetaFieldModel::EDITOR_TYPE,
        MetaFieldModel::EMAIL_TYPE,
        MetaFieldModel::EMBED_TYPE,
        MetaFieldModel::FILE_TYPE,
       // MetaFieldModel::GALLERY_TYPE,
        MetaFieldModel::HTML_TYPE,
        MetaFieldModel::IMAGE_TYPE,
        MetaFieldModel::LENGTH_TYPE,
        MetaFieldModel::LIST_TYPE,
        MetaFieldModel::NUMBER_TYPE,
        MetaFieldModel::PHONE_TYPE,
        MetaFieldModel::RADIO_TYPE,
        MetaFieldModel::RANGE_TYPE,
        MetaFieldModel::RATING_TYPE,
        MetaFieldModel::SELECT_TYPE,
        MetaFieldModel::SELECT_MULTI_TYPE,
        MetaFieldModel::TEXT_TYPE,
        MetaFieldModel::TEXTAREA_TYPE,
        MetaFieldModel::TIME_TYPE,
        MetaFieldModel::VIDEO_TYPE,
        MetaFieldModel::WEIGHT_TYPE,
        MetaFieldModel::URL_TYPE,
    ];

    /**
     * Add ACPT fields to dynamic content source data
     *
     * @param array $custom_fields
     * @param int $post_id
     * @param array $raw_custom_fields
     *
     * @return array
     */
    public static function get_fields($custom_fields, $post_id, $raw_custom_fields )
    {
        try {
            $custom_fields = [];

            $postType = get_post_type($post_id);
            $metaGroups = MetaRepository::get([
            	'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
	            'find' => $postType,
            ]);

            foreach ($metaGroups as $group){
	            foreach ($group->getBoxes() as $boxModel){
		            foreach ($boxModel->getFields() as $fieldModel){

			            $fieldModel->setBelongsToLabel(MetaTypes::CUSTOM_POST_TYPE);
			            $fieldModel->setFindLabel($postType);
			            $fieldType = $fieldModel->getType();
			            $valueForPostId = self::get_textual_value_for_field($fieldModel, $post_id);

			            if(in_array($fieldType, self::ALLOWED_TYPES) and $valueForPostId !== null){
				            $custom_fields[$fieldModel->getId()] = [
					            'label'    => esc_html( $fieldModel->getName() ),
					            'type'     => self::get_type($fieldType),
					            'fields'   => [
						            'before' => [
							            'label'   => esc_html__( 'Before', ACPT_EXT_TEXT_DOMAIN ),
							            'type'    => 'text',
							            'default' => '',
							            'show_on' => 'text',
						            ],
						            'after'  => [
							            'label'   => esc_html__( 'After', ACPT_EXT_TEXT_DOMAIN ),
							            'type'    => 'text',
							            'default' => '',
							            'show_on' => 'text',
						            ],
					            ],
					            'meta_key' => $fieldModel->getId(),
					            'custom'   => true,
					            'group'    => 'ACPT: ' . $boxModel->getName(),
				            ];
			            }
		            }
	            }
            }

            return $custom_fields;
        } catch (\Exception $exception){
            return $custom_fields;
        }
    }

    /**
     * It returns 'text', 'image', 'url' or 'any'
     *
     * @param string $fieldType
     *
     * @return string
     */
    private static function get_type($fieldType)
    {
        switch ($fieldType){
            case MetaFieldModel::IMAGE_TYPE:
            //case MetaFieldModel::GALLERY_TYPE:
                $type = 'image';
                break;

            case MetaFieldModel::FILE_TYPE:
            case MetaFieldModel::URL_TYPE:
            case MetaFieldModel::VIDEO_TYPE:
                $type = 'url';
                break;

            case MetaFieldModel::ADDRESS_TYPE:
            case MetaFieldModel::COLOR_TYPE:
            case MetaFieldModel::CURRENCY_TYPE:
            case MetaFieldModel::DATE_TYPE:
            case MetaFieldModel::DATE_TIME_TYPE:
            case MetaFieldModel::DATE_RANGE_TYPE:
            case MetaFieldModel::EDITOR_TYPE:
            case MetaFieldModel::EMAIL_TYPE:
            case MetaFieldModel::EMBED_TYPE:
            case MetaFieldModel::HTML_TYPE:
            case MetaFieldModel::LENGTH_TYPE:
            case MetaFieldModel::LIST_TYPE:
            case MetaFieldModel::NUMBER_TYPE:
            case MetaFieldModel::PHONE_TYPE:
            case MetaFieldModel::SELECT_TYPE:
            case MetaFieldModel::SELECT_MULTI_TYPE:
            case MetaFieldModel::RANGE_TYPE:
            case MetaFieldModel::RATING_TYPE:
            case MetaFieldModel::TEXT_TYPE:
            case MetaFieldModel::TEXTAREA_TYPE:
            case MetaFieldModel::TIME_TYPE:
            case MetaFieldModel::WEIGHT_TYPE:
                $type = 'text';
                break;

            default:
                $type = 'any';
        }

        return $type;
    }

    /**
     * @param string $meta_value
     * @param string $meta_key
     * @param int $post_id
     *
     * @return string|null
     */
    public static function get_value($meta_value, $meta_key, $post_id )
    {
        try {
            $metaFieldModel = MetaRepository::getMetaFieldById($meta_key); // @TODO che cos'è?? $meta_key

            if($metaFieldModel === null){
                return null;
            }

            return self::get_textual_value_for_field($metaFieldModel, $post_id);
        } catch (\Exception $exception){
            return $meta_value;
        }
    }

    /**
     * Return a textual value for the field
     *
     * @param MetaFieldModel $metaFieldModel
     * @param integer           $post_id
     *
     * @return string|array|null
     */
    private static function get_textual_value_for_field(MetaFieldModel $metaFieldModel, $post_id)
    {
        $meta_value = get_acpt_field([
            'post_id' => (int)$post_id,
            'box_name' => $metaFieldModel->getBox()->getName(),
            'field_name' => $metaFieldModel->getName(),
        ]);

        if(empty($meta_value)){
            return null;
        }

        $fieldType = $metaFieldModel->getType();

        switch ($fieldType){

            case MetaFieldModel::ADDRESS_TYPE:
                return $meta_value['address'];

            case MetaFieldModel::CURRENCY_TYPE:
                return $meta_value['amount']. ' ' . $meta_value['unit'];

//            case MetaFieldModel::GALLERY_TYPE:
//                $ids = [];
//
//                foreach ($meta_value as $image){
//                    if(isset($image['id'])){
//                        $ids[] = $image['id'];
//                    }
//                }
//
//                return implode(',', $ids);

		    case MetaFieldModel::DATE_RANGE_TYPE:
		    	return implode(' - ', $meta_value);

            case MetaFieldModel::FILE_TYPE:
            case MetaFieldModel::IMAGE_TYPE:
            case MetaFieldModel::VIDEO_TYPE:

            	if($meta_value instanceof WPAttachment and !$meta_value->isEmpty()){
            		return $meta_value->getSrc();
	            }

                return null;

		    case MetaFieldModel::RATING_TYPE:
			    return Strings::renderStars($meta_value);

            case MetaFieldModel::WEIGHT_TYPE:
                return $meta_value['weight']. ' ' . $meta_value['unit'];

            case MetaFieldModel::LENGTH_TYPE:
                return $meta_value['length']. ' ' . $meta_value['unit'];

            case MetaFieldModel::LIST_TYPE:
                return implode(PHP_EOL, $meta_value);

            case MetaFieldModel::CHECKBOX_TYPE:
            case MetaFieldModel::SELECT_MULTI_TYPE:
                return (implode(",", $meta_value));

            case MetaFieldModel::URL_TYPE:
                return $meta_value['url'];

            default:
                return $meta_value;
        }
    }

    /**
     * Add Dynamic Content support for Images field of Gallery module.
     *
     * @param array $modules Modules list.
     *
     * @return array Filtered modules list.
     */
    public static function add_dynamic_support_for_gallery_field( $modules )
    {
        if ( empty( $modules['et_pb_gallery'] ) ) {
            return $modules;
        }

        $module = $modules['et_pb_gallery'];

        if ( ! isset( $module->fields_unprocessed ) ) {
            return $modules;
        }

        if ( ! empty( $module->fields_unprocessed['gallery_ids'] ) ) {
            $module->fields_unprocessed['gallery_ids']['dynamic_content'] = 'image';
        }

        $modules['et_pb_gallery'] = $module;

        return $modules;
    }
}