<?php

namespace ACPT_Lite\Core\ValueObjects;

class SelectOptionObject extends AbstractValueObject implements \JsonSerializable
{
    /**
     * @var string|null
     */
    public ?string $label = null;

    /**
     * @var string|int|float|bool|null
     */
    public $value = null;

    /**
     * @var bool
     */
    public bool $isDefault = false;

    /**
     * @return bool
     */
    public function isValid(): bool
    {
        return $this->label !== null && $this->value !== null;
    }

    /**
     * Populates the object properties from the given array.
     *
     * @param array<string, mixed> $array An associative array containing data with keys 'key' and 'value'.
     *
     * @return void
     */
    public function fromArray(array $array): void
    {
        if (isset($array['label']) && $array['label'] !== '') {
            $this->label = sanitize_text_field($array['label']);
        }

        if (isset($array['value']) && $array['value'] !== '') {
            $this->value = is_string($array['value']) ? sanitize_text_field($array['value']) : $array['value'];
        }

        if (isset($array['isDefault']) && is_bool($array['isDefault'])) {
            $this->isDefault = $array['isDefault'];
        }
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'label' => $this->label,
            'value' => $this->value,
            'isDefault' => $this->isDefault
        ];
    }
}
