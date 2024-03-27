<?php

namespace ACPT_Lite\Core\Generators\Taxonomy;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Command\SaveTaxonomyMetaCommand;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\MetaRepository;

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
	 * @var TaxonomyModel
	 */
	private TaxonomyModel $taxonomyModel;

	/**
	 * TaxonomyMetaBoxGenerator constructor.
	 *
	 * @param TaxonomyModel $taxonomyModel
	 */
	public function __construct(TaxonomyModel $taxonomyModel)
    {
	    $this->taxonomyModel = $taxonomyModel;
    }

	/**
     * @throws \Exception
     */
    public function generate()
    {
	    $taxonomy = $this->taxonomyModel->getSlug();

	    add_action( $taxonomy . '_add_form_fields', [$this, 'addMetaBoxes'], 10, 1 );
	    add_action( $taxonomy . '_edit_form', [$this, 'editMetaBoxes'], 10, 1 );
	    add_action( 'created_' . $taxonomy, [$this, 'saveData'], 10, 1 );
	    add_action( 'edited_' . $taxonomy, [$this, 'saveData'], 10, 1 );
    }

    /**
     * @param $taxonomy
     * @throws \Exception
     */
    public function addMetaBoxes($taxonomy)
    {
        $metaGroups = MetaRepository::get([
	        'belongsTo' => MetaTypes::TAXONOMY,
	        'find' => $taxonomy,
        ]);

	    $this->generateMetaBoxes($metaGroups, $taxonomy);

	    $terms = get_terms([
		    'taxonomy' => $taxonomy,
		    'hide_empty' => false,
		    'fields' => 'ids',
	    ]);

	    if(!empty($terms)){
	    	foreach ($terms as $termId){
			    $metaGroups = MetaRepository::get([
				    'belongsTo' => BelongsTo::TERM_ID,
				    'find' => $termId,
			    ]);

			    $this->generateMetaBoxes($metaGroups, $taxonomy, $termId);
		    }
	    }
    }

    /**
     * @param $term
     * @throws \Exception
     */
    public function editMetaBoxes($term)
    {
        $taxonomy = $term->taxonomy;
        $termId = $term->term_id;

	    $metaGroups = MetaRepository::get([
		    'belongsTo' => MetaTypes::TAXONOMY,
		    'find' => $taxonomy,
	    ]);

	    $this->generateMetaBoxes($metaGroups, $taxonomy, $termId);

	    $terms = get_terms([
		    'taxonomy' => $taxonomy,
		    'hide_empty' => false,
		    'fields' => 'ids',
	    ]);

	    if(!empty($terms)){
		    foreach ($terms as $termId){
			    $metaGroups = MetaRepository::get([
				    'belongsTo' => BelongsTo::TERM_ID,
				    'find' => $termId,
			    ]);

			    $this->generateMetaBoxes($metaGroups, $taxonomy, $termId);
		    }
	    }
    }

	/**
	 * @param array $metaGroups
	 * @param $taxonomy
	 * @param null $termId
	 */
    private function generateMetaBoxes(array $metaGroups, $taxonomy, $termId = null)
    {
        if(
           $termId === null or
           (isset($_GET['tag_ID']) and $_GET['tag_ID'] == $termId)
        ):
	    foreach ($metaGroups as $metaGroup):
		    $generator = new TaxonomyMetaGroupGenerator($metaGroup, $taxonomy, $termId);
		    echo $generator->render();
	    endforeach;
	    endif;
    }

    /**
     * @param $termId
     * @throws \Exception
     */
    public function saveData($termId)
    {
        $command = new SaveTaxonomyMetaCommand($termId, $_POST);
        $command->execute();
    }
}