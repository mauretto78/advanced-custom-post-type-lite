<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class EmbedField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

        $width = ($this->payload->width !== null) ? $this->payload->width : '100%';
        $height = ($this->payload->height !== null) ? $this->payload->height : 500;
	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

	    return $this->addBeforeAndAfter($this->renderEmbed($width, $height, $rawData['value']));
    }

	/**
	 * @param $width
	 * @param $height
	 * @param $data
	 *
	 * @return false|string
	 */
    private function renderEmbed($width, $height, $data)
    {
    	return (new \WP_Embed())->shortcode([
		    'width' => $width,
		    'height' => $height,
	    ], $data);
    }
}