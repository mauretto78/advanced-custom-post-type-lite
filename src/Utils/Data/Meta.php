<?php

namespace ACPT_Lite\Utils\Data;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Features;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Vendor\Psr\Cache\InvalidArgumentException;

class Meta
{
    public const CACHE_KEY_PREFIX = "Meta_";
    public const CACHE_TTL = 3600; // 1 hour

    /**
     * @param mixed $id
     * @param string $belongsTo
     * @param string $key
     */
    public static function delete($id, string $belongsTo, string $key): void
    {
        switch ($belongsTo) {
            case MetaTypes::MEDIA:
            case MetaTypes::CUSTOM_POST_TYPE:
                delete_post_meta((int)$id, $key);
                break;

            case MetaTypes::TAXONOMY:
                delete_term_meta((int)$id, $key);
                break;

            case MetaTypes::USER:
                delete_user_meta((int)$id, $key);
                break;

            case MetaTypes::COMMENT:
                delete_comment_meta((int)$id, $key);
                break;
        }

        self::deleteFromCache($id, $belongsTo, $key);
    }

    /**
     * @param string $belongsTo
     * @param array<string, mixed> $args
     *
     * @throws \Exception
     */
    public static function deleteBy(string $belongsTo, $args = []): void
    {
        global $wpdb;

        $metaId = (isset($args['meta_id']) && !empty($args['meta_id'])) ? $args['meta_id'] : null;
        $id = (isset($args['id']) && !empty($args['id'])) ? $args['id'] : null;
        $key = (isset($args['key']) && !empty($args['key'])) ? $args['key'] : null;
        $value = (isset($args['value']) && !empty($args['value'])) ? $args['value'] : null;
        $queryArgs = [];

        switch ($belongsTo) {
            case MetaTypes::MEDIA:
            case MetaTypes::CUSTOM_POST_TYPE:
                $sql = "DELETE FROM `{$wpdb->prefix}postmeta` WHERE 1=1";

                if ($metaId) {
                    $sql .= ' AND meta_id = %d';
                    $queryArgs[] = (int)$metaId;
                }

                if ($key) {
                    $sql .= ' AND meta_key = %s';
                    $queryArgs[] = $key;
                }

                if ($value) {
                    $sql .= ' AND meta_value = %s';
                    $queryArgs[] = $value;
                }

                if ($id) {
                    $sql .= ' AND post_id = %d';
                    $queryArgs[] = (int)$id;
                }

                break;

            case MetaTypes::TAXONOMY:
                $sql = "DELETE FROM `{$wpdb->prefix}termmeta` WHERE 1=1";

                if ($metaId) {
                    $sql .= ' AND meta_id = %d';
                    $queryArgs[] = (int)$metaId;
                }

                if ($key) {
                    $sql .= ' AND meta_key = %s';
                    $queryArgs[] = $key;
                }

                if ($value) {
                    $sql .= ' AND meta_value = %s';
                    $queryArgs[] = $value;
                }

                if ($id) {
                    $sql .= ' AND term_id = %d';
                    $queryArgs[] = (int)$id;
                }

                break;

            case MetaTypes::USER:
                $sql = "DELETE FROM `{$wpdb->prefix}usermeta` WHERE 1=1";

                if ($metaId) {
                    $sql .= ' AND meta_id = %d';
                    $queryArgs[] = (int)$metaId;
                }

                if ($key) {
                    $sql .= ' AND meta_key = %s';
                    $queryArgs[] = $key;
                }

                if ($value) {
                    $sql .= ' AND meta_value = %s';
                    $queryArgs[] = $value;
                }

                if ($id) {
                    $sql .= ' AND user_id = %d';
                    $queryArgs[] = (int)$id;
                }

                break;
        }

        if (isset($sql)) {
            ACPT_Lite_DB::executeQueryOrThrowException($sql, $queryArgs);
        }
    }

    /**
     * @param string $belongsTo
     * @param int $id
     *
     * @throws \Exception
     */
    public static function deleteByMetaId(string $belongsTo, int $id): void
    {
        global $wpdb;

        switch ($belongsTo) {
            case MetaTypes::MEDIA:
            case MetaTypes::CUSTOM_POST_TYPE:
                $sql = "DELETE FROM `{$wpdb->prefix}postmeta` WHERE meta_id = %d";
                break;

            case MetaTypes::TAXONOMY:
                $sql = "DELETE FROM `{$wpdb->prefix}termmeta` WHERE meta_id = %d";
                break;
            case MetaTypes::USER:
                $sql = "DELETE FROM `{$wpdb->prefix}usermeta` WHERE meta_id = %d";
                break;
        }

        if (isset($sql)) {
            ACPT_Lite_DB::executeQueryOrThrowException($sql, [$id]);
        }
    }

    /**
     * @param int|string $id
     * @param string $belongsTo
     * @param string $key
     * @param bool $single
     *
     * @return mixed|null
     */
    public static function fetch($id, string $belongsTo, string $key, bool $single = true)
    {
        $fromCache = self::fetchFromCache($id, $belongsTo, $key);

        if ($fromCache !== null) {
            return $fromCache;
        }

        $fetched = null;

        switch ($belongsTo) {
            case MetaTypes::MEDIA:
            case MetaTypes::CUSTOM_POST_TYPE:
                $fetched = get_post_meta((int)$id, $key, $single);
                break;

            case MetaTypes::TAXONOMY:
                $fetched = get_term_meta((int)$id, $key, $single);
                break;

            case MetaTypes::USER:
                $fetched = get_user_meta((int)$id, $key, $single);
                break;

            case MetaTypes::COMMENT:
                $fetched = get_comment_meta((int)$id, $key, $single);
                break;
        }

        // in case of failure, return null
        if ($fetched === false || $fetched === '') {
            return null;
        }

        self::saveInCache($id, $belongsTo, $key, $fetched);

        return $fetched;
    }

    /**
     * @param string $belongsTo
     * @param array<string, mixed> $args
     *
     * @return array<int, mixed>
     */
    public static function fetchBy(string $belongsTo, array $args = []): array
    {
        global $wpdb;

        $metaIdIn = (isset($args['meta_id_in']) && !empty($args['meta_id_in'])) ? $args['meta_id_in'] : null;
        $metaIdNotIn = (isset($args['meta_id_not_in']) && !empty($args['meta_id_not_in'])) ? $args['meta_id_not_in'] : null;
        $metaId = (isset($args['meta_id']) && !empty($args['meta_id'])) ? $args['meta_id'] : null;
        $id = (isset($args['id']) && !empty($args['id'])) ? $args['id'] : null;
        $key = (isset($args['key']) && !empty($args['key'])) ? $args['key'] : null;
        $value = (isset($args['value']) && !empty($args['value'])) ? $args['value'] : null;
        $queryArgs = [];

        switch ($belongsTo) {
            case MetaTypes::MEDIA:
            case MetaTypes::CUSTOM_POST_TYPE:
                $sql = "SELECT * FROM `{$wpdb->prefix}postmeta` WHERE 1=1";

                if (is_array($metaIdIn)) {
                    $sql .= " AND post_id IN ('".implode("','", $metaIdIn) . "')";
                }

                if (is_array($metaIdNotIn)) {
                    $sql .= " AND post_id NOT IN ('".implode("','", $metaIdNotIn) . "')";
                }

                if ($metaId) {
                    $sql .= ' AND meta_id = %d';
                    $queryArgs[] = (int)$metaId;
                }

                if ($key) {
                    $sql .= ' AND meta_key = %s';
                    $queryArgs[] = $key;
                }

                if ($value) {
                    $sql .= ' AND meta_value = %s';
                    $queryArgs[] = $value;
                }

                if ($id) {
                    $sql .= ' AND post_id = %d';
                    $queryArgs[] = (int)$id;
                }

                break;

            case MetaTypes::TAXONOMY:
                $sql = "SELECT * FROM `{$wpdb->prefix}termmeta` WHERE 1=1";

                if ($metaId) {
                    $sql .= ' AND meta_id = %d';
                    $queryArgs[] = (int)$metaId;
                }

                if ($key) {
                    $sql .= ' AND meta_key = %s';
                    $queryArgs[] = $key;
                }

                if ($value) {
                    $sql .= ' AND meta_value = %s';
                    $queryArgs[] = $value;
                }

                if ($id) {
                    $sql .= ' AND term_id = %d';
                    $queryArgs[] = (int)$id;
                }

                break;

            case MetaTypes::USER:
                $sql = "SELECT * FROM `{$wpdb->prefix}usermeta` WHERE 1=1";

                if ($metaId) {
                    $sql .= ' AND meta_id = %d';
                    $queryArgs[] = (int)$metaId;
                }

                if ($key) {
                    $sql .= ' AND meta_key = %s';
                    $queryArgs[] = $key;
                }

                if ($value) {
                    $sql .= ' AND meta_value = %s';
                    $queryArgs[] = $value;
                }

                if ($id) {
                    $sql .= ' AND user_id = %d';
                    $queryArgs[] = (int)$id;
                }

                break;
        }

        if (isset($sql)) {
            return ACPT_Lite_DB::getResults($sql, $queryArgs);
        }

        return [];
    }

    /**
     * @param mixed $id
     * @param string $belongsTo
     * @param string $key
     * @param string|array<mixed, mixed> $value
     * @param bool $slashed false when $value is not slashed (the admin save commands, whose
     *                      Request predates WP's magic quotes, #1380): stored byte for byte
     *
     * @return bool
     */
    public static function save($id, string $belongsTo, string $key, $value, bool $slashed = true): bool
    {
        // Always invalidate before writing
        self::deleteFromCache($id, $belongsTo, $key);

        switch ($belongsTo) {
            default:
            case MetaTypes::MEDIA:
            case MetaTypes::CUSTOM_POST_TYPE:
                $update = update_post_meta((int)$id, $key, self::slashForMetaApi($value, $slashed));
                break;

            case MetaTypes::TAXONOMY:
                $update = update_term_meta((int)$id, $key, self::slashForMetaApi($value, $slashed));
                break;

            case MetaTypes::USER:
                $update = update_user_meta((int)$id, $key, self::slashForMetaApi($value, $slashed));
                break;

            case MetaTypes::COMMENT:
                $update = update_comment_meta((int)$id, $key, self::slashForMetaApi($value, $slashed));
                break;
        }

        // Update cache only on confirmed write
        if ($update !== false) {
            self::saveInCache($id, $belongsTo, $key, $value);
        }

        if ($update === false) {
            return false;
        }

        if ($update instanceof \WP_Error) {
            return false;
        }

        return (bool)$update;
    }

    /**
     * This function adds the value to field object representations
     *
     * @param \stdClass $fieldObject
     * @param mixed $value
     * @param string|null $format
     * @return mixed
     */
    public static function format(\stdClass $fieldObject, $value, ?string $format = 'only_value')
    {
        if ($format === "complete") {
            $fieldObject->value = $value;

            return $fieldObject;
        }

        return $value;
    }

    /**
     * @param string $childName
     * @param \stdClass $fieldObject
     * @return array<int, mixed>
     */
    private static function injectNestedValues(string $childName, \stdClass $fieldObject): array
    {
        $v = [];

        if (is_array($fieldObject->value)) {
            foreach ($fieldObject->value as $nestedValues) {
                if (is_array($nestedValues)) {
                    foreach ($nestedValues as $key => $nestedValue) {
                        if ($childName === $key) {
                            $v[] = $nestedValue;
                        }

                        // nested flexible
                        if (is_array($nestedValue)) {
                            foreach ($nestedValue as $nn) {
                                if (is_array($nn)) {
                                    foreach ($nn as $key => $nestedValue) {
                                        if ($childName === $key) {
                                            $v[] = $nestedValue;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return $v;
    }

    /**
     * update_*_meta() run wp_unslash() on what they are given. A value that is not
     * slashed (#1380) is slashed once to come out of it unchanged; a slashed one keeps
     * going through treatSlashes(), as every caller relied on before.
     *
     * @param mixed $value
     *
     * @return mixed
     */
    private static function slashForMetaApi($value, bool $slashed)
    {
        if ($slashed) {
            return Strings::treatSlashes($value);
        }

        // same types as treatSlashes(): arrays as they are, anything else as a string
        return wp_slash(is_array($value) ? $value : (string)$value);
    }

    /**
     * @param string|int $id
     * @param string $belongsTo
     * @param string $key
     *
     * @return mixed|null
     */
    private static function fetchFromCache($id, string $belongsTo, string $key)
    {
        if (!Features::hasMetaCache()) {
            return null;
        }

        $cache = ACPT_Lite_Plugin::getCache();

        if ($cache === null) {
            return null;
        }

        try {
            $cacheKey = self::cacheKey($id, $belongsTo, $key);
            $cachedElement = $cache->getItem($cacheKey);

            if (!$cachedElement->isHit()) {
                return null;
            }

            return $cachedElement->get();
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return null;
        } catch (\ACPT_Lite\Vendor\Psr\Cache\InvalidArgumentException $exception) {
            do_action("acpt/error", $exception);

            return null;
        }
    }

    /**
     * @param string|int $id
     * @param string $belongsTo
     * @param string $key
     */
    private static function deleteFromCache($id, string $belongsTo, string $key): void
    {
        // invalidate meta key cache

        if (!Features::hasMetaCache()) {
            return;
        }

        $cache = ACPT_Lite_Plugin::getCache();

        if ($cache === null) {
            return;
        }

        try {
            $cacheKey = self::cacheKey($id, $belongsTo, $key);
            $cache->deleteItem($cacheKey);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        } catch (InvalidArgumentException $exception) {
            do_action("acpt/error", $exception);
        }
    }

    /**
     * @param string|int $id
     * @param string $belongsTo
     * @param string $key
     * @param mixed $value
     */
    private static function saveInCache($id, string $belongsTo, string $key, $value): void
    {
        if (!Features::hasMetaCache()) {
            return;
        }

        $cache = ACPT_Lite_Plugin::getCache();

        if ($cache === null) {
            return;
        }

        try {
            self::deleteFromCache($id, $belongsTo, $key);
            $cacheKey = self::cacheKey($id, $belongsTo, $key);
            $cachedElement = $cache->getItem($cacheKey);
            $tag = md5(static::class);
            $cachedElement->addTag($tag)->set($value)->expiresAfter(self::CACHE_TTL);
            $cache->save($cachedElement);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        } catch (\ACPT_Lite\Vendor\Psr\Cache\InvalidArgumentException $exception) {
            do_action("acpt/error", $exception);
        }
    }

    /**
     * @param string|int $id
     * @param string $belongsTo
     * @param string $key
     *
     * @return string
     */
    private static function cacheKey($id, string $belongsTo, string $key): string
    {
        $identifier = $id . "_" . $belongsTo . "_" . $key;
        $language = self::currentLanguage();

        if (!empty($language)) {
            $identifier .= "_" . $language;
        }

        return md5(self::CACHE_KEY_PREFIX.$identifier);
    }

    /**
     * Returns the current language code (WPML or Polylang), if a multilingual
     * plugin is active. Used to scope the meta cache per language, otherwise
     * a cached value fetched in one language would be served untranslated
     * in every other language until it expires.
     *
     * @return string|null
     */
    private static function currentLanguage(): ?string
    {
        $language = apply_filters('wpml_current_language', null);

        if (!empty($language)) {
            return $language;
        }

        if (function_exists('pll_current_language')) {
            return pll_current_language() ?: null;
        }

        return null;
    }
}
