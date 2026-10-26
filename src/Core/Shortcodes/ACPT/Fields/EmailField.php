<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class EmailField extends AbstractField
{
    /**
     * @return string|null
     */
    public function render(): ?string
    {
        if (!$this->isFieldVisible()) {
            return null;
        }

        $rawData = $this->fetchRawData();

        if (!isset($rawData['value'])) {
            return null;
        }

        return $this->renderEmail($rawData['value']);
    }

    /**
     * @param string $email
     * @return string
     */
    private function renderEmail(string $email): string
    {
        if ($this->payload->render === 'text') {
            return $email;
        }

        return $this->addBeforeAndAfter('<a href="mailto:' . sanitize_email($email) . '">' . $email . '</a>');
    }
}
