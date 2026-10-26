<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Vendor\Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface;
use ACPT_Lite\Vendor\Phpfastcache\Entities\DriverStatistic;

class CacheStatsQuery implements QueryInterface
{
    /**
     * @inheritDoc
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheInvalidArgumentException
     */
    public function execute()
    {
        $cache = ACPT_Lite_Plugin::getCache();

        if (!$cache) {
            return [];
        }

        $stats = $cache->getStats();

        return $this->formatStats($cache, $stats);
    }

    /**
     * @param ExtendedCacheItemPoolInterface $cache
     * @param DriverStatistic                $stats
     *
     * @return array<string, mixed>
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheInvalidArgumentException
     */
    private function formatStats(ExtendedCacheItemPoolInterface $cache, DriverStatistic $stats): array
    {
        $data = explode(", ", $stats->getData());
        $items = [];

        foreach ($data as $key) {
            $item = $cache->getItem($key);
            $items[] = [
                'key'  => $key,
                'tags' => $item->getTagsAsString(),
                'data' => $item->getDataAsJsonString(),
            ];
        }

        return [
            "info" => $stats->getInfo(),
            "size" => Strings::bytesToHumanReadable($stats->getSize()),
            "itemsCount" => Arrays::count($data),
            "items" => $items,
        ];
    }
}
