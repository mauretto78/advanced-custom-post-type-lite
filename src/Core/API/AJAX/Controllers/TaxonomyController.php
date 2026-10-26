<?php

namespace ACPT_Lite\Core\API\AJAX\Controllers;

use ACPT_Lite\Core\CQRS\Command\DeleteTaxonomyCommand;
use ACPT_Lite\Core\CQRS\Command\RegenerateTaxonomyLabelsCommand;
use ACPT_Lite\Core\CQRS\Command\SaveTaxonomyCommand;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

class TaxonomyController extends AbstractController
{
    /**
     * Check if a Taxonomy exists
     */
    public function checkTaxonomySlugAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['slug'])) {
                wp_send_json([
                        'success' => false,
                        'error' => 'Missing slug'
                ]);
            }

            $slug = $data['slug'];

            wp_send_json([
                    'exists' => TaxonomyRepository::exists($slug)
            ]);
        }
    }

    /**
     * Delete a taxonomy
     */
    public function deleteTaxonomyAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['taxonomy'])) {
                wp_send_json([
                        'success' => false,
                        'error' => 'Missing taxonomy'
                ]);
            }

            $taxonomy = $data['taxonomy'];

            try {
                $command = new DeleteTaxonomyCommand($taxonomy);
                $command->execute();

                $return = [
                        'success' => true,
                ];
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                $return = [
                        'success' => false,
                        'error' => $exception->getMessage()
                ];
            }

            wp_send_json($return);
        }

        wp_send_json([
                'success' => false,
                'error' => 'no taxonomy was sent'
        ]);
    }

    /**
     * Fetch Taxonomies not registered in ACPT
     */
    public function fetchRegisteredTaxonomiesAction(): void
    {
        $taxonomies = get_taxonomies(['show_ui' => true], 'objects');
        $taxonomiesArray = [];

        foreach ($taxonomies as $taxonomy) {
            if (
                TaxonomyRepository::exists($taxonomy->name) === false &&
                $taxonomy->show_ui === true &&
                $taxonomy->show_in_nav_menus === true
            ) {
                $taxonomiesArray[] = $taxonomy;
            }
        }

        wp_send_json($taxonomiesArray);
    }

    /**
     * Fetch taxonomies
     *
     * @throws \Exception
     */
    public function fetchTaxonomiesAction(): void
    {
        $taxonomy = null;
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));
            $taxonomy = isset($data['taxonomy']) ? $data['taxonomy'] : null;
            $page = isset($data['page']) ? $data['page'] : null;
            $perPage = isset($data['perPage']) ? $data['perPage'] : null;
            $search = isset($data['search']) ? $data['search'] : null;
            $sort = isset($data['sort']) ? $data['sort'] : null;
            $order = isset($data['order']) ? $data['order'] : null;
        }

        if ($taxonomy) {
            wp_send_json(TaxonomyRepository::get([
                    'taxonomy' => $taxonomy
            ]));
        }

        wp_send_json([
            'count' => TaxonomyRepository::count([
                'search' => isset($search) ? $search : null,
            ]),
            'records' => TaxonomyRepository::get([
                'page' => isset($page) ? $page : 1,
                'perPage' => isset($perPage) ? $perPage : 20,
                'search' => isset($search) ? $search : null,
                'sort' => isset($sort) ? $sort : null,
                'order' => isset($order) ? $order : null,
            ]),
        ]);
    }

    /**
     * @throws \Exception
     */
    public function fetchTermsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['taxonomy'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing taxonomy'
                ], 500);
            }

            $context  = [];

            // RULE_POST_ID = 6
            $postIds  = isset($context[6]) ? array_values(array_filter(array_map('intval', $context[6]))) : [];

            // RULE_TERM_ID
            $termIds  = isset($context[7]) ? array_values(array_filter(array_map('intval', $context[7]))) : [];

            $termArgs = [
                'taxonomy'   => $data['taxonomy'],
                'hide_empty' => false,
            ];

            if (!empty($postIds)) {
                $termArgs['object_ids'] = $postIds;
                $termArgs['hide_empty'] = true;
            }

            if (!empty($termIds)) {
                $termArgs['include'] = $termIds;
                $termArgs['hide_empty'] = false;
            }

            $terms = get_terms($termArgs);

            if (is_wp_error($terms)) {
                wp_send_json([]);
            }

            if (isset($data['format']) && $data['format'] === 'short') {
                $result = [];

                foreach ($terms as $term) {
                    $result[] = ["label" => $term->name, "value" => (int)$term->term_id];
                }

                wp_send_json($result);
            }

            wp_send_json($terms);
        }

        wp_send_json([
            'success' => false,
            'error' => 'no data was sent'
        ], 500);
    }

    /**
     * Regenerate taxonomy labels
     */
    public function regenerateTaxonomyLabelsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['taxonomy'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing `taxonomy`'
                ], 500);
            }

            try {
                $taxonomy = $data['taxonomy'];
                $command = new RegenerateTaxonomyLabelsCommand($taxonomy);
                $command->execute();

                wp_send_json([
                    'success' => true,
                ]);
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                wp_send_json([
                    'success' => false,
                    'error' => $exception->getMessage()
                ], 500);
            }
        }
    }

    /**
     * Reset all taxonomies
     */
    public function resetTaxonomiesAction(): void
    {
        wp_send_json([]);
    }

    /**
     * Creates a taxonomy
     */
    public function saveTaxonomyAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        // persist $model on DB
        try {
            $settings = $data[3];

            if ($settings["rewrite"] === true) {
                $settings["rewrite"] = [];
                // @phpstan-ignore-next-line notIdentical.alwaysTrue
                $settings["rewrite"]["slug"] = (isset($settings["custom_rewrite"]) && null !== $settings["custom_rewrite"]) ? strtolower($settings["custom_rewrite"]) : strtolower($data[1]["slug"]) ;
            }

            $settings['capabilities'] = [];

            // The Settings-step form does not always submit the four capability
            // selects (they are optional), so guard each read — an absent key
            // means "not overridden", not an error.
            if (($settings['capabilities_0'] ?? null) === 'manage_terms') {
                $settings['capabilities'][] = 'manage_terms';
            }
            if (($settings['capabilities_1'] ?? null) === 'edit_terms') {
                $settings['capabilities'][] = 'edit_terms';
            }
            if (($settings['capabilities_2'] ?? null) === 'delete_terms') {
                $settings['capabilities'][] = 'delete_terms';
            }
            if (($settings['capabilities_3'] ?? null) === 'assign_terms') {
                $settings['capabilities'][] = 'assign_terms';
            }

            unset($settings['capabilities_0']);
            unset($settings['capabilities_1']);
            unset($settings['capabilities_2']);
            unset($settings['capabilities_3']);

            $id = (TaxonomyRepository::exists($data[1]["slug"])) ? TaxonomyRepository::getId($data[1]["slug"]) : Uuid::v4();
            $data = [
                'id' => $id,
                'slug' => $data[1]["slug"],
                'singular_label' => $data[1]["singular_label"],
                'plural_label' => $data[1]["plural_label"],
                'labels' => $data[2],
                'settings' => $settings
            ];

            $command = new SaveTaxonomyCommand($data);
            $command->execute();
            $httpStatus = 200;

            $return = [
                'id' => $id,
                'success' => true,
            ];
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            $httpStatus = 500;
            $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
            ];
        }

        wp_send_json($return, $httpStatus);
    }

    public function syncTaxonomiesAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['taxonomies'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing taxonomies'
                ], 500);
            }

            try {
                $taxonomies = $data['taxonomies'];
                $httpStatus = 200;

                foreach ($taxonomies as $taxonomy) {
                    TaxonomyRepository::createCustomTaxonomy($taxonomy);
                }

                $return = [
                    'success' => true
                ];
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                $httpStatus = 500;
                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            wp_send_json($return, $httpStatus);
        }

        wp_send_json([
            'success' => false,
            'error' => 'no data was sent'
        ], 500);
    }
}
