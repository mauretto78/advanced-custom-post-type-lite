<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class SelectField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

	    $render = $this->payload->render;
	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

        $value = $rawData['value'];

        return $this->addBeforeAndAfter($this->renderItem($value, $render));
    }

	/**
	 * @param $value
	 * @param null $render
	 *
	 * @return string|null
	 */
    private function renderItem($value, $render = null)
    {
    	if($render === 'label'){
    		return $this->metaBoxFieldModel->getOptionLabel($value);
	    }

    	return $value;
    }
}