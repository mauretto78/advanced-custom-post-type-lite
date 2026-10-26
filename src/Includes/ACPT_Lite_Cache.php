<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Vendor\Phpfastcache\CacheManager;
use ACPT_Lite\Vendor\Phpfastcache\Config\ConfigurationOption;
use ACPT_Lite\Vendor\Phpfastcache\Drivers\Files\Config as FilesConfig;
use ACPT_Lite\Vendor\Phpfastcache\Drivers\Memcached\Config as MemcachedConfig;
use ACPT_Lite\Vendor\Phpfastcache\Drivers\Predis\Config as PredisConfig;
use ACPT_Lite\Vendor\Phpfastcache\Drivers\Redis\Config as RedisConfig;
use ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverCheckException;
use ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverException;
use ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverNotFoundException;
use ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheInvalidArgumentException;
use ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheInvalidConfigurationException;
use ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheLogicException;

class ACPT_Lite_Cache
{
    public const ALLOWED_DRIVERS = [
        'redis',
        'files',
        'memcached',
    ];

    /**
     * @var string
     */
    private string $driver;

    /**
     * @var array<string, mixed>
     */
    private array $config;

    /**
     * @param string               $driver
     * @param array<string, mixed> $config
     * @throws \Exception
     */
    public function __construct(string $driver = "files", array $config = [])
    {
        if (!in_array($driver, self::ALLOWED_DRIVERS)) {
            throw new \Exception($driver . " is not an allowed driver");
        }

        $this->driver = $driver;
        $this->config = $config;
    }

    /**
     * @throws \Exception
     */
    public function testConnection(): void
    {
        switch ($this->driver) {
            case "memcached":
                $this->MemcachedCache();
                break;

            case "redis":
                $this->RedisCache();
                break;

            case "files":
                $folder = (isset($this->config['folder'])) ? $this->config['folder'] : "cache";
                $cacheDir = $this->cacheDir($folder);

                if (!is_dir($cacheDir)) {
                    $createDir = mkdir($cacheDir, 0777, true);

                    if (!$createDir) {
                        throw new \Exception($folder . " cannot be created. Please check your root permissions");
                    }

                    rmdir($cacheDir);
                } elseif (!is_writable($cacheDir)) {
                    throw new \Exception($folder . " is not a writable directory. Please check your root permissions");
                }

                break;
        }
    }

    /**
     * @return \ACPT_Lite\Vendor\Phpfastcache\Cluster\AggregatablePoolInterface|\ACPT_Lite\Vendor\Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverCheckException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverNotFoundException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheInvalidArgumentException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheInvalidConfigurationException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheLogicException
     * @throws \ReflectionException
     */
    public function getInstance()
    {
        switch ($this->driver) {
            // files
            default:
            case "files":
                $folder = (isset($this->config['folder'])) ? $this->config['folder'] : "cache";

                return $this->FilesCache($folder);

                // memcached
            case "memcached":
                try {
                    return $this->MemcachedCache();
                } catch (\Exception $exception) {
                    return $this->FilesCache("cache");
                }

                // redis
            case "redis":
                try {
                    return $this->RedisCache();
                } catch (\Exception $exception) {
                    return $this->FilesCache("cache");
                }
        }
    }

    /**
     * @param string $folder
     *
     * @return string
     */
    private function cacheDir(string $folder): string
    {
        if (str_starts_with($folder, '/')) {
            return rtrim($folder, '/') . '/';
        }

        return plugin_dir_path(__FILE__) . "../../". $folder;
    }

    /**
     * @param string $folder
     *
     * @return \ACPT_Lite\Vendor\Phpfastcache\Cluster\AggregatablePoolInterface|\ACPT_Lite\Vendor\Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface
     * @throws PhpfastcacheDriverCheckException
     * @throws PhpfastcacheDriverException
     * @throws PhpfastcacheDriverNotFoundException
     * @throws PhpfastcacheInvalidArgumentException
     * @throws PhpfastcacheInvalidConfigurationException
     * @throws PhpfastcacheLogicException
     * @throws \ReflectionException
     */
    private function FilesCache(string $folder)
    {
        $cacheDir = $this->cacheDir($folder);

        if (!is_dir($cacheDir)) {
            mkdir($cacheDir, 0777, true);
        }

        // FilesConfig (not the base ConfigurationOption) exposes setSecurityKey()
        $config = new FilesConfig();
        $config->setPath($cacheDir);

        // Derive a fixed security key from the WP site URL so PHPFastCache never
        // falls back to HTTP_HOST, which varies with bot/subdomain requests.
        $siteHost = parse_url(get_site_url(), PHP_URL_HOST) ?? 'acpt';

        if (is_string($siteHost)) {
            $securityKey = preg_replace('/^www\./', '', strtolower(str_replace(':', '_', $siteHost)));
            $config->setSecurityKey($securityKey ?: 'acpt');
        }

        CacheManager::setDefaultConfig($config);

        return CacheManager::getInstance('files');
    }

    /**
     * @return \ACPT_Lite\Vendor\Phpfastcache\Cluster\AggregatablePoolInterface|\ACPT_Lite\Vendor\Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverCheckException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverNotFoundException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheInvalidArgumentException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheInvalidConfigurationException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheLogicException
     * @throws \ReflectionException
     * @throws \Exception
     */
    private function MemcachedCache()
    {
        if (!isset($this->config['memcached_host'])) {
            throw new \Exception("Memcached host is not defined");
        }

        if (!isset($this->config['memcached_port'])) {
            throw new \Exception("Memcached port is not defined");
        }

        if (!class_exists('Memcached')) {
            throw new \Exception("Memcached library is not installed. <a href='https://www.php.net/manual/en/memcached.installation.php' target='_blank'>More info here</a>");
        }

        return CacheManager::getInstance(
            'memcached',
            new MemcachedConfig([
                    "host" => $this->config['memcached_host'],
                    "port" => (int)$this->config['memcached_port'],
            ])
        );
    }

    /**
     * @return \ACPT_Lite\Vendor\Phpfastcache\Cluster\AggregatablePoolInterface|\ACPT_Lite\Vendor\Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverCheckException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheDriverNotFoundException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheInvalidArgumentException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheInvalidConfigurationException
     * @throws \ACPT_Lite\Vendor\Phpfastcache\Exceptions\PhpfastcacheLogicException
     * @throws \ReflectionException
     * @throws \Exception
     */
    private function RedisCache()
    {
        if (!isset($this->config['redis_host'])) {
            throw new \Exception("Redis host is not defined");
        }

        if (!isset($this->config['redis_port'])) {
            throw new \Exception("Redis port is not defined");
        }

        if (!isset($this->config['redis_database'])) {
            throw new \Exception("Redis database is not defined");
        }

        try {
            return CacheManager::getInstance(
                'redis',
                new RedisConfig([
                    'host'     => $this->config['redis_host'],
                    'port'     => (int)$this->config['redis_port'],
                    "database" => (int)$this->config['redis_database'],
                ])
            );
        } catch (
            PhpfastcacheDriverCheckException |
            PhpfastcacheDriverException |
            PhpfastcacheDriverNotFoundException |
            PhpfastcacheInvalidArgumentException |
            PhpfastcacheInvalidConfigurationException |
            PhpfastcacheLogicException  $e) {
                $dependencyPath = ACPT_LITE_PLUGIN_DIR_PATH . '/dependencies/predis/predis-2.4.0/autoload.php';

                if (!class_exists('\Predis\Client') && file_exists($dependencyPath)) {
                    require_once $dependencyPath;
                }

                if (!class_exists('\Predis\Client')) {
                    throw new \Exception("Predis client is not installed: the Redis driver needs the predis/predis library.");
                }

                return CacheManager::getInstance(
                    'predis',
                    new PredisConfig([
                        'host'     => $this->config['redis_host'],
                        'port'     => (int)$this->config['redis_port'],
                        "database" => (int)$this->config['redis_database'],
                    ])
                );
            }
    }

    /**
     * Suppresses specific warnings generated by certain functions.
     *
     * @return void
     */
    public static function suppressWarnings()
    {
        set_error_handler(function ($errno, $errstr) {
            return (
                (str_contains($errstr, 'file_get_contents') || str_contains($errstr, 'fopen'))
                && str_contains($errstr, 'Failed to open stream')
            ) || (
                str_contains($errstr, 'unserialize()') && str_contains($errstr, 'Extra data')
            );
        });
    }

    /**
     * Restores the previously defined error handler.
     *
     * @return void
     */
    public static function restoreWarnings()
    {
        restore_error_handler();
    }
}
