<?php

namespace ACPT_Lite\Utils\Data;

use ACPT_Lite\Core\JSON\AbstractJSONSchema;
use Swaggest\JsonSchema\InvalidValue;
use Swaggest\JsonSchema\Schema;
use Swaggest\JsonSchema\SchemaContract;

class JSONSchemaValidator
{
    /**
     * The JSON schema
     *
     * @var SchemaContract
     */
    private $schemaContract;

    /**
     * JSONSchemaValidator constructor.
     *
     * @param AbstractJSONSchema $jsonSchema
     *
     * @throws InvalidValue
     * @throws \Swaggest\JsonSchema\Exception
     */
    public function __construct( AbstractJSONSchema $jsonSchema )
    {
        $this->schemaContract = Schema::import( $jsonSchema->toObject() );
    }

    /**
     * @param array $json
     *
     * @throws \Exception
     */
    public function validate(array $json)
    {
        try {
            $this->schemaContract->in(Normalizer::arrayToObject($json));
        } catch (InvalidValue $invalidValue){
            throw new \Exception($invalidValue->inspect()->error);
        } catch (\Exception $exception) {
            throw $exception;
        }
    }
}