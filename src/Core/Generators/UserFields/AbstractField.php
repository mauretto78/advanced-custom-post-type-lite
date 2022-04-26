<?php

namespace ACPT_Lite\Core\Generators\UserFields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Utils\Sanitizer;

abstract class AbstractField
{
    /**
     * @var int
     */
    protected $userId;

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
     * @param int    $userId
     * @param string $metaboxId
     * @param string $name
     * @param int    $sort
     * @param bool   $isRequired
     * @param null   $defaultValue
     * @param null   $description
     * @param array  $options
     * @param array  $relations
     */
    public function __construct($userId, $metaboxId, $name, $sort, $isRequired = false, $defaultValue = null, $description = null, $options = [], $relations = [] )
    {
        $this->userId = $userId;
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
        $idName = Strings::toDBFormat($this->metaboxId) . '_' . Strings::toDBFormat($this->name);

        return esc_html($idName);
    }

    /**
     * @return mixed|null
     */
    protected function getDefaultValue()
    {
        $value =  get_the_author_meta( $this->getIdName(), $this->userId );

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
     * @param      $icon
     * @param      $field
     */
    protected function renderField($icon, $field)
    {
        ?>
        <tr>
            <th>
                <div class="acpt-admin-meta-label-wrapper">
                    <div class="acpt-admin-meta-icon">
                        <span class="icon">
                            <span class="iconify" style="color: white;" data-width="24" data-height="24" data-icon="<?php echo esc_attr($icon); ?>"></span>
                        </span>
                    </div>
                    <label for="<?php echo $this->getIdName() ?>">
                        <?php
                        echo esc_html($this->name);
                        echo ($this->isRequired) ? '<span class="required">*</span>': '';
                        ?>
                    </label>
                </div>
            </th>
            <td>
                <?php echo Sanitizer::escapeField($field); ?>
                <br>
                <?php if($this->description !== null and $this->description !== ''):?>
                    <span class="description">
                        <?php echo $this->description; ?>
                    </span>
                <?php endif; ?>
            </td>
        </tr>
        <?php
    }
}