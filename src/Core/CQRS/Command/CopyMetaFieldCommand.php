<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PHP\Arrays;
use Exception;

class CopyMetaFieldCommand extends AbstractCopyCommand implements CommandInterface
{
    /**
     * @var string
     */
    private string $fieldId;

    /**
     * @var string
     */
    private string $targetEntityId;

    /**
     * @var string
     */
    private string $targetEntityType;

    /**
     * @var bool
     */
    private bool $delete;

    /**
     * @var int|null
     */
    private ?int $position = null;

    /**
     * CopyMetaFieldCommand constructor.
     *
     * @param array<string, mixed> $data
     */
    public function __construct(array $data)
    {
        parent::__construct();
        $validationRules = [
            'fieldId' => [
                'required' => true,
                'type' => 'string',
            ],
            'targetEntityId' => [
                'required' => true,
                'type' => 'string',
            ],
            'targetEntityType' => [
                'required' => true,
                'type' => 'string',
                'enum' => [
                    'box',
                    'field',
                    'block',
                ]
            ],
            'delete' => [
                'required' => false,
                'type' => 'boolean',
            ],
            'position' => [
                'required' => false,
                'type' => 'string|integer',
            ],
        ];

        $validator = new ArgumentsArrayValidator();

        if (!$validator->validate($validationRules, $data)) {
            throw new \InvalidArgumentException($validator->errorMessage());
        }

        $this->fieldId = (string)$data['fieldId'];
        $this->targetEntityType = (string)$data['targetEntityType'];
        $this->targetEntityId = (string)$data['targetEntityId'];
        $this->delete = isset($data['delete']) && (bool)$data['delete'];
        $this->position = isset($data['position']) ? (int)$data['position'] : null;
    }

    /**
     * @return void
     * @throws Exception
     */
    public function execute(): void
    {
        $metaBoxField = MetaRepository::getMetaFieldById($this->fieldId);

        if (empty($metaBoxField)) {
            throw new Exception('Meta field was not found. If you haven\'t saved the field yet, please SAVE it and then try to copy.');
        }

        switch ($this->targetEntityType) {
                // copy a field inside a nestable field
            case "field":
                $targetFieldModel = MetaRepository::getMetaFieldById($this->targetEntityId);

                if (empty($targetFieldModel)) {
                    throw new Exception('Target meta field was not found');
                }

                $duplicatedMetaField = $this->copyField($metaBoxField, $targetFieldModel->getBox());
                $duplicatedMetaField->changeSort(Arrays::count($targetFieldModel->getBox()->getFields())+1);

                if ($this->position !== null) {
                    $duplicatedMetaField->changeSort($this->position+1);

                    foreach ($targetFieldModel->getBox()->getFields() as $sort => $field) {
                        $newSort = ($sort > $this->position) ? $sort+1 : $sort;
                        $field->changeSort($newSort);
                        MetaRepository::saveMetaBoxField($field);
                    }
                }

                switch ($targetFieldModel->getType()) {
                }

                $this->saveMetaField($duplicatedMetaField);

                break;

                // copy a field inside a box
            case "box":
                $targetBoxModel = MetaRepository::getMetaBoxById($this->targetEntityId);

                if (empty($targetBoxModel)) {
                    throw new Exception('Target meta box was not found');
                }

                $duplicatedMetaField = $this->copyField($metaBoxField, $targetBoxModel);
                $duplicatedMetaField->changeSort(Arrays::count($targetBoxModel->getFields())+1);

                if ($this->position !== null) {
                    $duplicatedMetaField->changeSort($this->position+1);

                    foreach ($targetBoxModel->getFields() as $sort => $field) {
                        $newSort = ($sort > $this->position) ? $sort+1 : $sort;
                        $field->changeSort($newSort);
                        MetaRepository::saveMetaBoxField($field);
                    }
                }

                $duplicatedMetaField->setBlockId(null);
                $duplicatedMetaField->setParentId(null);
                $this->saveMetaField($duplicatedMetaField);

                break;
        }
    }

    /**
     * @param MetaFieldModel $fieldModel
     *
     * @throws Exception
     */
    private function saveMetaField(MetaFieldModel $fieldModel): void
    {
        ACPT_Lite_DB::startTransaction();

        MetaRepository::saveMetaBoxField($fieldModel);

        if ($this->delete) {
            MetaRepository::deleteMetaField($this->fieldId);
        }

        ACPT_Lite_DB::commitTransaction();
    }
}
