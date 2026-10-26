<?php

namespace ACPT_Lite\Core\Traits;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\PHP\Logics;

trait BelongsToTrait
{
    /**
     * @param string $belongsTo
     * @param string|null $operator
     * @param string|null $find
     *
     * @return bool
     */
    public function belongsTo(string $belongsTo, ?string $operator = null, ?string $find = null): bool
    {
        if (static::class !== MetaGroupModel::class) {
            return false;
        }

        try {
            /** @var BelongModel[] $belongs */
            $belongs = static::getBelongs();

            if (empty($belongs)) {
                return false;
            }

            $logicBlocks = Logics::extractLogicBlocks($belongs);

            foreach ($logicBlocks as $logicBlock) {
                if ($this->returnTrueOrFalseForALogicBlock($logicBlock, $belongsTo, $operator, $find)) {
                    return true;
                }
            }

            return false;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }

    /**
     * @param BelongModel[] $belongModels
     * @param string $belongsTo
     * @param string|null $operator
     * @param string|null $find
     *
     * @return bool
     */
    private function returnTrueOrFalseForALogicBlock(array $belongModels, string $belongsTo, ?string $operator = null, ?string $find = null): bool
    {
        $matches = 0;

        foreach ($belongModels as $belongModel) {
            if ($belongModel->getBelongsTo() === $belongsTo) {
                if ($operator == null && $find == null) {
                    $matches++;
                } else {
                    switch ($operator) {
                        case Operator::EQUALS:

                            if ($find == $belongModel->getFind()) {
                                $matches++;
                            }

                            // IN
                            if ($belongModel->getOperator() === Operator::IN) {
                                if (is_string($find) && is_string($belongModel->getFind())) {
                                    $check = Strings::matches($find, $belongModel->getFind());

                                    if (Arrays::count($check) > 0) {
                                        $matches++;
                                    }
                                }
                            }

                            // NOT IN
                            if ($belongModel->getOperator() === Operator::NOT_IN) {
                                if (is_string($find) && is_string($belongModel->getFind())) {
                                    $check = Strings::matches($find, $belongModel->getFind());

                                    if (empty($check)) {
                                        $matches++;
                                    }
                                }
                            }

                            break;

                        case Operator::NOT_EQUALS:

                            if ($find != $belongModel->getFind()) {
                                $matches++;
                            }

                            break;

                        case Operator::IN:

                            if (is_string($find) && is_string($belongModel->getFind())) {
                                $check = Strings::matches($find, $belongModel->getFind());

                                if (Arrays::count($check) > 0) {
                                    $matches++;
                                }
                            }

                            break;

                        case Operator::NOT_IN:

                            if (is_string($find) && is_string($belongModel->getFind())) {
                                $check = Strings::matches($find, $belongModel->getFind());

                                if (empty($check)) {
                                    $matches++;
                                }
                            }

                            break;
                    }
                }
            }
        }

        return $matches == Arrays::count($belongModels);
    }

    /**
     * @return bool
     */
    public function belongsToTaxonomy()
    {
        $belongs = [
            MetaTypes::TAXONOMY,
            BelongsTo::TERM_ID,
        ];

        foreach ($belongs as $belong) {
            if ($this->belongsTo($belong)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return bool
     */
    public function belongsToPostType()
    {
        $belongs = [
            MetaTypes::CUSTOM_POST_TYPE,
            BelongsTo::PARENT_POST_ID,
            BelongsTo::POST_ID,
            BelongsTo::POST_CAT,
            BelongsTo::POST_TAX,
            BelongsTo::POST_TEMPLATE,
        ];

        foreach ($belongs as $belong) {
            if ($this->belongsTo($belong)) {
                return true;
            }
        }

        return false;
    }
}
