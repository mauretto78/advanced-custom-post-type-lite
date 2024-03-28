<?php

namespace ACPT_Lite\Core\Shortcodes\Fields;

class DateField extends AbstractField
{
    public function render()
    {
        $dateFormat = $this->payload->dateFormat ? $this->payload->dateFormat : get_option('date_format');
        $date = new \DateTime($this->fetchMeta($this->getKey()));

	    return $this->formatDate($dateFormat, $date);
    }

	/**
	 * @param $format
	 * @param \DateTime $date
	 *
	 * @return string
	 */
	private function formatDate($format, \DateTime $date)
	{
		return date_i18n($format, $date->getTimestamp());
	}
}