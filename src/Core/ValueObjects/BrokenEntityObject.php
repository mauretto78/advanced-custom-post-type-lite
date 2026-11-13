<?php

namespace ACPT_Lite\Core\ValueObjects;

/**
 * A record whose stored definition no longer loads (the repository's hydrateRow()
 * threw). Only admin lists get these (AbstractRepository::getForAdminList()), so
 * the row stays visible, the list matches count(), and the admin can delete it.
 * Every other caller skips a broken record (M13, #1455).
 */
class BrokenEntityObject implements \JsonSerializable
{
    public string $id;
    public string $name;
    public string $label;

    /**
     * Entity-specific fields the list row needs (e.g. a table's `tableGroupId`),
     * merged into the JSON.
     *
     * @var array<string, scalar|null>
     */
    public array $extra;

    public string $error;

    /**
     * @param string $id
     * @param string $name
     * @param string $label
     * @param string $error
     * @param array<string, scalar|null> $extra
     */
    public function __construct(string $id, string $name, string $label, string $error, array $extra = [])
    {
        $this->id = $id;
        $this->name = $name;
        $this->label = $label;
        $this->error = $error;
        $this->extra = $extra;
    }

    /**
     * @param \stdClass $row A row of the repository's list query
     * @param \Throwable $error
     * @param string $nameProp The row property holding the record's name
     * @param string $labelProp The row property holding the record's label
     * @param array<string, scalar|null> $extra
     * @return self
     */
    public static function fromRow(\stdClass $row, \Throwable $error, string $nameProp = 'name', string $labelProp = 'label', array $extra = []): self
    {
        return new self(
            (string)($row->id ?? ''),
            (string)($row->{$nameProp} ?? ''),
            (string)($row->{$labelProp} ?? ''),
            $error->getMessage(),
            $extra
        );
    }

    /**
     * @return array<string, mixed>
     */
    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return array_merge($this->extra, [
            'id' => $this->id,
            'name' => $this->name,
            'label' => $this->label,
            'broken' => true,
            'error' => $this->error,
        ]);
    }
}
