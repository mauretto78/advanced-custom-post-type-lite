<?php

namespace ACPT_Lite\Core\Models\Contracts;

use ACPT_Lite\Utils\PHP\Request;

interface VisibilityInterface
{
    /**
     * Determines whether the specified entity should be visible based on the given arguments and request context.
     *
     * @param array<string, mixed> $args Optional parameters that may influence the visibility decision.
     * @param Request|null $request An optional request object that provides additional context.
     * @return bool True if the entity is visible, false otherwise.
     */
    public function isVisible(array $args = [], ?Request $request = null): bool;
}
