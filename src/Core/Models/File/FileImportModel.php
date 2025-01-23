<?php

namespace ACPT_Lite\Core\Models\File;

use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

/**
 * FileImportModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
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

	#[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,

        ];
    }

	/**
	 * @inheritDoc
	 */
	public static function validationRules(): array
	{
		return [
			'id' => [
				'required' => false,
				'type' => 'string',
			],
			'userId' => [
				'required' => true,
				'type' => 'string|integer',
			],
			'file' => [
				'required' => true,
				'type' => 'string',
			],
			'url' => [
				'required' => true,
				'type' => 'string',
			],
			'type' => [
				'required' => true,
				'type' => 'string',
			],
			'content' => [
				'required' => true,
				'type' => 'string',
			],
		];
	}
}