<?php

namespace ACPT_Lite\Core\Generators\User;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Query\FetchMetaGroupsQuery;
use ACPT_Lite\Core\Generators\AbstractGenerator;

class UserMetaGroupsGenerator extends AbstractGenerator
{
    /**
     * Generate meta boxes related to users
     *
     * @return void
     */
    public function generate(): void
    {
        try {
            $metaGroups = (new FetchMetaGroupsQuery([
                'belongsTo' => MetaTypes::USER,
                'clonedFields' => true,
                'cct' => true,
            ]))->execute();

            if (!empty($metaGroups)) {
                $generator = new UserMetaBoxGenerator($metaGroups);
                $generator->generate();
            }
        } catch (\Exception $exception) {
            // do nothing
            do_action("acpt/error", $exception);
        }
    }
}
