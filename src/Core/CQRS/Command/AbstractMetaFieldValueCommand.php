<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Data\Meta;

abstract class AbstractMetaFieldValueCommand
{
    /**
     * @var MetaFieldModel
     */
    protected MetaFieldModel $fieldModel;

    /**
     * @var string|null
     */
    protected ?string $belongsTo = null;

    /**
     * @var string|null
     */
    protected ?string $location = null;

    /**
     * @var string
     */
    protected string $identifier;

    /**
     * @var array<string, mixed>
     */
    protected array $args = [];

    /**
     * @var bool
     */
    protected bool $withContext;

    /**
     * @var string
     */
    protected string $return;

    /**
     * SaveMetaFieldValueCommand constructor.
     *
     * @param MetaFieldModel $fieldModel
     * @param array<string, mixed> $args
     *
     * @throws \Exception
     */
    public function __construct(MetaFieldModel $fieldModel, array $args = [])
    {
        $this->buildFromArgs($args);
        $this->args = $args;
        $this->fieldModel = $fieldModel;

        // override find and belongsTo
        $this->fieldModel->setBelongsToLabel($this->belongsTo);
        $this->fieldModel->setFindLabel($this->location);

        if (isset($args['wc_product_attribute']) && !empty($args['wc_product_attribute'])) {
            $this->fieldModel->setIsAWooCommerceProductAttribute(true);
        }

        // @phpstan-ignore-next-line ternary.alwaysFalse
        $this->withContext = (isset($this->args['with_context']) && $this->args['with_context'] == true) ? true : false;
        // @phpstan-ignore-next-line ternary.alwaysFalse
        $this->return = (isset($this->args['return']) && !empty($this->args['return'])) ? $this->args['return'] : 'object';
    }

    /**
     * @param array<string, mixed> $args
     *
     * @throws \Exception
     */
    protected function buildFromArgs(array $args = []): void
    {
        if (isset($args['post_id'])) {
            $this->belongsTo = MetaTypes::CUSTOM_POST_TYPE;
            $this->location = $args['post_id'];
            $this->identifier = 'post_id';
        } elseif (isset($args['term_id'])) {
            $this->belongsTo = MetaTypes::TAXONOMY;
            $this->location = $args['term_id'];
            $this->identifier = 'term_id';
        } elseif (isset($args['user_id'])) {
            $this->belongsTo = MetaTypes::USER;
            $this->location = $args['user_id'];
            $this->identifier = 'user_id';
        } elseif (isset($args['comment_id'])) {
            $this->belongsTo = MetaTypes::COMMENT;
            $this->location = $args['comment_id'];
            $this->identifier = 'comment_id';
        }

        if ($this->belongsTo === null && $this->location === null) {
            throw new \Exception("BelongsTo and location are null. Invalid args provided");
        }
    }

    /**
     * @param string $key
     * @param string|null $location
     *
     * @return mixed|void
     */
    protected function get(string $key, ?string $location = null)
    {
        // @phpstan-ignore-next-line ternary.alwaysFalse
        $loc = $location ? $location : $this->location;

        if ($this->fieldModel->isAWooCommerceProductAttribute()) {
            $key = "wc_attribute_" . $key . "_" . $this->args['wc_product_attribute'];
        }

        $fetched = Meta::fetch($loc, $this->belongsTo, $key);

        if ($fetched === null) {
            $key = $loc.'_'.$key;

            return Meta::fetch($loc, $this->belongsTo, $key);
        }

        return $fetched;
    }

    /**
     * @param string $key
     *
     * @return mixed|void
     */
    protected function getData(string $key = '')
    {
        return $this->get($this->fieldModel->getDbName().$key);
    }

    /**
     * @param string $key
     * @param mixed $value
     * @param string|null $location
     * @param bool $slashed false when $value is not slashed, so its backslashes are kept
     *
     * @return bool
     */
    protected function set(string $key, $value, ?string $location = null, bool $slashed = true): bool
    {
        // @phpstan-ignore-next-line ternary.alwaysFalse
        $loc = $location ?: $this->location;

        if ($this->fieldModel->isAWooCommerceProductAttribute()) {
            $key = "wc_attribute_" . $key . "_" . $this->args['wc_product_attribute'];
        }

        return Meta::save($loc, $this->belongsTo, $key, $value, $slashed);
    }
}
