<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Utils\Data\Meta;

class WPAttachment
{
	/**
	 * @var int
	 */
	private $id;

	/**
	 * @var string
	 */
	private $alt;

	/**
	 * @var string
	 */
	private $thumbnail_url;

	/**
	 * @var string
	 */
	private $type;

	/**
	 * @var string
	 */
	private $caption;

	/**
	 * @var string
	 */
	private $description;

	/**
	 * @var string
	 */
	private $href;

	/**
	 * @var string
	 */
	private $src;

	/**
	 * @var string
	 */
	private $title;

	/**
	 * @var array
	 */
	private $metadata;

	/**
	 * @var string|null
	 */
	private $path;

	/**
	 * @var array
	 */
	private $pathinfo;

	/**
	 * @param $url
	 *
	 * @return WPAttachment
	 */
	public static function fromUrl($url)
	{
		if(!is_string($url)){
			return new self();
		}

		global $wpdb;

		$uploadDir = wp_get_upload_dir();
		$relativeUrl = str_replace($uploadDir['baseurl'].'/', '', $url);

		$query = "SELECT p.ID FROM $wpdb->posts p join $wpdb->postmeta pm on p.ID = pm.post_id where meta_value = %s";

		if(!$result = $wpdb->get_row( $wpdb->prepare( $query, $relativeUrl))) {
			return new self();
		}

		$post = get_post( (int)$result->ID );

		if(empty($post)){
			return new self();
		}

		$attachment = new self();
		$attachment->hydrateFromPostObject($post);

		return $attachment;
	}

	/**
	 * @param $id
	 *
	 * @return $this
	 */
    public static function fromId($id)
    {
	    $post = get_post((int)$id);
	    $attachment = new self();

	    if(empty($post)){
		    return $attachment;
	    }

	    $attachment->hydrateFromPostObject($post);

	    return $attachment;
    }

	/**
	 * @param \WP_Post $attachment
	 *
	 * @return array
	 */
    private function hydrateFromPostObject(\WP_Post $attachment)
    {
	    $metadata = wp_get_attachment_metadata($attachment->ID);
	    $path = wp_get_original_image_path($attachment->ID);
	    $this->id = $attachment->ID;
	    $this->alt = Meta::fetch( $attachment->ID, MetaTypes::CUSTOM_POST_TYPE, '_wp_attachment_image_alt', true );
	    $this->thumbnail_url = '';
	    $this->type = $attachment->post_mime_type;
	    $this->caption = $attachment->post_excerpt;
	    $this->description = $attachment->post_content;
	    $this->href = get_permalink( $attachment->ID );
	    $this->src = $this->obtainSrc($attachment, $metadata);
	    $this->title = $attachment->post_title;
	    $this->metadata = ($metadata !== false) ? $metadata : [];
	    $this->path = ($path !== false) ? $path : null;
	    $this->pathinfo = ($path !== false) ? pathinfo($path) : [];
    }

	/**
	 * @param \WP_Post $attachment
	 * @param array $metadata
	 *
	 * @return string
	 */
    private function obtainSrc(\WP_Post $attachment, $metadata = [])
    {
    	if(!$this->isImage()){
    		return $attachment->guid;
	    }

	    if(!isset($metadata['file'])){
		    return $attachment->guid;
	    }

	    return wp_upload_dir()['baseurl'].DIRECTORY_SEPARATOR.$metadata['file'];
    }

	/**
	 * @return int
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * @return string
	 */
	public function getAlt()
	{
		return $this->alt;
	}

	/**
	 * @return string
	 */
	public function getCaption()
	{
		return $this->caption;
	}

	/**
	 * @return string
	 */
	public function getDescription()
	{
		return $this->description;
	}

	/**
	 * @return string
	 */
	public function getHref()
	{
		return $this->href;
	}

	/**
	 * @param null $size
	 *
	 * @return string
	 */
	public function getSrc($size = null)
	{
		if(
			$size and
			isset($this->getMetadata()['sizes']) and
			isset($this->getMetadata()['sizes'][$size]) and
			isset($this->getMetadata()['sizes'][$size]['file'])
		){
			$file = $this->getMetadata()['sizes'][$size]['file'];
			$basePathInfo = pathinfo($this->src);

			return $basePathInfo['dirname'] . DIRECTORY_SEPARATOR . $file;
		}

		return $this->src;
	}

	/**
	 * @return string
	 */
	public function getTitle()
	{
		return $this->title;
	}

	/**
	 * @return array
	 */
	public function getMetadata()
	{
		return $this->metadata;
	}

	/**
	 * @return string
	 */
	public function getThumbnailUrl()
	{
		return $this->thumbnail_url;
	}

	/**
	 * @return string
	 */
	public function getType()
	{
		return $this->type;
	}

	/**
	 * @return string/null
	 */
	public function getPath()
	{
		return $this->path;
	}

	/**
	 * @return array
	 */
	public function getPathinfo()
	{
		return $this->pathinfo;
	}

	/**
	 * @return bool
	 */
	public function isSVG()
	{
		if($this->type === null){
			return false;
		}

		return $this->type === 'image/svg+xml';
	}

    /**
     * @return bool
     */
    public function isImage()
    {
	    if($this->type === null){
		    return false;
	    }

    	if($this->type === 'image/svg+xml'){
    		return false;
	    }

    	if($this->type !== null and  Strings::contains('image', $this->type)){
    		return true;
	    }

        if(empty($this->metadata)){
            return false;
        }

        return isset($this->metadata['image_meta']);
    }

    /**
     * @return bool
     */
    public function isVideo()
    {
	    if($this->type === null){
		    return false;
	    }

	    if($this->type !== null and  Strings::contains('video', $this->type)){
		    return true;
	    }

        if(empty($this->metadata)){
            return false;
        }

        if(!isset($this->metadata['mime_type'])){
        	return false;
        }

        $mimeType = $this->metadata['mime_type'];

        return Strings::contains('video', $mimeType);
    }

	/**
	 * @return bool
	 */
    public function isEmpty()
    {
    	return $this->id === null;
    }

	/**
	 * @return string
	 */
    public function __toString()
    {
	    return $this->getSrc();
    }
}
