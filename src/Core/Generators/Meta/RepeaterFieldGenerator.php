<?php

namespace ACPT_Lite\Core\Generators\Meta;

use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Data\DataAggregator;
use ACPT_Lite\Utils\Wordpress\Translator;

class RepeaterFieldGenerator
{
    /**
     * @var MetaFieldModel
     */
    private $parentFieldModel;

    /**
     * @var array
     */
    private $data;

    /**
     * @var int
     */
    private $dataId;

	/**
	 * @var
	 */
	private $belongsTo;

	/**
	 * @var
	 */
	private $parentName;

	/**
	 * @var
	 */
	private $parentId;

	/**
	 * RepeaterFieldGenerator constructor.
	 *
	 * @param MetaFieldModel $parentFieldModel
	 * @param $parentName
	 * @param $parentId
	 * @param string $belongsTo
	 */
    public function __construct(MetaFieldModel $parentFieldModel, $parentName, $parentId, $belongsTo)
    {
        $this->parentFieldModel = $parentFieldModel;
        $this->parentName       = $parentName;
	    $this->belongsTo        = $belongsTo;
	    $this->parentId         = $parentId;
    }

    /**
     * @param array $data
     */
    public function setData( $data )
    {
        $this->data = $data;
    }

    /**
     * @param int $dataId
     */
    public function setDataId( $dataId )
    {
        $this->dataId = $dataId;
    }

    /**
     * @param null $generatedIndex
     *
     * @return string
     * @throws \Exception
     */
    public function generate($generatedIndex = null)
    {
        if(!empty($this->data)){

            $elements = '';

            foreach ( DataAggregator::aggregateNestedFieldsData($this->data) as $index => $data){
                $elements .= $this->generateElement($index, $data);
            }

            return $elements;
        }

        if(null === $generatedIndex){
            throw new \Exception('Missing generated index');
        }

        return $this->generateElement($generatedIndex, []);
    }

    /**
     * @param       $elementIndex
     * @param array $data
     *
     * @return string
     */
    private function generateElement($elementIndex, array $data = [])
    {
	    $return = '';
	    $id = 'element-'.rand(999999,111111);

	    $return .= '<li id="'.$id.'" draggable="true" class="sortable-li sortable-li-'.$this->parentId . '">
                <div class="handle">
                    .<br/>.<br/>.
                </div>
                <div class="sortable-content">';

	    foreach ($this->parentFieldModel->getChildren() as $index => $child){
		    $value = $this->getDafaultValue($data, $child->getNormalizedName());
		    $repeaterField = $this->getNestedField($child, $elementIndex, $value);
		    $return .= $repeaterField->render();
	    }

	    $return .= '</div>
                <a class="button small button-danger remove-grouped-element" data-element="element" data-elements="elements" data-target-id="'.$id.'" href="#">'.Translator::translate('Remove').' '.$this->parentFieldModel->getLabelOrName().'</a>
            </li>';

        return $return;
    }

    /**
     * @param $data
     * @param $key
     *
     * @return string
     */
    private function getDafaultValue($data, $key)
    {
        if(empty($data)){
            return null;
        }

        foreach ($data as $datum){
            if($key === $datum['key']){
                return $datum['value'];
            }
        }

        return null;
    }

    /**
     * @param MetaFieldModel $fieldModel
     * @param int                       $index
     * @param null                      $value
     *
     * @return AbstractField
     */
    private function getNestedField(MetaFieldModel $fieldModel, $index, $value = null)
    {
	    $className = 'ACPT_Lite\\Core\\Generators\\Meta\\Fields\\'.$fieldModel->getType().'Field';

	    if(class_exists($className)){
		    return new $className($fieldModel, $this->belongsTo, $this->dataId, $index, $value, $this->parentName);
	    }

        return null;
    }
}