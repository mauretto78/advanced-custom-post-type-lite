<?php

namespace ACPT_Lite\Core\Models\Belong;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\Logic;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

class BelongModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private string $belongsTo;

    /**
     * @var string|null
     */
    private ?string $operator = null;

    /**
     * @var int
     */
    private int $sort;

    /**
     * @var string|null
     */
    private ?string $logic = null;

    /**
     * @var string|null
     */
    private ?string $find = null;

    /**
     * BelongModel constructor.
     *
     * @param string $id
     * @param string $belongsTo
     * @param int $sort
     * @param string|null $logic
     * @param string|null $operator
     * @param string|null $find
     *
     * @throws \Exception
     */
    public function __construct(
        string $id,
        string $belongsTo,
        int $sort,
        ?string $logic = null,
        ?string $operator = null,
        ?string $find = null
    ) {
        parent::__construct($id);
        $this->setBelongsTo($belongsTo);

        if ($belongsTo !== MetaTypes::USER && $belongsTo !== MetaTypes::COMMENT) {
            $this->setOperator($operator);
        }

        $this->setLogic($logic);
        $this->find = $find;
        $this->sort = $sort;
    }

    /**
     * @param string $belongsTo
     */
    private function setBelongsTo(string $belongsTo): void
    {
        if (!in_array($belongsTo, BelongsTo::ALLOWED_FORMATS)) {
            throw new \DomainException($belongsTo . ' is not allowed');
        }

        $this->belongsTo = $belongsTo;
    }

    /**
     * @return string
     */
    public function getBelongsTo(): string
    {
        return $this->belongsTo;
    }

    /**
     * @return string|null
     */
    public function getOperator(): ?string
    {
        return $this->operator;
    }

    /**
     * @param string|null $operator
     */
    private function setOperator(?string $operator = null): void
    {
        if (!empty($operator)) {
            $allowedOperators = [
                Operator::EQUALS,
                Operator::NOT_EQUALS,
                Operator::IN,
                Operator::NOT_IN,
            ];

            if (!in_array($operator, $allowedOperators)) {
                throw new \DomainException($operator . ' is not allowed');
            }

            $this->operator = $operator;
        }
    }

    /**
     * @return string|null
     */
    public function getLogic(): ?string
    {
        return $this->logic;
    }

    /**
     * @param string|null $logic
     *
     * @throws \Exception
     *
     * @return void
     */
    private function setLogic(?string $logic = null): void
    {
        if (empty($logic)) {
            return;
        }

        if (!in_array($logic, Logic::ALLOWED_VALUES)) {
            throw new \Exception($logic . ' is not a valid logic');
        }

        $this->logic = $logic;
    }

    /**
     * @return string|null
     */
    public function getFind(): ?string
    {
        return $this->find;
    }

    /**
     * @param int $sort
     * @return void
     */
    public function changeSort(int $sort): void
    {
        $this->sort = $sort;
    }

    /**
     * @return int
     */
    public function getSort(): int
    {
        return $this->sort;
    }

    public function duplicate(): BelongModel
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();

        return $duplicate;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->getId(),
            'belongsTo' => $this->getBelongsTo(),
            'operator' => $this->getOperator(),
            'find' => $this->getFind(),
            'logic' => $this->getLogic(),
            'sort' => $this->getSort(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function validationRules(): array
    {
        return [
            'id' => [
                'required' => false,
                'type' => 'string',
            ],
            'belongsTo' => [
                'required' => true,
                'type' => 'string',
                'enum' => [
                    BelongsTo::PARENT_POST_ID,
                    BelongsTo::POST_ID,
                    BelongsTo::POST_CAT,
                    BelongsTo::POST_TAX,
                    BelongsTo::POST_TEMPLATE,
                    BelongsTo::POST_FORMAT,
                    BelongsTo::USER_ID,
                    BelongsTo::TERM_ID,
                    MetaTypes::CUSTOM_POST_TYPE,
                    MetaTypes::TAXONOMY,
                    MetaTypes::MEDIA,
                    MetaTypes::COMMENT,
                    MetaTypes::USER,
                ],
            ],
            'operator' => [
                'required' => false,
                'type' => 'string',
                'enum' => [
                    '',
                    Operator::EQUALS,
                    Operator::NOT_EQUALS,
                    Operator::IN,
                    Operator::NOT_IN,
                ],
            ],
            'find' => [
                'required' => false,
                'type' => 'array|string|integer',
            ],
            'logic' => [
                'required' => false,
                'type' => 'string',
                'enum' => Logic::ALLOWED_VALUES,
            ],
            'sort' => [
                'required' => false,
                'type' => 'string|integer',
            ],
        ];
    }

    /**
     * @return string|null
     */
    public function getFindAsSting(): ?string
    {
        $belongsTo = $this->getBelongsTo();
        $explodedFind = explode(",", $this->getFind());
        $find = [];

        switch ($belongsTo) {
            case BelongsTo::PARENT_POST_ID:
            case BelongsTo::POST_ID:
                foreach ($explodedFind as $f) {
                    $find[] = get_the_title((int)$f);
                }
                break;

            case BelongsTo::TERM_ID:
            case BelongsTo::POST_TAX:
                foreach ($explodedFind as $f) {
                    $term = get_term((int)$f);
                    $find[] = ($term instanceof \WP_Term) ? $term->name : $f;
                }
                break;

            case BelongsTo::POST_CAT:
                foreach ($explodedFind as $f) {
                    $catName = get_cat_name((int)$f);
                    $find[] = (!empty($catName)) ? $catName : $f;
                }
                break;

            case BelongsTo::POST_TEMPLATE:
                foreach ($explodedFind as $f) {
                    $templates = wp_get_theme()->get_page_templates();
                    $find[] = (isset($templates[$f])) ? $templates[$f] : $f;
                }
                break;

            case BelongsTo::POST_FORMAT:
                foreach ($explodedFind as $f) {
                    $formats = get_post_format_strings();
                    $find[] = (isset($formats[$f])) ? $formats[$f] : $f;
                }
                break;

            case BelongsTo::USER_ID:
                foreach ($explodedFind as $f) {
                    $user = get_user_by('id', $f);
                    $find[] = ($user instanceof \WP_User) ? $user->display_name : $f;
                }
                break;

            case MetaTypes::USER:
                $find = ["users"];
                break;

            default:
                $find = $explodedFind;
                break;
        }

        return implode(", ", $find);
    }
}
