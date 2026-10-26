<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;

class FetchMetaGroupsQuery implements QueryInterface
{
    /**
     * @var array<string, mixed>
     */
    private array $args = [];

    /**
     * Constructor method.
     *
     * @param array<string, mixed> $args An array of arguments to initialize the object.
     * @return void
     */
    public function __construct(array $args = [])
    {
        $this->args = $args;
    }

    /**
     * Executes the process of retrieving and constructing meta groups.
     *
     * This method fetches meta groups from the MetaRepository based on the provided arguments.
     * Additionally, if the CCT feature is enabled, it processes table group data to incorporate
     * meta groups derived from tables, which are then appended to the result.
     *
     * @return MetaGroupModel[] An array of meta groups constructed from repository data and, if applicable, table group data.
     */
    public function execute(): array
    {
        // Strip cct — MetaRepository validates its args against a whitelist and rejects unknown keys.
        $metaArgs = array_diff_key($this->args, ['cct' => null]);
        $metaGroups = MetaRepository::get($metaArgs);

        return $metaGroups;
    }
}
