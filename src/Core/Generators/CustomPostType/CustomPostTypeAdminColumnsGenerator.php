<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Wordpress\Nonce;
use ACPT_Lite\Utils\Wordpress\Translator;

class CustomPostTypeAdminColumnsGenerator
{
	public static function addColumns(CustomPostTypeModel $postTypeModel)
	{
		$manageEditAction = 'manage_edit-'.$postTypeModel->getName().'_columns';
		$manageEditSortAction = 'manage_edit-'.$postTypeModel->getName().'_sortable_columns';
		$customColumnsAction = 'manage_'.$postTypeModel->getName().'_posts_custom_column';

		$metaGroups = MetaRepository::get([
			'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
			'find' => $postTypeModel->getName()
		]);

		// add columns to show
		add_filter($manageEditAction, function($columns) use ($postTypeModel, $metaGroups) {
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

		// add sortable columns
		add_filter( $manageEditSortAction, function($columns) use ($postTypeModel, $metaGroups){
			foreach($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
						if ($metaBoxFieldModel->isShowInArchive() and $metaBoxFieldModel->isFilterable() and $metaBoxFieldModel->isFilterableInAdmin()){
							$key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
							$value = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());

							$columns[$key] = $value;
						}
					}
				}
			}

			return $columns;
		} );

		// display value on columns to show
		add_action($customColumnsAction, function($name) use ($postTypeModel, $metaGroups) {
			global $post;

			foreach ($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
						if ($metaBoxFieldModel->isShowInArchive()){
							$key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());

							if($key === $name){
								echo do_shortcode('[acpt preview="true" pid="'.$post->ID.'" box="'.esc_attr($metaBoxModel->getName()).'" field="'.esc_attr($metaBoxFieldModel->getName()).'"]');
							}
						}
					}
				}
			}
		});

		// modify the main posts query
		add_action('pre_get_posts', function ($query) use ($postTypeModel, $metaGroups) {
			if ( is_admin() && $query->is_main_query() ) {
				$scr = get_current_screen();

				if ( $scr->base !== 'edit' && $scr->post_type !== 'events' ) {
					return;
				}

				foreach ($metaGroups as $metaGroup){
					foreach ($metaGroup->getBoxes() as $metaBoxModel){
						foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
							if ($metaBoxFieldModel->isShowInArchive() and $metaBoxFieldModel->isFilterable() and $metaBoxFieldModel->isFilterableInAdmin()){

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
			}
		});

		// add filterable columns
		add_action( 'restrict_manage_posts', function($post_type) use ($postTypeModel, $metaGroups) {

			if($post_type !== $postTypeModel->getName()){
				return;
			}

			foreach($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
						if ($metaBoxFieldModel->isShowInArchive() and $metaBoxFieldModel->isFilterable() and $metaBoxFieldModel->isFilterableInAdmin()){

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
		add_action( 'quick_edit_custom_box', function($column_name) use ($postTypeModel, $metaGroups) {
			global $post;

			foreach ($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
						if (
							$metaBoxFieldModel->isShowInArchive() and
							$metaBoxFieldModel->isForQuickEdit() and
							$metaBoxFieldModel->isATextualField()
						){
							$key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
							$key = esc_html($key);
							$label = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());
							$value = Meta::fetch( $post->ID, MetaTypes::CUSTOM_POST_TYPE, $key, true );
							if( $column_name === $key ):
								Nonce::field();
								?>
                                <fieldset class="inline-edit-col-right" id="#edit-<?php echo $key; ?>">
                                    <input type="hidden" name="meta_fields[]" value="<?php echo $key; ?>">
                                    <input type="hidden" name="meta_fields[]" value="<?php echo $key; ?>_type">
                                    <input type="hidden" name="<?php echo $key; ?>_type" value="<?php echo $metaBoxFieldModel->getType(); ?>">
                                    <input type="hidden" name="<?php echo $key; ?>_required" value="<?php echo $metaBoxFieldModel->isRequired(); ?>">
                                    <div class="inline-edit-col">
                                        <label>
                                            <span class="title"><?php echo $label; ?></span>
                                            <span class="input-text-wrap">
                                                <?php if($metaBoxFieldModel->getType() === MetaFieldModel::EMAIL_TYPE): ?>
                                                    <input type="email" name="<?php echo $key; ?>" data-acpt-column="column-<?php echo $key; ?>" class="inline-edit-menu-order-input" value="<?php echo $value; ?>">
                                                <?php elseif($metaBoxFieldModel->getType() === MetaFieldModel::TEXTAREA_TYPE): ?>
                                                    <textarea name="<?php echo $key; ?>" data-acpt-column="column-<?php echo $key; ?>" class="inline-edit-menu-order-input" rows="5"><?php echo $value; ?>"</textarea>
                                                <?php elseif($metaBoxFieldModel->getType() === MetaFieldModel::NUMBER_TYPE): ?>
                                                    <input type="number" name="<?php echo $key; ?>" data-acpt-column="column-<?php echo $key; ?>" class="inline-edit-menu-order-input" value="<?php echo $value; ?>">
                                                <?php else: ?>
                                                    <input type="text" name="<?php echo $key; ?>" data-acpt-column="column-<?php echo $key; ?>" class="inline-edit-menu-order-input" value="<?php echo $value; ?>">
                                                <?php endif; ?>
									        </span>
                                        </label>
                                    </div>
                                </fieldset>
							<?php endif;
						}
					}
				}
			}
		} );
	}
}