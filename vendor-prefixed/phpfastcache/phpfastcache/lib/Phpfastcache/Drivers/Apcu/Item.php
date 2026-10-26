<?php

/**
 *
 * This file is part of phpFastCache.
 *
 * @license MIT License (MIT)
 *
 * For full copyright and license information, please see the docs/CREDITS.txt file.
 *
 * @author Khoa Bui (khoaofgod)  <khoaofgod@gmail.com> https://www.phpfastcache.com
 * @author Georges.L (Geolim4)  <contact@geolim4.com>
 *
 */
declare(strict_types=1);

namespace ACPT_Lite\Vendor\Phpfastcache\Drivers\Apcu;

use ACPT_Lite\Vendor\Phpfastcache\Core\Item\{ExtendedCacheItemInterface, ItemBaseTrait};
use ACPT_Lite\Vendor\Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface;
use ACPT_Lite\Vendor\Phpfastcache\Drivers\Apcu\Driver as ApcuDriver;
use ACPT_Lite\Vendor\Phpfastcache\Exceptions\{PhpfastcacheInvalidArgumentException};

/**
 * Class Item
 * @package phpFastCache\Drivers\Apcu
 */
class Item implements ExtendedCacheItemInterface
{
    use ItemBaseTrait {
        ItemBaseTrait::__construct as __BaseConstruct;
    }

    /**
     * Item constructor.
     * @param Driver $driver
     * @param $key
     * @throws PhpfastcacheInvalidArgumentException
     */
    public function __construct(ApcuDriver $driver, $key)
    {
        $this->__BaseConstruct($driver, $key);
    }

    /**
     * @param ExtendedCacheItemPoolInterface $driver
     * @return static
     * @throws PhpfastcacheInvalidArgumentException
     */
    public function setDriver(ExtendedCacheItemPoolInterface $driver)
    {
        if ($driver instanceof ApcuDriver) {
            $this->driver = $driver;

            return $this;
        }

        throw new PhpfastcacheInvalidArgumentException('Invalid driver instance');
    }
}