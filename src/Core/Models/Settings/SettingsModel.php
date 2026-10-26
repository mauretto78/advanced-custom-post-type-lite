<?php

namespace ACPT_Lite\Core\Models\Settings;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

/**
 * SettingsModel
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class SettingsModel extends AbstractModel implements \JsonSerializable
{
    // option keys
    public const LANGUAGE = 'language';
    public const LANGUAGE_SYNC = 'sync_language';
    public const RECORDS_PER_PAGE_KEY = 'records_per_page';
    public const SKIN = 'skin';
    public const ENABLE_ADMIN_MENU = 'enable_admin_menu';
    public const ENABLE_CACHE = 'enable_cache';
    public const ENABLE_META_CACHE = 'enable_meta_cache';
    public const CACHE_DRIVER = 'cache_driver';
    public const CACHE_CONFIG = 'cache_config';
    public const CACHE_FOLDER = 'cache_folder';
    public const ENABLE_CPT = 'enable_cpt';
    public const ENABLE_TAX = 'enable_tax';
    public const ENABLE_META = 'enable_meta';
    public const DELETE_TABLES_WHEN_DEACTIVATE_KEY = 'delete_tables_when_deactivate';
    public const DELETE_POSTS_KEY = 'delete_posts';
    public const DELETE_POSTMETA_KEY = 'delete_metadata';
    public const DELETE_UNUSED_TABLES = 'delete_unused_tables';

    /**
     * @var string
     */
    private string $key;

    /**
     * @var string
     */
    private string $value;

    /**
     * SettingsModel constructor.
     *
     * @param string $id
     * @param string $key
     * @param string $value
     */
    public function __construct(
        string $id,
        string $key,
        string $value
    ) {
        parent::__construct($id);
        $this->key   = $key;
        $this->value = $value;
    }

    /**
     * @return string
     */
    public function getKey(): string
    {
        return $this->key;
    }

    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @return mixed
     */
    public function getDecodedValue()
    {
        $value = $this->getValue();

        if (Strings::isJson($value)) {
            $value = json_decode($value);
        }

        return $value;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->getId(),
            'key' => $this->getKey(),
            'value' => $this->getDecodedValue(),
        ];
    }

    /**
     * @inheritDoc
     * @return array<string, array<string, mixed>>
     */
    public static function validationRules(): array
    {
        return [
            'id' => [
                'required' => false,
                'type' => 'string',
            ],
            'key' => [
                'required' => true,
                'type' => 'string',
            ],
            'value' => [
                'required' => true,
                'type' => 'string|integer',
            ],
        ];
    }
}
