<?php

namespace ACPT_Lite\Utils\Vite;

class Assets
{
    /**
     * @param string $src
     * @param string $key
     *
     * @return array<string, mixed>
     */
    public static function load(string $src, string $key): array
    {
        $resources = [
            'js' => [],
            'css' => [],
        ];

        $manifest = ACPT_LITE_PLUGIN_DIR_PATH."/assets/build/.vite/manifest.json";

        if (file_exists($manifest) && is_readable($manifest)) {
            $contents = file_get_contents($manifest);

            if ($contents === false) {
                return $resources;
            }

            $json = json_decode($contents, true);

            foreach ($json as $entry) {
                if (isset($entry['src']) && $entry['src'] === $src) {
                    $asset = $entry['file'];
                    $styles = $entry['css'];

                    $resources['js'][$key] = plugins_url('acpt-lite/assets/build/').$asset;

                    foreach ($styles as $style) {
                        $resources['css'][$key] = plugins_url('acpt-lite/assets/build/').$style;
                    }
                }
            }
        }

        return $resources;
    }
}
