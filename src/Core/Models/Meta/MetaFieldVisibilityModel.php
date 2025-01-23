<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Constants\Logic;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Utils\PHP\JSON;

class MetaFieldVisibilityModel extends AbstractModel implements \JsonSerializable
{
    const TYPES = [
        'VALUE',
        'POST_ID',
        'TERM_ID',
        'TAXONOMY',
        'OTHER_FIELDS',
    ];

    /**
     * @var MetaFieldModel
     */
    private MetaFieldModel $metaField;

    /**
     * @var array
     */
    private array $type = [];

    /**
     * @var string
     */
    private string $operator;

    /**
     * @var string
     */
    private string $value;

	/**
	 * @var string|null
	 */
    private ?string $logic = null;

    /**
     * @var int
     */
    private int $sort;

	/**
	 * @var bool
	 */
    private bool $backEnd;

	/**
	 * @var bool
	 */
    private bool $frontEnd;

	/**
	 * MetaFieldVisibilityModel constructor.
	 *
	 * @param string $id
	 * @param MetaFieldModel $metaField
	 * @param array $type
	 * @param string $operator
	 * @param string $value
	 * @param int $sort
	 * @param string|null $logic
	 * @param bool $backEnd
	 * @param bool $frontEnd
	 *
	 * @throws \Exception
	 */
    public function __construct(
	    string $id,
        MetaFieldModel $metaField,
	    array $type,
	    string $operator,
	    string $value,
        int $sort,
        ?string $logic = null,
	    bool $backEnd = true,
	    bool $frontEnd = true
    )
    {
        parent::__construct($id);
        $this->setType($type);
        $this->setOperator($operator);
        $this->setLogic($logic);
        $this->metaField = $metaField;
        $this->value     = $value;
        $this->sort = $sort;
        $this->backEnd = $backEnd;
        $this->frontEnd = $frontEnd;
    }

    /**
     * @return MetaFieldModel
     */
    public function getMetaField() {
        return $this->metaField;
    }

    /**
     * @param $logic
     *
     * @throws \Exception
     */
    private function setLogic($logic)
    {
        if(!in_array($logic, Logic::ALLOWED_VALUES)){
            throw new \Exception($logic . ' is not a valid logic');
        }

        $this->logic = $logic;
    }

    /**
     * @param array $type
     * @example ["type" => "TAXONOMY", "value" => 3]
     *
     * @throws \Exception
     */
    private function setType(array $type)
    {
        if(!isset($type['type'])){
            throw new \Exception('Type is not a valid type');
        }

        if(!in_array($type['type'], self::TYPES)){
            throw new \Exception($type . ' is not a valid type');
        }

        $this->type = $type;
    }

    /**
     * @param $operator
     *
     * @throws \Exception
     */
    private function setOperator($operator)
    {
        if(!in_array($operator, Operator::ALLOWED_VALUES)){
            throw new \Exception($operator . ' is not a valid operator');
        }

        $this->operator = $operator;
    }

    /**
     * @return array
     */
    public function getType()
    {
        return $this->type;
    }

	/**
	 * Needed by UI
	 *
	 * @return string
	 */
    public function getTypeForUI()
    {
    	if($this->type['value'] instanceof MetaFieldModel){
		    $this->type['value'] = $this->type['value']->getId();
	    }

		return JSON::arrayToEscapedJson($this->type);
    }

    /**
     * @return string
     */
    public function getOperator()
    {
        return $this->operator;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @return string|null
     */
    public function getLogic()
    {
        return $this->logic;
    }

    /**
     * @return int
     */
    public function getSort()
    {
        return $this->sort;
    }

	/**
	 * @return bool
	 */
	public function isBackEnd(): bool
	{
		return $this->backEnd;
	}

	/**
	 * @return bool
	 */
	public function isFrontEnd(): bool
	{
		return $this->frontEnd;
	}

	#[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'boxId' => $this->getMetaField()->getBox()->getId(),
            'fieldId' => $this->getMetaField()->getId(),
            'type' => $this->getTypeForUI(),
            'operator' => $this->getOperator(),
            'value' => $this->getValue(),
            'logic' => $this->getLogic(),
            'sort' => (int)$this->sort,
            'backEnd' => $this->isBackEnd(),
            'frontEnd' => $this->isFrontEnd(),
        ];
    }

	/**
	 * @param MetaFieldModel $duplicateFrom
	 *
	 * @return MetaFieldVisibilityModel
	 */
	public function duplicateFrom( MetaFieldModel $duplicateFrom ): MetaFieldVisibilityModel
	{
		$duplicate            = clone $this;
		$duplicate->id        = Uuid::v4();
		$duplicate->metaField = $duplicateFrom;

		return $duplicate;
	}

	/**
	 * @inheritDoc
	 */
	public static function validationRules(): array
	{
		return [
			'id' => [
				'required' => false,
				'type' => 'string',
			],
			'metaField' => [
				'required' => false,
				'type' => 'object',
				'instanceOf' => MetaFieldModel::class
			],
			'boxId' => [
				'required' => false,
				'type' => 'string',
			],
			'fieldId' => [
				'required' => false,
				'type' => 'string',
			],
			'type' => [
				'required' => true,
				'type' => 'array',
			],
			'operator' => [
				'required' => true,
				'type' => 'string',
				'enum' => Operator::ALLOWED_VALUES,
			],
			'value' => [
				'required' => true,
				'type' => 'string|integer',
			],
			'logic' => [
				'required' => false,
				'type' => 'string',
				'enum' => [
					Logic::BLANK,
					Logic::AND,
					Logic::OR,
				],
			],
			'sort' => [
				'required' => false,
				'type' => 'string|integer',
			],
			'backEnd' => [
				'required' => false,
				'type' => 'boolean',
			],
			'frontEnd' => [
				'required' => false,
				'type' => 'boolean',
			],
		];
	}
}