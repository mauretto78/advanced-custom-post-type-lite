<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Core\ValueObjects\BrokenEntityObject;
use ACPT_Lite\Includes\ACPT_Lite_DB;
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

    /**
     * Builds an ORDER BY clause from caller-supplied sort/order values without
     * ever putting them into the SQL: `$sort` must be a key of `$columns` (mapped
     * to the real SQL column), and the direction is ASC unless `$order` is "desc".
     * An unknown or missing sort key falls back to `$default`.
     *
     * Sort keys come from list pages (the column a user clicked) and from REST/AJAX
     * payloads, so they must never be concatenated into the query as they are.
     *
     * @param mixed $sort
     * @param mixed $order
     * @param array<string, string> $columns allowed sort key => SQL column (trusted)
     * @param string $default ORDER BY expression used when $sort is not allowed (trusted)
     * @return string e.g. " ORDER BY f.form_name DESC"
     */
    protected static function orderByClause($sort, $order, array $columns, string $default): string
    {
        if (!is_string($sort) || !isset($columns[$sort])) {
            return " ORDER BY " . $default;
        }

        $direction = (is_string($order) && strtoupper($order) === 'DESC') ? 'DESC' : 'ASC';

        return " ORDER BY " . $columns[$sort] . " " . $direction;
    }

    /**
     * The records for an admin list page. Same filters and pagination as the
     * repository's get(), but a record whose definition fails to load is
     * returned as a BrokenEntityObject instead of being left out: count() can't
     * know which rows load, so this keeps every row it counts in the list, and
     * the admin can delete the broken one (M13, #1455).
     *
     * A repository opts in by implementing listQuery() and hydrateRow() (and
     * brokenRow() when its name/label columns are named differently).
     *
     * Not cached at the repository level: it backs one admin page of at most
     * `perPage` rows, and the underlying query is cached by ACPT_Lite_DB.
     *
     * @param array<string, mixed> $args The repository's get() arguments
     * @return array<int, object>
     */
    public static function getForAdminList(array $args = []): array
    {
        [$query, $params] = static::listQuery($args);
        $skipCache = isset($args['skipCache']) && $args['skipCache'] === true;
        $rows = ACPT_Lite_DB::getResults($query, $params, 7200, null, $skipCache);

        return static::hydrateRows($rows, $args, true);
    }

    /**
     * Hydrates the rows of listQuery(). A row that fails to load is logged and
     * then skipped, or kept as a BrokenEntityObject when $keepBroken is true.
     *
     * @param array<int, mixed> $rows
     * @param array<string, mixed> $args
     * @param bool $keepBroken
     * @return array<int, object>
     */
    protected static function hydrateRows(array $rows, array $args, bool $keepBroken): array
    {
        $results = [];

        foreach ($rows as $row) {
            if (!$row instanceof \stdClass) {
                continue;
            }

            try {
                $results[] = static::hydrateRow($row, $args);
            } catch (\Throwable $exception) {
                do_action("acpt/error", $exception);

                if ($keepBroken) {
                    $results[] = static::brokenRow($row, $exception);
                }
            }
        }

        return $results;
    }

    /**
     * The list query (SQL and params) for the given get() arguments.
     *
     * @param array<string, mixed> $args
     * @return array{0: string, 1: array<int, mixed>}
     */
    protected static function listQuery(array $args): array
    {
        throw new \LogicException(static::class . " has no admin list: implement listQuery() and hydrateRow().");
    }

    /**
     * Builds the model of one row of listQuery(). May throw: hydrateRows() catches it.
     *
     * @param \stdClass $row
     * @param array<string, mixed> $args
     * @return object
     */
    protected static function hydrateRow(\stdClass $row, array $args): object
    {
        throw new \LogicException(static::class . " has no admin list: implement listQuery() and hydrateRow().");
    }

    /**
     * The placeholder for a row that failed to load. The default reads the
     * row's `id`, `name` and `label`.
     *
     * @param \stdClass $row
     * @param \Throwable $exception
     * @return BrokenEntityObject
     */
    protected static function brokenRow(\stdClass $row, \Throwable $exception): BrokenEntityObject
    {
        return BrokenEntityObject::fromRow($row, $exception);
    }
}
