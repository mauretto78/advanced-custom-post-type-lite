<?php

namespace ACPT_Lite\Core\Shortcodes\Fields;

class TextareaField extends AbstractField
{
    public function render()
    {
	    return $this->renderTextarea($this->fetchMeta($this->getKey()));
    }

	/**
	 * @param $data
	 *
	 * @return string
	 */
    private function renderTextarea($data)
    {
    	return do_shortcode(nl2br($data));
    }
}