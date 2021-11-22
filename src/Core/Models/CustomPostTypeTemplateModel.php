<?php

namespace ACPT_Lite\Core\Models;

/**
 * CustomPostTypeTemplateModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class CustomPostTypeTemplateModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private $postType;

    /**
     * @var string
     */
    private $templateType;

    /**
     * @var string
     */
    private $json;

    /**
     * @var string
     */
    private $html;

    /**
     * @var array
     */
    private $meta = [];

    /**
     * CustomPostTypeTemplateModel constructor.
     *
     * @param       $id
     * @param       $postType
     * @param       $templateType
     * @param       $json
     * @param       $html
     * @param array $meta
     */
    public function __construct(
        $id,
        $postType,
        $templateType,
        $json,
        $html,
        array $meta = []
    ) {
        parent::__construct($id);
        $this->postType = $postType;
        $this->templateType   = $templateType;
        $this->json     = $json;
        $this->html     = $html;
        $this->meta     = $meta;
    }

    /**
     * @return string
     */
    public function getPostType() {
        return $this->postType;
    }

    /**
     * @return string
     */
    public function getTemplateType() {
        return $this->templateType;
    }

    /**
     * @return string
     */
    public function getJson() {
        return $this->json;
    }

    /**
     * @return string
     */
    public function getHtml()
    {
        return $this->html;
    }

    /**
     * @return array
     */
    public function getMeta()
    {
        return (!empty($this->meta)) ? $this->meta : [];
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'postType' => $this->postType,
            'templateType' => $this->templateType,
            'json' => $this->json,
            'html' => $this->html,
            'meta' => $this->meta,
        ];
    }
}