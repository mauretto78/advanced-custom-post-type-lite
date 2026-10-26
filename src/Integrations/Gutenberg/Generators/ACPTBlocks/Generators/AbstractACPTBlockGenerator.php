<?php

namespace ACPT_Lite\Integrations\Gutenberg\Generators\ACPTBlocks\Generators;

abstract class AbstractACPTBlockGenerator
{
    /**
     * Generate the ACPT block
     *
     * @return void
     */
    abstract public function generate(): void;
}
