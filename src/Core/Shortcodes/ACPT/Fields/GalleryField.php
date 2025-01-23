<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Utils\Wordpress\WPAttachment;

class GalleryField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

        $return = '';
        $this->enqueueAssets();

	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

	    if(!is_array($rawData['value'])){
		    return null;
	    }

	    $images = $rawData['value'];
	    $elements = ($this->payload->elements !== null) ? $this->payload->elements : 1;
	    $return .= $this->renderGallery($images, $elements);

        return $return;
    }

	/**
	 * @param $images
	 * @param $elements
	 *
	 * @return string|null
	 */
    private function renderGallery($images, $elements)
    {
	    if(empty($images)){
	    	return null;
	    }

	    if(!is_array($images)){
		    return null;
	    }

    	if($this->payload->preview){

		    $return = '<div style="display: flex; gap: 5px;">';

		    foreach ($images as $image){
			    $wpAttachment = WPAttachment::fromUrl($image);

			    if(!$wpAttachment->isEmpty()){
				    $return .= $this->addBeforeAndAfter('<img style="border: 1px solid #c3c4c7; object-fit: fill;" src="'. esc_url($wpAttachment->getSrc('thumbnail')).'" width="'.esc_attr(80).'" height="'.esc_attr(60).'" title="'.$wpAttachment->getTitle().'" alt="'.$wpAttachment->getAlt().'" />');
			    }
		    }

		    $return .= '</div>';

			return $return;
	    }

	    $style = 'margin:auto;';
	    $style .= ($this->payload->width !== null) ? 'width: '. $this->payload->width .';' : 'width: 100%;';
	    $style .= ($this->payload->height !== null) ? 'height: '. $this->payload->height .';' : 'height: 350px;';

	    $width = ($this->payload->width !== null) ? $this->payload->width : '100%';
	    $height = ($this->payload->height !== null) ? $this->payload->height : null;

	    $return = '<div class="acpt-owl-carousel owl-carousel" data-carousel-options=\'{"items":'.(int)$elements.'}\'>';

	    foreach ($images as $image){

		    $wpAttachment = WPAttachment::fromUrl($image);

		    if(!$wpAttachment->isEmpty()){
			    $return .= '<div class="item" style="'.$style.'">';
			    $return .= $this->addBeforeAndAfter('<img src="'. esc_url($image).'" width="'.esc_attr($width).'" height="'.esc_attr($height).'" title="'.$wpAttachment->getTitle().'" alt="'.$wpAttachment->getAlt().'" />');
			    $return .= '</div>';
		    }
	    }

	    $return .= '</div>';

	    return $return;
    }

    /**
     * Enqueue necessary assets
     */
    public function enqueueAssets()
    {
        wp_enqueue_style( 'owl.carousel.min', plugins_url( 'advanced-custom-post-type/assets/vendor/owl.carousel/assets/owl.carousel.min.css'), array(), '2.2.0', 'all');
        wp_enqueue_style( 'owl.carousel.theme', plugins_url( 'advanced-custom-post-type/assets/vendor/owl.carousel/assets/owl.theme.default.min.css'), array(), '2.2.0', 'all');
        wp_enqueue_script( 'owl.carousel', plugins_url( 'advanced-custom-post-type/assets/vendor/owl.carousel/owl.carousel.min.js'), array ( 'jquery' ), '2.2.0', true);
        wp_enqueue_script( 'custom-owl.carousel', plugins_url( 'advanced-custom-post-type/assets/static/js/owl.carousel.js'), array ( 'jquery' ), '2.2.0', true);
    }
}