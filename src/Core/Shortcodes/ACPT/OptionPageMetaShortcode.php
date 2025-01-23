<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Repository\OptionPageRepository;

class OptionPageMetaShortcode extends AbstractACPTShortcode
{
	/**
	 * @param $atts
	 *
	 * @return string|null
	 * @throws \Exception
	 */
	public function render( $atts )
	{
		if(!isset($atts['page']) or !isset($atts['box']) or !isset($atts['field'])){
			return '';
		}

		$box = $atts['box'];
		$field = $atts['field'];
		$page = $atts['page'];
		$pageModel = OptionPageRepository::getByMenuSlug($page);

		if($pageModel === null){
			return '';
		}

		return $this->renderShortcode($page, MetaTypes::OPTION_PAGE, $page, $atts);
	}
}