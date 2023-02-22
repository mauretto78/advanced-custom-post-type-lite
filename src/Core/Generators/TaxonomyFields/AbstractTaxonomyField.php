<?php

namespace ACPT_Lite\Core\Generators\TaxonomyFields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxFieldModel;
use ACPT_Lite\Utils\Sanitizer;

abstract class AbstractTaxonomyField
{
    /**
     * @var AbstractMetaBoxFieldModel
     */
    protected AbstractMetaBoxFieldModel $metaBoxFieldModel;

    /**
     * @var string
     */
    protected $taxonomy;

    /**
     * @var null
     */
    protected $termId;

    /**
     * TaxonomyMetaBoxFieldGenerator constructor.
     * @param AbstractMetaBoxFieldModel $metaBoxFieldModel
     * @param string $taxonomy
     * @param null $termId
     */
    public function __construct(AbstractMetaBoxFieldModel $metaBoxFieldModel, $taxonomy, $termId = null)
    {
        $this->metaBoxFieldModel = $metaBoxFieldModel;
        $this->taxonomy = $taxonomy;
        $this->termId = $termId;
    }

    /**
     * @return string
     */
    protected function getIdName()
    {
        $idName = Strings::toDBFormat($this->metaBoxFieldModel->getMetaBox()->getName()) . '_' . Strings::toDBFormat($this->metaBoxFieldModel->getName());

        return esc_html($idName);
    }

    /**
     * @return mixed|null
     */
    protected function getDefaultValue()
    {
        if(null === $this->termId){
            return null;
        }

        $value = get_term_meta( $this->termId, $this->getIdName(), true );

        return ($value !== null and $value !== '' ) ? $value : $this->metaBoxFieldModel->getDefaultValue();
    }

    /**
     * @return string
     */
    protected function required()
    {
        return ($this->metaBoxFieldModel->isRequired()) ? 'required="required"' : '';
    }



    /**
     * @param $icon
     * @param $field
     */
    protected function renderField($icon, $field)
    {
	    $headlineAlignment = 'left';
	    $width = '100';
	    $widthStyle = $width.'%';
        ?>
        <div class="taxonomy-meta-field-wrapper" style="width: <?php echo $widthStyle; ?>;">
            <div class="taxonomy-meta-field">
		        <?php echo $this->renderIcon($icon).$this->renderFieldWrapper($field, $headlineAlignment); ?>
            </div>
        </div>
        <?php
    }

	/**
	 * @param $icon
	 */
	private function renderIcon($icon)
    {
        ?>
        <div class="taxonomy-meta-field-icon">
            <span class="iconify" style="color: white;" data-width="18" data-height="18" data-icon="<?php echo $icon; ?>"></span>
        </div>
        <?php
    }

	private function renderFieldWrapper($field, $alignment = 'left')
	{
        ?>
        <div class="form-field <?php echo $alignment; ?>">
	        <?php
	        if($alignment === 'top' or $alignment === 'left'){
		        echo $this->renderFieldLabel().$this->renderFieldValue($field);
	        } elseif($alignment === 'right'){
		        echo $this->renderFieldValue($field).$this->renderFieldLabel();
	        } elseif($alignment === 'none'){
		        echo $this->renderFieldValue($field);
	        }
	        ?>
        </div>
        <?php
	}

	private function renderFieldLabel()
	{
		?>
		<label for="<?php echo esc_attr($this->getIdName()); ?>">
			<?php
			echo esc_html($this->displayLabel());
			echo ($this->metaBoxFieldModel->isRequired()) ? '<span class="required">*</span>' : '';
			?>
		</label>
		<?php
	}

	private function renderFieldValue($field)
	{
		echo Sanitizer::escapeField($field);
		if($this->metaBoxFieldModel->getDescription()): ?>
			<p class="description">
				<?php echo esc_html($this->metaBoxFieldModel->getDescription()); ?>
			</p>
		<?php endif;
	}

    /**
     * @return string
     */
    protected function displayLabel()
    {
        return $this->metaBoxFieldModel->getName();
    }
}