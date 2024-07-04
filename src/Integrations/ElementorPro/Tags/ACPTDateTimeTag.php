<?php

namespace ACPT_Lite\Integrations\ElementorPro\Tags;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;
use Elementor\Controls_Manager;
use Elementor\Modules\DynamicTags\Module;

class ACPTDateTimeTag extends ACPTAbstractTag
{
	/**
	 * @inheritDoc
	 */
	public function get_categories()
	{
		return [
			Module::DATETIME_CATEGORY,
		];
	}

	/**
	 * @inheritDoc
	 */
	public function get_name()
	{
		return 'acpt-date-time';
	}

	/**
	 * @inheritDoc
	 */
	public function get_title()
	{
		return esc_html__( "ACPT Date time field", ACPT_LITE_PLUGIN_NAME );
	}

	public function register_controls()
	{
		parent::register_controls();

		$this->add_control(
			'date_format',
			[
				'label' => Translator::translate( 'Date format' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'default' => esc_html__( 'Default', ACPT_LITE_PLUGIN_NAME ),
					"d-M-y" => "dd-mmm-yy (ex. 28-OCT-90)",
					"d-M-Y" => "dd-mmm-yyyy (ex. 28-OCT-1990)",
					"d M y" => "mmm yy (ex. 28 OCT 90)",
					"d M Y" => "mmm yyyy (ex. 28 OCT 1990)",
					"d/m/Y" => "dd/mm/yy (ex. 28/10/90)",
					"m/d/y" => "mm/dd/yy (ex. 10/28/90)",
					"m/d/Y" => "mm/dd/yyyy (ex. 10/28/1990)",
					"d.m.y" => "dd.mm.yy (ex. 28.10.90)",
					"d.m.Y" => "dd.mm.yyyy (ex. 28.10.1990)",
				],
			]
		);

		$this->add_control(
			'time_format',
			[
				'label' => Translator::translate( 'Time format' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'default' => esc_html__( 'Default', ACPT_LITE_PLUGIN_NAME ),
					'G:i' => "G:i (ex. 16:25)",
					'g:i A' => "g:i A (ex. 4:25 PM)",
					'H:i' => "H:i (ex. 16:25)",
				],
			]
		);

		$this->add_control(
			'date_separator',
			[
				'label' => Translator::translate( 'Date separator' ),
				'type' => Controls_Manager::TEXT,
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

				$dateFormat = (!empty($this->get_settings( 'date_format' ))) ? $this->get_settings( 'date_format' ) : get_option( 'date_format' );
				$timeFormat = (!empty($this->get_settings( 'time_format' ))) ? $this->get_settings( 'time_format' ) : get_option( 'time_format' );
				$dataSeparator = (!empty($this->get_settings( 'date_separator' ))) ? $this->get_settings( 'date_separator' ) : ' - ';

				if(empty($timeFormat)){
					$timeFormat = 'H:i';
				}

				if(empty($dateFormat)){
					$dateFormat = 'F j, Y';
				}

				switch ($fieldType){

					case MetaFieldModel::DATE_RANGE_TYPE:
						if(is_array($rawData) and !empty($rawData)){
							$start = $rawData[0];
							$end = $rawData[1];

							try {
								$startDatetime = new \DateTime($start);
								$endDatetime = new \DateTime($end);

								$startDate = $this->renderDate($startDatetime, $dateFormat);
								$endDate = $this->renderDate($endDatetime, $dateFormat);

								$render .= $startDate.$dataSeparator.$endDate;
							} catch (\Exception $exception){}
						}
						break;

					case MetaFieldModel::DATE_TIME_TYPE:
						try {
							$dateTime = new \DateTime($rawData);
							$render .= $this->renderDate($dateTime, $dateFormat. ' ' . $timeFormat);
						} catch (\Exception $exception){}
						break;

					case MetaFieldModel::DATE_TYPE:
						try {
							$dateTime = new \DateTime($rawData);
							$render .= $this->renderDate($dateTime, $dateFormat);
						} catch (\Exception $exception){}
						break;

					case MetaFieldModel::TIME_TYPE:
						$render .= date_i18n($timeFormat, strtotime($rawData));
						break;
				}
			}
		}

		echo $render;
	}

	/**
	 * @param \DateTime $dataTime
	 * @param string $format
	 *
	 * @return string
	 */
	private function renderDate(\DateTime $dataTime, $format)
	{
		return date_i18n($format, $dataTime->getTimestamp());
	}
}