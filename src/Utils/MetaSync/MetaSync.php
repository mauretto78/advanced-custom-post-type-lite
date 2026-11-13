<?php

namespace ACPT_Lite\Utils\MetaSync;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

/**
 * Moves the saved values of a renamed box or field to their new keys, before the rename is saved.
 */
class MetaSync
{
    /**
     * @param MetaBoxModel $metaBoxModel
     *
     * @return void
     * @throws \Exception
     */
    public static function syncBox(MetaBoxModel $metaBoxModel)
    {
        foreach (self::targets($metaBoxModel->getGroup()->getBelongs()) as [$belongsTo, $find]) {
            switch ($belongsTo) {
                case MetaTypes::CUSTOM_POST_TYPE:
                    PostMetaSync::syncBox($metaBoxModel, $find);
                    break;

                case MetaTypes::TAXONOMY:
                    TaxonomyMetaSync::syncBox($metaBoxModel, $find);
                    break;

                case MetaTypes::USER:
                    UserMetaSync::syncBox($metaBoxModel);
                    break;

                case MetaTypes::COMMENT:
                    CommentMetaSync::syncBox($metaBoxModel);
                    break;
            }
        }
    }

    /**
     * @param MetaFieldModel $fieldModel
     *
     * @return void
     * @throws \Exception
     */
    public static function syncField(MetaFieldModel $fieldModel)
    {
        foreach (self::targets($fieldModel->getBox()->getGroup()->getBelongs()) as [$belongsTo, $find]) {
            switch ($belongsTo) {
                case MetaTypes::CUSTOM_POST_TYPE:
                    PostMetaSync::syncField($fieldModel, $find);
                    break;

                case MetaTypes::TAXONOMY:
                    TaxonomyMetaSync::syncField($fieldModel, $find);
                    break;

                case MetaTypes::USER:
                    UserMetaSync::syncField($fieldModel);
                    break;

                case MetaTypes::COMMENT:
                    CommentMetaSync::syncField($fieldModel);
                    break;
            }
        }
    }

    /**
     * Each place whose values a rename must move, once: [belongsTo, find]. A rule matching many
     * post types, taxonomies or option pages ("IN", "!=", "NOT_IN"...) is resolved to each of
     * them; the syncers filter by one exact name, so "page,post" or "!= page" moved nothing (#1455 L7).
     *
     * @param BelongModel[] $belongs
     * @return array<int, array{0: string, 1: string|null}>
     */
    private static function targets(array $belongs): array
    {
        $targets = [];

        foreach ($belongs as $belong) {
            $belongsTo = $belong->getBelongsTo();

            if (in_array($belongsTo, [MetaTypes::USER, MetaTypes::COMMENT], true)) {
                $targets[$belongsTo] = [$belongsTo, null];
                continue;
            }

            foreach (self::matchingNames($belongsTo, (string)$belong->getOperator(), (string)$belong->getFind()) as $name) {
                $targets[$belongsTo.'|'.$name] = [$belongsTo, $name];
            }
        }

        return array_values($targets);
    }

    /**
     * @param string $belongsTo
     * @param string $operator
     * @param string $find
     * @return string[]
     */
    private static function matchingNames(string $belongsTo, string $operator, string $find): array
    {
        $listed = array_values(array_filter(array_map('trim', explode(',', $find)), function (string $name): bool { return $name !== ''; }));

        switch ($operator) {
            case Operator::EQUALS:
            case Operator::IN:
                return $listed;

            case Operator::NOT_EQUALS:
            case Operator::NOT_IN:
                return array_values(array_diff(self::allNames($belongsTo), $listed));

            case Operator::LIKE:
            case Operator::NOT_LIKE:
                $like = $operator === Operator::LIKE;

                return array_values(array_filter(self::allNames($belongsTo), function (string $name) use ($find, $like) {
                    return ($find !== '' && stripos($name, $find) !== false) === $like;
                }));
        }

        // other operators don't name post types, taxonomies or pages: keep the old behaviour
        return $find !== '' ? [$find] : [];
    }

    /**
     * @param string $belongsTo
     * @return string[]
     */
    private static function allNames(string $belongsTo): array
    {
        switch ($belongsTo) {
            case MetaTypes::CUSTOM_POST_TYPE:
                return array_values(get_post_types());

            case MetaTypes::TAXONOMY:
                return array_values(get_taxonomies());

        }

        return [];
    }
}
