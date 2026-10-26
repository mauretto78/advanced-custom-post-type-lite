<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Constants\MetaBox;
use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Contracts\VisibilityInterface;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Traits\BelongsToTrait;
use ACPT_Lite\Core\Traits\VisibilityTrait;
use ACPT_Lite\Utils\PHP\Request;

class MetaGroupModel extends AbstractModel implements \JsonSerializable, VisibilityInterface
{
    use BelongsToTrait;
    use VisibilityTrait;

    /**
     * @var string
     */
    private string $name;

    /**
     * @var string|null
     */
    private ?string $label = null;

    /**
     * @var string|null
     */
    private ?string $display = MetaGroupDisplay::STANDARD;

    /**
     * @var string|null
     */
    private ?string $context = null;

    /**
     * @var string|null
     */
    private ?string $priority = null;

    /**
     * @var BelongModel[]
     */
    private array $belongs;

    /**
     * @var MetaBoxModel[]
     */
    private array $boxes;

    private bool $isCCTCopy = false;

    /**
     * MetaGroup constructor.
     *
     * @param string $id
     * @param string $name
     * @param string|null $label
     * @param string|null $display
     */
    public function __construct(
        string $id,
        string $name,
        ?string $label = null,
        ?string $display = null
    ) {
        if (!Strings::alphanumericallyValid($name)) {
            throw new \DomainException($name . ' is not valid name');
        }

        if (!empty($display) && !in_array($display, [
            MetaGroupDisplay::STANDARD,
            MetaGroupDisplay::ACCORDION,
            MetaGroupDisplay::VERTICAL_TABS,
            MetaGroupDisplay::HORIZONTAL_TABS,
        ])) {
            throw new \DomainException($display . ' is not valid display value');
        }

        parent::__construct($id);
        $this->name = $name;
        $this->label = $label;
        $this->display = $display;
        $this->boxes = [];
        $this->belongs = [];
    }

    public function setIsCCTCopy(bool $isCctCopy): void
    {
        $this->isCCTCopy = $isCctCopy;
    }

    public function isCCTCopy(): bool
    {
        return $this->isCCTCopy;
    }

    /**
     * @param string $name
     */
    public function changeName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string|null
     */
    public function getLabel(): ?string
    {
        return $this->label;
    }

    /**
     * @return string|null
     */
    public function getDisplay(): ?string
    {
        return $this->display;
    }

    /**
     * @return string
     */
    public function getUIName(): string
    {
        if ($this->getLabel()) {
            return $this->getLabel();
        }

        return $this->getName();
    }

    /**
     * @return BelongModel[]
     */
    public function getBelongs(): array
    {
        return $this->belongs;
    }

    /**
     * @param BelongModel $belong
     */
    public function addBelong(BelongModel $belong): void
    {
        if (!$this->existsInCollection($belong->getId(), $this->belongs)) {
            $this->belongs[] = $belong;
        }
    }

    /**
     * @param BelongModel $belongModel
     */
    public function removeBelong(BelongModel $belongModel): void
    {
        $this->belongs = $this->removeFromCollection($belongModel->getId(), $this->belongs);
    }

    /**
     * @return array<int, MetaBoxModel>
     */
    public function getBoxes(): array
    {
        return $this->boxes;
    }

    /**
     * @param string|null $id
     *
     * @return MetaBoxModel|null
     */
    public function getBoxById(?string $id): ?MetaBoxModel
    {
        if ($id === null) {
            return null;
        }

        foreach ($this->getBoxes() as $box) {
            if ($id === $box->getId()) {
                return $box;
            }
        }

        return null;
    }

    /**
     * @param string $name
     *
     * @return MetaBoxModel|null
     */
    public function getBox(string $name): ?MetaBoxModel
    {
        foreach ($this->getBoxes() as $box) {
            if ($name === $box->getName()) {
                return $box;
            }
        }

        return null;
    }

    /**
     * @param MetaBoxModel $box
     */
    public function addBox(MetaBoxModel $box): void
    {
        if (!$this->existsInCollection($box->getId(), $this->boxes)) {
            $this->boxes[] = $box;
        }
    }

    /**
     * @param MetaBoxModel $box
     */
    public function removeBox(MetaBoxModel $box): void
    {
        $this->boxes = $this->removeFromCollection($box->getId(), $this->boxes);
    }

    /**
     * @return int
     */
    private function getFieldsCount(): int
    {
        $count = 0;

        foreach ($this->getBoxes() as $boxModel) {
            $count = $count + count(array_filter($boxModel->getFields(), function (MetaFieldModel $field) {
                return $field->getForgedBy() === null;
            }));
        }

        return $count;
    }

    /**
     * @return string
     */
    public function getContext()
    {
        return $this->context;
    }

    /**
     * @param string $context
     *
     * @throws \Exception
     */
    public function setContext(string $context): void
    {
        $allowedValues = [
            MetaBox::CONTEXT_ADVANCED,
            MetaBox::CONTEXT_NORMAL,
            MetaBox::CONTEXT_SIDE,
        ];

        if (!in_array($context, $allowedValues)) {
            throw new \Exception("Context is not valid");
        }

        $this->context = $context;
    }

    /**
     * @return string
     */
    public function getPriority()
    {
        return $this->priority;
    }

    /**
     * @return MetaGroupModel
     */
    public function duplicate(): MetaGroupModel
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->changeName(Strings::getTheFirstAvailableName($duplicate->getName(), MetaRepository::getGroupNames()));

        $belongs = $duplicate->getBelongs();
        $duplicate->belongs = [];

        foreach ($belongs as $belongsModel) {
            $duplicate->belongs[] = $belongsModel->duplicate();
        }

        $boxes = $duplicate->getBoxes();
        $duplicate->boxes = [];

        foreach ($boxes as $boxModel) {
            $duplicate->boxes[] = $boxModel->duplicateFrom($duplicate);
        }

        return $duplicate;
    }

    /**
     * @param string $priority
     *
     * @throws \Exception
     */
    public function setPriority(string $priority): void
    {
        $allowedValues = [
            MetaBox::PRIORITY_CORE,
            MetaBox::PRIORITY_DEFAULT,
            MetaBox::PRIORITY_HIGH,
            MetaBox::PRIORITY_LOW,
        ];

        if (!in_array($priority, $allowedValues)) {
            throw new \Exception("Priority is not valid");
        }

        $this->priority = $priority;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->getId(),
            'isCCTCopy' => false,
            'name' => $this->getName(),
            'label' => $this->getLabel(),
            'display' => $this->getDisplay(),
            'UIName' => $this->getUIName(),
            'belongs' => $this->getBelongs(),
            "fieldsCount" => $this->getFieldsCount(),
            'boxes' => $this->getBoxes(),
            'context' => $this->getContext(),
            'priority' => $this->getPriority(),
        ];
    }

    /**
     * @inheritDoc
     * @return array<string, array<string, mixed>>
     */
    public static function validationRules(): array
    {
        return [
            'id' => [
                'required' => false,
                'type' => 'string',
            ],
            'name' => [
                'required' => true,
                'type' => 'string',
            ],
            'new_name' => [
                'required' => false,
                'type' => 'string',
            ],
            'UIName' => [
                'required' => false,
                'type' => 'string',
            ],
            'fieldsCount' => [
                'required' => false,
                'type' => 'string|integer',
            ],
            'label' => [
                'required' => false,
                'type' => 'string',
            ],
            'display' => [
                'required' => false,
                'type' => 'string',
            ],
            'belongs' => [
                'required' => false,
                'type' => 'array',
            ],
            'boxes' => [
                'required' => false,
                'type' => 'array',
            ],
            'context' => [
                'required' => false,
                'type' => 'string',
            ],
            'priority' => [
                'required' => false,
                'type' => 'string',
            ],
            'IsCCTCopy' => [
                'required' => false,
                'type' => 'boolean',
            ],
        ];
    }

    /**
     * This method is a helper to check the visibility of a meta group.
     * Constrains can be passed by reference of got from Request.
     *
     * This method is also used by get_acpt_fields() function
     *
     * @param array<string, mixed> $args
     * @param Request|null $request
     *
     * @return bool
     */
    public function isVisible(array $args = [], ?Request $request = null): bool
    {
        try {
            $request = $request ?? Request::fromGlobals();
            $belongs = $this->getBelongs();

            return $this->evaluateVisibilityFromLocationRules($request, $belongs, $args);
        } catch (\Throwable $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}
