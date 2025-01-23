<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class UrlField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

        $target = ($this->payload->target !== null) ? $this->payload->target : '_blank';
	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

        return $this->renderUrl($rawData, $target);
    }

	/**
	 * @param $rawData
	 * @param $target
	 *
	 * @return string
	 */
	private function renderUrl($rawData, $target)
	{
		$label = isset($rawData['label']) ? $rawData['label'] : $rawData['value'];
		$label = $this->addBeforeAndAfter($label);

		return '<a href="'.$rawData['value'].'" target="'.$target.'">'.$label.'</a>';
	}
}