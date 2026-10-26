<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Currencies
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
abstract class AbstractUnitOfMeasure
{
    /**
     * @param string $value
     *
     * @return string|null
     */
    public static function getSymbol(string $value): ?string
    {
        $list = static::getList();

        if (isset($list[$value])) {
            return $list[$value]['symbol'];
        }

        return null;
    }

    /**
     * @param string $value
     *
     * @return string|null
     */
    public static function getFullName(string $value): ?string
    {
        $list = static::getList();

        if (isset($list[$value])) {
            return $list[$value]['name'];
        }

        return null;
    }

    /**
     * @return array<int, array{label: string, value: string}>
     */
    public static function getSymbolList(): array
    {
        $return = [];

        foreach (array_keys(static::getList()) as $item) {
            $return[] = [
                "label" => $item,
                "value" => $item,
            ];
        }

        return $return;
    }

    /**
     * @return array<string, array{name: string, symbol: string}>
     */
    abstract public static function getList(): array;

    /**
     * Retrieves an array of keys from the list.
     *
     * @return array<int|string> An array containing the keys of the list.
     */
    public static function getValues(): array
    {
        return array_keys(static::getList());
    }

    /**
     * @return string The default symbol used as the representative value.
     */
    abstract public static function getDefaultSymbol(): string;

    /**
     * @return string
     */
    abstract public static function getDefaultValue(): string;
}
