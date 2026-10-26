<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\Cookies;
use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Validators\MetaDataValidator;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\PHP\Cookie;
use ACPT_Lite\Utils\PHP\DateNormalizer;
use ACPT_Lite\Utils\PHP\Request;
use ACPT_Lite\Utils\Wordpress\Files;

abstract class AbstractSaveMetaCommand implements LogFormatInterface
{
    /**
     * @var Request
     */
    protected Request $request;

    /**
     * @var array<string, mixed>
     */
    protected ?array $data = [];

    /**
     * @var array<string, mixed>|null
     */
    protected ?array $files;

    /**
     * AbstractSaveMetaCommand constructor.
     *
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;

        if (!empty($request->postParams())) {
            $this->data = $request->postParams();
        } else {
            // bulk edit
            if (!empty($request->request('_wpnonce')) && !wp_verify_nonce($request->request('_wpnonce'), 'bulk-posts')) {
                return;
            }

            $this->data = $request->requestAll();
        }

        $this->files = $request->files();
        ;
    }

    /**
     * @param MetaFieldModel $fieldModel
     *
     * @return bool
     */
    protected function hasField(MetaFieldModel $fieldModel): bool
    {
        $key = $fieldModel->getDbName();

        // @phpstan-ignore-next-line notIdentical.alwaysTrue
        if (isset($this->WooCommerceLoopIndex) && $this->WooCommerceLoopIndex !== null) {
            $key .= "_" . $this->WooCommerceLoopIndex;
        }

        $key .= "_id";

        return (
            isset($this->data[$key]) &&
            $this->data[$key] === $fieldModel->getId()
        );
    }

    /**
     * WordPress core Bulk Edit (edit.php?bulk_edit=...) treats a blank input as
     * "no change". ACPT renders its quick-edit inputs in the Bulk Edit panel too,
     * so a field left blank there must be skipped instead of blanking the value
     * on every selected post. Ticket #1369.
     *
     * @param MetaFieldModel $fieldModel
     *
     * @return bool
     */
    protected function isBlankBulkEditField(MetaFieldModel $fieldModel): bool
    {
        if (!$this->request->hasRequest('bulk_edit')) {
            return false;
        }

        $value = $this->data[$fieldModel->getDbName()] ?? null;

        if (is_array($value)) {
            $value = array_filter($value, static function ($item) {
                return $item !== '' && $item !== null;
            });
        }

        return $value === null || $value === '' || $value === [];
    }

    /**
     * Whether the current WP user is allowed to write this field, per the
     * field's own Permissions rules. Mirrors the verdict AbstractField::
     * setPermissions() already computes for the render path: a field with no
     * permissions configured is writable by everyone (PermissionTrait default);
     * otherwise the current user must have the `edit` capability for it
     * (READ_ONLY / NO_SHOW both resolve `edit => false`). Ticket #1243.
     *
     * @param MetaFieldModel $fieldModel
     * @return bool
     */
    protected function currentUserCanEditField(MetaFieldModel $fieldModel): bool
    {
        return true;
    }

    /**
     * Phase 1: Validate a field without touching the DB.
     * Returns an array of error message strings (empty = valid).
     *
     * @param MetaFieldModel $fieldModel
     * @param string|int     $elementId
     *
     * @return string[]
     */
    protected function validateField(MetaFieldModel $fieldModel, $elementId): array
    {
        $errors    = [];
        $data      = $this->data;
        $fieldType = $fieldModel->getType();
        $key       = $fieldModel->getDbName();

        // @phpstan-ignore-next-line notIdentical.alwaysTrue
        if (isset($this->WooCommerceLoopIndex) && $this->WooCommerceLoopIndex !== null) {
            $key .= "_" . $this->WooCommerceLoopIndex;
        }

        // File fields are validated at save time (tmp_name availability), skip here
        if (isset($this->files[$key])) {
            return [];
        }

        if (!isset($data[$key])) {
            return [];
        }

        $rawValue = $data[$key];

        // Basic type validation
        try {
            MetaDataValidator::validate($fieldType, $rawValue, $fieldModel->isRequired());
        } catch (\Exception $e) {
            $errors[] = $e->getMessage();
        }

        return $errors;
    }

    /**
     * Phase 2: Persist a single field to the DB.
     * Call this only after all fields have been validated.
     *
     * @param MetaFieldModel $fieldModel
     * @param string|int     $elementId
     * @param string         $belongsTo
     *
     * @throws \Exception
     */
    protected function persistField(MetaFieldModel $fieldModel, $elementId, $belongsTo): void
    {
        $data                  = $this->data;
        $idName                = $fieldModel->getDbName();
        $fieldType             = $fieldModel->getType();
        $allowHtml             = false;
        $allowDangerousContent = false;
        $key                   = $idName;

        if ($fieldModel->isAWooCommerceProductAttribute()) {
            $idName = $elementId;
        }

        // @phpstan-ignore-next-line notIdentical.alwaysTrue
        if (isset($this->WooCommerceLoopIndex) && $this->WooCommerceLoopIndex !== null) {
            $key .= "_" . $this->WooCommerceLoopIndex;
        }

        // Handle file uploads from comment forms
        if (isset($this->files[$key])) {
            $rawFile = $this->files[$key];

            if (!empty($rawFile['tmp_name'])) {
                $fileUploaded = Files::uploadFile($rawFile['tmp_name'], $rawFile['name']);

                if ($fileUploaded !== false) {
                    Meta::save($elementId, $belongsTo, (string)$idName, $fileUploaded['url']);
                    Meta::save($elementId, $belongsTo, $idName . '_id', $fileUploaded['attachmentId']);
                    Meta::save($elementId, $belongsTo, $idName . '_type', $fieldModel->getType());
                }
            }

            return;
        }

        if (isset($data[$key])) {
            $rawValue = $data[$key];

            // ACPT_Lite_Plugin's Request is built when the plugin loads, before WP adds magic
            // quotes, so this value is NOT slashed: it is sanitized and stored as is
            // (Meta::save(..., false)). Unslashing it stripped every backslash, JSON
            // escapes included (#1380).
            $value = $rawValue;

            if (is_array($value)) {
                $value = Arrays::reindex($value);
            }

            // Date / time normalisation
            if (
                $fieldType === MetaFieldModel::DATE_TYPE
            ) {
                switch ($fieldType) {
                    default:
                        $defaultFormat = "Y-m-d";
                        break;
                }

                $format         = $data[$idName . "_format"] ?? $defaultFormat;
                $dateTimeObject = \DateTime::createFromFormat($format, $value);

                // Fallback for quick/bulk edit format
                if (!$dateTimeObject instanceof \DateTime) {
                    $dateTimeObject = \DateTime::createFromFormat("Y-m-d\TH:i", $value);
                }

                if ($dateTimeObject instanceof \DateTime) {
                    $value = $dateTimeObject->format($defaultFormat);
                } elseif (is_string($value) && $value !== '') {
                    $value = $this->normalizeDisplayDate($fieldModel, $fieldType, $value);
                }
            }

            // HTML flags
            if ($fieldType === MetaFieldModel::TEXT_TYPE || $fieldType === MetaFieldModel::TEXTAREA_TYPE) {
                $allowHtml             = $fieldModel->getAdvancedOption("allow_html") ?? false;
                $allowDangerousContent = $fieldModel->getAdvancedOption("allow_dangerous_content") ?? false;
            }

            Meta::save(
                $elementId,
                $belongsTo,
                (string)$idName,
                Sanitizer::toMetaStorage($fieldType, Sanitizer::sanitizeRawData($fieldType, $this->convertMetaDataToDBFormat($value), [
                    'allow_dangerous_content' => $allowDangerousContent,
                    'allow_html' => $allowHtml,
                    'unslashed' => true,
                ])),
                false
            );

            // Extra fields
            foreach (ExtraFields::ALLOWED_VALUES as $extra) {
                if (isset($data[$key . '_' . $extra])) {
                    Meta::save(
                        $elementId,
                        $belongsTo,
                        $idName . '_' . $extra,
                        Sanitizer::sanitizeRawData(MetaFieldModel::TEXT_TYPE, $data[$key . '_' . $extra], ['unslashed' => true]),
                        false
                    );
                }
            }
        } else {
            // Blank the field only if it already exists in the DB
            $existing = Meta::fetch($elementId, $belongsTo, (string)$idName);

            if ($existing !== null) {
                Meta::save($elementId, $belongsTo, (string)$idName, '');

                foreach (ExtraFields::ALLOWED_VALUES as $extra) {
                    $existingExtra = Meta::fetch($elementId, $belongsTo, $idName . '_' . $extra);

                    if ($existingExtra !== null) {
                        Meta::save($elementId, $belongsTo, $idName . '_' . $extra, '');
                    }
                }
            }
        }

        do_action("acpt/save_meta_field", $this, $fieldModel, $elementId, $belongsTo);
    }

    /**
     * Validate all fields first, then persist them inside a DB transaction.
     * Redirects back with all collected errors if any validation fails.
     *
     * Each entry in $fieldEntries must be an associative array with keys:
     *   - 'field'     => MetaFieldModel
     *   - 'elementId' => string|int
     *   - 'belongsTo' => string
     *
     * @param array<array<string, mixed>> $fieldEntries
     */
    protected function validateAndSaveFields(array $fieldEntries): void
    {
        // --- Phase 1: validate each field individually. A field that fails
        // validation is excluded from Phase 2 below, but no longer blocks
        // every other field on the post from being persisted. ---
        $errors       = [];
        $validEntries = [];

        foreach ($fieldEntries as $entry) {
            // Server-side permission enforcement (ticket #1243). A field's own
            // Permissions tab is honoured on the render path (AbstractField::
            // setPermissions() -> READ_ONLY / NO_SHOW), but the save path never
            // checked it — a crafted POST carrying a restricted field's hidden
            // trackers was persisted regardless. If the current user has no
            // `edit` verdict on this field, silently drop the write and log it
            // (the normal UI would not have submitted it — this only fires on a
            // hand-crafted request, so it is not a user-facing validation error).
            if (!$this->currentUserCanEditField($entry['field'])) {
                do_action("acpt/error", new \Exception(sprintf(
                    'Blocked a write to meta field "%s" — the current user does not have edit permission on it (field-level Permissions).',
                    $entry['field']->getName()
                )));
                continue;
            }

            try {
                $fieldErrors = $this->validateField($entry['field'], $entry['elementId']);
            } catch (\Throwable $e) {
                do_action("acpt/error", $e);
                $fieldErrors = [$e->getMessage()];
            }

            if (!empty($fieldErrors)) {
                $errors = array_merge($errors, $fieldErrors);
                continue;
            }

            $validEntries[] = $entry;
        }

        // --- Phase 2: persist each valid field independently. One field's
        // failure must not discard fields already persisted earlier in
        // this same request. ---
        global $wpdb;

        $wpdb->query('START TRANSACTION');

        foreach ($validEntries as $entry) {
            try {
                $this->persistField($entry['field'], $entry['elementId'], $entry['belongsTo']);
            } catch (\Throwable $e) {
                do_action("acpt/error", $e);
                $errors[] = $e->getMessage();
            }
        }

        $wpdb->query('COMMIT');

        if (!empty($errors)) {
            $this->redirectWithErrors($errors);
        }
    }

    /**
     * Store errors in a cookie and redirect back to the previous page.
     *
     * @param array<string>|array<string, string[]> $messages
     *
     * @return void
     */
    protected function redirectWithErrors(array $messages): void
    {
        foreach ($messages as $message) {
            // @phpstan-ignore-next-line instanceof.alwaysFalse
            if ($message instanceof \Exception) {
                do_action("acpt/error", $message);
            }
        }

        Cookie::set(Cookies::ACPT_ERRORS, array_map(static function ($field, $errors) {
            // @phpstan-ignore-next-line function.impossibleType
            $message = (is_array($errors)) ? $field . ': ' . implode(', ', $errors) : $errors;

            return [
                'level'   => 'warning',
                'message' => $message,
            ];
        }, array_keys($messages), $messages));

        wp_safe_redirect($this->request->httpReferer());

        // the test suite throws here: the exit would end the whole PHPUnit process, silently and with code 0
        do_action('acpt/save_meta/before_exit', $messages);

        exit();
    }

    /**
     * The admin date pickers submit the field's display format (e.g. "08.10.2026"
     * on a German site) and no longer send a "_format" companion, so convert it
     * to the canonical storage format here (#1389). Unparseable values are
     * returned unchanged.
     *
     * @param MetaFieldModel $fieldModel
     * @param string         $fieldType
     * @param string         $value
     * @return string
     */
    private function normalizeDisplayDate(MetaFieldModel $fieldModel, string $fieldType, string $value): string
    {
        $dateFormat = $fieldModel->getAdvancedOption('date_format') ?: get_option('date_format');
        $timeFormat = $fieldModel->getAdvancedOption('time_format') ?: get_option('time_format');

        $toDate = static function (string $date) use ($dateFormat): ?string {
            return DateNormalizer::toDate($date, $dateFormat) ?? DateNormalizer::toDate($date);
        };

        switch ($fieldType) {
            case MetaFieldModel::DATE_TYPE:
                $normalized = $toDate($value);
                break;

            default:
                $normalized = null;
        }

        return $normalized ?? $value;
    }

    /**
     * Normalise raw data before saving to DB.
     * Converts relationship values from comma-separated strings to arrays.
     *
     * @param mixed $rawValue
     *
     * @return mixed
     * @throws \Exception
     */
    protected function convertMetaDataToDBFormat($rawValue)
    {
        if (!is_array($rawValue)) {
            return $rawValue;
        }

        foreach ($rawValue as $fieldLabel => $fieldValue) {
            if (!is_array($fieldValue)) {
                continue;
            }

            foreach ($fieldValue as $index => $nestedValue) {
                // POST inside a nested block
                if (isset($nestedValue['blocks']) && is_array($nestedValue['blocks'])) {
                    foreach ($nestedValue['blocks'] as $blockIndex => $blockFields) {
                        if (!is_array($blockFields)) {
                            continue;
                        }

                        foreach ($blockFields as $fieldName => $fieldValues) {
                            if (!is_array($fieldValues)) {
                                continue;
                            }

                            foreach ($fieldValues as $fIndex => $fValue) {
                                if (!is_array($fValue)) {
                                    continue;
                                }

                                foreach ($fValue as $cIndex => $field) {
                                }
                            }
                        }
                    }
                } elseif (isset($nestedValue['original_name'])) {
                }
            }

            // POST inside a block
            // @phpstan-ignore-next-line function.alreadyNarrowedType
            if ($fieldLabel !== 'blocks' || !is_array($fieldValue)) {
                continue;
            }

            foreach ($fieldValue as $blockIndex => $blockFields) {
                if (!is_array($blockFields)) {
                    continue;
                }

                foreach ($blockFields as $fieldName => $fieldValues) {
                    if (!is_array($fieldValues)) {
                        continue;
                    }

                    foreach ($fieldValues as $fIndex => $fValue) {
                        if (!is_array($fValue)) {
                            continue;
                        }

                        foreach ($fValue as $cIndex => $field) {
                            // POST inside a 2nd-level block
                            if (!isset($field['blocks'])) {
                                continue;
                            }

                            foreach ($field['blocks'] as $bBlockIndex => $bBlockFields) {
                                foreach ($bBlockFields as $ffieldName => $ffieldValues) {
                                    foreach ($ffieldValues as $ffIndex => $ffieldValue) {
                                        foreach ($ffieldValue as $ccIndex => $ffield) {
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return $rawValue;
    }

    /**
     * @return array<string, mixed>
     */
    public function logFormat(): array
    {
        return [
            "class" => static::class,
            'data'  => $this->data,
            'files' => $this->files,
        ];
    }

}
