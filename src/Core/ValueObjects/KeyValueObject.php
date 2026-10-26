<?php

namespace ACPT_Lite\Core\ValueObjects;

class KeyValueObject extends AbstractValueObject implements \JsonSerializable
{
    /**
     * @var string|null
     */
    public ?string $key = null;

    /**
     * @var mixed|null
     */
    public $value = null;

    /**
     * Determines if the current instance is valid based on its properties.
     *
     * @return bool True if both key and value are non-empty, false otherwise.
     */
    public function isValid(): bool
    {
        return !empty($this->key) && !empty($this->value);
    }

    /**
     * Populates the object properties from the given array.
     *
     * @param array<string,mixed> $array An associative array containing data with keys 'key' and 'value'.
     * @return void
     */
    public function fromArray(array $array): void
    {
        if (isset($array['key']) && !empty($array['key'])) {
            $this->key = sanitize_text_field($array['key']);
        }

        if (isset($array['value']) && !empty($array['value'])) {
            $this->value = is_string($array['value']) ? sanitize_text_field($array['value']) : $array['value'];
        }
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            $this->key => $this->value
        ];
    }
}
