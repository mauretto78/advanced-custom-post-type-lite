<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class CloneField extends AbstractField
{
    /**
     * @inheritDoc
     */
    public function render()
    {
        $clonedFields = $this->metaField->getClonedFields();
        $defaultValue = $this->getData($this->getIdName());
        $layout = $this->getAdvancedOption('layout') !== null ? $this->getAdvancedOption('layout') : 'row';

        if(empty($clonedFields)){
            return null;
        }

        $field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::CLONE_TYPE.'">';

        switch ($layout){
            case "row":
                $field .= $this->renderRowLayout($clonedFields, $defaultValue);
                break;

            case "table":
                $field .= $this->renderTableLayout($clonedFields, $defaultValue);
                break;

            case "block":
                $field .= $this->renderBlockLayout($clonedFields, $defaultValue);
                break;
        }

        if(empty($field)){
            return null;
        }

        return $this->renderField($field);
    }

    /**
     * @param MetaFieldModel[] $fields
     * @param null $defaultValue
     * @return string
     */
    private function renderRowLayout($fields, $defaultValue = null)
    {
        $rows = Fields::extractFieldRows($fields);
        $field = '<div style="width: 100%; margin: -24px;">';

        foreach ($rows as $index => $row){

            $field .= '<div class="acpt-admin-meta-row">';

            foreach ($row as $fieldToBeCloned){
                $clonedField = $this->getClonedField($fieldToBeCloned, $defaultValue);
                $field .= $clonedField->render();
            }

            $field .= '</div>';
        }

        $field .= '</div>';

        return $field;
    }

    /**
     * @param MetaFieldModel[] $fields
     * @param null $defaultValue
     * @return string
     */
    private function renderBlockLayout($fields, $defaultValue = null)
    {
        $field = '<div class="acpt-table-responsive">';
        $field .= '<table class="acpt-table acpt-vertical-table">';
        $field .= '<tbody>';

        foreach ($fields as $fieldToBeCloned){
            $clonedField = $this->getClonedField($fieldToBeCloned, $defaultValue);

            $field .= '<tr>';
            $field .= '<th><span class="text-ellipsis">'.$fieldToBeCloned->getLabelOrName().'</span> <span class="acpt-badge acpt-badge-info">CLONED</span></th>';
			$field .= '<td>'.$clonedField->render().'</td>';
            $field .= '</tr>';
        }

        $field .= '</tbody>';
        $field .= '</table>';
        $field .= '</div>';

        return $field;
    }

    /**
     * @param MetaFieldModel[] $fields
     * @param null $defaultValue
     * @return string
     */
    private function renderTableLayout($fields, $defaultValue = null)
    {
        $field = '<div class="acpt-table-responsive" style="margin: 10px 0;">';
        $field .= '<table class="acpt-table">';

        // <thead>
        $field .= '<thead>';
        $field .= '<tr>';

        foreach ($fields as $fieldToBeCloned){
            $field .= '<th>';
            $field .= $fieldToBeCloned->getLabelOrName();
            $field .= ' <span class="acpt-badge acpt-badge-info">CLONED</span>';
            $field .= '</th>';
        }

        $field .= '</tr>';
        $field .= '</thead>';

        // <tbody>
        $field .= '<tbody>';
        $field .= '<tr>';

        foreach ($fields as $fieldToBeCloned){
            $clonedField = $this->getClonedField($fieldToBeCloned, $defaultValue);

            $field .= '<td>';
            $field .= $clonedField->render();
            $field .= '</td>';
        }

        $field .= '</tr>';
        $field .= '</tbody>';

        $field .= '</table>';
        $field .= '</div>';

        return $field;
    }

    /**
     * @param MetaFieldModel $metaField
     * @param $defaultValue
     * @return AbstractField|null
     */
    private function getClonedField(MetaFieldModel $metaField, $defaultValue = null): ?AbstractField
    {
        $className = 'ACPT\\Core\\Generators\\Meta\\Fields\\'.$metaField->getType().'Field';
        $value = $this->getClonedFieldDefaultValue($metaField, $defaultValue);

        if(class_exists($className)){
            /** @var AbstractField $instance */
            $instance = new $className($metaField, $this->belongsTo, $this->find, $this->index, $value, $this->parentName, $this->blockIndex, $this->metaField->getId());

            return $instance;
        }

        return null;
    }

    /**
     * @param MetaFieldModel $metaField
     * @param null $defaultValue
     * @return mixed|null
     */
    private function getClonedFieldDefaultValue(MetaFieldModel $metaField, $defaultValue = null)
    {
        if($defaultValue !== null and !empty($defaultValue)){
            return $defaultValue;
        }

        // The clone field is nested inside a repeater
        if(is_array($this->value)){
            foreach ($this->value as $value){
                if($value['key'] === $metaField->getName()){
                    return $value['value'];
                }
            }
        }

        return (isset($defaultValue[$metaField->getName()])) ? $defaultValue[$metaField->getName()]['value'] : null;
    }
}