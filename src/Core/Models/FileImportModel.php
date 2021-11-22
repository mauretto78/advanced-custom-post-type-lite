<?php

namespace ACPT_Lite\Core\Models;

/**
 * FileImportModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class FileImportModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var int
     */
    private $userId;

    /**
     * @var string
     */
    private $file;

    /**
     * @var string
     */
    private $url;

    /**
     * @var string
     */
    private $type;

    /**
     * @var string
     */
    private $content;

    /**
     * FileImportModel constructor.
     *
     * @param string $id
     * @param int    $userId
     * @param string $file
     * @param string $url
     * @param string $type
     * @param string $content
     */
    public function __construct( $id, $userId, $file, $url, $type, $content ) {
        parent::__construct($id);
        $this->userId    = $userId;
        $this->file    = $file;
        $this->url     = $url;
        $this->type    = $type;
        $this->content = $content;
    }

    /**
     * @return int
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @return string
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,

        ];
    }
}