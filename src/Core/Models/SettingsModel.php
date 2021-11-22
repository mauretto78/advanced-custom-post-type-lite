<?php

namespace ACPT_Lite\Core\Models;

/**
 * SettingsModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class SettingsModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private $key;

    /**
     * @var string
     */
    private $value;

    /**
     * SettingsModel constructor.
     *
     * @param $id
     * @param $key
     * @param $value
     */
    public function __construct(
        $id,
        $key,
        $value
    ) {
        parent::__construct($id);
        $this->key   = $key;
        $this->value = $value;
    }

    /**
     * @return string
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @return array|mixed
     */
    public function jsonSerialize()
    {
        return [
            'id' => $this->getId(),
            'key' => $this->getKey(),
            'value' => $this->getValue(),
        ];
    }

}