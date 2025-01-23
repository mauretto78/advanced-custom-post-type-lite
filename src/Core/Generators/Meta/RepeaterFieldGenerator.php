<?php

namespace ACPT_Lite\Core\Generators\Meta;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\DataAggregator;
use ACPT_Lite\Utils\Wordpress\Translator;

class RepeaterFieldGenerator extends AbstractGenerator
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
	 * @var
	 */
	private $layout;

	/**
	 * @var MetaFieldModel|null
	 */
	private $leadingField;

    /**
     * @var null
     */
	private $cloneFieldId;

	/**
	 * RepeaterFieldGenerator constructor.
	 *
	 * @param MetaFieldModel $parentFieldModel
	 * @param $parentName
	 * @param $parentId
	 * @param string $belongsTo
	 * @param string $layout
	 * @param null $leadingFieldId
	 * @param null $cloneFieldId
	 */
    public function __construct(
    	MetaFieldModel $parentFieldModel,
	    $parentName,
	    $parentId,
	    $belongsTo,
	    $layout = 'row',
	    $leadingFieldId = null,
        $cloneFieldId = null
    )
    {
        $this->parentFieldModel = $parentFieldModel;
        $this->parentName       = $parentName;
	    $this->belongsTo        = $belongsTo;
	    $this->parentId         = $parentId;
	    $this->layout           = $layout;
	    $this->cloneFieldId     = $cloneFieldId;

	    if($leadingFieldId !== null){
		    try {
			    $this->leadingField = MetaRepository::getMetaFieldById($leadingFieldId, true);
		    } catch (\Exception $exception){}
	    }
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
	    $id = 'element-'.rand(999999,111111);

    	if($this->layout === 'table'){
		    return $this->generateElementWithTableLayout($id, $elementIndex, $data);
	    }

	    if($this->layout === 'block'){
		    return $this->generateElementWithBlockLayout($id, $elementIndex, $data);
	    }

        return $this->generateElementWithRowLayout($id, $elementIndex, $data);
    }

	/**
	 * @param $id
	 * @param $elementIndex
	 * @param array $data
	 *
	 * @return string
	 */
    private function generateElementWithTableLayout($id, $elementIndex, array $data = [])
    {
	    $return = '<tr id='.$id.' class="sortable-li sortable-li-'.$this->parentId.' ">';
	    $return .= '<td width="30">
						<div class="handle">
		                    .<br/>.<br/>.
		                </div>
					</td>';

	    foreach ($this->parentFieldModel->getChildren() as $index => $child){
		    $value = $this->getDafaultValue($data, $child->getNormalizedName());
		    $repeaterField = $this->getNestedField($child, $elementIndex, $value);
		    $return .= '<td>'.$repeaterField->render().'</td>';
	    }

	    $return .= '<td width="120">
				<a 
	                class="button small button-danger remove-grouped-element" 
	                data-parent-id="'.$this->parentFieldModel->getId().'"
	                data-layout="'.$this->layout.'"
	                data-element="'.$this->parentFieldModel->getLabelOrName().'" 
	                data-elements="elements" 
	                data-target-id="'.$id.'" 
	                href="#"
                >'.Translator::translate('Remove').' '.$this->parentFieldModel->getLabelOrName().'</a>
			</td>';
	    $return .= '</tr>';

	    return $return;
    }

	/**
	 * @param $id
	 * @param $elementIndex
	 * @param array $data
	 *
	 * @return string
	 */
	private function generateElementWithBlockLayout($id, $elementIndex, array $data = [])
	{
		$return = '';
		$return .= '<li id="'.$id.'" class="sortable-li sortable-li-'.$this->parentId . '">
                <div class="handle">
                    .<br/>.<br/>.
                </div>
                <span class="sortable-li_collapsed_placeholder">'.$this->collapsedPlaceholder($elementIndex, $data).'</span>
                <div class="sortable-content">';

		$return .= '<div class="acpt-table-responsive">';
		$return .= '<table class="acpt-table acpt-vertical-table">';
		$return .= '<tbody>';
		$return .= '</tbody>';

		foreach ($this->parentFieldModel->getChildren() as $index => $child){
			$value = $this->getDafaultValue($data, $child->getNormalizedName());
			$repeaterField = $this->getNestedField($child, $elementIndex, $value);
			$return .= '<tr>';
			$return .= '<th><span class="text-ellipsis">'.$child->getLabelOrName().'</span></th>';
			$return .= '<td>'.$repeaterField->render().'</td>';
			$return .= '</tr>';
		}

		$return .= '</table>';
		$return .= '</div>';
		$return .= '</div>
                <a 
	                class="button small button-danger remove-grouped-element" 
	                data-parent-id="'.$this->parentFieldModel->getId().'"
	                data-element="'.$this->parentFieldModel->getLabelOrName().'" 
	                data-elements="elements" 
	                data-target-id="'.$id.'" 
	                href="#"
                >'.Translator::translate('Remove').' '.$this->parentFieldModel->getLabelOrName().'</a>
                <a title="'.Translator::translate("Show/hide elements").'" class="button small sortable-li_toggle_visibility" data-target-id="'.$id.'" href="#">
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18" class="components-panel__arrow" aria-hidden="true" focusable="false">
						<path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path>
					</svg>
				</a>
            </li>';

		return $return;
	}

	/**
	 * @param $id
	 * @param $elementIndex
	 * @param array $data
	 *
	 * @return string
	 */
	private function generateElementWithRowLayout($id, $elementIndex, array $data = [])
	{
		$return = '';
		$return .= '<li id="'.$id.'" class="sortable-li sortable-li-'.$this->parentId . '">
                <div class="handle">
                    .<br/>.<br/>.
                </div>
               <span class="sortable-li_collapsed_placeholder">'.$this->collapsedPlaceholder($elementIndex, $data).'</span>
                <div class="sortable-content">';

		$rows = Fields::extractFieldRows($this->parentFieldModel->getChildren());

		foreach ($rows as $row){
			$randomId = Strings::generateRandomId();
			$return .= "<div class='acpt-admin-meta-row' id='".$randomId."'>";
			$visibleFieldsCount = 0;

			/** @var MetaFieldModel $child */
			foreach ($row as $index => $child){

			    $child->setParentId($this->parentFieldModel->getId());

			    if($child->getType() === MetaFieldModel::CLONE_TYPE){

                    foreach ($data as $i => $datum){
                        if($child->getNormalizedName() === $datum['key']){
                            unset($data[$i]);
                        }
                    }

                    $value = array_values($data);
                } else {
                    $value = $this->getDafaultValue($data, $child->getNormalizedName());
                }

				$repeaterField = $this->getNestedField($child, $elementIndex, $value);

				if($repeaterField->isVisible()){
					$visibleFieldsCount++;
				}

				$return .= $repeaterField->render();
			}

			// hidden row containing only not visible fields
			if($visibleFieldsCount == 0){
				$return = str_replace("<div class='acpt-admin-meta-row' id='".$randomId."'>", "<div class='acpt-admin-meta-row hidden' id='".$randomId."'>", $return);
			}

			$return .= "</div>";
		}

		$return .= '</div>
                <a 
	                class="button small button-danger remove-grouped-element" 
	                data-parent-id="'.$this->parentFieldModel->getId().'"
	                data-element="'.$this->parentFieldModel->getLabelOrName().'" 
	                data-elements="elements" 
	                data-target-id="'.$id.'" 
	                href="#"
                >'.Translator::translate('Remove').' '.$this->parentFieldModel->getLabelOrName().'</a>
                <a title="'.Translator::translate("Show/hide elements").'" class="button small sortable-li_toggle_visibility" data-target-id="'.$id.'" href="#">
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18" class="components-panel__arrow" aria-hidden="true" focusable="false">
						<path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path>
					</svg>
				</a>
            </li>';

		return $return;
	}

	/**
	 * @param $elementIndex
	 * @param array $data
	 *
	 * @return string
	 */
    private function collapsedPlaceholder($elementIndex, array $data = [])
    {
    	if($this->leadingField === null){
    		return Translator::translate("Collapsed element").' #'.$elementIndex;
	    }

	    $value = $this->getDafaultValue($data, $this->leadingField->getNormalizedName());

    	if(is_array($value)){
		    $value = implode(", ", $value);
	    }

    	return '<span class="label">'.$this->leadingField->getLabelOrName().'</span>' . ': <span class="value">' . $value . '</span>';
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
	    $className = 'ACPT\\Core\\Generators\\Meta\\Fields\\'.$fieldModel->getType().'Field';

	    if(class_exists($className)){
		    return new $className($fieldModel, $this->belongsTo, $this->dataId, $index, $value, $this->parentName, 0, $this->cloneFieldId);
	    }

        return null;
    }
}