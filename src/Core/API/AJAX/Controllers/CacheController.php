<?php

namespace ACPT_Lite\Core\API\AJAX\Controllers;

use ACPT_Lite\Core\CQRS\Query\CacheStatsQuery;
use ACPT_Lite\Core\Repository\SettingsRepository;
use ACPT_Lite\Includes\ACPT_Lite_Cache;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Vendor\Psr\Cache\InvalidArgumentException;

class CacheController extends AbstractController
{
    public function cacheConnectionTestAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            try {
                $driver = $data['driver'];
                $config = $data['config'];
                $cache = new ACPT_Lite_Cache($driver, $config);
                $cache->testConnection();

                wp_send_json([
                    "success" => true,
                ]);
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                wp_send_json([
                    "success" => false,
                    "error" => $exception->getMessage()
                ], 500);
            }
        }

        wp_send_json([
            "success" => false,
            "error" => "Missing data"
        ], 500);
    }

    public function cacheStatsAction(): void
    {
        $query = new CacheStatsQuery();

        wp_send_json($query->execute());
    }

    public function deleteCacheItemAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['key'])) {
                wp_send_json([
                        'success' => false,
                        'error' => 'Missing key'
                ]);
            }

            $key = $data['key'];

            try {
                $cache = ACPT_Lite_Plugin::getCache();
                $cache->deleteItem($key);

                $return = [
                    'success' => true,
                ];
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            } catch (InvalidArgumentException $exception) {
                do_action("acpt/error", $exception);

                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            wp_send_json($return);
        }

        wp_send_json([
                'success' => false,
                'error' => 'no postType was sent'
        ]);
    }

    /**
     * Flush cache
     */
    public function flushCacheAction(): void
    {
        try {
            // ACPT_Lite_DB::flushCache() only clears the phpfastcache pool -- it never
            // touches SettingsRepository's separate acpt_settings_cache option
            // (which get(null) checks BEFORE ever reaching that pool), so without
            // this a "Flush cache" click could leave settings reads stale even
            // though the button reported success.
            SettingsRepository::invalidateCache();

            if (!ACPT_Lite_Plugin::isCacheEnabled()) {
                // Nothing to flush -- the ACPT cache is turned off, or its
                // directory could not be initialised (e.g. not writable). Don't
                // report a generic failure; tell the user what to check.
                wp_send_json([
                    'success' => true,
                    'message' => "The ACPT cache is disabled, so there is nothing to flush. If you expected it to be active, check Settings → Performances → Test connection (the cache directory may not be writable).",
                ]);
            }

            // clear() returns false on an already-empty / not-yet-created cache
            // directory, which is not an error -- the desired end state is
            // reached either way. A genuine cache-layer failure throws (we pass
            // true) and is reported below.
            ACPT_Lite_DB::flushCache(true);

            wp_send_json([
                'success' => true,
            ]);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            wp_send_json([
                'success' => false,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
