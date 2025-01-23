<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Utils\Wordpress\WPAttachment;

class ImageField extends AbstractField
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

        return $this->addBeforeAndAfter($this->renderImage($rawData['value']));
    }

	/**
	 * @param $src
	 *
	 * @return string
	 */
    private function renderImage($src)
    {
	    if($src === null){
		    return null;
	    }

    	if(!is_string($src)){
    		return null;
	    }

	    $wpAttachment = WPAttachment::fromUrl($src);

	    if($wpAttachment->isEmpty()){
	    	return null;
	    }

	    if($this->payload->preview){
	    	return $this->addBeforeAndAfter('<img style="border: 1px solid #c3c4c7; object-fit: fill;" src="'. esc_url($wpAttachment->getSrc('thumbnail')).'" width="'.esc_attr(80).'" height="'.esc_attr(60).'" title="'.$wpAttachment->getTitle().'" alt="'.$wpAttachment->getAlt().'" />');
	    }

	    $width = ($this->payload->width !== null) ? $this->payload->width : '100%';
	    $height = ($this->payload->height !== null) ? $this->payload->height : null;

	    return $this->addBeforeAndAfter('<img src="'.$src.'" width="'.esc_attr($width).'" height="'.esc_attr($height).'" title="'.$wpAttachment->getTitle().'" alt="'.$wpAttachment->getAlt().'" />');
    }
}