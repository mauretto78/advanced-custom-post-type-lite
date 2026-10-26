<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Utils\Wordpress\WPUtils;

class TextField extends AbstractField
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

        $allowHtml = $this->metaBoxFieldModel->getAdvancedOption("allow_html");

        if ($allowHtml == 1) {
            $rawData['value'] = html_entity_decode($rawData['value']);
        }

        return $this->addBeforeAndAfter(WPUtils::renderShortCode($rawData['value']));
    }
}
