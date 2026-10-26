<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class DeleteMetaFieldValueCommand extends AbstractMetaFieldValueCommand implements CommandInterface
{
    /**
     * @throws \Exception
     */
    public function execute()
    {
        global $wpdb;

        $this->fieldModel->setFindLabel($this->location);
        $this->fieldModel->setBelongsToLabel($this->belongsTo);

        switch ($this->belongsTo) {
            case MetaTypes::MEDIA:
            case MetaTypes::CUSTOM_POST_TYPE:
                [$keyClause, $keyArgs] = $this->keyPredicate('meta_key', $this->fieldModel->getDbName());
                $sql  = "DELETE FROM `{$wpdb->prefix}postmeta` WHERE {$keyClause} AND post_id = %d";
                $args = array_merge($keyArgs, [$this->location]);
                break;

            case MetaTypes::TAXONOMY:
                [$keyClause, $keyArgs] = $this->keyPredicate('meta_key', $this->fieldModel->getDbName());
                $sql  = "DELETE FROM `{$wpdb->prefix}termmeta` WHERE {$keyClause} AND term_id = %d";
                $args = array_merge($keyArgs, [$this->location]);
                break;

            case MetaTypes::USER:
                [$keyClause, $keyArgs] = $this->keyPredicate('meta_key', $this->fieldModel->getDbName());
                $sql  = "DELETE FROM `{$wpdb->prefix}usermeta` WHERE {$keyClause} AND user_id = %d";
                $args = array_merge($keyArgs, [$this->location]);
                break;

            case MetaTypes::COMMENT:
                [$keyClause, $keyArgs] = $this->keyPredicate('meta_key', $this->fieldModel->getDbName());
                $sql  = "DELETE FROM `{$wpdb->prefix}commentmeta` WHERE {$keyClause} AND comment_id = %d";
                $args = array_merge($keyArgs, [$this->location]);
                break;
        }

        if (isset($sql) && isset($args)) {
            ACPT_Lite_DB::executeQueryOrThrowException($sql, $args);
        }
    }

    /**
     * Build the meta_key / option_name WHERE fragment that matches exactly this
     * field's stored keys — its value (`<dbName>`) and its companion / nested
     * sub-keys (`<dbName>_type`, `<dbName>_id`, repeater rows `<dbName>_0_…`,
     * address `<dbName>_lat`, currency `<dbName>_currency`, …) — WITHOUT catching
     * a sibling field in the same box whose db-name shares this one's as a
     * prefix (ticket #1244: `name` used to also wipe `name_full`).
     *
     * The old code used `LIKE '<dbName>%'` unescaped, so the trailing `%` matched
     * any sibling `<dbName>_x`, and the always-present literal `_` characters in a
     * db-name were themselves treated as single-char LIKE wildcards.
     *
     * @param string $column  'meta_key' or 'option_name'
     * @param string $dbName
     * @return array{0: string, 1: array<int, string>}
     */
    private function keyPredicate(string $column, string $dbName): array
    {
        global $wpdb;

        // exact value key, or a properly-escaped, `_`-anchored sub-key
        $sql  = "( `{$column}` = %s OR `{$column}` LIKE %s )";
        $args = [$dbName, $wpdb->esc_like($dbName) . '\\_%'];

        $thisSegment = Strings::toDBFormat($this->fieldModel->getName());

        // Only the field name (not a WooCommerce attribute location, not a
        // parent-prefixed nested key) sits at the tail of $dbName; if it does
        // not, there is nothing to reconcile against siblings.
        if ($thisSegment === '' || substr($dbName, -\strlen($thisSegment)) !== $thisSegment) {
            return [$sql, $args];
        }

        $prefix = substr($dbName, 0, \strlen($dbName) - \strlen($thisSegment));

        foreach ($this->fieldModel->getBox()->getFields() as $sibling) {
            if ($sibling->getId() === $this->fieldModel->getId()) {
                continue;
            }

            $siblingSegment = Strings::toDBFormat($sibling->getName());

            // A sibling only collides when its name begins with this field's
            // name + '_' (e.g. this = `name`, sibling = `name_full`).
            if ($siblingSegment === $thisSegment || strpos($siblingSegment, $thisSegment . '_') !== 0) {
                continue;
            }

            $siblingDbName = $prefix . $siblingSegment;
            $sql   .= " AND `{$column}` <> %s AND `{$column}` NOT LIKE %s";
            $args[] = $siblingDbName;
            $args[] = $wpdb->esc_like($siblingDbName) . '\\_%';
        }

        return [$sql, $args];
    }
}
