<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Core\Models\Belong\BelongModel;

class Logics
{
    /**
     * @param mixed $elements
     * @param string|null $visibility
     *
     * @return array<mixed>
     */
    public static function extractLogicBlocks($elements, ?string $visibility = null): array
    {
        if (empty($elements)) {
            return [];
        }

        if (!is_array($elements)) {
            return [];
        }

        $logicBlocks = [];
        $storedLogicBlocks = [];

        foreach ($elements as $index => $element) {
            if (
                $element instanceof BelongModel
            ) {
                $isLast = $index === (Arrays::count($elements)-1);
                $logic  = $element->getLogic();

                // OR
                if ($logic === 'OR' && !$isLast) {
                    if (!empty($storedLogicBlocks)) {
                        $storedLogicBlocks[] = $element;
                        $logicBlocks[] = $storedLogicBlocks;
                        $storedLogicBlocks = [];
                    } else {
                        $logicBlocks[] = [$element];
                    }
                }

                // AND
                if ($logic === 'AND' && !$isLast) {
                    $storedLogicBlocks[] = $element;
                }

                // Last element
                if ($isLast) {
                    if (!empty($storedLogicBlocks)) {
                        $storedLogicBlocks[] = $element;
                        $logicBlocks[] = $storedLogicBlocks;
                        $storedLogicBlocks = [];
                    } else {
                        $logicBlocks[] = [$element];
                    }
                }
            }
        }

        return $logicBlocks;
    }

}
