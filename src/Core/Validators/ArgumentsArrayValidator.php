<?php

namespace ACPT_Lite\Core\Validators;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Utils\Wordpress\Translator;

class ArgumentsArrayValidator
{
    /**
     * @var array<int, string>
     */
    private array $errors = [];

    /**
     * @return array<int, string>
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * @param array<string, mixed> $keys
     * @param array<string, mixed> $args
     * @param bool $inLoop
     *
     * @return bool
     */
    public function validate(array $keys, array $args, ?bool $inLoop = false): bool
    {
        if ($inLoop === false) {
            $this->errors = [];
        }

        $normalizedKeys = [];
        $normalizedArgs = [];

        foreach ($keys as $key => $values) {
            $normalizedKeys[Strings::toCamelCase($key)] = $values;
        }

        foreach ($args as $key => $values) {
            $normalizedArgs[Strings::toCamelCase($key)] = $values;
        }

        foreach ($normalizedKeys as $key => $values) {
            if (
                $values['required'] === true
                && (!array_key_exists($key, $normalizedArgs) || $normalizedArgs[$key] === null)
            ) {
                $this->errors[] = '`' .$key . '` key is mandatory.';
            }

            if (isset($normalizedArgs[$key])) {
                $value = $normalizedArgs[$key];
                $get_type = gettype($value);
                $types = explode("|", $values['type']);

                if (!in_array($get_type, $types)) {
                    $this->errors[] = '`' .$key . '` is '.$get_type.' (allowed:'.implode(',', $types).').';
                }

                if (isset($values['enum'])) {
                    if (is_array($value)) {
                        foreach ($value as $v) {
                            if (!in_array($v, $values['enum'])) {
                                $this->errors[] = '`' .$v . '` is not allowed value (allowed:'.implode(',', $types).').';
                            }
                        }
                    } else {
                        if (!in_array($value, $values['enum'])) {
                            $this->errors[] = '`' .$value . '` is not allowed value (allowed:'.implode(',', $types).').';
                        }
                    }
                }

                if (isset($values['instanceOf']) && $get_type === 'object') {
                    if ($values['required'] && !$value instanceof $values['instanceOf']) {
                        $this->errors[] = 'The object is not a valid instance of ' . $values['instanceOf'];
                    }
                }

                if (isset($values['rules']) && $get_type === 'array') {
                    $this->validate($values['rules'], $normalizedArgs[$key], true);
                }
            }
        }

        foreach (array_keys($normalizedArgs) as $keyArg) {
            if (!array_key_exists($keyArg, $normalizedKeys)) {
                $this->errors[] = $keyArg . ' is not allowed key.';
            }
        }

        return empty($this->errors);
    }

    /**
     * @return string
     */
    public function errorMessage(): string
    {
        return static::class . ': '.Translator::translate('Invalid data provided').'. Errors: {' . implode(", ", self::getErrors()) . '}';
    }
}
