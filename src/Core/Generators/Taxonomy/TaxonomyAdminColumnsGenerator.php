<?php

namespace ACPT_Lite\Core\Generators\Taxonomy;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Wordpress\Nonce;

class TaxonomyAdminColumnsGenerator extends AbstractGenerator
{
	/**
     * Add meta fields to the posts table
     *
	 * @param $taxonomyModel
	 *
	 * @throws \Exception
	 */
	public static function addColumns($taxonomyModel)
	{
	    $taxonomyName = ($taxonomyModel instanceof TaxonomyModel) ? $taxonomyModel->getSlug() : $taxonomyModel;

		$manageEditAction = 'manage_edit-'.$taxonomyName.'_columns';
		$manageEditSortAction = 'manage_edit-'.$taxonomyName.'_sortable_columns';
		$customColumnsAction = 'manage_'.$taxonomyName.'_custom_column';

		$metaGroups = MetaRepository::get([
			'belongsTo' => MetaTypes::TAXONOMY,
			'find' => $taxonomyName,
            'clonedFields' => true
		]);

		// add columns to show
		add_filter($manageEditAction, function($columns) use ($taxonomyName, $metaGroups) {

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
		add_action($customColumnsAction, function($content, $columnName, $termId) use ($taxonomyName, $metaGroups) {
			foreach ($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
						if ($metaBoxFieldModel->isShowInArchive()){
							$boxName = Strings::toDBFormat($metaBoxModel->getName());
							$fieldName  = Strings::toDBFormat($metaBoxFieldModel->getName());
							$key = $boxName.'_'.$fieldName;

							if($key === $columnName){
								echo do_shortcode('[acpt_tax admin_view="true" preview="true" tid="'.$termId.'" box="'.esc_attr($boxName).'" field="'.esc_attr($fieldName).'"]');
							}
						}
					}
				}
			}
		}, 10, 3);

		// add sortable columns
		add_filter( $manageEditSortAction, function($columns) use ($taxonomyName, $metaGroups){
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

        // quick edit
        add_action( 'quick_edit_custom_box', function($columnName, $screen, $tax) use ($taxonomyModel, $taxonomyName, $metaGroups) {

            if ( $screen !== 'edit-tags' ) {
                return;
            }

            $taxonomy = get_taxonomy( $tax );
            if ( ! current_user_can( $taxonomy->cap->edit_terms ) ) {
                return;
            }

            if ( $taxonomyName !== $tax ){
                return;
            }

           self::generateQuickEditFields($metaGroups, $columnName, null);
        }, 10, 3);

        //
        add_action( 'admin_print_footer_scripts-edit-tags.php', function () use($taxonomyName){
            $current_screen = get_current_screen();

            if ( $current_screen->id != 'edit-'.$taxonomyName or $current_screen->taxonomy != $taxonomyName ) {
                return;
            }

            // Ensure jQuery library is loaded
            wp_enqueue_script( 'jquery' );
            ?>
            <script type="text/javascript">
                /*global jQuery*/
                jQuery(function($) {

                    $('#the-list').on( 'click', '.editinline', function( e ) {
                        e.preventDefault();
                        const $tr = $(this).closest('tr');

                        $tr.find("td").each(function() {
                            const $this = $(this);
                            const val = $this.text();
                            const classList = $this.attr('class').split(/\s+/);
                            let element = $('tr.inline-edit-row [name="'+classList[0]+'"]');

                            // select multi elements
                            if(element.length === 0){
                                element = $('tr.inline-edit-row [name="'+classList[0]+'[]"]');
                            }

                            if(element.length > 0){
                                const tagName = element.prop("tagName");

                                switch (tagName) {
                                    case  "INPUT":
                                        element.val(val ? val : '');
                                        break;

                                    case  "SELECT":
                                        const options = element.find('option');
                                        const values = val.split(", ");

                                        if(options.length > 0){
                                            options.each(function() {
                                                if(values.includes($(this).val())) {
                                                    $(this).attr('selected','selected');
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        });
                    });
                });
            </script>
            <?php
        } );
    }

    /**
     * @param MetaGroupModel[] $metaGroups
     * @param string $columnName
     * @param null $termId
     */
    private static function generateQuickEditFields($metaGroups, $columnName, $termId = null)
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

                        if( $columnName === $key ){
                            Nonce::field();
                            echo self::generateQuickEditField($key, $label, $value, $metaBoxFieldModel);
                        }
                    }
                }
            }
        }
    }
}