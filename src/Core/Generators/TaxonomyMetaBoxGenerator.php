<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyMetaBoxFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Core\Validators\MetaDataValidator;
use ACPT_Lite\Costants\MetaTypes;
use ACPT_Lite\Utils\Sanitizer;

/**
 * *************************************************
 * TaxonomyMetaBoxGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class TaxonomyMetaBoxGenerator extends AbstractGenerator
{
    /**
     * @throws \Exception
     */
    public function generate()
    {
        foreach (TaxonomyRepository::get()  as $taxonomyModel){
            $taxonomy = $taxonomyModel->getSlug();

            add_action( $taxonomy . '_add_form_fields', [$this, 'addMetaBoxes'], 10, 1 );
            add_action( $taxonomy . '_edit_form', [$this, 'editMetaBoxes'], 10, 1 );
            add_action( 'created_' . $taxonomy, [$this, 'saveData'], 10, 1 );
            add_action( 'edited_' . $taxonomy, [$this, 'saveData'], 10, 1 );
        }
    }

    /**
     * @param $taxonomy
     * @throws \Exception
     */
    public function addMetaBoxes($taxonomy)
    {
        foreach (MetaRepository::get([
            'belongsTo' => MetaTypes::TAXONOMY,
            'find' => $taxonomy,
        ])  as $metaBoxModel):
        ?>
        <div class="taxonomy-meta-box-group">
            <h3><?php echo (!empty($metaBoxModel->getLabel())) ? $metaBoxModel->getLabel() : $metaBoxModel->getName(); ?></h3>
            <div class="taxonomy-meta-fields">
                <?php
                foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                    $taxonomyMetaBoxFieldGenerator = new TaxonomyMetaBoxFieldGenerator($metaBoxFieldModel, $taxonomy);
                    $taxonomyMetaBoxFieldGenerator->generate();
                }
                ?>
            </div>
        </div>
        <?php endforeach;
    }

    /**
     * @param $term
     * @throws \Exception
     */
    public function editMetaBoxes($term)
    {
        $taxonomy = $term->taxonomy;
        $termId = $term->term_id;

        foreach (MetaRepository::get([
            'belongsTo' => MetaTypes::TAXONOMY,
            'find' => $taxonomy,
        ])  as $metaBoxModel):
        ?>
        <div class="taxonomy-meta-box-group">
            <h3><?php echo $metaBoxModel->getName(); ?></h3>
            <div class="taxonomy-meta-fields">
                <?php
                foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                    $taxonomyMetaBoxFieldGenerator = new TaxonomyMetaBoxFieldGenerator($metaBoxFieldModel, $taxonomy, $termId);
                    $taxonomyMetaBoxFieldGenerator->generate();
                }
                ?>
            </div>
        </div>
        <?php
        endforeach;
    }

    /**
     * @param $termId
     * @throws \Exception
     */
    public function saveData($termId)
    {
        $taxonomyObject = get_term( $termId);
        $taxonomy = $taxonomyObject->taxonomy;

	    $metaBoxModels = MetaRepository::get([
	        'belongsTo' => MetaTypes::TAXONOMY,
	        'find' => $taxonomy,
        ]);

        foreach ($metaBoxModels as $metaBoxModel) {
            foreach ($metaBoxModel->getFields() as $fieldModel){
                $idName = Strings::toDBFormat($metaBoxModel->getName()) . '_' . Strings::toDBFormat($fieldModel->getName());

                if(isset($_POST[$idName])){

                    $rawValue = $_POST[$idName];

	                // validation
	                try {
		                MetaDataValidator::validate($fieldModel->getType(), $rawValue);
	                } catch (\Exception $exception){
		                wp_die('There was an error during saving data. The error is: ' . $exception->getMessage());
	                }

                    update_term_meta(
                        $termId,
                        $idName,
                        Sanitizer::sanitizeTaxonomyRawData($fieldModel->getType(), $rawValue)
                    );

                    $extras = [
                        'type',
                        'label',
                        'currency',
                        'weight',
                        'length',
                        'lat',
                        'lng',
                    ];

                    foreach ($extras as $extra){
                        if(isset($_POST[$idName.'_'.$extra])){
                            update_term_meta(
                                $termId,
                                $idName.'_'.$extra,
                                Sanitizer::sanitizeTaxonomyRawData(TaxonomyMetaBoxFieldModel::TEXT_TYPE, $_POST[$idName.'_'.$extra] )
                            );
                        }
                    }
                }
            }
        }
    }
}