<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class SelectMultiField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

	    $list = $rawData['value'];

	    if(!is_array($list)){
		    return null;
	    }

	    if(empty($list)){
		    return null;
	    }

	    if(empty($list[0])){
		    return null;
	    }

        return $this->renderList($list);
    }
}