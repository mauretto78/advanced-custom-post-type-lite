<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Wordpress\Nonce;
use ACPT_Lite\Utils\Wordpress\Translator;

class CustomPostTypeAdminColumnsGenerator extends AbstractGenerator
{
	/**
     * Add meta fields to the posts table
     *
	 * @param CustomPostTypeModel $postTypeModel
	 *
	 * @throws \Exception
	 */
	public static function addColumns($postTypeModel)
	{
	    $postTypeName = ($postTypeModel instanceof CustomPostTypeModel) ? $postTypeModel->getName() : $postTypeModel;

		$manageEditAction = 'manage_edit-'.$postTypeName.'_columns';
		$manageEditSortAction = 'manage_edit-'.$postTypeName.'_sortable_columns';
		$customColumnsAction = 'manage_'.$postTypeName.'_posts_custom_column';

		$metaGroups = MetaRepository::get([
			'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
			'find' => $postTypeName,
            'clonedFields' => true
		]);

		// add columns to show
		add_filter($manageEditAction, function($columns) use ($postTypeModel, $metaGroups) {

			if($postTypeModel instanceof CustomPostTypeModel and !$postTypeModel->isNative()){
				foreach ( $postTypeModel->getTaxonomies() as $taxonomy ) {
					if(!$taxonomy->isNative() and !isset($columns[$taxonomy->getSlug()])){
						$columns[$taxonomy->getSlug()] = $taxonomy->getSingular();
					}
				}
			}

			foreach($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
						if ($metaBoxFieldModel->isShowInArchive()){
							$key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
							$value = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());
							$columns[$key] = $value;
						}
					}
				}
			}

			return $columns;
		});

		// display value on columns to show
		add_action($customColumnsAction, function($name) use ($postTypeModel, $metaGroups) {
			global $post;

			if($postTypeModel instanceof CustomPostTypeModel and !$postTypeModel->isNative()){
				foreach ($postTypeModel->getTaxonomies() as $taxonomy) {
					if(!$taxonomy->isNative() and $name === $taxonomy->getSlug()){

						$display = self::displayTaxonomy($postTypeModel, $taxonomy);

						if($display){
							$terms = wp_get_post_terms((int)$post->ID, $taxonomy->getSlug());

							if(empty($terms)){
								echo "—";
							}

							if(is_array($terms)){
								/** @var \WP_Term $term */
								foreach ($terms as $index => $term){
									echo '<a href="edit.php?post_type='.$postTypeModel->getName().'&'.$term->taxonomy.'='.$term->slug.'">'.$term->name.'</a>';

									if(($index+1) !== count($terms)){
										echo ", ";
									}
								}
							}
						}
					}
				}
            }

			foreach ($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
						if ($metaBoxFieldModel->isShowInArchive()){
							$boxName = Strings::toDBFormat($metaBoxModel->getName());
							$fieldName  = Strings::toDBFormat($metaBoxFieldModel->getName());
							$key = $boxName.'_'.$fieldName;

							if($key === $name){
								echo do_shortcode('[acpt admin_view="true" preview="true" pid="'.$post->ID.'" box="'.esc_attr($boxName).'" field="'.esc_attr($fieldName).'"]');
							}
						}
					}
				}
			}
		});

		// add sortable columns
		add_filter( $manageEditSortAction, function($columns) use ($postTypeModel, $metaGroups){
			foreach($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
						if (
                            $metaBoxFieldModel->isShowInArchive() and
                            $metaBoxFieldModel->isFilterable() and
                            $metaBoxFieldModel->isFilterableInAdmin()
                        ){
							$key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
							$value = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());

							$columns[$key] = $value;
						}
					}
				}
			}

			return $columns;
		} );

		// modify the main posts query
		add_action('pre_get_posts', function ($query) use ($postTypeModel, $metaGroups) {

            global $wpdb;

            if(!$query->is_main_query()) {
                return;
            }

		    // filter queries on back-end
			if ( is_admin() ) {
				$scr = get_current_screen();

				if ( $scr->base !== 'edit' && $scr->post_type !== 'events' ) {
					return;
				}

				if($postTypeModel instanceof CustomPostTypeModel and !$postTypeModel->isNative()){
					foreach ($postTypeModel->getTaxonomies() as $taxonomy) {
						if (!$taxonomy->isNative() and isset($_GET[$taxonomy->getSlug()]) && $_GET[$taxonomy->getSlug()] != 0) {

							$display = self::displayTaxonomy($postTypeModel, $taxonomy);

							if($display){
								$term = sanitize_text_field($_GET[$taxonomy->getSlug()]);
								$query->set('tax_query', [
									[
										'taxonomy' => $taxonomy->getSlug(),
										'field' => 'slug',
										'terms' => $term
									]
								]);
							}
						}
					}
                }

				foreach ($metaGroups as $metaGroup){
					foreach ($metaGroup->getBoxes() as $metaBoxModel){
						foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
							if (
                                $metaBoxFieldModel->isShowInArchive() and
                                $metaBoxFieldModel->isFilterable() and
                                $metaBoxFieldModel->isFilterableInAdmin()
                            ){
								$metaKey = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());

								if (isset($_GET[$metaKey]) && $_GET[$metaKey] != 0) {

									$meta = get_post_meta_by_id($_GET[$metaKey]);
									$query->set('meta_query', [
										[
											'key' => $metaKey,
											'value' => sanitize_text_field($meta->meta_value),
											'compare' => '=',
											'type' => 'CHAR'
										]
									]);
								}
							}
						}
					}
				}
			} else {
                // alter frontend URL prefixes
                if(!$postTypeModel instanceof CustomPostTypeModel){
                    return;
                }

                $frontEndUrlPrefix = $postTypeModel->getSettings()['front_url_prefix'] ?? null;

                if($frontEndUrlPrefix === null){
                    return;
                }

                if($frontEndUrlPrefix !== ""){

                    $urlArr = explode("/", $_SERVER['REQUEST_URI']);
                    $frontEndUrlPrefixArr = explode("/", $frontEndUrlPrefix);
                    $check = array_values(array_intersect($urlArr, $frontEndUrlPrefixArr));

                    if($frontEndUrlPrefixArr == $check){
                        $postName = $query->get("attachment");

                        $postType = $wpdb->get_var(
                            $wpdb->prepare(
                                'SELECT post_type FROM ' . $wpdb->posts . ' WHERE post_name = %s LIMIT 1',
                                $postName
                            )
                        );

                        if($postTypeModel->getName() === $postType){
                            $query->set($postTypeModel->getName(), $postName);
                            $query->set('post_type', $postType);
                            $query->is_single = true;
                            $query->is_page = false;
                        }
                    }

                } else {

                    // remove frontend URL prefix
                    if( count($query->query) === 2 and isset($query->query['page']) and !empty($query->query['name']) ){
                        $postTypes = get_post_types([
                            'public' => true,
                            '_builtin' => false,
                        ]);

                        $query->set('post_type', array_merge(['page', 'post'], $postTypes));
                    }
                }
            }
		});

		// add filterable columns
		add_action( 'restrict_manage_posts', function($post_type) use ($postTypeModel, $postTypeName, $metaGroups) {

			if($post_type !== $postTypeName){
				return;
			}

			if($postTypeModel instanceof CustomPostTypeModel and !$postTypeModel->isNative()){
				foreach ($postTypeModel->getTaxonomies() as $taxonomy) {

					$display = self::displayTaxonomy($postTypeModel, $taxonomy);

					if(!$taxonomy->isNative() and $display){
						$metaKey = $taxonomy->getSlug();
						$selected = '';
						if ( isset($_REQUEST[$metaKey]) ) {
							$selected = $_REQUEST[$metaKey];
						}

						echo '<select id="'.$metaKey.'" name="'.$metaKey.'">';
						echo '<option value="0">' . Translator::translate('Select') . ' ' . $taxonomy->getSingular() .' </option>';

						$terms = get_terms([
							'taxonomy'   => $taxonomy->getSlug(),
							'hide_empty' => false,
						]);

						foreach($terms as $term){
							$isSelected = ($term->name == $selected) ? ' selected="selected"':'';
							echo '<option value="'.$term->name.'"'.$isSelected.'>' . $term->name . ' </option>';
						}

						echo '</select>';
					}
				}
			}

			foreach($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
						if (
                            $metaBoxFieldModel->isShowInArchive() and
                            $metaBoxFieldModel->isFilterable() and
                            $metaBoxFieldModel->isFilterableInAdmin()
                        ){

							//get unique values of the meta field to filer by.
							$metaKey = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
							$metaLabel = $metaBoxFieldModel->getLabelOrName();

							$selected = '';
							if ( isset($_REQUEST[$metaKey]) ) {
								$selected = $_REQUEST[$metaKey];
							}

							global $wpdb;

							$results = $wpdb->get_results(
								$wpdb->prepare( "
                                    SELECT DISTINCT pm.meta_value, pm.meta_id FROM {$wpdb->postmeta} pm
                                    LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id
                                    WHERE pm.meta_key = '%s' 
                                    AND p.post_status IN ('publish', 'draft')
                                    ORDER BY pm.meta_value",
									$metaKey
								)
							);

							echo '<select id="'.$metaKey.'" name="'.$metaKey.'">';
							echo '<option value="0">' . Translator::translate('Select') . ' ' . $metaLabel .' </option>';

							$unique = [];

							foreach($results as $result){
								if(!in_array($result->meta_value, $unique)){
									$selected = ($result->meta_id == $selected) ? ' selected="selected"':'';
									$unique[] = $result->meta_value;
									echo '<option value="'.$result->meta_id.'"'.$selected.'>' . $result->meta_value . ' </option>';
								}
							}

							echo '</select>';
						}
					}
				}
			}
		});

		// quick edit
		add_action( 'quick_edit_custom_box', function($columnName) use ($postTypeModel, $postTypeName, $metaGroups) {
			global $post;

			if($post !== null and $post->post_type === $postTypeName){
                self::generateQuickEditFields($metaGroups, $columnName, $post->ID);
            }
        } );

		// bulk edit
        add_action( 'bulk_edit_custom_box', function ($columnName, $postType) use ($postTypeModel, $postTypeName, $metaGroups) {
            if($postType === $postTypeName){
                self::generateQuickEditFields($metaGroups, $columnName);
            }
        }, 10, 2 );
	}

    /**
     * @param MetaGroupModel[] $metaGroups
     * @param string $columnName
     * @param null $postId
     */
	private static function generateQuickEditFields($metaGroups, $columnName, $postId = null)
    {
        foreach ($metaGroups as $metaGroup){
            foreach ($metaGroup->getBoxes() as $metaBoxModel){
                foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
                    if (
                        $metaBoxFieldModel->isShowInArchive() and
                        $metaBoxFieldModel->isForQuickEdit() and
                        $metaBoxFieldModel->canBeQuickEdited()
                    ){
                        $key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
                        $key = esc_html($key);
                        $label = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());
                        $value = "";

                        if(!empty($postId)){
                            $value = Meta::fetch( $postId, MetaTypes::CUSTOM_POST_TYPE, $key, true );
                        }

                        if( $columnName === $key ){
                            Nonce::field();
                            echo self::generateQuickEditField($key, $label, $value, $metaBoxFieldModel);
                        }
                    }
                }
            }
        }
    }

	/**
	 * @param CustomPostTypeModel $postTypeModel
	 * @param TaxonomyModel $taxonomy
	 *
	 * @return bool
	 */
	private static function displayTaxonomy(CustomPostTypeModel $postTypeModel, TaxonomyModel $taxonomy): bool
	{
		return ($postTypeModel->isWooCommerce() and $taxonomy->isWooCommerceNative()) ? false : true;
	}
}