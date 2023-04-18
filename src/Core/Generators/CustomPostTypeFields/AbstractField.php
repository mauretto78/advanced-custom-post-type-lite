<?php

namespace ACPT_Lite\Core\Generators\CustomPostTypeFields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxModel;
use ACPT_Lite\Utils\Sanitizer;

abstract class AbstractField
{
    /**
     * @var int
     */
    protected $postId;

	/**
	 * @var AbstractMetaBoxModel
	 */
	protected $metaBoxModel;

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
     * AbstractField constructor.
     *
     * @param int    $postId
     * @param AbstractMetaBoxModel $metaBoxModel
     * @param string $name
     * @param int    $sort
     * @param bool   $isRequired
     * @param null   $defaultValue
     * @param null   $description
     * @param array  $options
     * @param array  $relations
     */
    public function __construct($postId,  $metaBoxModel, $name, $sort, $isRequired = false, $defaultValue = null, $description = null, $options = [] )
    {
        $this->postId = $postId;
        $this->metaBoxModel = $metaBoxModel;
        $this->name = $name;
        $this->sort = (int)$sort;
        $this->isRequired = $isRequired;
        $this->defaultValue = $defaultValue;
        $this->description = $description;
        $this->options = $options;
    }

	/**
	 * @return string
	 */
	protected function getIdName()
	{
		$idName = Strings::toDBFormat($this->metaBoxModel->getName()) . '_' . Strings::toDBFormat($this->name);

		return esc_html($idName);
	}

    /**
     * @return mixed|null
     */
    protected function getDefaultValue()
    {
        $value = get_post_meta($this->postId, $this->getIdName(), true);

        return ($value !== null and $value !== '' ) ? $value : $this->defaultValue;
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
    protected function renderField( $icon, $field )
    {
        ?>
        <div class="acpt-admin-meta sort-<?php echo esc_attr($this->sort); ?>">
            <div class="acpt-admin-meta-icon">
                <span class="icon">
                    <span class="iconify" style="color: white;" data-width="24" data-height="24" data-icon="<?php echo esc_attr($icon); ?>"></span>
                </span>
            </div>
            <div class="acpt-admin-meta-label">
                <label for="<?php echo esc_attr($this->getIdName()); ?>">
                    <?php
                    echo esc_html($this->name);
                    echo ($this->isRequired) ? '<span class="required">*</span>': '';
                    ?>
                </label>
                <?php if($this->description):_?>
                    <span class="description">
                        <?php echo esc_html($this->description); ?>
                    </span>
                <?php endif; ?>
            </div>
            <div class="acpt-admin-meta-field">
                <input type="hidden" name="meta_fields[]" value="<?php echo esc_html($this->getIdName()); ?>">
                <input type="hidden" name="meta_fields[]" value="<?php echo esc_html($this->getIdName()); ?>_type">
                <input type="hidden" name="<?php echo esc_attr($this->getIdName()); ?>_required" value="<?php echo esc_attr($this->isRequired); ?>">
                <?php echo Sanitizer::escapeField($field); ?>
            </div>
        </div>
        <?php
    }
}