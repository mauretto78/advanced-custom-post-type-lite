<?php

namespace ACPT_Lite\Utils\Settings;

use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\SettingsRepository;

class Settings
{
    /**
     * @param string     $key
     * @param mixed|null $defaultValue
     *
     * @return string|null
     */
    public static function get(string $key, $defaultValue = null): ?string
    {
        try {
            $fetched = SettingsRepository::getSingle($key);

            return ($fetched instanceof SettingsModel) ? $fetched->getDecodedValue() : $defaultValue;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return $defaultValue;
        }
    }

    /**
     * @param string          $key
     * @param SettingsModel[] $settings
     *
     * @return mixed|null
     */
    public static function fromSettings(string $key, array $settings)
    {
        $fetched = array_filter($settings, function (SettingsModel $model) use ($key) {
            return $model->getKey() === $key;
        });

        if (empty($fetched)) {
            return null;
        }

        $fetched = array_values($fetched);

        return $fetched[0]->getDecodedValue();
    }
}
