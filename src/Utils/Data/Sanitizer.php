<?php

namespace ACPT_Lite\Utils\Data;

use ACPT_Lite\Constants\HTMLTag;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\JSON;

class Sanitizer
{
    /**
     * @param string $field
     * @return string
     */
    public static function escapeField(string $field): string
    {
        if (empty($field)) {
            return $field;
        }

        return wp_kses($field, HTMLTag::ALLOWED_FORMATS);
    }

    /**
     * The form of a sanitized value to store in WordPress meta (post, term, user and
     * comment meta, options). sanitizeRawData() returns a Table as a PHP array, which
     * the CCT records need; in WordPress meta it must stay the JSON string every
     * reader expects, or the table renders empty and raw-meta readers such as
     * Bricks' {cf_...} tag fatal on its stdClass cells (#1428).
     *
     * @param string $type
     * @param mixed  $value
     * @return mixed
     */
    public static function toMetaStorage(string $type, $value)
    {
        return $value;
    }

    /**
     * Sanitizes the given raw data based on the specified type and options.
     *
     * @param string $type   The field type that drives the sanitization policy.
     * @param mixed  $value  The raw data to sanitize.
     * @param array  $options Optional overrides (e.g. allow_html, allow_iframe, allow_dangerous_content, unslashed: the value is not slashed, keep its backslashes).
     * @return mixed The sanitized value, or null when $value is null.
     */
    /**
     * @param mixed $value
     * @param array<string, mixed> $options
     * @return mixed
     */
    public static function sanitizeRawData(string $type, $value, array $options = [])
    {
        if ($value === null) {
            return null;
        }

        // Escape hatch: skip all sanitization.
        // Only use this when the source is trusted (e.g. an internal admin-only feature).
        if (isset($options['allow_dangerous_content']) && $options['allow_dangerous_content']) {
            return $value;
        }

        // Boolean: preserve as-is after the dangerous-content check.
        if (is_bool($value)) {
            return $value;
        }

        // Array → recursive sanitize
        if (is_array($value)) {
            return self::sanitizeArray($type, $value, $options);
        }

        // Textarea holding JSON (#1370)
        if ($type === MetaFieldModel::TEXTAREA_TYPE && is_string($value)) {
            $json = self::sanitizeTextareaJson($value, self::getPolicy($type, $options));

            if ($json !== null) {
                return $json;
            }
        }

        // JSON string → decode → sanitize → re-encode
        if (is_string($value) && Strings::isJson($value)) {
            return self::sanitizeJson($type, $value, $options);
        }

        $policy = self::getPolicy($type, $options);

        return self::applyPolicy($policy, $value);
    }

    /**
     * Convenience wrapper: sanitizes an associative array of [fieldType => value] pairs.
     * Useful in controllers that receive a mixed payload where each key maps to a field type.
     *
     * @param array<string, mixed> $data Associative array of [fieldType => rawValue].
     * @param string $defaultType Fallback type when the key is not a known field type.
     * @return array<string, mixed> Sanitized data preserving the original keys.
     */
    public static function recursiveSanitizeRawData(array $data, string $defaultType = MetaFieldModel::TEXT_TYPE): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            $sanitized[$key] = self::sanitizeRawData($defaultType, $value);
        }

        return $sanitized;
    }

    // ── Policy ────────────────────────────────────────────────────────────────

    /**
     * @param array<string, mixed> $options
     * @return array<string, mixed>
     */
    private static function getPolicy(string $type, array $options): array
    {
        $default = [
            'type'          => 'text',
            'allow_html'    => false,
            'allow_svg'     => false,
            'allow_iframe'  => false,
        ];

        $map = [
            // Text
            MetaFieldModel::TEXT_TYPE     => ['type' => 'text'],

            // Specialised text formats
            MetaFieldModel::EMAIL_TYPE    => ['type' => 'email'],

            // Plain textarea (no HTML by default)
            MetaFieldModel::TEXTAREA_TYPE => ['type' => 'textarea', 'allow_html' => false],
        ];

        return array_merge($default, $map[$type] ?? [], $options);
    }

    /**
     * @param array<string, mixed> $policy
     * @param mixed $value
     * @return mixed
     */
    private static function applyPolicy(array $policy, $value)
    {
        switch ($policy['type']) {

            case 'color':
                return sanitize_hex_color((string) $value) ?? '';

            case 'email':
                return sanitize_email((string) $value);

            case 'file':
            case 'url':
                return sanitize_url((string) $value);

            case 'number':
                // Preserve sign, digits, decimal point and scientific notation.
                // sanitize_text_field would work for simple integers but strips
                // commas used as thousand-separators and scientific notation.
                $cleaned = preg_replace('/[^0-9.\-+eE,]/', '', (string) $value);

                // an empty (or digit-less) value stays empty: casting it made a blank
                // Number/Currency/Weight/Length field save as 0 (#1355)
                if (!preg_match('/[0-9]/', (string) $cleaned)) {
                    return '';
                }

                // return int or float
                if (strpos($cleaned, '.') !== false) {
                    return (float) $cleaned;
                }

                return (int)$cleaned;

            case 'html':
                return self::sanitizeHtml((string) $value, $policy);

            case 'textarea':
                if ($policy['allow_html']) {
                    return self::sanitizeHtml((string) $value, $policy);
                }

                $value = sanitize_textarea_field((string) $value);

                // a value that is not slashed (#1380) keeps its backslashes
                return empty($policy['unslashed']) ? stripslashes_deep($value) : $value;

            case 'tel':
            case 'text':
            default:
                if (!empty($policy['preserve_whitespace'])) {
                    // Strip tags but preserve whitespace characters (\n, \t)
                    // which sanitize_text_field would otherwise remove.
                    return wp_strip_all_tags((string) $value);
                }
                return sanitize_text_field((string) $value);
        }
    }

    // ── TABLE_TYPE helpers ────────────────────────────────────────────────────

    /**
     * Sanitizes a decoded TABLE field value while preserving its nested structure.
     * Only string leaf values are sanitized; booleans and integers are kept as-is
     * so the JSON Schema's type constraints on settings properties remain satisfied.
     *
     * @param array<mixed> $data
     * @param array<string, mixed> $options
     * @return array<string, mixed>
     */
    private static function sanitizeTableData(array $data, array $options): array
    {
        if (isset($data['settings']) && is_array($data['settings'])) {
            $data['settings'] = self::sanitizeTableSettings($data['settings'], $options);
        }

        if (isset($data['data']) && is_array($data['data'])) {
            foreach ($data['data'] as $rowIdx => $row) {
                if (!is_array($row)) {
                    continue;
                }
                foreach ($row as $cellIdx => $cell) {
                    if (!is_array($cell)) {
                        continue;
                    }
                    if (isset($cell['value']) && is_string($cell['value'])) {
                        $data['data'][$rowIdx][$cellIdx]['value'] = sanitize_text_field($cell['value']);
                    }
                    // json_decode(…, true) turns empty {} into []; restore as stdClass so
                    // the "type: object" constraint in the JSON Schema is satisfied.
                    if (array_key_exists('settings', $cell) && $cell['settings'] === []) {
                        $data['data'][$rowIdx][$cellIdx]['settings'] = new \stdClass();
                    }
                }
            }
        }

        return $data;
    }

    /**
     * Recursively sanitizes string values inside a TABLE settings sub-object.
     * Non-string scalars (integers, booleans) are preserved unchanged.
     *
     * @param array<mixed> $settings
     * @param array<string, mixed> $options
     * @return array<mixed>
     */
    private static function sanitizeTableSettings(array $settings, array $options): array
    {
        foreach ($settings as $key => $value) {
            if (is_string($value)) {
                $settings[$key] = sanitize_text_field($value);
            } elseif (is_array($value)) {
                $settings[$key] = self::sanitizeTableSettings($value, $options);
            }
            // Booleans and integers are preserved as-is.
        }

        return $settings;
    }

    // ── HTML sanitization ─────────────────────────────────────────────────────

    /**
     * Sanitizes a Textarea value holding JSON without corrupting it (#1370).
     *
     * The plain textarea policy (sanitize_textarea_field / wp_kses) runs on the
     * raw JSON text: it strips tags and %xx sequences inside JSON strings, and
     * with "Allow HTML" on it HTML-encodes & and mangles < / >. The generic JSON
     * branch doesn't help either: admin POST data is slashed (so it is not valid
     * JSON as received), and it re-encodes numbers as strings.
     *
     * Here each string leaf is sanitized on its own (tags stripped, or kept per
     * the post HTML allowlist when allow_html is on). When nothing had to be
     * removed the original text is kept byte for byte (formatting, number
     * precision, escape sequences). Like the plain textarea policy, the result
     * is returned unslashed. A value flagged 'unslashed' (#1380) is not slashed
     * to begin with: unslashing it would strip its JSON escapes (\", \n, \/).
     *
     * @param string $value
     * @param array<string, mixed> $policy
     *
     * @return string|null null when $value is not JSON
     */
    private static function sanitizeTextareaJson(string $value, array $policy): ?string
    {
        if (!JSON::isValid($value)) {
            if (!empty($policy['unslashed'])) {
                return null;
            }

            $unslashed = wp_unslash($value);

            if (!JSON::isValid($unslashed)) {
                return null;
            }

            $value = $unslashed;
        }

        $decoded = json_decode($value, true);

        if (!is_array($decoded)) {
            return null;
        }

        $changed = false;

        array_walk_recursive($decoded, static function (&$leaf) use ($policy, &$changed) {
            if (!is_string($leaf)) {
                return;
            }

            $clean = $policy['allow_html'] ? self::sanitizeHtml($leaf, $policy) : self::stripTags($leaf);

            // wp_kses only normalizing entities (& -> &amp;, a lone < -> &lt;)
            // removed nothing: keep the original text
            if (html_entity_decode($clean, ENT_QUOTES | ENT_HTML5, 'UTF-8') === html_entity_decode($leaf, ENT_QUOTES | ENT_HTML5, 'UTF-8')) {
                return;
            }

            if ($clean !== $leaf) {
                $leaf    = $clean;
            }
        });

        if ($changed) {
            $flags = JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION;

            if (strpos($value, "\n") !== false) {
                $flags |= JSON_PRETTY_PRINT;
            }

            $value = (string) json_encode($decoded, $flags);
        }

        return $value;
    }

    /**
     * wp_strip_all_tags() without its trim(): inside JSON, whitespace is data
     * (e.g. a block's "\n\n" innerHTML), not formatting to tidy up (#1370).
     */
    private static function stripTags(string $value): string
    {
        $value = (string) preg_replace('@<(script|style)[^>]*?>.*?</\\1>@si', '', $value);

        return strip_tags($value);
    }

    /**
     * @param array<string, mixed> $policy
     */
    private static function sanitizeHtml(string $html, array $policy): string
    {
        $allowed = wp_kses_allowed_html('post');

        // xlink attributes for SVG anchors
        $allowed['a']['xlink:title'] = true;
        $allowed['a']['xlink:type']  = true;
        $allowed['a']['xlink:href']  = true;

        if ($policy['allow_svg']) {
            $allowed = array_merge($allowed, self::svgWhitelist());
        }

        if ($policy['allow_iframe']) {
            $allowed['iframe'] = [
                'src'             => true,
                'width'           => true,
                'height'          => true,
                'frameborder'     => true,
                'allowfullscreen' => true,
            ];
        }

        return wp_kses($html, $allowed);
    }

    /** @return array<string, array<string, bool>> */
    private static function svgWhitelist(): array
    {
        return [
            'svg' => [
                'aria-hidden'     => true,
                'aria-labelledby' => true,
                'class'           => true,
                'id'              => true,
                'role'            => true,
                'style'           => true,
                'xmlns'           => true,
                'width'           => true,
                'height'          => true,
                'version'         => true,
                'viewBox'         => true,
                'viewbox'         => true,
                'xmlns:svg'       => true,
            ],
            'g' => [
                'fill'      => true,
                'id'        => true,
                'style'     => true,
                'transform' => true,
            ],
            'line' => [
                'id'    => true,
                'x1'    => true,
                'y1'    => true,
                'x2'    => true,
                'y2'    => true,
                'style' => true,
            ],
            'polyline' => [
                'id'     => true,
                'points' => true,
                'style'  => true,
            ],
            'path' => [
                'd'     => true,
                'id'    => true,
                'fill'  => true,
                'name'  => true,
                'style' => true,
            ],
            'circle' => [
                'cx'    => true,
                'cy'    => true,
                'id'    => true,
                'r'     => true,
                'style' => true,
            ],
            'rect' => [
                'id'     => true,
                'x'      => true,
                'y'      => true,
                'width'  => true,
                'height' => true,
                'rx'     => true,
                'ry'     => true,
                'style'  => true,
                'fill'   => true,
            ],
            'text' => [
                'id'           => true,
                'x'            => true,
                'y'            => true,
                'style'        => true,
                'text-anchor'  => true,
                'font-size'    => true,
                'font-family'  => true,
                'fill'         => true,
            ],
        ];
    }

    // ── Recursive helpers ─────────────────────────────────────────────────────

    /**
     * @param array<mixed> $data
     * @param array<string, mixed> $options
     * @param array<int, string> $skipKeys
     * @return array<mixed>
     */
    private static function sanitizeArray(string $type, array $data, array $options, array $skipKeys = []): array
    {
        foreach ($data as $key => $value) {
            if (in_array($key, $skipKeys, true)) {
                continue;
            }
            $data[$key] = is_array($value)
                ? self::sanitizeArray($type, $value, $options, $skipKeys)
                : self::sanitizeRawData($type, $value, $options);
        }

        return $data;
    }

    /**
     * @param array<string, mixed> $options
     */
    private static function sanitizeJson(string $type, string $json, array $options): string
    {
        $decoded = json_decode($json, true);

        // If decoding fails or yields a scalar (e.g. json "true", "42"),
        // fall back to sanitizing as a plain string of the given type.
        if (!is_array($decoded)) {
            $policy = self::getPolicy($type, $options);
            return (string) self::applyPolicy($policy, $json);
        }

        $skipKeys = [];

        if (isset($decoded['img'])) {
            $decoded['img'] = self::sanitizeBase64Image($decoded['img']);
            $skipKeys[] = 'img';
        }

        // When sanitizing decoded JSON values, preserve whitespace characters
        // (\n, \t) that would otherwise be stripped by sanitize_text_field.
        $jsonOptions = array_merge($options, ['preserve_whitespace' => true]);

        $decoded = self::sanitizeArray($type, $decoded, $jsonOptions, $skipKeys);

        if (empty($decoded)) {
            // Avoid encoding empty arrays as JSON objects ({}).
            return '[]';
        }

        $encoded = json_encode($decoded, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        if ($encoded === false) {
            return '[]';
        }

        return $encoded;
    }

    // ── Public utilities ──────────────────────────────────────────────────────

    /**
     * Sanitizes a Base64-encoded image string.
     * Returns an empty string when the value is not a valid Base64 image.
     */
    /**
     * @param string $base64
     *
     * @return string
     */
    public static function sanitizeBase64Image(string $base64): string
    {
        if (Strings::isValidBase64Image($base64)) {
            return $base64;
        }

        return '';
    }
}
