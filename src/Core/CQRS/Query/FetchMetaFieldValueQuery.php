<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Core\CQRS\Command\AbstractMetaFieldValueCommand;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

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

        switch ($saved_field_type){

            // DATE_TYPE
            case MetaFieldModel::DATE_TYPE:

                $dateFormat = get_option('date_format');
                $saved_date = new \DateTime($saved_field_value);
                $date = date_i18n($dateFormat, $saved_date->getTimestamp());

                return $this->formatRawValue($date, $after, $before);

            // DEFAULT VALUE
            default:
                return $this->formatRawValue($saved_field_value, $after, $before);
        }
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
}