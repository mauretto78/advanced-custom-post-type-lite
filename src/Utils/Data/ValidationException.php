<?php

namespace ACPT_Lite\Utils\Data;

class ValidationException extends \RuntimeException
{
    /** @var string[] */
    private array $errors;

    /** @var array<string, string[]> */
    private array $formattedErrors;

    /**
     * @param string[]               $errors          Flat list of all error messages.
     * @param array<string, string[]> $formattedErrors Keyed by field name (or "schema" for root errors).
     */
    public function __construct(array $errors, array $formattedErrors = [])
    {
        $this->errors          = $errors;
        $this->formattedErrors = $formattedErrors;
        parent::__construct(implode('; ', $errors));
    }

    /**
     * Returns all validation error messages as a flat list.
     *
     * @return string[]
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Returns errors grouped by field name.
     *
     * Format: ["fieldName" => ["error message", ...], "schema" => ["root-level error", ...]]
     *
     * @return array<string, string[]>
     */
    public function getFormattedErrors(): array
    {
        return $this->formattedErrors;
    }
}
