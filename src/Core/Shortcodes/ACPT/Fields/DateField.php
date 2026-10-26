<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Utils\PHP\Date;

class DateField extends AbstractField
{
    public const DEFAULT_FORMAT = "Y-m-d";

    /**
     * @return string|null
     */
    public function render(): ?string
    {
        if (!$this->isFieldVisible()) {
            return null;
        }

        $dateFormat = $this->getDefaultDateFormat();
        $rawData = $this->fetchRawData();

        if (!isset($rawData['value'])) {
            return null;
        }

        try {
            $savedForm = $rawData['format'] ?? self::DEFAULT_FORMAT;
            $date = \DateTime::createFromFormat($savedForm, $rawData['value']);

            if (!$date instanceof \DateTime) {
                $date = \DateTime::createFromFormat(self::DEFAULT_FORMAT, $rawData['value']);
            }

            if (!$date instanceof \DateTime) {
                return null;
            }

            return $this->addBeforeAndAfter(Date::format($dateFormat, $date));
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return null;
        }
    }

    /**
     * @return mixed|void|null
     */
    protected function getDefaultDateFormat()
    {
        if (!empty($this->payload->dateFormat)) {
            return $this->payload->dateFormat;
        }

        if ($this->metaBoxFieldModel !== null && $this->metaBoxFieldModel->getAdvancedOption('date_format') !== null) {
            return $this->metaBoxFieldModel->getAdvancedOption('date_format');
        }

        if (!empty(get_option('date_format'))) {
            return get_option('date_format');
        }

        return "Y-m-d";
    }

    /**
     * @return mixed|void|null
     */
    protected function getDefaultTimeFormat()
    {
        if (!empty($this->payload->timeFormat)) {
            return $this->payload->timeFormat;
        }

        if ($this->metaBoxFieldModel !== null &&  $this->metaBoxFieldModel->getAdvancedOption('time_format') !== null) {
            return $this->metaBoxFieldModel->getAdvancedOption('time_format');
        }

        if (!empty(get_option('time_format'))) {
            return get_option('time_format');
        }

        return "H:i";
    }
}
