<?php

namespace ACPT_Lite\Core\Generators\Meta;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Utils\PHP\Arrays;

class TableFieldGenerator extends AbstractGenerator
{
	private $json;

	/**
	 * TableFieldGenerator constructor.
	 *
	 * @param $json
	 */
	public function __construct($json)
	{
		if($this->validateJSON($json)){
			$this->json = json_decode($json, true);
		}
	}

	/**
	 * @param $json
	 *
	 * @return bool
	 */
	private function validateJSON($json)
	{
		if(empty($json)){
			return false;
		}

		if(!Strings::isJson($json)){
			return false;
		}

		$json = json_decode($json, true);

		if(!isset($json['settings']['layout'])){
			return false;
		}

		if(!in_array(@$json['settings']['layout'], ['vertical', 'horizontal'])){
			return false;
		}

		if(!is_bool(@$json['settings']['header'])){
			return false;
		}

		if(!is_bool(@$json['settings']['footer'])){
			return false;
		}

        if(!is_numeric(@$json['settings']['columns'])){
	        return false;
        }

		if(!is_numeric(@$json['settings']['rows'])){
			return false;
		}

        if(!isset($json['data'])){
	        return false;
        }

        if(!is_array(@$json['data'])){
			return false;
		}

        foreach ($json['data'] as $index => $row){

        	if(!is_array($row)){
        		return false;
	        }

        	if(!Arrays::arrayIsList($row)){
        		return false;
	        }

        	foreach ($row as $k => $item){
        		if(!isset($item['value'])){
        			return false;
		        }

		        if(!is_string($item['value'])){
			        return false;
		        }

		        if(!isset($item['settings'])){
			        return false;
		        }

		        if(!is_array($item['settings'])){
			        return false;
		        }
	        }
        }

        // validate data

		return true;
	}

	/**
	 * @return bool
	 */
	public function theJSONIsValid()
	{
		return !empty($this->json);
	}

	/**
	 * @return string
	 */
	public function generate()
	{
		if(!$this->theJSONIsValid()){
			return null;
		}

		$layout = $this->json['settings']['layout'];
		$css = $this->json['settings']['css'] ?? '';
		$header = $this->json['settings']['header'];
		$footer = $this->json['settings']['footer'];
		$columns = (int)$this->json['settings']['columns'];
		$rows = (int)$this->json['settings']['rows'];
		$data = $this->json['data'];

		if($rows === 0 or $columns === 0){
			return null;
		}

		if($layout === 'vertical'){
			return $this->createVerticalTable($columns, $rows, $data, $css, $footer);
        }

		return $this->createHorizontalTable($columns, $rows, $data, $css, $header, $footer);
	}

	/**
	 * @param $columns
	 * @param $rows
	 * @param $data
	 * @param $css
	 * @param bool $footer
	 *
	 * @return string
	 */
	private function createVerticalTable($columns, $rows, $data, $css, $footer = false)
	{
		$table = '<table class="acpt-table '.$css.'">';
		$rowIndex = 0;
		$index = 0;

		// tbody
		$table .= '<tbody>';

		for ($i = 0; $i < $rows; $i++) {
			$table .=  '<tr data-row-id="'.$rowIndex.'">';

			for ($k = 0; $k < $columns; $k++) {
				if($k === 0){
					$table .=  '<th data-row-id="'.$rowIndex.'" data-col-id="'.$k.'" '.$this->applyCSStoCell($rowIndex, $k).'>';
				} else {
					$table .=  '<td data-row-id="'.$rowIndex.'" data-col-id="'.$k.'" '.$this->applyCSStoCell($rowIndex, $k).'>';
				}

				$table .=  do_shortcode($data[$index][$k]['value']);

				if($k === 0){
					$table .=  '</th>';
				} else {
					$table .=  '</td>';
				}
			}
			
			$table .=  '</tr>';
			$index++;
			$rowIndex++;
		}
		
		$table .= '</tbody>';

		// tfoot
		if($footer){
			$table .= '<tfoot>';
			$table .=  '<tr data-row-id="'.$rowIndex.'">';

			for ($k = 0; $k < $columns; $k++) {
				if($k === 0){
					$table .=  '<th data-row-id="'.$rowIndex.'" data-col-id="'.$k.'" '.$this->applyCSStoCell($rowIndex, $k).'>';
				} else {
					$table .=  '<td data-row-id="'.$rowIndex.'" data-col-id="'.$k.'" '.$this->applyCSStoCell($rowIndex, $k).'>';
				}

				$table .=  do_shortcode($data[$index][$k]['value']);

				if($k === 0){
					$table .=  '</th>';
				} else {
					$table .=  '</td>';
				}
			}

			$table .=  '</tr';
			$table .= '</tfoot>';
		}
		
		$table .= '</table>';

		return $table;
	}

	/**
	 * @param $columns
	 * @param $rows
	 * @param $data
	 * @param $css
	 * @param bool $header
	 * @param bool $footer
	 *
	 * @return string
	 */
	private function createHorizontalTable($columns, $rows, $data, $css, $header = true, $footer = false)
	{
		$table = '<table class="acpt-table '.$css.'">';
        $rowIndex = 0;
        $index = 0;

        // thead
		if($header){
			$table .= '<thead>';
			$table .=  '<tr data-row-id="'.$rowIndex.'">';

			for ($k = 0; $k < $columns; $k++) {
				$table .=  '<th data-row-id="'.$rowIndex.'" data-col-id="'.$k.'" '.$this->applyCSStoCell($rowIndex, $k).'>';
				$table .=  do_shortcode($data[$index][$k]['value']);
				$table .=  '</th>';
			}

            $table .=  '</tr>';
            $index++;
            $rowIndex++;
			$table .= '</thead>';
		}
		
		// tbody
		$table .= '<tbody>';

		for ($i = 0; $i < $rows; $i++) {

			$table .=  '<tr data-row-id="'.$rowIndex.'">';
			
			for ($k = 0; $k < $columns; $k++) {
				$table .=  '<td data-row-id="'.$rowIndex.'" data-col-id="'.$k.'" '.$this->applyCSStoCell($rowIndex, $k).'>';
				$table .= do_shortcode($data[$index][$k]['value']);
				$table .=  '</td>';
			}

			$table .=  '</tr>';
			$index++;
			$rowIndex++;
		}
		
		$table .= '</tbody>';
		
		// tfoot
		if($footer){
			$table .= '<tfoot>';
			$table .=  '<tr data-row-id="'.$rowIndex.'">';

			for ($k = 0; $k < $columns; $k++) {
				$table .=  '<td data-row-id="'.$rowIndex.'" data-col-id="'.$k.'" '.$this->applyCSStoCell($rowIndex, $k).'>';
				$table .= do_shortcode($data[$index][$k]['value']);
				$table .=  '</td>';
			}
			
			$table .=  '</tr>';
			$table .= '</tfoot>';
		}
		
        $table .= '</table>';
        
		return $table;
	}

	/**
	 * @param $rowId
	 * @param $colId
	 *
	 * @return string
	 */
	private function applyCSStoCell($rowId, $colId)
	{
		$generalSettings = $this->json['settings'];
		$cellSettings    = $this->json['data'][$rowId][$colId]['settings'];

		$width = $cellSettings['width'] ?? null;
		$alignment = $cellSettings['alignment'] ?? $generalSettings['alignment'] ?? null;
		$color = $cellSettings['color'] ?? $generalSettings['color'] ?? null;
		$css = $cellSettings['css'] ?? null;

		$background = [
			'color' => $cellSettings['backgroundColor'] ?? $generalSettings['background']['color'] ?? null,
			'zebra' => $cellSettings['backgroundColor'] ?? $generalSettings['background']['zebra'] ?? null,
		];

        $border = [
	        'style' => $cellSettings['borderStyle'] ?? $generalSettings['border']['style'] ?? null,
            'color' => $cellSettings['borderColor'] ?? $generalSettings['border']['color'] ?? null,
            'thickness' => $cellSettings['borderThickness'] ?? $generalSettings['border']['thickness'] ?? null,
        ];



		$attributes = '';

		if($css !== null){
			$attributes .= ' class="'.$css.'" ';
		}

		$attributes .= 'style="';

		if($width !== null){
			$attributes .= 'width: '.$width.';';
		}

		if($alignment !== null){
			$attributes .= 'text-align: '.$alignment.';';
		}

		if($color !== null){
			$attributes .= 'color: '.$color.';';
		}

		if($border['thickness'] !== null){
			$attributes .= 'border: '.$border['thickness'].'px '.$border['style'].' '.$border['color'].';';
		}

		if($background['color'] !== null){
			$attributes .= 'background: '.(($rowId % 2) ? $background['zebra'] : $background['color']).';';
		}

		$attributes .= '"';

		return $attributes;
	}
}