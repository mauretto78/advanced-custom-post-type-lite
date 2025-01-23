<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Utils\Wordpress\WPUtils;

class EditorField extends AbstractField
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

        return $this->renderContent($rawData['value']);
    }

	/**
	 * @param $content
	 *
	 * @return string
	 */
    private function renderContent($content)
    {
	    $content = WPUtils::renderShortCode($content);

	    if($content === null){
	    	return null;
	    }

	    $replacementMap = [
		    '<p>['    => '[',
		    ']</p>'   => ']',
		    ']<br />' => ']'
	    ];

	    $content = strtr( $content, $replacementMap );

	    return $this->addBeforeAndAfter(wpautop($content));
    }
}