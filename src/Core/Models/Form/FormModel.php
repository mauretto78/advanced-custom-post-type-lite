<?php

namespace ACPT_Lite\Core\Models\Form;

use ACPT_Lite\Constants\FormAction;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Repository\FormRepository;

class FormModel extends AbstractModel implements \JsonSerializable
{
	/**
	 * @var string
	 */
	private string $name;

	/**
	 * @var string
	 */
	private ?string $label = null;

	/**
	 * @var string
	 */
	private string $action;

	/**
	 * @var string
	 */
	private string $key;

	/**
	 * @var FormFieldModel[]
	 */
	private array $fields;

	/**
	 * @var FormMetadataModel[]
	 */
	private array $meta;

	/**
	 * FormModel constructor.
	 *
	 * @param string $id
	 * @param string $name
	 * @param string $key
	 * @param string $action
	 * @param string|null $label
	 */
	public function __construct(
		string $id,
		string $name,
		string $key,
		string $action,
		?string $label = null
	) {
		if(!Strings::alphanumericallyValid($name)){
			throw new \DomainException($name . ' is not valid name');
		}

		if(!in_array($action, FormAction::ALLOWED_VALUES)){
			throw new \DomainException($action . ' is not valid action');
		}

		parent::__construct($id);
		$this->name   = $name;
		$this->label  = $label;
		$this->key    = $key;
		$this->action = $action;
		$this->fields = [];
		$this->meta   = [];
	}

	/**
	 * @return string
	 */
	public function getName(): string
	{
		return $this->name;
	}

	/**
	 * @param string $name
	 */
	public function changeName( string $name ): void
	{
		$this->name = $name;
	}

	/**
	 * @return string|null
	 */
	public function getLabel(): ?string
	{
		return $this->label;
	}

	/**
	 * @param string $label
	 */
	public function changeLabel( string $label ): void
	{
		$this->label = $label;
	}

	/**
	 * @return string
	 */
	public function getKey(): string
	{
		return $this->key;
	}

	public function regenerateKey(): void
	{
		$this->key = Strings::randomString(8);
	}

	/**
	 * @return string
	 */
	public function getAction(): string
	{
		return $this->action;
	}

	/**
	 * @return FormFieldModel[]
	 */
	public function getFields(): array
	{
		$belong = $this->getMetaDatum('fill_meta_location_belong');
		$find = $this->getMetaDatum('fill_meta_location_find');

		$fields = [];

		foreach ($this->fields as $field){

			if($belong !== null){
				$field->setBelong($belong->getValue());
			}

			if($find !== null){
				$field->setFind($find->getValue());
			}

			$fields[] = $field;
		}

		return $fields;
	}

	/**
	 * @param $fieldName
	 *
	 * @return FormFieldModel|null
	 */
	public function getAField($fieldName): ?FormFieldModel
	{
		foreach($this->getFields() as $fieldIndex => $field) {
			if($field->getName() === $fieldName){
				return $field;
			}
		}

		return null;
	}

	public function resetFields()
	{
		$this->fields = [];
	}

	/**
	 * @param FormFieldModel $field
	 */
	public function addField(FormFieldModel $field)
	{
		if(!$this->existsInCollection($field->getId(), $this->fields)){
			$this->fields[] = $field;
		}
	}

	/**
	 * @param FormFieldModel $field
	 */
	public function removeField(FormFieldModel $field)
	{
		$this->fields = $this->removeFromCollection($field->getId(), $this->fields);
	}

	/**
	 * @param $fieldName
	 */
	public function removeAField($fieldName)
	{
		foreach($this->getFields() as $fieldIndex => $field) {
			if($field->getName() === $fieldName){
				$this->removeField($field);
			}
		}
	}

	/**
	 * @return int
	 */
	private function getFieldsCount(): int
	{
		return count($this->getFields());
	}

	/**
	 * @return FormMetadataModel[]
	 */
	public function getMeta(): array
	{
		return $this->meta;
	}

	/**
	 * @param $key
	 *
	 * @return FormMetadataModel|null
	 */
	public function getMetaDatum($key): ?FormMetadataModel
	{
		foreach ($this->getMeta() as $metadataModel){
			if($metadataModel->getKey() === $key){
				return $metadataModel;
			}
		}

		return null;
	}

	/**
	 * @param FormMetadataModel $data
	 */
	public function addMetadata(FormMetadataModel $data)
	{
		if(!$this->existsInCollection($data->getId(), $this->meta)){
			$this->meta[] = $data;
		}
	}

	/**
	 * @param FormMetadataModel $data
	 */
	public function removeMeta(FormMetadataModel $data)
	{
		$this->meta = $this->removeFromCollection($data->getId(), $this->meta);
	}

    /**
     * @return FormModel
     */
    public function duplicate(): FormModel
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->regenerateKey();
        $duplicate->changeName(Strings::getTheFirstAvailableName($duplicate->getName(), FormRepository::getNames()));

        $fields = $duplicate->getFields();
        $meta = $duplicate->getMeta();
        $duplicate->meta = [];
        $duplicate->fields = [];

        foreach ($fields as $fieldModel){
            $duplicate->fields[] = $fieldModel->duplicateFrom($duplicate);
        }

        foreach ($meta as $metaModel){
            $duplicate->meta[] = $metaModel->duplicateFrom($duplicate);
        }

        return $duplicate;
    }

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->getId(),
			'name' => $this->getName(),
			'label' => $this->getLabel(),
			'key' => $this->getKey(),
			'action' => $this->getAction(),
			'fields' => $this->getFields(),
			"fieldsCount" => $this->getFieldsCount(),
			'meta' => $this->getMeta(),
		];
	}

	/**
	 * @return array
	 */
	public function arrayRepresentation(): array
	{
		return [
			'id' => $this->getId(),
			'name' => $this->getName(),
			'label' => $this->getLabel(),
			'key' => $this->getKey(),
			'action' => $this->getAction(),
			'fields' => $this->getFields(),
			"fieldsCount" => $this->getFieldsCount(),
			'meta' => $this->getMeta(),
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
			'key' => [
				'required' => false,
				'type' => 'string',
			],
			'name' => [
				'required' => true,
				'type' => 'string',
			],
			'label' => [
				'required' => false,
				'type' => 'string',
			],
			'action' => [
				'required' => true,
				'type' => 'string',
				'enum' => [
					FormAction::EMAIL,
					FormAction::PHP,
					FormAction::AJAX,
					FormAction::CUSTOM,
					FormAction::FILL_META,
				],
			],
			'fields' => [
				'required' => false,
				'type' => 'array',
			],
			'meta' => [
				'required' => false,
				'type' => 'array',
			]
		];
	}
}