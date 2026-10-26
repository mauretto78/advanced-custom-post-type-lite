<?php

namespace ACPT_Lite\Core\Traits;

use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Utils\PHP\Arrays;

trait CollectionsTrait
{
    /**
     * @param string $id
     * @param array<int, mixed> $collection
     *
     * @return bool
     */
    public function existsInCollection(string $id, array $collection): bool
    {
        /** @var AbstractModel $item */
        foreach ($collection as $item) {
            if ($item->getId() === $id) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param string $id
     * @param array<int, mixed> $collection
     *
     * @return array<int, mixed>
     */
    public function removeFromCollection(string $id, array $collection): array
    {
        if ($this->existsInCollection($id, $collection)) {
            /** @var AbstractModel $item */
            foreach ($collection as $index => $item) {
                if ($id === $item->getId()) {
                    unset($collection[$index]);
                }
            }
        }

        return Arrays::reindex($collection);
    }
}
