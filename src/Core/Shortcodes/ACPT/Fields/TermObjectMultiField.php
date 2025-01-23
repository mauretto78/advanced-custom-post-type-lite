<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class TermObjectMultiField extends AbstractField
{
	public function render()
	{
		if($this->payload->preview){

			$rawData = $this->fetchRawData();

			if(!isset($rawData['value'])){
				return null;
			}

			if(empty($rawData['value'])){
				return null;
			}

			$termIds = $rawData['value'];

			return $this->renderTerms($termIds);
		}

		return null;
	}

	/**
	 * @param $termIds
	 *
	 * @return string
	 */
	private function renderTerms($termIds)
	{
		if(!is_array($termIds)){
			return null;
		}

		if(!empty($termIds)){
			$termsArray = [];

			foreach ($termIds as $termId){
				$termsArray[] = $this->addBeforeAndAfter($this->renderTerm($termId));
			}

			return implode(", ", $termsArray);
		}

		return null;
	}
}