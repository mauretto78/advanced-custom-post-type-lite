<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\JSON\CustomPostTypeSchema;
use ACPT_Lite\Core\JSON\FormSchema;
use ACPT_Lite\Core\JSON\MetaGroupSchema;
use ACPT_Lite\Core\JSON\OptionPageSchema;
use ACPT_Lite\Core\JSON\QueryFilterSchema;
use ACPT_Lite\Core\JSON\QueryResultSchema;
use ACPT_Lite\Core\JSON\TaxonomySchema;
use ACPT_Lite\Core\JSON\WooCommerceProductDataFieldSchema;
use ACPT_Lite\Core\JSON\WooCommerceProductDataSchema;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;

class SchemaController extends AbstractController
{
    const SWAGGER_VERSION = '2.0';

    /**
     * @return string
     */
    private function getBasePath()
    {
        $restUrl = get_rest_url();

        if(Strings::contains('?rest_route=', $restUrl)){
            return '/?rest_route=/acpt/v1';
        }

        return '/wp-json/acpt/v1';
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function schema()
    {
        return [
            'swagger' => self::SWAGGER_VERSION,
            'host' => (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : 'http://localhost:83',
            'basePath' => $this->getBasePath(),
            'tags' => $this->getTags(),
            'schemes' => $this->getSchemas(),
            'paths' => $this->getPaths(),
            'definitions' => $this->getModelDefinitions(),
            'securityDefinitions' => $this->getSecurityDefinitions(),
            'security' => $this->getSecurity(),
            'externalDocs' => $this->getExternalDocs(),
        ];
    }

    /**
     * Tag definitions
     *
     * @return array
     */
    private function getTags()
    {
        return [
            [
                'name' => 'cpt',
                'description' => 'Manage ACPT custom post types',
                'externalDocs' => $this->getExternalDocs(),
            ],
	        [
		        'name' => 'taxonomy',
		        'description' => 'Manage taxonomies',
		        'externalDocs' => $this->getExternalDocs(),
	        ],
	        [
		        'name' => 'option-page',
		        'description' => 'Manage option pages',
		        'externalDocs' => $this->getExternalDocs(),
	        ],
	        [
		        'name' => 'meta',
		        'description' => 'Manage custom post types meta',
		        'externalDocs' => $this->getExternalDocs(),
	        ],
	        [
		        'name' => 'form',
		        'description' => 'Manage forms',
		        'externalDocs' => $this->getExternalDocs(),
	        ],
	        [
		        'name' => 'woocommerce',
		        'description' => 'WooCommerce product data',
		        'externalDocs' => $this->getExternalDocs(),
	        ],
            [
                'name' => 'filter',
                'description' => 'Filter posts by query',
                'externalDocs' => $this->getExternalDocs(),
            ],
        ];
    }

    /**
     * http schemas
     *
     * @return array
     */
    private function getSchemas()
    {
        return [
            'http',
            'https',
        ];
    }

    /**
     * Path definitions
     *
     * @return array
     * @throws \Exception
     */
    private function getPaths()
    {
        $paths = [
            '/cpt' => [
                'get' => [
                    'tags' => [
                        'cpt',
                    ],
                    'summary' => 'Get all cpts',
                    'description' => 'Use this endpoint to fetch all the registered cpts',
                    'operationId' => 'getAllCpt',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'page',
                            'in' => 'query',
                            'description' => 'current page',
                            'required' => false,
                            'type' => 'integer',
                        ],
                        [
                            'name' => 'per_page',
                            'in' => 'query',
                            'description' => 'choose pagination size (Max 100)',
                            'required' => false,
                            'type' => 'integer',
                            'minimum' => 1,
                            'maximum' => 100,
                            'default' => 20,
                        ],
                    ],
                    'responses' => [
                        200 => [
                            'description' => 'successful operation',
                            'schema' => $this->getPaginatedResponse('#/definitions/CustomPostType'),
                        ],
                    ],
                ],
                'post' => [
                    'tags' => [
                        'cpt',
                    ],
                    'summary' => 'Create a cpt',
                    'description' => 'Use this endpoint to create a new cpt',
                    'operationId' => 'createCpt',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'body',
                            'in' => 'body',
                            'description' => 'The cpt model',
                            'schema' => [
                                '$ref' => '#/definitions/CustomPostType',
                            ],
                        ],
                    ],
                    'responses' => [
                        201 => [
                            'description' => 'successful operation',
                            'schema' => [
                                '$ref' => '#/definitions/CreateResponse',
                            ],
                        ],
                        500 => [
                            'description' => 'error',
                            'schema' => [
                                '$ref' => '#/definitions/ErrorResponse',
                            ],
                        ],
                    ],
                ],
            ],
            '/cpt/{slug}' => [
                'get' => [
                    'tags' => [
                        'cpt',
                    ],
                    'summary' => 'Get a single cpt',
                    'description' => 'Use this endpoint to fetch a single registered cpt',
                    'operationId' => 'getCpt',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'slug',
                            'in' => 'path',
                            'description' => 'the slug of cpt',
                            'required' => true,
                            'type' => 'string',
                        ],
                    ],
                    'responses' => [
                        200 => [
                            'description' => 'successful operation',
                            'schema' => [
                                '$ref' => '#/definitions/CustomPostType',
                            ],
                        ],
                        404 => [
                            'description' => 'record not found',
                            'schema' => [
                                '$ref' => '#/definitions/NotFoundResponse',
                            ],
                        ],
                    ],
                ],
                'put' => [
                    'tags' => [
                        'cpt',
                    ],
                    'summary' => 'Update a single cpt',
                    'description' => 'Use this endpoint to update a single registered cpt',
                    'operationId' => 'updateCpt',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'slug',
                            'in' => 'path',
                            'description' => 'the slug of cpt',
                            'required' => true,
                            'type' => 'string',
                        ],
                        [
                            'name' => 'body',
                            'in' => 'body',
                            'description' => 'The cpt model',
                            'schema' => [
                                    '$ref' => '#/definitions/CustomPostType',
                            ],
                        ],
                    ],
                    'responses' => [
                        200 => [
                            'description' => 'successful operation',
                            'schema' => [
                                '$ref' => '#/definitions/CustomPostType',
                            ],
                        ],
                        404 => [
                            'description' => 'record not found',
                            'schema' => [
                                '$ref' => '#/definitions/NotFoundResponse',
                            ],
                        ],
                        500 => [
                            'description' => 'error',
                            'schema' => [
                                '$ref' => '#/definitions/ErrorResponse',
                            ],
                        ],
                    ],
                ],
                'delete' => [
                    'tags' => [
                        'cpt',
                    ],
                    'summary' => 'Delete a single cpt',
                    'description' => 'Use this endpoint to delete a single registered cpt',
                    'operationId' => 'deleteCpt',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'slug',
                            'in' => 'path',
                            'description' => 'the slug of cpt',
                            'required' => true,
                            'type' => 'string',
                        ],
                    ],
                    'responses' => [
                        200 => [
                            'description' => 'successful operation',
                            'schema' => [
                                '$ref' => '#/definitions/DeleteResponse',
                            ],
                        ],
                        404 => [
                            'description' => 'record not found',
                            'schema' => [
                                '$ref' => '#/definitions/NotFoundResponse',
                            ],
                        ],
                        500 => [
                            'description' => 'error',
                            'schema' => [
                                '$ref' => '#/definitions/ErrorResponse',
                            ],
                        ],
                    ],
                ],
            ],
            '/taxonomy' => [
                'get' => [
                    'tags' => [
                        'taxonomy',
                    ],
                    'summary' => 'Get all taxonomies',
                    'description' => 'Use this endpoint to fetch all the registered taxonomies',
                    'operationId' => 'getAllTaxonomies',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'page',
                            'in' => 'query',
                            'description' => 'current page',
                            'required' => false,
                            'type' => 'integer',
                        ],
                        [
                            'name' => 'per_page',
                            'in' => 'query',
                            'description' => 'choose pagination size (Max 100)',
                            'required' => false,
                            'type' => 'integer',
                            'minimum' => 1,
                            'maximum' => 100,
                            'default' => 20,
                        ],
                    ],
                    'responses' => [
                        200 => [
                            'description' => 'successful operation',
                            'schema' => $this->getPaginatedResponse('#/definitions/Taxonomy'),
                        ],
                    ],
                ],
                'post' => [
                    'tags' => [
                        'taxonomy',
                    ],
                    'summary' => 'Create a taxonomy',
                    'description' => 'Use this endpoint to create a new taxonomy',
                    'operationId' => 'createTaxonomy',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'body',
                            'in' => 'body',
                            'description' => 'The taxonomy model',
                            'schema' => [
                                '$ref' => '#/definitions/Taxonomy',
                            ],
                        ],
                    ],
                    'responses' => [
                        201 => [
                            'description' => 'successful operation',
                            'schema' => [
                                '$ref' => '#/definitions/CreateResponse',
                            ],
                        ],
                        500 => [
                            'description' => 'error',
                            'schema' => [
                                '$ref' => '#/definitions/ErrorResponse',
                            ],
                        ],
                    ],
                ],
            ],
            '/taxonomy/{slug}' => [
                'get' => [
                    'tags' => [
                        'taxonomy',
                    ],
                    'summary' => 'Get a single taxonomy',
                    'description' => 'Use this endpoint to fetch a single registered taxonomy',
                    'operationId' => 'getTaxonomy',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'slug',
                            'in' => 'path',
                            'description' => 'the slug of taxonomy',
                            'required' => true,
                            'type' => 'string',
                        ],
                    ],
                    'responses' => [
                        200 => [
                            'description' => 'successful operation',
                            'schema' => [
                                '$ref' => '#/definitions/Taxonomy',
                            ],
                        ],
                        404 => [
                            'description' => 'record not found',
                            'schema' => [
                                '$ref' => '#/definitions/NotFoundResponse',
                            ],
                        ],
                    ],
                ],
                'put' => [
                    'tags' => [
                        'taxonomy',
                    ],
                    'summary' => 'Update a single taxonomy',
                    'description' => 'Use this endpoint to update a single registered taxonomy',
                    'operationId' => 'updateTaxonomy',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'slug',
                            'in' => 'path',
                            'description' => 'the slug of taxonomy',
                            'required' => true,
                            'type' => 'string',
                        ],
                        [
                            'name' => 'body',
                            'in' => 'body',
                            'description' => 'The taxonomy model',
                            'schema' => [
                                '$ref' => '#/definitions/Taxonomy',
                            ],
                        ],
                    ],
                    'responses' => [
                        200 => [
                            'description' => 'successful operation',
                            'schema' => [
                                '$ref' => '#/definitions/Taxonomy',
                            ],
                        ],
                        404 => [
                            'description' => 'record not found',
                            'schema' => [
                                '$ref' => '#/definitions/NotFoundResponse',
                            ],
                        ],
                        500 => [
                            'description' => 'error',
                            'schema' => [
                                '$ref' => '#/definitions/ErrorResponse',
                            ],
                        ],
                    ],
                ],
                'delete' => [
                    'tags' => [
                        'taxonomy',
                    ],
                    'summary' => 'Delete a single taxonomy',
                    'description' => 'Use this endpoint to delete a single registered taxonomy',
                    'operationId' => 'deleteTaxonomy',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'slug',
                            'in' => 'path',
                            'description' => 'the slug of taxonomy',
                            'required' => true,
                            'type' => 'string',
                        ],
                    ],
                    'responses' => [
                        200 => [
                            'description' => 'successful operation',
                            'schema' => [
                                '$ref' => '#/definitions/DeleteResponse',
                            ],
                        ],
                        404 => [
                            'description' => 'record not found',
                            'schema' => [
                                '$ref' => '#/definitions/NotFoundResponse',
                            ],
                        ],
                        500 => [
                            'description' => 'error',
                            'schema' => [
                                '$ref' => '#/definitions/ErrorResponse',
                            ],
                        ],
                    ],
                ],
            ],
            '/taxonomy/assoc/{slug}/{cpt}' => [
                'post' => [
                    'tags' => [
                        'taxonomy',
                    ],
                    'summary' => 'Associate a taxonomy to a cpt',
                    'description' => 'Use this endpoint to associate a registered taxonomy to a cpt',
                    'operationId' => 'assocTaxonomy',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'slug',
                            'in' => 'path',
                            'description' => 'the slug of taxonomy',
                            'required' => true,
                            'type' => 'string',
                        ],
                        [
                            'name' => 'cpt',
                            'in' => 'path',
                            'description' => 'the slug of custom post type',
                            'required' => true,
                            'type' => 'string',
                        ],
                    ],
                    'responses' => [
                        200 => [
                            'description' => 'successful operation',
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'cptId' => [
                                        'type' => 'string',
                                        'format' => 'uuid',
                                    ],
                                    'taxonomyId' => [
                                        'type' => 'string',
                                        'format' => 'uuid',
                                    ],
                                ],
                            ],
                        ],
                        404 => [
                            'description' => 'record not found',
                            'schema' => [
                                '$ref' => '#/definitions/NotFoundResponse',
                            ],
                        ],
                        500 => [
                            'description' => 'error',
                            'schema' => [
                                '$ref' => '#/definitions/ErrorResponse',
                            ],
                        ],
                    ],
                ]
            ],
            '/option-page' => [
	            'get' => [
		            'tags' => [
			            'option-page',
		            ],
		            'summary' => 'Get all option pages',
		            'description' => 'Use this endpoint to fetch all the registered option pages',
		            'operationId' => 'getAllOptionPages',
		            'consumes' => [
			            'application/json',
		            ],
		            'produces' => [
			            'application/json',
		            ],
		            'parameters' => [
			            [
				            'name' => 'page',
				            'in' => 'query',
				            'description' => 'current page',
				            'required' => false,
				            'type' => 'integer',
			            ],
			            [
				            'name' => 'per_page',
				            'in' => 'query',
				            'description' => 'choose pagination size (Max 100)',
				            'required' => false,
				            'type' => 'integer',
				            'minimum' => 1,
				            'maximum' => 100,
				            'default' => 20,
			            ],
		            ],
		            'responses' => [
			            200 => [
				            'description' => 'successful operation',
				            'schema' => $this->getPaginatedResponse('#/definitions/OptionPage'),
			            ],
		            ],
	            ],
	            'post' => [
		            'tags' => [
			            'option-page',
		            ],
		            'summary' => 'Create a option page',
		            'description' => 'Use this endpoint to create a new option page',
		            'operationId' => 'createOptionPage',
		            'consumes' => [
			            'application/json',
		            ],
		            'produces' => [
			            'application/json',
		            ],
		            'parameters' => [
			            [
				            'name' => 'body',
				            'in' => 'body',
				            'description' => 'The taxonomy model',
				            'schema' => [
					            '$ref' => '#/definitions/OptionPage',
				            ],
			            ],
		            ],
		            'responses' => [
			            201 => [
				            'description' => 'successful operation',
				            'schema' => [
					            '$ref' => '#/definitions/CreateResponse',
				            ],
			            ],
			            500 => [
				            'description' => 'error',
				            'schema' => [
					            '$ref' => '#/definitions/ErrorResponse',
				            ],
			            ],
		            ],
	            ],
            ],
            '/option-page/{slug}' => [
	            'get' => [
		            'tags' => [
			            'option-page',
		            ],
		            'summary' => 'Get a single option page',
		            'description' => 'Use this endpoint to fetch a single registered option page',
		            'operationId' => 'getOptionPage',
		            'consumes' => [
			            'application/json',
		            ],
		            'produces' => [
			            'application/json',
		            ],
		            'parameters' => [
			            [
				            'name' => 'slug',
				            'in' => 'path',
				            'description' => 'the slug of the option page',
				            'required' => true,
				            'type' => 'string',
			            ],
		            ],
		            'responses' => [
			            200 => [
				            'description' => 'successful operation',
				            'schema' => [
					            '$ref' => '#/definitions/OptionPage',
				            ],
			            ],
			            404 => [
				            'description' => 'record not found',
				            'schema' => [
					            '$ref' => '#/definitions/NotFoundResponse',
				            ],
			            ],
		            ],
	            ],
	            'put' => [
		            'tags' => [
			            'option-page',
		            ],
		            'summary' => 'Update a single option page',
		            'description' => 'Use this endpoint to update a single registered option page',
		            'operationId' => 'updateOptionPage',
		            'consumes' => [
			            'application/json',
		            ],
		            'produces' => [
			            'application/json',
		            ],
		            'parameters' => [
			            [
				            'name' => 'slug',
				            'in' => 'path',
				            'description' => 'the slug of option page',
				            'required' => true,
				            'type' => 'string',
			            ],
			            [
				            'name' => 'body',
				            'in' => 'body',
				            'description' => 'The option page model',
				            'schema' => [
					            '$ref' => '#/definitions/Taxonomy',
				            ],
			            ],
		            ],
		            'responses' => [
			            200 => [
				            'description' => 'successful operation',
				            'schema' => [
					            '$ref' => '#/definitions/OptionPage',
				            ],
			            ],
			            404 => [
				            'description' => 'record not found',
				            'schema' => [
					            '$ref' => '#/definitions/NotFoundResponse',
				            ],
			            ],
			            500 => [
				            'description' => 'error',
				            'schema' => [
					            '$ref' => '#/definitions/ErrorResponse',
				            ],
			            ],
		            ],
	            ],
	            'delete' => [
		            'tags' => [
			            'option-page',
		            ],
		            'summary' => 'Delete a single option page',
		            'description' => 'Use this endpoint to delete a single registered option page',
		            'operationId' => 'deleteOptionPage',
		            'consumes' => [
			            'application/json',
		            ],
		            'produces' => [
			            'application/json',
		            ],
		            'parameters' => [
			            [
				            'name' => 'slug',
				            'in' => 'path',
				            'description' => 'the slug of option page',
				            'required' => true,
				            'type' => 'string',
			            ],
		            ],
		            'responses' => [
			            200 => [
				            'description' => 'successful operation',
				            'schema' => [
					            '$ref' => '#/definitions/DeleteResponse',
				            ],
			            ],
			            404 => [
				            'description' => 'record not found',
				            'schema' => [
					            '$ref' => '#/definitions/NotFoundResponse',
				            ],
			            ],
			            500 => [
				            'description' => 'error',
				            'schema' => [
					            '$ref' => '#/definitions/ErrorResponse',
				            ],
			            ],
		            ],
	            ],
            ],
            '/meta' => [
	            'get' => [
		            'tags' => [
			            'meta',
		            ],
		            'summary' => 'Get the meta groups',
		            'description' => 'Use this endpoint to fetch the meta groups',
		            'operationId' => 'getAllMetaGroups',
		            'consumes' => [
			            'application/json',
		            ],
		            'produces' => [
			            'application/json',
		            ],
		            'parameters' => [
			            [
				            'name' => 'page',
				            'in' => 'query',
				            'description' => 'current page',
				            'required' => false,
				            'type' => 'integer',
			            ],
			            [
				            'name' => 'per_page',
				            'in' => 'query',
				            'description' => 'choose pagination size (Max 100)',
				            'required' => false,
				            'type' => 'integer',
				            'minimum' => 1,
				            'maximum' => 100,
				            'default' => 20,
			            ],
		            ],
		            'responses' => [
			            200 => [
				            'description' => 'successful operation',
				            'schema' => $this->getPaginatedResponse('#/definitions/MetaGroup'),
			            ],
			            404 => [
				            'description' => 'record not found',
				            'schema' => [
					            '$ref' => '#/definitions/NotFoundResponse',
				            ],
			            ],
		            ],
	            ],
	            'post' => [
		            'tags' => [
			            'meta',
		            ],
		            'summary' => 'Create meta groups',
		            'description' => 'Use this endpoint to create a meta group',
		            'operationId' => 'createMetaGroup',
		            'consumes' => [
			            'application/json',
		            ],
		            'produces' => [
			            'application/json',
		            ],
		            'parameters' => [
			            [
				            'name' => 'body',
				            'in' => 'body',
				            'description' => 'The meta group model',
				            'schema' => [
					            '$ref' => '#/definitions/MetaGroup',
				            ],
			            ],
		            ],
		            'responses' => [
			            201 => [
				            'description' => 'successful operation',
				            'schema' => [
					            '$ref' => '#/definitions/DeleteResponse',
				            ],
			            ],
			            500 => [
				            'description' => 'error',
				            'schema' => [
					            '$ref' => '#/definitions/ErrorResponse',
				            ],
			            ],
		            ],
	            ],
            ],
            '/meta/{id}' => [
	            'get' => [
		            'tags' => [
			            'meta',
		            ],
		            'summary' => 'Get a single meta group',
		            'description' => 'Use this endpoint to fetch a single meta group',
		            'operationId' => 'getSingleMetaGroup',
		            'consumes' => [
			            'application/json',
		            ],
		            'produces' => [
			            'application/json',
		            ],
		            'parameters' => [
			            [
				            'name' => 'id',
				            'in' => 'path',
				            'description' => 'the id of meta group',
				            'required' => true,
				            'type' => 'string',
				            'format' => 'uuid',
			            ],
		            ],
		            'responses' => [
			            200 => [
				            'description' => 'successful operation',
				            'schema' => [
					            '$ref' => '#/definitions/MetaGroup',
				            ],
			            ],
			            404 => [
				            'description' => 'record not found',
				            'schema' => [
					            '$ref' => '#/definitions/NotFoundResponse',
				            ],
			            ],
		            ],
	            ],
	            'put' => [
		            'tags' => [
			            'meta',
		            ],
		            'summary' => 'Update meta groups',
		            'description' => 'Use this endpoint to update meta groups',
		            'operationId' => 'updateMetaGroup',
		            'consumes' => [
			            'application/json',
		            ],
		            'produces' => [
			            'application/json',
		            ],
		            'parameters' => [
			            [
				            'name' => 'id',
				            'in' => 'path',
				            'description' => 'the id of meta group',
				            'required' => true,
				            'type' => 'string',
				            'format' => 'uuid',
			            ],
			            [
				            'name' => 'body',
				            'in' => 'body',
				            'description' => 'The meta group model',
				            'schema' => [
					            '$ref' => '#/definitions/MetaGroup',
				            ],
			            ],
		            ],
		            'responses' => [
			            200 => [
				            'description' => 'successful operation',
				            'schema' => [
					            '$ref' => '#/definitions/DeleteResponse',
				            ],
			            ],
			            500 => [
				            'description' => 'error',
				            'schema' => [
					            '$ref' => '#/definitions/ErrorResponse',
				            ],
			            ],
		            ],
	            ],
	            'delete' => [
		            'tags' => [
			            'meta',
		            ],
		            'summary' => 'Delete a single meta group',
		            'description' => 'Use this endpoint to delete a single meta group',
		            'operationId' => 'deleteMetaGroup',
		            'consumes' => [
			            'application/json',
		            ],
		            'produces' => [
			            'application/json',
		            ],
		            'parameters' => [
			            [
				            'name' => 'id',
				            'in' => 'path',
				            'description' => 'the id of meta group',
				            'required' => true,
				            'type' => 'string',
				            'format' => 'uuid',
			            ],
		            ],
		            'responses' => [
			            200 => [
				            'description' => 'successful operation',
				            'schema' => [
					            '$ref' => '#/definitions/DeleteResponse',
				            ],
			            ],
			            404 => [
				            'description' => 'record not found',
				            'schema' => [
					            '$ref' => '#/definitions/NotFoundResponse',
				            ],
			            ],
			            500 => [
				            'description' => 'error',
				            'schema' => [
					            '$ref' => '#/definitions/ErrorResponse',
				            ],
			            ],
		            ],
	            ],
            ],
	        '/form' => [
		        'get' => [
			        'tags' => [
				        'form',
			        ],
			        'summary' => 'Get the forms',
			        'description' => 'Use this endpoint to fetch the forms',
			        'operationId' => 'getAllForms',
			        'consumes' => [
				        'application/json',
			        ],
			        'produces' => [
				        'application/json',
			        ],
			        'parameters' => [
				        [
					        'name' => 'page',
					        'in' => 'query',
					        'description' => 'current page',
					        'required' => false,
					        'type' => 'integer',
				        ],
				        [
					        'name' => 'per_page',
					        'in' => 'query',
					        'description' => 'choose pagination size (Max 100)',
					        'required' => false,
					        'type' => 'integer',
					        'minimum' => 1,
					        'maximum' => 100,
					        'default' => 20,
				        ],
			        ],
			        'responses' => [
				        200 => [
					        'description' => 'successful operation',
					        'schema' => $this->getPaginatedResponse('#/definitions/Form'),
				        ],
				        404 => [
					        'description' => 'record not found',
					        'schema' => [
						        '$ref' => '#/definitions/NotFoundResponse',
					        ],
				        ],
			        ],
		        ],
		        'post' => [
			        'tags' => [
				        'form',
			        ],
			        'summary' => 'Create forms',
			        'description' => 'Use this endpoint to create a form',
			        'operationId' => 'createForm',
			        'consumes' => [
				        'application/json',
			        ],
			        'produces' => [
				        'application/json',
			        ],
			        'parameters' => [
				        [
					        'name' => 'body',
					        'in' => 'body',
					        'description' => 'The form model',
					        'schema' => [
						        '$ref' => '#/definitions/Form',
					        ],
				        ],
			        ],
			        'responses' => [
				        201 => [
					        'description' => 'successful operation',
					        'schema' => [
						        '$ref' => '#/definitions/DeleteResponse',
					        ],
				        ],
				        500 => [
					        'description' => 'error',
					        'schema' => [
						        '$ref' => '#/definitions/ErrorResponse',
					        ],
				        ],
			        ],
		        ],
	        ],
	        '/form/{id}' => [
		        'get' => [
			        'tags' => [
				        'form',
			        ],
			        'summary' => 'Get a single form',
			        'description' => 'Use this endpoint to fetch a single form',
			        'operationId' => 'getSingleForm',
			        'consumes' => [
				        'application/json',
			        ],
			        'produces' => [
				        'application/json',
			        ],
			        'parameters' => [
				        [
					        'name' => 'id',
					        'in' => 'path',
					        'description' => 'the id of form',
					        'required' => true,
					        'type' => 'string',
					        'format' => 'uuid',
				        ],
			        ],
			        'responses' => [
				        200 => [
					        'description' => 'successful operation',
					        'schema' => [
						        '$ref' => '#/definitions/Form',
					        ],
				        ],
				        404 => [
					        'description' => 'record not found',
					        'schema' => [
						        '$ref' => '#/definitions/NotFoundResponse',
					        ],
				        ],
			        ],
		        ],
		        'put' => [
			        'tags' => [
				        'form',
			        ],
			        'summary' => 'Update form',
			        'description' => 'Use this endpoint to update forms',
			        'operationId' => 'updateForm',
			        'consumes' => [
				        'application/json',
			        ],
			        'produces' => [
				        'application/json',
			        ],
			        'parameters' => [
				        [
					        'name' => 'id',
					        'in' => 'path',
					        'description' => 'the id of form',
					        'required' => true,
					        'type' => 'string',
					        'format' => 'uuid',
				        ],
				        [
					        'name' => 'body',
					        'in' => 'body',
					        'description' => 'The form model',
					        'schema' => [
						        '$ref' => '#/definitions/Form',
					        ],
				        ],
			        ],
			        'responses' => [
				        200 => [
					        'description' => 'successful operation',
					        'schema' => [
						        '$ref' => '#/definitions/DeleteResponse',
					        ],
				        ],
				        500 => [
					        'description' => 'error',
					        'schema' => [
						        '$ref' => '#/definitions/ErrorResponse',
					        ],
				        ],
			        ],
		        ],
		        'delete' => [
			        'tags' => [
				        'form',
			        ],
			        'summary' => 'Delete a single form',
			        'description' => 'Use this endpoint to delete a single form',
			        'operationId' => 'deleteForm',
			        'consumes' => [
				        'application/json',
			        ],
			        'produces' => [
				        'application/json',
			        ],
			        'parameters' => [
				        [
					        'name' => 'id',
					        'in' => 'path',
					        'description' => 'the id of form',
					        'required' => true,
					        'type' => 'string',
					        'format' => 'uuid',
				        ],
			        ],
			        'responses' => [
				        200 => [
					        'description' => 'successful operation',
					        'schema' => [
						        '$ref' => '#/definitions/DeleteResponse',
					        ],
				        ],
				        404 => [
					        'description' => 'record not found',
					        'schema' => [
						        '$ref' => '#/definitions/NotFoundResponse',
					        ],
				        ],
				        500 => [
					        'description' => 'error',
					        'schema' => [
						        '$ref' => '#/definitions/ErrorResponse',
					        ],
				        ],
			        ],
		        ],
	        ],
            '/woocommerce/product-data' => [
                'get' => [
                    'tags' => [
                        'woocommerce',
                    ],
                    'summary' => 'Get all WooCommerce product data',
                    'description' => 'Use this endpoint to fetch all the registered WooCommerce product data',
                    'operationId' => 'getAllWooCommerceProductData',
                    'consumes' => [
                            'application/json',
                    ],
                    'produces' => [
                            'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'page',
                            'in' => 'query',
                            'description' => 'current page',
                            'required' => false,
                            'type' => 'integer',
                        ],
                        [
                            'name' => 'per_page',
                            'in' => 'query',
                            'description' => 'choose pagination size (Max 100)',
                            'required' => false,
                            'type' => 'integer',
                            'minimum' => 1,
                            'maximum' => 100,
                            'default' => 20,
                        ],
                    ],
                    'responses' => [
                        200 => [
                            'description' => 'successful operation',
                            'schema' => $this->getPaginatedResponse('#/definitions/WooCommerceProductData'),
                        ],
                    ],
                ],
                'post' => [
                    'tags' => [
                        'woocommerce',
                    ],
                    'summary' => 'Create a WooCommerce product data',
                    'description' => 'Use this endpoint to create a new WooCommerce product data',
                    'operationId' => 'createWooCommerceProductData',
                    'consumes' => [
                        'application/json',
                    ],
                    'produces' => [
                        'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'body',
                            'in' => 'body',
                            'description' => 'The WooCommerce product data model',
                            'schema' => [
                                '$ref' => '#/definitions/WooCommerceProductData',
                            ],
                        ],
                    ],
                    'responses' => [
                        201 => [
                            'description' => 'successful operation',
                            'schema' => [
                                    '$ref' => '#/definitions/CreateResponse',
                            ],
                        ],
                        500 => [
                            'description' => 'error',
                            'schema' => [
                                    '$ref' => '#/definitions/ErrorResponse',
                            ],
                        ],
                    ],
                ],
            ],
            '/woocommerce/product-data/{id}' => [
                    'get' => [
                            'tags' => [
                                    'woocommerce',
                            ],
                            'summary' => 'Get a single WooCommerce product data',
                            'description' => 'Use this endpoint to fetch a single registered WooCommerce product data',
                            'operationId' => 'getWooCommerceProductData',
                            'consumes' => [
                                    'application/json',
                            ],
                            'produces' => [
                                    'application/json',
                            ],
                            'parameters' => [
                                    [
                                            'name' => 'id',
                                            'in' => 'path',
                                            'description' => 'the id of WooCommerce product data',
                                            'required' => true,
                                            'type' => 'string',
                                            'format' => 'uuid',
                                    ],
                            ],
                            'responses' => [
                                    200 => [
                                            'description' => 'successful operation',
                                            'schema' => [
                                                    '$ref' => '#/definitions/WooCommerceProductData',
                                            ],
                                    ],
                                    404 => [
                                            'description' => 'record not found',
                                            'schema' => [
                                                    '$ref' => '#/definitions/NotFoundResponse',
                                            ],
                                    ],
                            ],
                    ],
                    'put' => [
                        'tags' => [
                                'woocommerce',
                        ],
                        'summary' => 'Update a single WooCommerce product data',
                        'description' => 'Use this endpoint to update a single registered WooCommerce product data',
                        'operationId' => 'updateWooCommerceProductData',
                        'consumes' => [
                                'application/json',
                        ],
                        'produces' => [
                                'application/json',
                        ],
                        'parameters' => [
                                [
                                        'name' => 'id',
                                        'in' => 'path',
                                        'description' => 'the id of WooCommerce product data',
                                        'required' => true,
                                        'type' => 'string',
                                        'format' => 'uuid',
                                ],
                                [
                                        'name' => 'body',
                                        'in' => 'body',
                                        'description' => 'The WooCommerce product data model',
                                        'schema' => [
                                                '$ref' => '#/definitions/WooCommerceProductData',
                                        ],
                                ],
                        ],
                        'responses' => [
                                200 => [
                                        'description' => 'successful operation',
                                        'schema' => [
                                                '$ref' => '#/definitions/WooCommerceProductData',
                                        ],
                                ],
                                404 => [
                                        'description' => 'record not found',
                                        'schema' => [
                                                '$ref' => '#/definitions/NotFoundResponse',
                                        ],
                                ],
                                500 => [
                                        'description' => 'error',
                                        'schema' => [
                                                '$ref' => '#/definitions/ErrorResponse',
                                        ],
                                ],
                        ],
                    ],
                    'delete' => [
                            'tags' => [
                                    'woocommerce',
                            ],
                            'summary' => 'Delete a single WooCommerce product data',
                            'description' => 'Use this endpoint to delete a single registered WooCommerce product data',
                            'operationId' => 'deleteWooCommerceProductData',
                            'consumes' => [
                                    'application/json',
                            ],
                            'produces' => [
                                    'application/json',
                            ],
                            'parameters' => [
                                    [
                                            'name' => 'id',
                                            'in' => 'path',
                                            'description' => 'the id of WooCommerce product data',
                                            'required' => true,
                                            'type' => 'string',
                                            'format' => 'uuid',
                                    ],
                            ],
                            'responses' => [
                                    200 => [
                                            'description' => 'successful operation',
                                            'schema' => [
                                                    '$ref' => '#/definitions/DeleteResponse',
                                            ],
                                    ],
                                    404 => [
                                            'description' => 'record not found',
                                            'schema' => [
                                                    '$ref' => '#/definitions/NotFoundResponse',
                                            ],
                                    ],
                                    500 => [
                                            'description' => 'error',
                                            'schema' => [
                                                    '$ref' => '#/definitions/ErrorResponse',
                                            ],
                                    ],
                            ],
                    ],
            ],
            '/woocommerce/product-data/{id}/fields' => [
                'get' => [
                        'tags' => [
                                'woocommerce',
                        ],
                        'summary' => 'Get the WooCommerce product data fields',
                        'description' => 'Use this endpoint to fetch the product data associated to a single WooCommerce product data',
                        'operationId' => 'getWooCommerceProductDataFields',
                        'consumes' => [
                                'application/json',
                        ],
                        'produces' => [
                                'application/json',
                        ],
                        'parameters' => [
                                [
                                        'name' => 'id',
                                        'in' => 'path',
                                        'description' => 'the id of WooCommerce product data',
                                        'required' => true,
                                        'type' => 'string',
                                        'format' => 'uuid',
                                ],
                        ],
                        'responses' => [
                                200 => [
                                        'description' => 'successful operation',
                                        'schema' => [
                                                'type' => 'array',
                                                'items' => [
                                                        '$ref' => '#/definitions/WooCommerceProductDataField'
                                                ]
                                        ],
                                ],
                                404 => [
                                        'description' => 'record not found',
                                        'schema' => [
                                                '$ref' => '#/definitions/NotFoundResponse',
                                        ],
                                ],
                        ],
                ],
                'post' => [
                    'tags' => [
                            'woocommerce',
                    ],
                    'summary' => 'Create WooCommerce product data fields',
                    'description' => 'Use this endpoint to create WooCommerce product data fields',
                    'operationId' => 'createWooCommerceProductDataFields',
                    'consumes' => [
                            'application/json',
                    ],
                    'produces' => [
                            'application/json',
                    ],
                    'parameters' => [
                            [
                                'name' => 'body',
                                'in' => 'body',
                                'description' => 'Array ofWooCommerce product data fields models',
                                'type' => 'array',
                                'items' => [
                                    '$ref' => '#/definitions/WooCommerceProductDataField',
                                ],
                            ],
                    ],
                    'responses' => [
                            201 => [
                                    'description' => 'successful operation',
                                    'schema' => [
                                            '$ref' => '#/definitions/WooCommerceFieldsCreateResponse',
                                    ],
                            ],
                            500 => [
                                    'description' => 'error',
                                    'schema' => [
                                            '$ref' => '#/definitions/ErrorResponse',
                                    ],
                            ],
                    ],
                ],
                'put' => [
                        'tags' => [
                                'woocommerce',
                        ],
                        'summary' => 'Update WooCommerce product data fields',
                        'description' => 'Use this endpoint to update WooCommerce product data fields',
                        'operationId' => 'updateWooCommerceProductDataFields',
                        'consumes' => [
                                'application/json',
                        ],
                        'produces' => [
                                'application/json',
                        ],
                        'parameters' => [
                                [
                                        'name' => 'body',
                                        'in' => 'body',
                                        'description' => 'Array ofWooCommerce product data fields models',
                                        'type' => 'array',
                                        'items' => [
                                                '$ref' => '#/definitions/WooCommerceProductDataField',
                                        ],
                                ],
                        ],
                        'responses' => [
                                200 => [
                                        'description' => 'successful operation',
                                        'schema' => [
                                                '$ref' => '#/definitions/WooCommerceFieldsCreateResponse',
                                        ],
                                ],
                                500 => [
                                        'description' => 'error',
                                        'schema' => [
                                                '$ref' => '#/definitions/ErrorResponse',
                                        ],
                                ],
                        ],
                ],
                'delete' => [
                    'tags' => [
                        'woocommerce',
                    ],
                    'summary' => 'Delete all WooCommerce product data fields',
                    'description' => 'Use this endpoint to delete all fields associated to single WooCommerce product data',
                    'operationId' => 'deleteWooCommerceProductDataFields',
                    'consumes' => [
                            'application/json',
                    ],
                    'produces' => [
                            'application/json',
                    ],
                    'parameters' => [
                            [
                                    'name' => 'id',
                                    'in' => 'path',
                                    'description' => 'the id of WooCommerce product data',
                                    'required' => true,
                                    'type' => 'string',
                                    'format' => 'uuid',
                            ],
                    ],
                    'responses' => [
                            200 => [
                                    'description' => 'successful operation',
                                    'schema' => [
                                            '$ref' => '#/definitions/DeleteResponse',
                                    ],
                            ],
                            404 => [
                                    'description' => 'record not found',
                                    'schema' => [
                                            '$ref' => '#/definitions/NotFoundResponse',
                                    ],
                            ],
                            500 => [
                                    'description' => 'error',
                                    'schema' => [
                                            '$ref' => '#/definitions/ErrorResponse',
                                    ],
                            ],
                    ],
                ],
            ],
            '/woocommerce/product-data/{id}/fields/{field}' => [
                    'get' => [
                            'tags' => [
                                    'woocommerce',
                            ],
                            'summary' => 'Get a single WooCommerce product data field',
                            'description' => 'Use this endpoint to fetch a single registered WooCommerce product data field',
                            'operationId' => 'getWooCommerceProductDataField',
                            'consumes' => [
                                    'application/json',
                            ],
                            'produces' => [
                                    'application/json',
                            ],
                            'parameters' => [
                                    [
                                            'name' => 'id',
                                            'in' => 'path',
                                            'description' => 'the id of WooCommerce product data field',
                                            'required' => true,
                                            'type' => 'string',
                                            'format' => 'uuid',
                                    ],
                            ],
                            'responses' => [
                                    200 => [
                                            'description' => 'successful operation',
                                            'schema' => [
                                                    '$ref' => '#/definitions/WooCommerceProductDataField',
                                            ],
                                    ],
                                    404 => [
                                            'description' => 'record not found',
                                            'schema' => [
                                                    '$ref' => '#/definitions/NotFoundResponse',
                                            ],
                                    ],
                            ],
                    ],
                    'delete' => [
                            'tags' => [
                                'woocommerce',
                            ],
                            'summary' => 'Delete a single WooCommerce product data field',
                            'description' => 'Use this endpoint to delete a single registered WooCommerce product data field',
                            'operationId' => 'deleteWooCommerceProductFataField',
                            'consumes' => [
                                    'application/json',
                            ],
                            'produces' => [
                                    'application/json',
                            ],
                            'parameters' => [
                                [
                                    'name' => 'id',
                                    'in' => 'path',
                                    'description' => 'the slug of cpt',
                                    'required' => true,
                                    'type' => 'string',
                                    'format' => 'uuid',
                                ],
                                [
                                    'name' => 'field',
                                    'in' => 'path',
                                    'description' => 'the slug of cpt',
                                    'required' => true,
                                    'type' => 'string',
                                    'format' => 'uuid',
                                ],
                            ],
                            'responses' => [
                                200 => [
                                    'description' => 'successful operation',
                                    'schema' => [
                                            '$ref' => '#/definitions/DeleteResponse',
                                    ],
                                ],
                                404 => [
                                    'description' => 'record not found',
                                    'schema' => [
                                            '$ref' => '#/definitions/NotFoundResponse',
                                    ],
                                ],
                                500 => [
                                    'description' => 'error',
                                    'schema' => [
                                            '$ref' => '#/definitions/ErrorResponse',
                                    ],
                                ],
                            ],
                    ],
            ],
        ];

        $cpts = CustomPostTypeRepository::get([]);

        foreach ($cpts as $cpt){

            $path = '/' . $cpt->getName() . '/filter/query';

            $paths[ $path ] = [
                'post' => [
                    'tags' => [
                            'filter',
                    ],
                    'summary' => 'Advanced posts search',
                    'description' => 'Use this endpoint to search post',
                    'operationId' => 'queryFilter',
                    'consumes' => [
                            'application/json',
                    ],
                    'produces' => [
                            'application/json',
                    ],
                    'parameters' => [
                        [
                            'name' => 'body',
                            'in' => 'body',
                            'description' => 'The filters array',
                            'type' => 'object',
                            'schema' => [
                                '$ref' => '#/definitions/QueryFilter',
                            ],
                        ],
                        [
                            'name' => 'page',
                            'in' => 'query',
                            'description' => 'current page',
                            'required' => false,
                            'type' => 'integer',
                            'default' => 1,
                        ],
                        [
                            'name' => 'per_page',
                            'in' => 'query',
                            'description' => 'choose pagination size (Max 100)',
                            'required' => false,
                            'type' => 'integer',
                            'minimum' => 1,
                            'maximum' => 100,
                            'default' => 20,
                        ],
                    ],
                    'responses' => [
                            200 => [
                                'description' => 'successful operation',
                                'schema' => $this->getPaginatedResponse('#/definitions/QueryResult'),
                            ],
                    ],
                ],
            ];
        }

        return $paths;
    }

    /**
     * Model definitions
     *
     * @return array
     */
    private function getModelDefinitions()
    {
        return [
            'CustomPostType' => (new CustomPostTypeSchema())->toArray(),
            'MetaGroup' => (new MetaGroupSchema())->toArray(),
            'Form' => (new FormSchema())->toArray(),
            'OptionPage' => (new OptionPageSchema())->toArray(),
            'Taxonomy' => (new TaxonomySchema())->toArray(),
            'QueryFilter' => (new QueryFilterSchema())->toArray(),
            'WooCommerceProductData' => (new WooCommerceProductDataSchema())->toArray(),
            'WooCommerceProductDataField' => (new WooCommerceProductDataFieldSchema())->toArray(),
            'QueryResult' => (new QueryResultSchema())->toArray(),
            'CreateResponse' => $this->getCreateResponse(),
            'CreateMetaGroupResponse' => $this->getCreateMetaGroupResponse(),
            'WooCommerceFieldsCreateResponse' => $this->getWooCommerceFieldsCreateResponse(),
            'DeleteResponse' => $this->getDeleteResponse(),
            'DeleteMultiResponse' => $this->getDeleteMultiResponse(),
            'NotFoundResponse' => $this->getNotFoundResponse(),
            'ErrorResponse' => $this->getErrorResponse(),
        ];
    }

    /**
     * Security definitions
     *
     * @return array
     */
    private function getSecurityDefinitions()
    {
        return [
            'ApiKeyAuth' => [
                'type' => 'apiKey',
                'in' => 'header',
                'name' => 'acpt-api-key',
            ],
            'BasicAuth' => [
                'type' => 'basic'
            ],
        ];
    }

    /**
     * Security
     *
     * @return array
     */
    private function getSecurity()
    {
        return [
            [
                'ApiKeyAuth' => []
            ],
            [
                'BasicAuth' => []
            ],
        ];
    }

    /**
     * Paginated response
     *
     * @param $ref
     *
     * @return array
     */
    private function getPaginatedResponse($ref)
    {
        return [
                'type' => 'object',
                'properties' => [
                        'currentPage' => [
                            'type' => 'integer',
                            'example' => 1,
                        ],
                        'prev' => [
                                'type' => 'string',
                                'nullable' => true,
                        ],
                        'next' => [
                                'type' => 'string',
                                'nullable' => true,
                        ],
                        'total' => [
                                'type' => 'integer',
                        ],
                        'records' => [
                                'type' => 'array',
                                'items' => [
                                        '$ref' => $ref
                                ],
                        ],
                ],
        ];
    }

    private function getCreateResponse()
    {
        return [
            'type' => 'object',
            'properties' => [
                'id' => [
                    'type' => 'string',
                    'format' => 'uuid',
                ],
            ],
        ];
    }

    /**
     * @return array
     */
    private function getCreateMetaGroupResponse()
    {
        return [
            'type' => 'object',
            'properties' => [
                'ids' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'slug' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'object',
                                    'properties' => [
                                        "boxes" => [
                                            'type' => 'array',
                                            'items' => [
                                                'type' => 'string',
                                                'format' => 'uuid',
                                            ]
                                        ],
                                        "fields" => [
                                            'type' => 'array',
                                            'items' => [
                                                'type' => 'string',
                                                'format' => 'uuid',
                                            ]
                                        ],
                                        "options" => [
                                            'type' => 'array',
                                            'items' => [
                                                'type' => 'string',
                                                'format' => 'uuid',
                                            ]
                                        ],
                                    ]
                                ]
                            ]
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * @return array
     */
    private function getWooCommerceFieldsCreateResponse()
    {
        return [
            'type' => 'object',
            'properties' => [
                'ids' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                              "product_data_id" => [
                                  'type' => 'string',
                                  'format' => 'uuid',
                              ],
                              "field" => [
                                  'type' => 'string',
                                  'format' => 'uuid',
                              ],
                              "options" => [
                                    'type' => 'array',
                                    'items' => [
                                        'type' => 'string',
                                        'format' => 'uuid',
                                    ]
                              ],
                        ],
                    ],
                ]
            ]
        ];
    }

    private function getDeleteResponse()
    {
        return [
            'type' => 'object',
            'properties' => [
                'id' => [
                    'type' => 'string',
                    'format' => 'uuid',
                ],
            ],
        ];
    }

    private function getDeleteMultiResponse()
    {
        return [
                'type' => 'object',
                'properties' => [
                    'ids' => [
                        'type' => 'array',
                        'items' => [
                            'type' => 'string',
                            'format' => 'uuid',
                        ],
                    ],
                ],
        ];
    }

    private function getNotFoundResponse()
    {
        return [
            'type' => 'object',
            'properties' => [
                'message' => [
                    'type' => 'string',
                ],
            ],
        ];
    }

    private function getErrorResponse()
    {
        return [
            'type' => 'object',
            'properties' => [
                'message' => [
                    'type' => 'string',
                ],
                'code' => [
                    'type' => 'integer',
                ],
                'line' => [
                    'type' => 'integer',
                ],
                'trace' => [
                    'type' => 'string',
                ],
            ],
        ];
    }

    /**
     * External docs links
     *
     * @return array
     */
    private function getExternalDocs()
    {
        return [
            'description' => 'Find out more about ACPT',
            'url' => $this->documentationLink(),
        ];
    }

    /**
     * @return string
     */
    private function documentationLink()
    {
        return 'https://acpt.io/documentation';
    }
}