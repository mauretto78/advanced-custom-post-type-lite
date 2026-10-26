<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Utils\PHP\Arrays;

abstract class AbstractRepository
{
    public const CACHE_KEY_PREFIX = "AbstractRepository_";
    public const CACHE_TTL = 3600; // 1 hour

    /**
     * @param array<string, mixed> $mandatoryKeys
     * @param array<string, mixed> $args
     * @return void
     * @throws \Exception
     */
    protected static function validateArgs(array $mandatoryKeys = [], array $args = [])
    {
        $validator = new ArgumentsArrayValidator();

        if (!$validator->validate($mandatoryKeys, $args)) {
            throw new \Exception('Invalid parameters. Required: ['.Arrays::toPlainText($mandatoryKeys).']. Provided: ['.Arrays::toPlainText($args).']');
        }
    }

    /**
     * @param string $identifier
     *
     * @return mixed|null
     */
    protected static function fromCache($identifier)
    {
        $cache = ACPT_Lite_Plugin::getCache();

        if ($cache === null) {
            return null;
        }

        try {
            $cacheKey = md5(self::CACHE_KEY_PREFIX.$identifier);
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
     * @param string $identifier
     * @param mixed $value
     * @return void
     */
    protected static function saveInCache($identifier, $value)
    {
        $cache = ACPT_Lite_Plugin::getCache();

        if ($cache === null) {
            return;
        }

        try {
            $cacheKey = md5(self::CACHE_KEY_PREFIX.$identifier);
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
}
