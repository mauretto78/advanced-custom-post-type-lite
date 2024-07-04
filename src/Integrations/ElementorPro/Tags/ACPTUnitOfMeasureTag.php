<?php

namespace ACPT_Lite\Integrations\ElementorPro\Tags;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Currencies;
use ACPT_Lite\Core\Helper\Lengths;
use ACPT_Lite\Core\Helper\Weights;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;
use Elementor\Controls_Manager;
use Elementor\Modules\DynamicTags\Module;

class ACPTUnitOfMeasureTag extends ACPTAbstractTag
{
	/**
	 * @inheritDoc
	 */
	public function get_categories()
	{
		return [
			Module::TEXT_CATEGORY,
		];
	}

	/**
	 * @inheritDoc
	 */
	public function get_name()
	{
		return 'acpt-unit-of-measure';
	}

	/**
	 * @inheritDoc
	 */
	public function get_title()
	{
		return esc_html__( "ACPT unit of measure field", ACPT_LITE_PLUGIN_NAME );
	}

	public function register_controls()
	{
		parent::register_controls();

		$this->add_control(
			'render',
			[
				'label' => Translator::translate( 'Render as' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'both' => Translator::translate('Value and UOM'),
					'value' => Translator::translate('Only value'),
					'uom' => Translator::translate('Only UOM'),
				],
			]
		);

		$this->add_control(
			'value_format_decimal_points',
			[
				'label' => Translator::translate( 'Value format (Decimal points)' ),
				'type' => Controls_Manager::TEXT,
				'condition' => [
					'render' => [
						'both',
						'value',
					],
				],
			]
		);

		$this->add_control(
			'value_format_decimal_separator',
			[
				'label' => Translator::translate( 'Value format (Decimal separator)' ),
				'type' => Controls_Manager::TEXT,
				'condition' => [
					'render' => [
						'both',
						'value',
					],
				],
			]
		);

		$this->add_control(
			'value_format_thousands_separator',
			[
				'label' => Translator::translate( 'Value format (Thousands separator)' ),
				'type' => Controls_Manager::TEXT,
				'condition' => [
					'render' => [
						'both',
						'value',
					],
				],
			]
		);

		$this->add_control(
			'uom_format',
			[
				'label' => Translator::translate( 'UOM format' ),
				'type' => Controls_Manager::SELECT,
				'condition' => [
					'render' => [
						'both',
						'value',
					],
				],
				'options' => [
					'full' => Translator::translate('Full UOM name'),
					'abbreviation' => Translator::translate('Abbreviation'),
				],
			]
		);

		$this->add_control(
			'uom_position',
			[
				'label' => Translator::translate( 'UOM position' ),
				'type' => Controls_Manager::SELECT,
				'condition' => [
					'render' => [
						'both',
						'value',
					],
				],
				'options' => [
					'after' => Translator::translate('After value'),
					'before' => Translator::translate('Before value'),
				],
			]
		);
	}

	public function render()
	{
		$render = '';
		$field = $this->extractField();

		if(!empty($field)){
			if(
				isset($field['find']) and
				isset($field['belongsTo']) and
				isset($field['boxName']) and
				isset($field['fieldName']) and
				isset($field['fieldType'])
			){
				$find = $field['find'];
				$belongsTo = $field['belongsTo'];
				$boxName = $field['boxName'];
				$fieldName = $field['fieldName'];
				$fieldType = $field['fieldType'];

				$context = null;
				$contextId = null;

				if($belongsTo === MetaTypes::CUSTOM_POST_TYPE){
					$context = 'post_id';
					$contextId = (isset($field['postId']) and !empty($field['postId'])) ? (int)$field['postId'] : $this->getCurrentPostId();
				} elseif($belongsTo === MetaTypes::OPTION_PAGE){
					$context = 'option_page';
					$contextId = $find;
				}

				if($context === null or $contextId === null){
					echo '';
					exit();
				}

				$rawData = get_acpt_field([
					$context => $contextId,
					'box_name' => $boxName,
					'field_name' => $fieldName,
				]);

				switch ($fieldType){

					case MetaFieldModel::CURRENCY_TYPE:
						if(is_array($rawData)){
							$render .= $this->renderUom($rawData['amount'], $rawData['unit'], 'currency');
						}

						break;

					case MetaFieldModel::LENGTH_TYPE:
						if(is_array($rawData)){
							$render .= $this->renderUom($rawData['length'], $rawData['unit'], 'length');
						}

						break;

					case MetaFieldModel::WEIGHT_TYPE:
						if(is_array($rawData)){
							$render .= $this->renderUom($rawData['weight'], $rawData['unit'], 'weight');
						}

						break;

					default:
						$render .= $rawData;
						break;
				}
			}
		}

		echo $render;
	}

	/**
	 * @param $value
	 * @param $unit
	 * @param $type
	 *
	 * @return mixed
	 */
	private function renderUom($value, $unit, $type)
	{
		$render = (!empty($this->get_settings('render'))) ? $this->get_settings('render') : null;
		$decimalPoints = (!empty($this->get_settings('value_format_decimal_points'))) ? $this->get_settings('value_format_decimal_points') : 0;
		$decimalSeparator = (!empty($this->get_settings('value_format_decimal_separator'))) ? $this->get_settings('value_format_decimal_separator') : ".";
		$thousandsSeparator = (!empty($this->get_settings('value_format_thousands_separator'))) ? $this->get_settings('value_format_thousands_separator') : ",";
		$uomFormat = (!empty($this->get_settings('uom_format'))) ? $this->get_settings('uom_format') : "full";
		$uomPosition = (!empty($this->get_settings('uom_position'))) ? $this->get_settings('uom_position') : "after";

		$value = number_format($value, (int)$decimalPoints, $decimalSeparator, $thousandsSeparator);

		if($uomFormat === 'abbreviation'){
			switch ($type){
				case 'currency':
					$unit = Currencies::getSymbol($unit);
					break;

				case 'length':
					$unit = Lengths::getSymbol($unit);
					break;

				case 'weight':
					$unit = Weights::getSymbol($unit);
					break;
			}
		}

		if($render === 'value'){
			if($value === null){
				return null;
			}

			return $value;
		}

		if($render === 'uom'){
			if($unit === null){
				return null;
			}

			return $unit;
		}

		if($uomPosition === 'before'){
			if($unit === null or $value === null){
				return null;
			}

			return $unit . ' ' . $value;
		}

		if($unit === null or $value === null){
			return null;
		}

		return $value . ' ' . $unit;
	}
}
