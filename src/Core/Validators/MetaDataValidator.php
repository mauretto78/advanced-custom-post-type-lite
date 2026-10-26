<?php

namespace ACPT_Lite\Core\Validators;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Assert;

class MetaDataValidator
{
    /**
     * @param string $type
     * @param mixed $rawData
     * @param bool $isRequired
     *
     * @return void
     */
    public static function validate(string $type, $rawData, bool $isRequired = false): void
    {
        if ($isRequired) {
            // not Assert::notEmpty(): empty("0") is true, so a required Number field set to 0 was rejected
            Assert::false(self::isBlank($rawData), 'Expected a non-empty value.');
        }

        if (!$isRequired && empty($rawData)) {
            return;
        }

        switch ($type) {
            case MetaFieldModel::DATE_TYPE:
                Assert::date($rawData);
                break;

            case MetaFieldModel::EMAIL_TYPE:
                Assert::email($rawData);
                break;

            default:
                Assert::string($rawData);
        }
    }

    /**
     * Whether a value counts as "not filled in" for a required field.
     * Unlike PHP's empty(), "0", 0 and 0.0 are real values (e.g. a Number field set to zero).
     *
     * @param mixed $value
     *
     * @return bool
     */
    public static function isBlank($value): bool
    {
        return $value === null || $value === '' || $value === [];
    }
}
