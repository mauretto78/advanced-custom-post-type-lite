<?php

namespace ACPT_Lite\Core\Shortcodes\Fields;

class EmailField extends AbstractField
{
    public function render()
    {
	    return $this->renderEmail($this->fetchMeta($this->getKey()));
    }

	/**
	 * @param $email
	 *
	 * @return string
	 */
	private function renderEmail($email)
	{
		if($this->payload->render === 'text'){
			return $email;
		}

		return '<a href="mailto:' . $email . '">' . $email . '</a>';
	}
}