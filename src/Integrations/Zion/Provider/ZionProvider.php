<?php

namespace ACPT_Lite\Integrations\Zion\Provider;

use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeCountry;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeDate;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeIcon;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeImage;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeLabelValue;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeLink;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeList;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeListValues;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeRating;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeText;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeTime;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeUOM;
use ACPT_Lite\Integrations\Zion\Provider\Fields\AcptFieldTypeVideo;
use ACPT_Lite\Integrations\Zion\Provider\Repeater\ACPTRepeaterProvider;
use ZionBuilderPro\DynamicContent\Manager as ElementsManager;
use ZionBuilderPro\Repeater;

class ZionProvider
{
	public function init()
	{
		add_action( 'zionbuilderpro/dynamic_content_manager/register_fields', [ $this, 'registerFields' ] );
		add_action( 'zionbuilderpro/dynamic_content_manager/register_field_groups', [ $this, 'registerFieldGroup' ] );
		add_action( 'zionbuilderpro/repeater/register_providers', [ $this, 'registerRepeaterProvider' ] );
	}

	/**
	 * @param ElementsManager $elementsManager
	 *
	 * @throws \Exception
	 */
	public function registerFields( ElementsManager $elementsManager )
	{
		$elementsManager->register_field(new AcptFieldTypeCountry());
		$elementsManager->register_field(new AcptFieldTypeDate());
		$elementsManager->register_field(new AcptFieldTypeIcon());
		$elementsManager->register_field(new AcptFieldTypeImage());
		$elementsManager->register_field(new AcptFieldTypeLabelValue());
		$elementsManager->register_field(new AcptFieldTypeLink());
		$elementsManager->register_field(new AcptFieldTypeList());
		$elementsManager->register_field(new AcptFieldTypeListValues());
		$elementsManager->register_field(new AcptFieldTypeText());
		$elementsManager->register_field(new AcptFieldTypeTime());
		$elementsManager->register_field(new AcptFieldTypeUOM());
		$elementsManager->register_field(new AcptFieldTypeVideo());
		$elementsManager->register_field(new AcptFieldTypeRating());
	}

	/**
	 * @param ElementsManager $elementsManager
	 */
	public function registerFieldGroup(ElementsManager $elementsManager)
	{
		$elementsManager->register_field_group(
			[
				'id'   => 'ACPT',
				'name' => esc_html__( 'ACPT', 'zionbuilder-pro' ),
			]
		);
	}

	/**
	 * @param Repeater $repeater
	 */
	public function registerRepeaterProvider(Repeater $repeater)
	{
		$repeater->register_provider(new ACPTRepeaterProvider());
	}
}