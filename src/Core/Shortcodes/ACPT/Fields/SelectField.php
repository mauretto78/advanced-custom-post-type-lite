<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class SelectField extends AbstractField
{
    /**
     * @return string|null
     */
    public function render(): ?string
    {
        if (!$this->isFieldVisible()) {
            return null;
        }

        $render = $this->payload->render;
        $rawData = $this->fetchRawData();

        if (!isset($rawData['value'])) {
            return null;
        }

        $value = $rawData['value'];

        return $this->addBeforeAndAfter($this->renderItem($value, $render));
    }

    /**
     * @param string $value
     * @param string|null $render
     * @return string|null
     */
    private function renderItem(string $value, ?string $render = null): ?string
    {
        if ($render === 'label' && $this->metaBoxFieldModel !== null) {
            return $this->metaBoxFieldModel->getOptionLabel($value);
        }

        return $value;
    }
}
