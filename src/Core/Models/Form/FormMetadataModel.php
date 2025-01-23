<?php

namespace ACPT_Lite\Core\Models\Form;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

class FormMetadataModel extends AbstractModel implements \JsonSerializable
{
	/**
	 * @var string
	 */
	private string $formId;

	/**
	 * @var string
	 */
	private string $key;

	/**
	 * @var string
	 */
	private string $value;

	/**
	 * FormMetadataModel constructor.
	 *
	 * @param string $id
	 * @param string $formId
	 * @param string $key
	 * @param string $value
	 */
	public function __construct(
		string $id,
		string $formId,
		string $key,
		string $value
	) {
		parent::__construct($id);
		$this->formId = $formId;
		$this->key = $key;
		$this->value = $value;
	}

	/**
	 * @return string
	 */
	public function getFormId(): string
	{
		return $this->formId;
	}

	/**
	 * @return string
	 */
	public function getKey(): string
	{
		return $this->key;
	}

	/**
	 * @return mixed
	 */
	public function getValue()
	{
		if(is_numeric($this->value)){
			return (int)$this->value;
		}

		return $this->value;
	}

	/**
	 * @return mixed
	 */
	public function getFormattedValue()
	{
		if($this->getKey() === 'fill_meta_fields' and is_serialized($this->getValue())){
			return unserialize($this->getValue());
		}

		return $this->getValue();
	}

    /**
     * @param FormModel $formModel
     * @return FormMetadataModel
     */
    public function duplicateFrom(FormModel $formModel)
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->formId = $formModel->getId();

        return $duplicate;
    }

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->getId(),
			'formId' => $this->getFormId(),
			'key' => $this->getKey(),
			'value' => $this->getFormattedValue(),
		];
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
			'formId' => [
				'required' => true,
				'type' => 'string',
			],
			'key' => [
				'required' => true,
				'type' => 'string',
			],
			'value' => [
				'required' => true,
				'type' => 'string',
			],
		];
	}
}