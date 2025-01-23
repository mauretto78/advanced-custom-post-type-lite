<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Models\OptionPage\OptionPageModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class OptionPageRepository extends AbstractRepository
{
	/**
	 * @return int
	 */
	public static function count()
	{
		$baseQuery = "
            SELECT 
                count(id) as count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."`
            ";

		$results = ACPT_Lite_DB::getResults($baseQuery);

		return (int)$results[0]->count;
	}

	/**
	 * @param bool $deleteOptions
	 *
	 * @return bool
	 * @throws \Exception
	 */
	public static function deleteAll($deleteOptions = false)
	{
		$optionPageModels = self::get([]);

		foreach ($optionPageModels as $optionPageModel){
			if(self::delete($optionPageModel, $deleteOptions) === false){
				return false;
			}

			foreach ($optionPageModel->getChildren() as $childPageModel){
				if(self::delete($childPageModel, $deleteOptions) === false){
					return false;
				}
			}
		}

		ACPT_Lite_DB::invalidateCacheTag(self::class);
		ACPT_Lite_DB::invalidateCacheTag(MetaRepository::class);

		return true;
	}

	/**
	 * @param OptionPageModel $optionPageModel
	 * @param bool $deleteOptions
	 *
	 * @return bool
	 * @throws \Exception
	 */
	public static function delete(OptionPageModel $optionPageModel, $deleteOptions = false)
	{
		ACPT_Lite_DB::startTransaction();

		try {
			$sql = "
	            DELETE
	                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."`
	                WHERE id = %s
	            ";

			MetaRepository::deleteAll([
				'belongsTo' => MetaTypes::OPTION_PAGE,
				'find' => $optionPageModel->getMenuSlug(),
			]);

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$optionPageModel->getId()]);
			ACPT_Lite_DB::commitTransaction();

			if($deleteOptions){
				$meta = MetaRepository::get([
					'belongsTo' => MetaTypes::OPTION_PAGE,
					'find' => $optionPageModel->getMenuSlug()
				]);

				self::deleteOptions($meta);
			}

			foreach ($optionPageModel->getChildren() as $childPage){
				self::delete($childPage, $deleteOptions);
			}

			ACPT_Lite_DB::invalidateCacheTag(self::class);

			return true;
		} catch (\Exception $exception){
			ACPT_Lite_DB::rollbackTransaction();

			return false;
		}
	}

	/**
	 * @param MetaGroupModel[] $metaGroups
	 *
	 * @throws \Exception
	 */
	private static function deleteOptions(array $metaGroups)
	{
		global $wpdb;

		foreach ($metaGroups as $metaGroup){
			foreach ($metaGroup->getBoxes() as $metaBoxModel){
				foreach ($metaBoxModel->getFields() as $metaFieldModel){
					$metaFieldModel->getDbName();

					$query = "DELETE 
            		FROM `{$wpdb->prefix}options` o
            		WHERE o.option_name = %s";

					ACPT_Lite_DB::executeQueryOrThrowException($query, [$metaFieldModel->getDbName()]);
				}
			}
	ACPT_Lite_DB::invalidateCacheTag(self::class);
	}


		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

	/**
	 * @param $menuSlug
	 *
	 * @return bool
	 */
	public static function exists($menuSlug)
	{
		$baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."`
            WHERE menu_slug = %s
            ";

		$pages = ACPT_Lite_DB::getResults($baseQuery, [$menuSlug]);

		return count($pages) === 1;
	}

	/**
	 * @param $menuSlug
	 *
	 * @return mixed|null
	 */
	public static function getId($menuSlug)
	{
		$baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."`
            WHERE menu_slug = %s
            ";

		$posts = ACPT_Lite_DB::getResults($baseQuery, [$menuSlug]);

		if(count($posts) === 1){
			return $posts[0]->id;
		}

		return null;
	}

	/**
	 * @return array
	 */
	public static function getAllIds()
	{
		$results = [];

		$baseQuery = "
            SELECT 
                op.id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."` op
            GROUP BY op.id ORDER BY op.sort ASC;
            ";

		$optionPageIds = ACPT_Lite_DB::getResults($baseQuery, []);

		foreach ($optionPageIds as $optionPageId){
			$results[] = $optionPageId->id;
		}

		return $results;
	}

	/**
	 * @return array
	 */
	public static function getAllSlugs()
	{
		$results = [];

		$baseQuery = "
            SELECT 
                op.menu_slug
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."` op
            GROUP BY op.id ORDER BY op.sort ASC;
            ";

		$optionPageSlugs = ACPT_Lite_DB::getResults($baseQuery, []);

		foreach ($optionPageSlugs as $optionPageSlug){
			$results[] = $optionPageSlug->menu_slug;
		}

		return $results;
	}

	/**
	 * @param array $meta
	 *
	 * @return OptionPageModel[]
	 * @throws \Exception
	 */
	public static function get(array $meta = [])
	{
		$results = [];
		$args = [];

		$baseQuery = "
            SELECT 
                op.id, 
                op.page_title,
	            op.menu_title,
	            op.capability,
	            op.menu_slug,
                op.icon,
                op.description,
                op.parent_id,
                op.sort,
                op.page_position as `position`
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."` op
            WHERE parent_id = ''
            ";

		if(isset($meta['id'])){
			$baseQuery .= " AND op.id = %s";
			$args[] = $meta['id'];
		}

		if(isset($meta['exclude'])){
			$baseQuery .= " AND op.menu_slug != %s";
			$args[] = $meta['exclude'];
		}

		if(isset($meta['excludeIds'])){
			$baseQuery .= " AND op.id NOT IN ('".implode("','", $meta['excludeIds'])."')";
		}

		if(isset($meta['menuSlug'])){
			$baseQuery .= " AND op.menu_slug = %s ";
			$args[] = $meta['menuSlug'];
		}

		$baseQuery .= " GROUP BY op.id";

        if(isset($meta['sortedBy'])){
            $baseQuery .= " ORDER BY op.".$meta['sortedBy']." ASC";
        } else {
            $baseQuery .= " ORDER BY op.sort ASC";
        }

        if(isset($meta['page']) and isset($meta['perPage'])){
			$baseQuery .= " LIMIT ".$meta['perPage']." OFFSET " . ($meta['perPage'] * ($meta['page'] - 1));
		}

		$baseQuery .= ';';
		$optionPages = ACPT_Lite_DB::getResults($baseQuery, $args);

		foreach ($optionPages as $optionPage){
			$optionPageModel = OptionPageModel::hydrateFromArray([
				'id' => $optionPage->id,
				'pageTitle' => $optionPage->page_title,
				'menuTitle' => $optionPage->menu_title,
				'capability' => $optionPage->capability,
				'menuSlug' => $optionPage->menu_slug,
				'icon' => $optionPage->icon,
				'description' => $optionPage->description,
				'parentId' => null,
				'sort' => $optionPage->sort,
				'position' => $optionPage->position,
			]);

			// Permissions
			$permissions = PermissionRepository::getByEntityId($optionPage->id);
			foreach ($permissions as $permission){
				$optionPageModel->addPermission($permission);
			}

			// Children here
			$baseQuery = "
	            SELECT 
	                ch.id, 
	                ch.page_title,
		            ch.menu_title,
		            ch.capability,
		            ch.menu_slug,
	                ch.icon,
	                ch.description,
	                ch.parent_id,
	                ch.sort,
	                ch.page_position as `position`
	            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."` ch
	            WHERE ch.parent_id = %s
            ";

			if(isset($args['excludeIds'])){
				$baseQuery .= " AND ch.id NOT IN ('".implode("','", $args['excludeIds'])."')";
			}

			$baseQuery .= ' GROUP BY ch.id ';

            if(isset($meta['sortedBy'])){
                $baseQuery .= " ORDER BY ch.".$meta['sortedBy']." ASC";
            } else {
                $baseQuery .= " ORDER BY ch.sort ASC";
            }

			$childrenPages = ACPT_Lite_DB::getResults($baseQuery, [$optionPageModel->getId()]);

			foreach ($childrenPages as $childrenPage){
				$childPageModel = OptionPageModel::hydrateFromArray([
					'id' => $childrenPage->id,
					'parentId' => $optionPage->id,
					'pageTitle' => $childrenPage->page_title,
					'menuTitle' => $childrenPage->menu_title,
					'capability' => $childrenPage->capability,
					'menuSlug' => $childrenPage->menu_slug,
					'description' => $childrenPage->description,
					'sort' => $childrenPage->sort,
					'position' => $childrenPage->position,
				]);

				// Permissions
				$permissions = PermissionRepository::getByEntityId($childrenPage->id);
				foreach ($permissions as $permission){
					$childPageModel->addPermission($permission);
				}

				$optionPageModel->addChild($childPageModel);
			}

			$results[] = $optionPageModel;
		}

		return $results;
	}

	/**
	 * @param $slug
	 * @param bool $lazy
	 *
	 * @return OptionPageModel|null
	 * @throws \Exception
	 */
	public static function getByMenuSlug($slug, $lazy = false)
	{
		$baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."`
            WHERE menu_slug = %s
            ";

		$page = @ACPT_Lite_DB::getResults($baseQuery, [$slug])[0];

		if($page){
			return self::getById($page->id, $lazy);
		}

		return null;
	}

	/**
	 * @param $id
	 * @param bool $lazy
	 *
	 * @return OptionPageModel|null
	 * @throws \Exception
	 */
	public static function getById($id, $lazy = false)
	{
		$result = null;

		$baseQuery = "
            SELECT 
                op.id, 
                op.page_title,
	            op.menu_title,
	            op.capability,
	            op.menu_slug,
                op.icon,
                op.description,
                op.parent_id,
                op.sort,
                op.page_position as `position`
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."` op
            WHERE id = %s;
            ";

		$optionPages = ACPT_Lite_DB::getResults($baseQuery, [$id]);

		foreach ($optionPages as $optionPage){
			$optionPageModel = OptionPageModel::hydrateFromArray([
				'id' => $optionPage->id,
				'pageTitle' => $optionPage->page_title,
				'menuTitle' => $optionPage->menu_title,
				'capability' => $optionPage->capability,
				'menuSlug' => $optionPage->menu_slug,
				'icon' => $optionPage->icon,
				'description' => $optionPage->description,
				'parentId' => $optionPage->parent_id,
				'sort' => $optionPage->sort,
				'position' => $optionPage->position,
			]);

			// Children here
			$baseQuery = "
	            SELECT 
	                ch.id, 
	                ch.page_title,
		            ch.menu_title,
		            ch.capability,
		            ch.menu_slug,
	                ch.icon,
	                ch.description,
	                ch.parent_id,
	                ch.sort,
	                ch.page_position as `position`
	            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."` ch
	            WHERE ch.parent_id = %s GROUP BY ch.id ORDER BY ch.sort ASC;
            ";

			$childrenPages = ACPT_Lite_DB::getResults($baseQuery, [$optionPageModel->getId()]);

			foreach ($childrenPages as $childrenPage){
				$childPageModel = OptionPageModel::hydrateFromArray([
					'id' => $childrenPage->id,
					'parentId' => $optionPage->id,
					'pageTitle' => $childrenPage->page_title,
					'menuTitle' => $childrenPage->menu_title,
					'capability' => $childrenPage->capability,
					'menuSlug' => $childrenPage->menu_slug,
					'description' => $childrenPage->description,
					'sort' => $childrenPage->sort,
					'position' => $childrenPage->position,
				]);

				$optionPageModel->addChild($childPageModel);
			}

			$result = $optionPageModel;
		}

		return $result;
	}

	/**
	 * @param OptionPageModel $optionPage
	 *
	 * @throws \Exception
	 */
	public static function save(OptionPageModel $optionPage)
	{
		//OptionPageMetaSync::syncAllMeta($optionPage);

		$sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."` 
            (
	            `id`,
	            `page_title`,
				`menu_title`,
				`capability`,
				`menu_slug`,
	            `icon`,
	            `description`,
	            `parent_id`,
	            `sort`,
	            `page_position`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %d,
                %d
            ) ON DUPLICATE KEY UPDATE 
                `page_title` = %s,
				`menu_title` = %s,
				`capability` = %s,
				`menu_slug` = %s,
                `icon` = %s,
                `description` = %s,
                `parent_id` = %s,
                `sort` = %d,
                `page_position` = %d
        ;";

		ACPT_Lite_DB::executeQueryOrThrowException($sql, [
			$optionPage->getId(),
			$optionPage->getPageTitle(),
			$optionPage->getMenuTitle(),
			$optionPage->getCapability(),
			$optionPage->getMenuSlug(),
			$optionPage->getIcon(),
			$optionPage->getDescription(),
			$optionPage->getParentId(),
			$optionPage->getSort(),
			$optionPage->getPosition(),
			$optionPage->getPageTitle(),
			$optionPage->getMenuTitle(),
			$optionPage->getCapability(),
			$optionPage->getMenuSlug(),
			$optionPage->getIcon(),
			$optionPage->getDescription(),
			$optionPage->getParentId(),
			$optionPage->getSort(),
			$optionPage->getPosition(),
		]);

		foreach ($optionPage->getChildren() as $childOptionPage){
			self::save($childOptionPage);
		}

		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}
}