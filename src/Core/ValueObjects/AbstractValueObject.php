<?php

namespace ACPT_Lite\Core\ValueObjects;

abstract class AbstractValueObject
{
    /**
     * Every value object must implement this method to check if the object is valid.
     */
    abstract public function isValid(): bool;

    /**
     * Populates the object properties from the given array.
     *
     * @param array<string, mixed> $array An associative array containing data with keys 'key' and 'value'.
     * @return void
     */
    abstract public function fromArray(array $array);

    /**
     * Parses a JSON-encoded string and initializes the object with the resulting data if valid.
     *
     * @param string $string A JSON-encoded string to be parsed.
     * @return void
     */
    public function fromString(string $string)
    {
        $array = json_decode($string, true);

        if (is_array($array) && !empty($array)) {
            $this->fromArray($array);
        }
    }
}
