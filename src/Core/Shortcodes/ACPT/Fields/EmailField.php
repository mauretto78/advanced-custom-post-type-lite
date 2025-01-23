<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT_Lite\Fields;

class EmailField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

        return $this->renderEmail($rawData['value']);
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

		return '<a href="mailto:' . sanitize_email($email) . '">' . $this->addBeforeAndAfter($email) . '</a>';
	}
}