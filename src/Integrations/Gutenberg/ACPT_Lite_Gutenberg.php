<?php

namespace ACPT_Lite\Integrations\Gutenberg;

use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\Gutenberg\Blocks\ACPTBasicBlock;

class ACPT_Lite_Gutenberg extends AbstractIntegration
{
	/**
	 * @inheritDoc
	 */
	protected function isActive()
	{
		return true;
	}

	/**
	 * @inheritDoc
	 */
	protected function runIntegration()
	{
		add_action( 'init', [new ACPT_Lite_Gutenberg(), 'registerBlocks'] );
	}

	/**
	 * Register Gutenberg blocks
	 */
	public function registerBlocks()
	{
		if ( ! function_exists( 'register_block_type' ) ) {
			// Block editor is not available.
			return;
		}

		// basic-block
		register_block_type( 'advanced-custom-post-type/basic-block', [
			'api_version' => 3,
			'editor_script' => 'block_js',
			'editor_style' => 'block_css',
			'render_callback' => [new ACPTBasicBlock(), 'render'],
			'attributes'      => [
				'postId'      => [
					'default' => 99999999999999999,
					'type'    => 'integer'
				],
				'field'            => [
					'default' => null,
					'type'    => 'string'
				],
				'gradient' => [
					'default' => null,
					'type'    => 'string'
				],
				'backgroundColor' => [
					'default' => null,
					'type'    => 'string'
				],
				'textColor' => [
					'default' => null,
					'type'    => 'string'
				],
				'style' => [
					'default' => [],
					'type'    => 'object'
				],
				'align' => [
					'default' => 'left',
					'type'    => 'string'
				],
				'display' => [
					'default' => null,
					'type'    => 'string'
				],
				"color" => [
					"type" => 'string',
					"default" => null
				],
				"target" => [
					"type" => 'string',
					"default" => null
				],
				"fontSize" => [
					"type" => 'string',
					"default" => null
				],
				"width" => [
					"type" => 'string',
					"default" => null
				],
				"height" => [
					"type" => 'string',
					"default" => null
				],
				"uomFormatDecimalPoints" => [
					"type" => 'string',
					"default" => null
				],
				"uomFormatDecimalSeparator" => [
					"type" => 'string',
					"default" => null
				],
				"uomFormatThousandsSeparator" => [
					"type" => 'string',
					"default" => null
				],
				"uomFormat" => [
					"type" => 'string',
					"default" => null
				],
				"uomPosition" => [
					"type" => 'string',
					"default" => null
				],
				"dateFormat" => [
					"type" => 'string',
					"default" => null
				],
				"timeFormat" => [
					"type" => 'string',
					"default" => null
				],
				"zoom" => [
					"type" => 'integer',
					"default" => 14
				],
				"gap" => [
					"type" => 'integer',
					"default" => 20
				],
				"elements" => [
					"type" => 'integer',
					"default" => 3
				],
				"border" => [
					"type" => 'object',
					"default" => []
				],
				"borderRadius" => [
					"type" => 'object',
					"default" => []
				],
				"padding" => [
					"type" => 'object',
					"default" => []
				],
			]
		]);
	}
}



