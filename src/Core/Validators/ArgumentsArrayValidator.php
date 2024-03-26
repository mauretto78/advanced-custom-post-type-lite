<?php

namespace ACPT_Lite\Core\Validators;

use ACPT_Lite\Utils\Translator;

class ArgumentsArrayValidator
{
	/**
	 * @var array
	 */
	private $errors = [];

	/**
	 * @return array
	 */
	public function getErrors()
	{
		return $this->errors;
	}

	/**
	 * @param array $keys
	 * @param array $args
	 *
	 * @return bool
	 */
	public function validate(array $keys, array $args)
	{
		foreach ($keys as $key => $values){

			if($values['required'] === true and !array_key_exists($key, $args)){
				$this->errors[] = '`' .$key . '` key is mandatory.';
			}

			if(isset($args[$key])){

				$value = $args[$key];
				$get_type = gettype($value);
				$types = explode("|", $values['type']);

				if(!in_array($get_type, $types)){
					$this->errors[] = '`' .$key . '` is '.$get_type.' (allowed:'.implode(',', $types).').';
				}

				if(isset($values['enum'])){
					if(is_array($value)){
						foreach ($value as $v){
							if(!in_array($v, $values['enum'])){
								$this->errors[] = '`' .$v . '` is not allowed value (allowed:'.implode(',', $types).').';
							}
						}
					} else {
						if(!in_array($value, $values['enum'])){
							$this->errors[] = '`' .$value . '` is not allowed value (allowed:'.implode(',', $types).').';
						}
					}
				}

				if(isset($values['instanceOf']) and $get_type === 'object'){

					if(!$value instanceof $values['instanceOf']){
						$this->errors[] = 'The object is not a valid instance of ' . $values['instanceOf'];
					}
				}
			}
		}

		foreach (array_keys($args) as $keyArg){
			if(!array_key_exists($keyArg, $keys)){
				$this->errors[] = $keyArg . ' is not allowed key.';
			}
		}

		return empty($this->errors);
	}

	/**
	 * @return string
	 */
	public function errorMessage()
	{
		return static::class . ': '.Translator::translate('Invalid data provided').'. Errors: {' . implode(", ", self::getErrors()) . '}';
	}
}