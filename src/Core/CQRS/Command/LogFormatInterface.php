<?php

namespace ACPT_Lite\Core\CQRS\Command;

interface LogFormatInterface
{
    /**
     * @return array<string, mixed>
     */
    public function logFormat(): array;
}
