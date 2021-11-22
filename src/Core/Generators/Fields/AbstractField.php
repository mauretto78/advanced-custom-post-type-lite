<?php

namespace ACPT_Lite\Core\Generators\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\MetaBoxFieldRelationshipModel;

abstract class AbstractField
{
    /**
     * @var int
     */
    protected $postId;

    /**
     * @var string
     */
    protected $metaboxId;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var bool
     */
    protected $isRequired;

    /**
     * @var int
     */
    protected $sort;

    /**
     * @var null
     */
    protected $defaultValue;

    /**
     * @var null
     */
    protected $description;

    /**
     * @var array
     */
    protected $options;

    /**
     * @var array
     */
    protected $relations;

    /**
     * AbstractField constructor.
     *
     * @param int    $postId
     * @param string $metaboxId
     * @param string $name
     * @param int    $sort
     * @param bool   $isRequired
     * @param null   $defaultValue
     * @param null   $description
     * @param array  $options
     * @param array  $relations
     */
    public function __construct($postId, $metaboxId, $name, $sort, $isRequired = false, $defaultValue = null, $description = null, $options = [], $relations = [] )
    {
        $this->postId = $postId;
        $this->metaboxId = $metaboxId;
        $this->name = $name;
        $this->sort = (int)$sort;
        $this->isRequired = $isRequired;
        $this->defaultValue = $defaultValue;
        $this->description = $description;
        $this->options = $options;
        $this->relations = $relations;
    }

    /**
     * @return string
     */
    protected function getIdName()
    {
        return Strings::toDBFormat($this->metaboxId) . '_' . Strings::toDBFormat($this->name);
    }

    /**
     * @return mixed|null
     */
    protected function getDefaultValue()
    {
        $value = get_post_meta($this->postId, $this->getIdName(), true);

        return ($value !== null and $value !== '' ) ? Strings::unserialize($value) : $this->defaultValue;
    }

    /**
     * @return string
     */
    protected function required()
    {
        return ($this->isRequired) ? 'required="required"' : '';
    }

    /**
     * Render the field in the UI
     *
     * @param $icon
     * @param $field
     */
    protected function renderField($icon, $field, $relation = null)
    {
        ?>
        <div class="acpt-admin-meta sort-<?php echo $this->sort; ?>">
            <div class="acpt-admin-meta-icon">
                <span class="icon">
                    <span class="iconify" style="color: white;" data-width="24" data-height="24" data-icon="<?php echo $icon; ?>"></span>
                </span>
            </div>
            <div class="acpt-admin-meta-label">
                <label for="<?php echo $this->getIdName(); ?>">
                    <?php
                    echo $this->name;
                    echo ($this->isRequired) ? '<span class="required">*</span>': '';
                    ?>
                </label>
                <?php if($this->description):_?>
                    <span class="description"><?php echo $this->description; ?></span>
                <?php endif; ?>
                <?php if($relation): ?>
                    <div class="relation">
                        <?php echo $this->displayRelation($relation); ?>
                    </div>
                <?php endif; ?>
            </div>
            <div class="acpt-admin-meta-field">
                <input type="hidden" name="meta_fields[]" value="<?php echo $this->getIdName(); ?>">
                <input type="hidden" name="meta_fields[]" value="<?php echo $this->getIdName(); ?>_type">
                <input type="hidden" name="<?php echo $this->getIdName(); ?>_required" value="<?php echo $this->isRequired; ?>">
                <?php echo $field; ?>
            </div>
        </div>
        <?php
    }

    private function displayRelation($relation)
    {
        switch ($relation){
            case MetaBoxFieldRelationshipModel::ONE_TO_ONE_UNI:
                return '<span class="relation-label">1</span><span class="relation-sign">⟶</span><span class="relation-label">1</span></span>';

            case MetaBoxFieldRelationshipModel::ONE_TO_ONE_BI:
                return '<span class="relation-label">1</span><span class="relation-sign">⟷</span><span class="relation-label">1</span></span>';

            case MetaBoxFieldRelationshipModel::ONE_TO_MANY_UNI:
                return '<span class="relation-label">1</span><span class="relation-sign">⟶</span><span class="relation-label">M</span></span>';

            case MetaBoxFieldRelationshipModel::ONE_TO_MANY_BI:
                return '<span class="relation-label">1</span><span class="relation-sign">⟷</span><span class="relation-label">M</span></span>';

            case MetaBoxFieldRelationshipModel::MANY_TO_ONE_UNI:
                return '<span class="relation-label">M</span><span class="relation-sign">⟶</span><span class="relation-label">1</span></span>';

            case MetaBoxFieldRelationshipModel::MANY_TO_ONE_BI:
                return '<span class="relation-label">M</span><span class="relation-sign">⟷</span><span class="relation-label">1</span></span>';

            case MetaBoxFieldRelationshipModel::MANY_TO_MANY_UNI:
                return '<span class="relation-label">M</span><span class="relation-sign">⟶</span><span class="relation-label">M</span></span>';

            case MetaBoxFieldRelationshipModel::MANY_TO_MANY_BI:
                return '<span class="relation-label">M</span><span class="relation-sign">⟷</span><span class="relation-label">M</span></span>';
        }


        return $relation;
    }
}