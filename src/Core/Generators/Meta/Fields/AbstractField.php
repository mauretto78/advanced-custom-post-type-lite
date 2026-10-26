<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Permissions;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldOptionModel;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\PHP\Session;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

abstract class AbstractField
{
    public const ERRORS_SESSION_KEY = 'meta_field_errors';

    /**
     * @var MetaFieldModel
     */
    protected MetaFieldModel $metaField;

    /**
     * @var MetaFieldModel|null
     */
    protected ?MetaFieldModel $parentMetaField = null;

    /**
      * @var null
     */
    protected $parentBlock = null;

    /**
     * @var string|null
     */
    protected ?string $belongsTo = null;

    /**
     * @var string|null
     */
    protected ?string $find = null;

    /**
     * @var int|null
     */
    protected ?int $index = null;

    /**
     * @var mixed
     */
    protected $value;

    /**
     * @var string|null
     */
    protected ?string $parentName = null;

    /**
     * @var int
     */
    protected int $blockIndex;

    /**
     * @var array<mixed>|null
     */
    protected ?array $externalPermissions = null;

    /**
     * @var string
     */
    protected string $permissions;

    /**
     * @var string|null
     */
    protected ?string $cloneFieldId = null;

    /**
     * @var int|null
     */
    protected ?int $WooCommerceLoopIndex = null;

    /**
     * @var bool
     */
    private bool $noShowLabel = false;

    /**
     * AbstractField constructor.
     * @param MetaFieldModel $metaField
     * @param string|null $belongsTo
     * @param string|null $find
     * @param int|null $index
     * @param mixed $value
     * @param string|null $parentName
     * @param int $blockIndex
     * @param string|null $cloneFieldId
     * @throws \Exception
     */
    public function __construct(
        MetaFieldModel $metaField,
        ?string $belongsTo,
        ?string $find,
        ?int $index = 0,
        $value = null,
        ?string $parentName = null,
        int $blockIndex = 0,
        ?string $cloneFieldId = null
    ) {
        $this->metaField = $metaField;
        $this->belongsTo = $belongsTo;
        $this->find = $find;
        $this->value = $value;
        $this->parentName = $parentName;
        $this->index = $index;
        $this->blockIndex = $blockIndex;
        $this->cloneFieldId = $cloneFieldId;
        $this->noShowLabel = false;

        $this->setPermissions();
    }

    /**
     * @param bool $noShowLabel
     *
     * @return void
     */
    public function setNoShowLabel(bool $noShowLabel): void
    {
        $this->noShowLabel = $noShowLabel;
    }

    /**
     * @param mixed $value
     *
     * @return void
     */
    public function setValue($value): void
    {
        $this->value = $value;
    }

    /**
     * @param int|null $WooCommerceLoopIndex
     *
     * @return void
     */
    public function setWooCommerceLoopIndex($WooCommerceLoopIndex): void
    {
        $this->WooCommerceLoopIndex = $WooCommerceLoopIndex;
    }

    /**
     * @return void
     */
    protected function setPermissions(): void
    {
        $this->permissions = Permissions::EDIT;
    }

    /**
     * @return mixed
     */
    abstract public function render();

    /**
     * @return bool
     */
    protected function isForEdit(): bool
    {
        return $this->permissions === Permissions::EDIT;
    }

    /**
     * @return bool
     */
    protected function isNoShow(): bool
    {
        return $this->permissions === Permissions::NO_SHOW;
    }

    /**
     * @return bool
     */
    protected function isReadOnly(): bool
    {
        return $this->permissions === Permissions::READ_ONLY;
    }

    /**
     * @return MetaFieldModel
     */
    public function getMetaField(): MetaFieldModel
    {
        return $this->metaField;
    }

    /**
     * @return string|null
     */
    public function getBelongsTo(): ?string
    {
        return $this->belongsTo;
    }

    /**
     * @return string|null
     */
    public function getFind(): ?string
    {
        return $this->find;
    }

    /**
     * @return int|null
     */
    public function getIndex(): ?int
    {
        return $this->index;
    }

    /**
     * @return int
     */
    public function getBlockIndex(): int
    {
        return $this->blockIndex;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @return bool
     */
    protected function isCloned(): bool
    {
        return $this->metaField->getForgedBy() !== null;
    }

    /**
     * @return bool
     */
    protected function isChild(): bool
    {
        return false;
    }

    /**
     * @return bool
     */
    protected function hasChildren(): bool
    {
        return false;
    }

    /**
     * @return bool
     */
    protected function isNestedInABlock(): bool
    {
        return $this->parentBlock !== null;
    }

    /**
     * @param MetaFieldOptionModel[] $options
     * @param bool $isMulti
     *
     * @return array<mixed>
     */
    protected function selectedOptions(array $options, bool $isMulti = false): array
    {
        $value = $this->getDefaultValue();

        if (!$isMulti) {
            if (!empty($value)) {
                return [$value];
            }

            $default = [];
            foreach ($options as $option) {
                if ($option->isDefault()) {
                    $default[] = $option->getValue();
                }
            }

            if (empty($default)) {
                return [];
            }

            return [
                $default[0]
            ];
        }

        if (!empty($value) && is_array($value)) {
            return $value;
        }

        $default = [];
        foreach ($options as $option) {
            if ($option->isDefault()) {
                $default[] = $option->getValue();
            }
        }

        return $default;
    }

    /**
     * @return string
     */
    protected function getIdName(): string
    {
        $idName = '';

        // add prefix for OP fields.
        // $this->find can be null when a repeater/flexible row is generated via AJAX
        // (generateGroupedFieldsAction never sets the data id); the parent name
        // already carries the OP prefix in that case, so skip it.
        $opPrefix = '';
        $idName .= $opPrefix;

        if ($this->isChild()) {
            $idName .= $this->parentName;

            if ($this->WooCommerceLoopIndex !== null) {
                $idName .= "_".$this->WooCommerceLoopIndex;
            }

            $idName .= '['.$this->metaField->getNormalizedName().']['.$this->index.']';

            // remove double prefix
            if ($opPrefix !== '') {
                $idName = str_replace($opPrefix.$opPrefix, $opPrefix, $idName);
            }

            return esc_html($idName);
        }

        $idName .= Strings::toDBFormat($this->metaField->getBox()->getName()) . '_' . $this->metaField->getNormalizedName();

        if ($this->WooCommerceLoopIndex !== null) {
            $idName .= "_".$this->WooCommerceLoopIndex;
        }

        return esc_html($idName);
    }

    /**
     * Returns true when the field is rendered in the context of a custom table record.
     * In CCT mode the field name is just the column name and WordPress meta hidden
     * inputs are not needed (CCT has its own schema and validation layer).
     *
     * @return bool
     */
    protected function isCCTMode(): bool
    {
        return false;
    }

    /**
     * @return bool
     */
    public function isVisible(): bool
    {
        return true;
    }

    /**
     * @param string $key
     *
     * @return mixed|null
     */
    protected function getData(string $key)
    {
        return Meta::fetch($this->find, $this->belongsTo, $key);
    }

    /**
     * Walks $data along $path, returning null as soon as a level is missing or
     * is not an array. Stored nested data can be malformed (e.g. a string left
     * by the 2.0.63-2.0.66 block-sort bug), and indexing into it must never
     * fatal the whole edit screen (#1397).
     *
     * @param mixed                 $data
     * @param array<int|string|null> $path
     *
     * @return mixed|null
     */
    protected function valueAtPath($data, array $path)
    {
        foreach ($path as $key) {
            if (!is_array($data) || $key === null || !array_key_exists($key, $data)) {
                return null;
            }

            $data = $data[$key];
        }

        return $data;
    }

    /**
     * @return mixed
     */
    protected function getParentData()
    {
        // field nested in a repeater
        if ($this->parentMetaField !== null) {
            $key = $this->parentMetaField->getDbName();

            return $this->getData($this->prependOptionPagePrefix($key));
        }

        return null;
    }

    /**
     * Option page values are stored under "<page>_<box>_<field>". A field loaded
     * in the option page context already carries the page prefix in its db name,
     * so add it only when it is missing (#1410).
     *
     * @param string $key
     *
     * @return string
     */
    private function prependOptionPagePrefix(string $key): string
    {
        return $key;
    }

    /**
     * @return mixed|null
     */
    protected function getDefaultValue()
    {
        if ($this->value !== '' && $this->value !== null) {
            return $this->formatValueForCCT($this->value);
        }

        if ($this->isChild()) {
            return $this->formatDefaultValue($this->metaField->getDefaultValue());
        }

        $value = $this->getData($this->getIdName());

        if ($value !== null && $value !== '') {
            return $value;
        }

        return $this->formatDefaultValue($this->metaField->getDefaultValue());
    }

    /**
     * Formats the provided value for use in CCT mode based on the meta field type.
     *
     * @param mixed $value The value to be formatted.
     * @return mixed The formatted value if in CCT mode, or the original value otherwise.
     */
    /**
     * @param mixed $value
     * @return mixed
     */
    private function formatValueForCCT($value)
    {
        return $value;
    }

    /**
     * @param mixed $string
     *
     * @return mixed
     */
    private function formatDefaultValue($string)
    {
        if (is_string($string) && Strings::isJson($string)) {
            return json_decode($string, true);
        }

        return $string;
    }

    /**
     * @return WPAttachment[]
     */
    protected function getAttachments(): array
    {
        $attachments = [];

        // Other (legacy) fields
        if ($this->isChild()) {
            $id = $this->getParentData()[$this->getMetaField()->getName()][$this->getIndex()]['attachment_id'] ?? '';
            $url = $this->getParentData()[$this->getMetaField()->getName()][$this->getIndex()]['value'] ?? '';
        } else {
            $id = $this->getAttachmentId();
            $url = $this->getData($this->getIdName());
        }

        if (empty($id) && empty($url)) {
            $defaultValue = $this->metaField->getDefaultValue();

            if (empty($defaultValue)) {
                return $attachments;
            }

            $url = $defaultValue;
        }

        // from id
        if (!empty($id)) {
            $ids =  explode(',', $id);

            foreach ($ids as $_id) {
                if (!empty($_id)) {
                    $attachments[] = WPAttachment::fromId($_id);
                }
            }

            return $attachments;
        }

        // from url
        if (!empty($url)) {
            if (is_array($url)) {
                foreach ($url as $_url) {
                    if (!empty($_url)) {
                        $attachments[] = WPAttachment::fromUrl($_url);
                    }
                }

                return $attachments;
            }

            $urls =  explode(',', $url);

            foreach ($urls as $_url) {
                $attachments[] = WPAttachment::fromUrl($_url);
            }
        }

        return $attachments;
    }

    /**
     * @return string|null
     */
    private function getAttachmentId(): ?string
    {
        return $this->getData(Strings::esc_attr($this->getIdName()) . '_attachment_id') ?? null;
    }

    /**
     * @param string $key
     *
     * @return mixed|null
     */
    protected function getAdvancedOption(string $key)
    {
        foreach ($this->metaField->getAdvancedOptions() as $advancedOption) {
            if ($advancedOption->getKey() === $key && $advancedOption->getValue() !== '') {
                return $advancedOption->getUnserializedValue();
            }
        }

        return null;
    }

    /**
     * @return string
     */
    protected function displayLabel()
    {
        $label = ($this->metaField->getLabel()) ? $this->metaField->getLabel() : $this->metaField->getName();
        $label = esc_html($label);
        $label = '<span>'.$this->addAsteriskToLabel($label).'</span>';

        if ($this->metaField->getForgedBy() !== null) {
            $label .= '<span class="acpt-badge acpt-badge-info">CLONED</span>';
        }

        return $label;
    }

    /**
     * Plain-text equivalent of displayLabel(), safe to embed inside an HTML
     * attribute value. displayLabel() returns HTML (including a badge
     * <span class="..."> for cloned/repeater/flexible fields) -- embedding
     * that raw inside aria-label="..." lets the badge's own class="..."
     * attribute close aria-label early, spilling markup into the page as
     * visible text.
     *
     * @return string
     */
    protected function plainTextLabel(): string
    {
        $label = ($this->metaField->getLabel()) ? $this->metaField->getLabel() : $this->metaField->getName();

        if ($this->metaField->getForgedBy() !== null) {
            $label .= ' (cloned)';
        }

        return $label;
    }

    /**
     * @param string $label
     *
     * @return string
     */
    private function addAsteriskToLabel(string $label): string
    {
        if ($this->metaField->isRequired()) {
            return $label . '<span class="required">*</span>';
        }

        return $label;
    }

    /**
     * @return string
     */
    protected function getGridCssClass()
    {
        foreach ($this->metaField->getAdvancedOptions() as $advancedOption) {
            if ($advancedOption->getKey() === 'columns' && $advancedOption->getValue() !== '') {
                return "grid-".$advancedOption->getValue();
            }
        }

        return '';
    }

    /**
     * @param string $relation
     *
     * @return string
     */
    private function displayRelation(string $relation): string
    {
        switch ($relation) {
        }

        return $relation;
    }

    /**
     * @return string
     */
    protected function required(): string
    {
        return ($this->metaField->isRequired()) ? 'required="required" aria-required="true"' : '';
    }

    /**
     * @param string|null $field
     *
     * @return string|null
     */
    protected function renderField(?string $field): ?string
    {
        // cloned fields
        if ($this->isCloned() && $this->cloneFieldId !== $this->metaField->getForgedBy()->getId()) {
            return null;
        }

        // no show
        if ($this->isNoShow()) {
            return null;
        }

        $css = $this->getAdvancedOption('css') ?? '';
        $headlineAlignment = $this->getAdvancedOption('headline') ?? 'top';
        $verticalAlignment = $this->getAdvancedOption('vertical_alignment') ?? 'center';
        $width = $this->getAdvancedOption('width') ?? '100';
        $widthStyle = $width.'%';
        $isHidden = ($this->isVisible() === false) ? 'hidden' : '';

        $return = '<div class="acpt-admin-meta-wrapper '.$isHidden.' acpt-w-'.$width.' '.$css.'" data-id="'.$this->metaField->getId().'" id="'.$this->metaField->getId().'" style="width: '.$widthStyle.';">';
        $return .= '<div class="acpt-admin-meta sort-'.$this->getMetaField()->getSort().'" style="align-items: '.$verticalAlignment.';">';

        $return .= $this->renderFieldWrapper($field, $headlineAlignment);
        $return .= '</div>';
        $return .= '</div>';

        return $return;
    }

    /**
     * @param string|null $field
     * @param string $alignment
     *
     * @return string
     */
    private function renderFieldWrapper(?string $field, string $alignment = 'top'): string
    {
        $return = '<div class="acpt-admin-meta-field-wrapper '.$alignment.'">';

        if ($this->noShowLabel) {
            $return .= $this->renderFieldValue($field);
        } elseif ($alignment === 'top' || $alignment === 'left') {
            $return .= $this->renderFieldLabel() . $this->renderFieldValue($field);
        } elseif ($alignment === 'right') {
            $return .= $this->renderFieldValue($field) . $this->renderFieldLabel();
        } elseif ($alignment === 'none') {
            $return .= $this->renderFieldValue($field);
        }

        $return .= '</div>';

        return $return;
    }

    /**
     * @return string|null
     */
    private function renderFieldLabel(): ?string
    {
        $return = '<div class="acpt-admin-meta-label">';
        $return .= '<label aria-label="'.Strings::esc_attr($this->plainTextLabel()).'" for="'.Strings::esc_attr($this->getIdName()).'">';
        $return .= $this->displayLabel();
        $return .= '</label>';

        if ($this->metaField->getDescription()) {
            $return .= '<span class="description">';
            $return .= wp_kses_post($this->metaField->getDescription());
            $return .= '</span>';
        }

        if (!empty($this->metaField->getRelations())) {
            $relationModel = $this->metaField->getRelations()[0];

            $return .= '<div class="relation">';
            $return .= '<div>';
            $return .= $this->displayRelation($relationModel->getRelationship());
            $return .= '</div>';

            if ($relationModel->getInversedBy() !== null) {
                $return .= '<div class="inversed-by">'.$relationModel->getInversedBy()->getUiName().'</div>';
            }

            $return .= '</div>';
        }

        $return .= '</div>';

        return $return;
    }

    /**
     * @param string|null $field
     *
     * @return string|null
     */
    private function renderFieldValue(?string $field): ?string
    {
        $return = '<div class="acpt-admin-meta-field">';

        // readonly
        if ($this->isReadOnly()) {
            switch ($this->belongsTo) {
                default:
                case MetaTypes::CUSTOM_POST_TYPE:
                    $tag = 'acpt pid';
                    break;

                case MetaTypes::TAXONOMY:
                    $tag = 'acpt_tax tid';
                    break;

                case MetaTypes::USER:
                    $tag = 'acpt_user uid';
                    break;
            }

            $return .= do_shortcode('['.$tag.'="'.$this->find.'" box="'.Strings::esc_attr($this->metaField->getBox()->getName()).'" field="'.Strings::esc_attr($this->metaField->getName()).'" preview="true"]');
            $return .= '</div>';

            return $return;
        }

        // edit
        if ($this->isForEdit()) {
            $return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'">';
            $return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'_type">';
            $return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'_id">';
            if ($this->metaField->getForgedBy() !== null) {
                $return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'_forged_by">';
                $return .= '<input type="hidden" name="'.esc_html($this->getIdName()).'_forged_by" value="'. esc_html($this->metaField->getForgedBy()->getId()) .'">';
            }
            $return .= '<input type="hidden" name="'.esc_html($this->getIdName()).'_id" value="'. esc_html($this->metaField->getId()) .'">';
            $return .= '<input type="hidden" name="' . Strings::esc_attr($this->getIdName()) . '_required" value="' . Strings::esc_attr($this->metaField->isRequiredAsSting())  . '">';
            $return .= Sanitizer::escapeField($field);
            $return .= $this->renderErrors();
            $return .= '</div>';

            return $return;
        }

        return null;
    }

    /**
     * @return bool
     */
    protected function hasErrors(): bool
    {
        if (Session::has(self::ERRORS_SESSION_KEY)) {
            foreach (Session::get(self::ERRORS_SESSION_KEY) as $id => $errors) {
                if ($id === $this->metaField->getId()) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @return string|null
     */
    public function renderErrors()
    {
        $id = 'acpt-error-list-'.$this->getIdName();

        if ($this->isChild()) {
            $id .= '[value]';
        }

        $errorsList = '<ul class="acpt-error-list" id="'.$id.'">';

        if (Session::has(self::ERRORS_SESSION_KEY)) {
            foreach (Session::get(self::ERRORS_SESSION_KEY) as $id => $errors) {
                foreach ($errors as $error) {
                    $realId = $id;

                    if ($realId === $this->getIdName()) {
                        $errorsList .= '<li>'.$error.'</li>';

                        // unset the error from the session
                        Session::unsetItemFromArray(self::ERRORS_SESSION_KEY, $id);
                    }
                }
            }
        }

        $errorsList .= '</ul>';

        return $errorsList;
    }

    /**
     * @param string|null $max
     * @param string|null $min
     * @param string|null $pattern
     * @return string
     */
    protected function appendPatternMaxlengthAndMinlength(?string $max = null, ?string $min = null, ?string $pattern = null): string
    {
        $attr= '';

        if (!empty($min)) {
            $attr .= ' minlength="'.$min.'"';
        }

        if (!empty($max)) {
            $attr .= ' maxlength="'.$max.'"';
        }

        if (!empty($pattern)) {
            $attr .= ' pattern="'.$pattern.'"';
        }

        return $attr;
    }

    /**
     * @return string
     */
    protected function appendDataValidateAndLogicAttributes(): string
    {
        $attr = ' data-conditional-rules-id="'.$this->metaField->getId().'"';

        if ($this->metaField->getForgedBy() !== null) {
            $attr .= ' data-conditional-rules-field-forged-by="'.$this->metaField->getForgedBy()->getId().'"';
        }

        return $attr;
    }

    /**
     * @return bool
     */
    protected function isLeadingField(): bool
    {
        if ($this->isChild()) {
            $parentField = $this->parentMetaField;

            if ($parentField === null) {
                return false;
            }

            $leadingFieldId = $parentField->getAdvancedOption('leading_field');

            if ($leadingFieldId !== null) {
                return $leadingFieldId === $this->metaField->getId();
            }
        }

        return false;
    }

    /**
     * Enqueue the nested fields assets
     * (used only by Repeater and Flexible fields)
     *
     * @param array<string, bool> $checks
     */
    protected function enqueueNestedFieldsAssets(array $checks = []): void
    {
        wp_enqueue_script('html5sortable', plugins_url('acpt-lite/assets/vendor/html5sortable/dist/html5sortable.min.js'), [], '2.2.0', true);

        // DATE FIELDS
        if (
            isset($checks[ MetaFieldModel::DATE_TYPE ])
        ) {
            wp_enqueue_script('momentjs', plugins_url('acpt-lite/assets/vendor/moment/moment.min.js'), [], '2.18.1', true);
            wp_enqueue_script('daterangepicker-js', plugins_url('acpt-lite/assets/vendor/daterangepicker/js/daterangepicker.min.js'), [], '3.1.0', true);
            wp_enqueue_style('daterangepicker-css', plugins_url('acpt-lite/assets/vendor/daterangepicker/css/daterangepicker.min.css'), [], '3.1.0', 'all');
        }
    }

    /**
     * @param MetaFieldModel[] $fields
     *
     * @return array<string, bool>
     */
    protected function nestedFieldsChecks(array $fields = []): array
    {
        if (empty($fields)) {
            return [];
        }

        $return = [];

        foreach ($fields as $child) {
            $return[$child->getType()] = true;
        }

        return $return;
    }

    /**
     * Get an field attribute value
     * (ex. lat, lng, label, etc...)
     *
     * @param string $attribute
     * @param mixed|null $defaultValue
     *
     * @return mixed|null
     */
    protected function getDefaultAttributeValue(string $attribute, $defaultValue = null)
    {
        if ($this->isChild()) {
            $data = $this->getParentData();
            $key = Strings::toDBFormat($this->metaField->getName());

            // Field nested in a repeater
            if (
                isset($data[$key]) &&
                isset($data[$key][$this->index]) &&
                isset($data[$key][$this->index][$attribute])
            ) {
                return $data[$key][$this->index][$attribute];
            }

            // Field nested in a nested repeater
            $parentField = $this->metaField->getParentField();

            if ($parentField === null) {
                return $defaultValue;
            }

            $parentFieldKey = $parentField->getName();

            if (
                isset($data[$parentFieldKey]) &&
                isset($data[$parentFieldKey][$this->getBlockIndex()]) &&
                isset($data[$parentFieldKey][$this->getBlockIndex()][$key]) &&
                isset($data[$parentFieldKey][$this->getBlockIndex()][$key][$this->index]) &&
                isset($data[$parentFieldKey][$this->getBlockIndex()][$key][$this->index][$attribute])
            ) {
                return $data[$parentFieldKey][$this->getBlockIndex()][$key][$this->index][$attribute];
            }

            return $defaultValue;
        }

        $savedValue = $this->getData(Strings::esc_attr($this->getIdName()).'_' . $attribute);

        return ($savedValue !== null && $savedValue !== '' && $savedValue !== false) ? $savedValue : $defaultValue;
    }

    /**
     * @param string|null $style
     *
     * @return string
     */
    public static function keyboardShortcutsLegend(?string $style = null): string
    {
        wp_enqueue_script('jquery.modal-js', plugins_url('acpt-lite/assets/vendor/jquery.modal/jquery.modal.min.js'), [], '3.1.0', true);
        wp_enqueue_style('jquery.modal-css', plugins_url('acpt-lite/assets/vendor/jquery.modal/jquery.modal.min.css'), [], '3.1.0', 'all');

        $shortcuts = [
            [
                'key' => 'CTRL + ENTER',
                'legend' => 'Add an element'
            ],
            [
                'key' => 'CTRL + CANC',
                'legend' => 'Delete an element'
            ],
            [
                'key' => 'CTRL + ↑',
                'legend' => 'Navigate to the previous element'
            ],
            [
                'key' => 'CTRL + ↓',
                'legend' => 'Navigate to the next element'
            ],
        ];

        $legend = "<div class='acpt-keyboards-legend-wrapper' style='".$style."'>";

        // link
        $legend .= '<a class="acpt-keyboards-legend-link" href="#acpt-keyboard-shortcuts" rel="modal:open" >
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8"/><path fill="currentColor" d="M11 11h2v6h-2zm0-4h2v2h-2z"/></svg>
                <span>'.Translator::translate("Keyboard shortcuts").'</span>
            </a>';

        // modal
        $legend .= '<div id="acpt-keyboard-shortcuts" class="modal">';
        $legend .= '<h3>'.Translator::translate("Keyboard shortcuts").'</h3>';
        $legend .= '<p>'.Translator::translate("Keyboard shortcuts work when any field element is focused.").'</p>';

        $legend .= "<ul class='acpt-keyboards-legend'>";

        foreach ($shortcuts as $shortcut) {
            $legend .= "<li>";
            $legend .= "<span class='key'>".$shortcut['key']."</span>";
            $legend .= "<span class='legend'>".$shortcut['legend']."</span>";
            $legend .= "</li>";
        }

        $legend .= "</ul>";

        $legend .= '<div class="acpt-flex gap-10">';
        $legend .= '<a href="#" rel="modal:close" class="acpt-modal-link button button-danger">'.Translator::translate("Close").'</a>';
        $legend .= '</div>';

        $legend .= '</div>';
        $legend .= "</div>";

        return $legend;
    }
}
