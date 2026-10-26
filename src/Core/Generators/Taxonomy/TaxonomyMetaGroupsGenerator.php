<?php

namespace ACPT_Lite\Core\Generators\Taxonomy;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

class TaxonomyMetaGroupsGenerator extends AbstractGenerator
{
    /**
     * Generate meta boxes related to taxonomies
     *
     * @return void
     */
    public function generate(): void
    {
        $hooked = [];

        try {
            foreach (TaxonomyRepository::get() as $taxonomyModel) {
                $taxonomyMetaBoxGenerator = new TaxonomyMetaBoxGenerator($taxonomyModel->getSlug());
                $taxonomyMetaBoxGenerator->generate();
                $hooked[] = $taxonomyModel->getSlug();
            }
        } catch (\Exception $exception) {
            // do nothing
            do_action("acpt/error", $exception);
        }

        // Taxonomies registered by other plugins (e.g. WooCommerce's product_cat) can be picked
        // as a field group location too, but aren't in TaxonomyRepository. They only exist once
        // their plugin has run its own `init` callback, hence the late priority.
        if (did_action('init')) {
            $this->generateForThirdPartyTaxonomies($hooked);
        } else {
            add_action('init', function () use ($hooked) {
                $this->generateForThirdPartyTaxonomies($hooked);
            }, 99);
        }
    }

    /**
     * @param string[] $alreadyHooked
     *
     * @return void
     */
    private function generateForThirdPartyTaxonomies(array $alreadyHooked): void
    {
        try {
            foreach (get_taxonomies(['show_ui' => true]) as $taxonomy) {
                if (in_array($taxonomy, $alreadyHooked, true)) {
                    continue;
                }

                (new TaxonomyMetaBoxGenerator($taxonomy))->generate();
            }
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        }
    }
}
