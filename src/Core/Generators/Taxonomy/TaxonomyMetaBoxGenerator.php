<?php

namespace ACPT_Lite\Core\Generators\Taxonomy;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Command\SaveTaxonomyMetaCommand;
use ACPT_Lite\Core\CQRS\Query\FetchMetaGroupsQuery;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;

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
     * @var string
     */
    private string $taxonomy;

    /**
     * TaxonomyMetaBoxGenerator constructor.
     *
     * @param string $taxonomy the taxonomy slug (an ACPT taxonomy or any other registered one, e.g. WooCommerce's product_cat)
     */
    public function __construct(string $taxonomy)
    {
        $this->taxonomy = $taxonomy;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function generate(): void
    {
        $taxonomy = $this->taxonomy;

        add_action($taxonomy . '_add_form_fields', [$this, 'addMetaBoxes'], 10, 1);
        add_action($taxonomy . '_edit_form', [$this, 'editMetaBoxes'], 10, 1);
        add_action('created_' . $taxonomy, [$this, 'saveData'], 10, 1);
        add_action('edited_' . $taxonomy, [$this, 'saveData'], 10, 1);
    }

    /**
     * @param string $taxonomy
     * @return void
     * @throws \Exception
     */
    public function addMetaBoxes(string $taxonomy): void
    {
        $this->enqueueScripts('add-tax');

        $metaGroups = (new FetchMetaGroupsQuery([
            'belongsTo' => MetaTypes::TAXONOMY,
            'find' => $taxonomy,
            'clonedFields' => true,
            'cct' => true,
        ]))->execute();

        $this->generateMetaBoxes($metaGroups, $taxonomy);

        $terms = get_terms([
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
            'fields' => 'ids',
        ]);

        if (!empty($terms) && !is_wp_error($terms)) {
            foreach ($terms as $termId) {
                $metaGroups = (new FetchMetaGroupsQuery([
                    'belongsTo' => BelongsTo::TERM_ID,
                    'find' => $termId,
                    'clonedFields' => true,
                    'cct' => true,
                ]))->execute();

                $this->generateMetaBoxes($metaGroups, $taxonomy, $termId);
            }
        }
    }

    /**
     * @param \WP_Term $term
     * @return void
     * @throws \Exception
     */
    public function editMetaBoxes(\WP_Term $term): void
    {
        $this->enqueueScripts('edit-tax');

        $taxonomy = $term->taxonomy;
        $termId = $term->term_id;

        $metaGroups = (new FetchMetaGroupsQuery([
            'belongsTo' => MetaTypes::TAXONOMY,
            'find' => $taxonomy,
            'clonedFields' => true,
            'cct' => true,
        ]))->execute();

        $this->generateMetaBoxes($metaGroups, $taxonomy, $termId);
    }

    /**
     * @param array<int, \ACPT_Lite\Core\Models\Meta\MetaGroupModel> $metaGroups
     * @param string $taxonomy
     * @param int|null $termId
     *
     * @return void
     */
    private function generateMetaBoxes(array $metaGroups, string $taxonomy, ?int $termId = null): void
    {
        if (
            $termId === null ||
            (isset($_GET['tag_ID']) && $_GET['tag_ID'] == $termId)
        ):
            foreach ($metaGroups as $metaGroup):
                $generator = new TaxonomyMetaGroupGenerator($metaGroup, $termId);
                echo $generator->render();
            endforeach;
        endif;
    }

    /**
     * @param int $termId
     * @return void
     * @throws \Exception
     */
    public function saveData(int $termId): void
    {
        $command = new SaveTaxonomyMetaCommand($termId, ACPT_Lite_Plugin::getRequest());
        $command->execute();
    }
}
