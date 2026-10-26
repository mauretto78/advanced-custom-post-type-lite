<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PHP\Arrays;

class CopyMetaBoxCommand extends AbstractCopyCommand implements CommandInterface
{
    /**
     * @var string
     */
    private string $boxId;

    /**
     * @var string
     */
    private string $targetGroupId;

    /**
     * @var bool
     */
    private bool $delete;

    /**
     * @var int|null
     */
    private ?int $position = null;

    /**
     * CopyMetaBoxCommand constructor.
     *
     * @param array<string, mixed> $data
     */
    public function __construct(array $data)
    {
        parent::__construct();
        $validationRules = [
            'boxId' => [
                'required' => true,
                'type' => 'string',
            ],
            'targetGroupId' => [
                'required' => true,
                'type' => 'string',
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

        $this->boxId = (string)$data['boxId'];
        $this->targetGroupId = (string)$data['targetGroupId'];
        $this->delete = isset($data['delete']) && (bool)$data['delete'];
        $this->position = isset($data['position']) ? (int)$data['position'] : null;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute(): void
    {
        $targetMetaGroup = MetaRepository::get([
            'id' => $this->targetGroupId
        ]);

        if (empty($targetMetaGroup)) {
            throw new \Exception("Group id not found");
        }

        $metaBox = MetaRepository::getMetaBoxById($this->boxId);

        if (empty($metaBox)) {
            throw new \Exception("Box id not found");
        }

        $duplicatedMetaBox = $this->copyBox($metaBox, $targetMetaGroup[0]);
        $duplicatedMetaBox->changeSort(Arrays::count($targetMetaGroup[0]->getBoxes())+1);

        if ($this->position !== null) {
            $duplicatedMetaBox->changeSort($this->position+1);

            foreach ($targetMetaGroup[0]->getBoxes() as $sort => $box) {
                $newSort = ($sort > $this->position) ? $sort+1 : $sort;
                $box->changeSort($newSort);
                MetaRepository::saveMetaBox($box);
            }
        }

        ACPT_Lite_DB::startTransaction();

        MetaRepository::saveMetaBox($duplicatedMetaBox);

        if ($this->delete) {
            MetaRepository::deleteMetaBoxById([
                'id' => $this->boxId,
            ]);
        }

        ACPT_Lite_DB::commitTransaction();
    }
}
