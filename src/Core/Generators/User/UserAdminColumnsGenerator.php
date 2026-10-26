<?php

namespace ACPT_Lite\Core\Generators\User;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Query\FetchMetaGroupsQuery;
use ACPT_Lite\Core\Helper\Strings;

class UserAdminColumnsGenerator
{
    /**
     * Add User columns to Back-end
     *
     * @return void
     */
    public static function addColumns(): void
    {
        try {
            $metaGroups = (new FetchMetaGroupsQuery([
                'belongsTo' => MetaTypes::USER,
                'clonedFields' => true,
                'cct' => true,
            ]))->execute();

            add_filter('manage_users_columns', function ($column) use ($metaGroups) {
                foreach ($metaGroups as $metaGroup) {
                    foreach ($metaGroup->getBoxes() as $boxModel) {
                        foreach ($boxModel->getFields() as $fieldModel) {
                            if ($fieldModel->isShowInArchive()) {
                                $key = Strings::toDBFormat($boxModel->getName()).'_'.Strings::toDBFormat($fieldModel->getName());
                                $value = Strings::toHumanReadableFormat($fieldModel->getName());
                                $column[$key] = $value;
                            }
                        }
                    }
                }

                return $column;
            });

            add_filter('manage_users_custom_column', function ($val, $columnName, $userId) use ($metaGroups) {
                foreach ($metaGroups as $metaGroup) {
                    foreach ($metaGroup->getBoxes() as $boxModel) {
                        foreach ($boxModel->getFields() as $fieldModel) {
                            if ($fieldModel->isShowInArchive()) {
                                $key = Strings::toDBFormat($boxModel->getName()).'_'.Strings::toDBFormat($fieldModel->getName());

                                if ($key === $columnName) {
                                    return do_shortcode('[acpt_user uid="'.$userId.'" box="'.Strings::esc_attr($boxModel->getName()).'" field="'.Strings::esc_attr($fieldModel->getName()).'"]');
                                }
                            }
                        }
                    }
                }

                return $val;
            }, 10, 3);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        }
    }
}
