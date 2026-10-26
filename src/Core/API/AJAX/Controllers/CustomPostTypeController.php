<?php

namespace ACPT_Lite\Core\API\AJAX\Controllers;

use ACPT_Lite\Core\CQRS\Command\AssocTaxonomyToCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Command\DeleteCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Command\RegeneratePostLabelsCommand;
use ACPT_Lite\Core\CQRS\Command\SaveCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Query\FetchPostTypeTaxonomiesQuery;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

class CustomPostTypeController extends AbstractController
{
    /**
     * Assoc CPT to Taxonomy
     */
    public function assocPostTypeToTaxonomyAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            try {
                $taxonomyId = TaxonomyRepository::getId($data['taxonomy']);

                foreach ($data['postTypes'] as $customPostType) {
                    $command = new AssocTaxonomyToCustomPostTypeCommand($customPostType['id'], $taxonomyId, $customPostType['checked']);
                    $command->execute();
                }

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
    }

    /**
     * Assoc Taxonomy to CPT
     */
    public function assocTaxonomyToPostTypeAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            try {
                $postId = CustomPostTypeRepository::getId($data['postType']);

                foreach ($data['taxonomies'] as $taxonomy) {
                    $command = new AssocTaxonomyToCustomPostTypeCommand($postId, $taxonomy['id'], $taxonomy['checked']);
                    $command->execute();
                }

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
    }

    /**
     * Delete custom post type
     */
    public function deleteCustomPostTypeAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['postType'])) {
                wp_send_json([
                        'success' => false,
                        'error' => 'Missing postType'
                ]);
            }

            $postType = $data['postType'];

            try {
                $command = new DeleteCustomPostTypeCommand($postType);
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
                'error' => 'no postType was sent'
        ]);
    }

    /**
     * Fetch custom post types
     *
     * @throws \Exception
     */
    public function fetchCustomPostTypesAction(): void
    {
        $postType = null;

        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));
            $postType = isset($data['postType']) ? $data['postType'] : null;
            $page = isset($data['page']) ? $data['page'] : null;
            $perPage = isset($data['perPage']) ? $data['perPage'] : null;
            $sort = isset($data['sort']) ? $data['sort'] : null;
            $order = isset($data['order']) ? $data['order'] : null;
            $search = isset($data['search']) ? $data['search'] : null;
        }

        if ($postType) {
            wp_send_json(CustomPostTypeRepository::get([
                    'postType' => $postType
            ]));
        }

        wp_send_json([
            'count' => CustomPostTypeRepository::count([
                'search' => isset($search) ? $search : null,
            ]),
            'records' => CustomPostTypeRepository::get([
                'page' => isset($page) ? $page : 1,
                'perPage' => isset($perPage) ? $perPage : 20,
                'sort' => isset($sort) ? $sort : null,
                'order' => isset($order) ? $order : null,
                'search' => isset($search) ? $search : null,
            ]),
        ]);
    }

    /**
     * Fetch post types and taxonomies
     */
    public function fetchPostTypeTaxonomiesAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data[ 'postType' ])) {
                wp_send_json([
                        'success' => false,
                        'error'   => 'Missing postType'
                ]);
            }

            $postType = $data[ 'postType' ];
            $query = new FetchPostTypeTaxonomiesQuery($postType);

            wp_send_json($query->execute());
        }
    }

    /**
     * Regenerate post type labels
     */
    public function regeneratePostLabelsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['postType'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing `postType`'
                ], 500);
            }

            try {
                $postType = $data['postType'];
                $command = new RegeneratePostLabelsCommand($postType);
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
     * Reset all custom post type meta
     */
    public function resetCustomPostTypesAction(): void
    {
        wp_send_json([]);
    }

    /**
     * Creates a custom post type
     */
    public function saveCustomPostTypeAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        $supports = [];

        if ($data[1]["support_0"] !== false) {
            $supports[] = $data[1]["support_0"];
        }
        if ($data[1]["support_1"] !== false) {
            $supports[] = $data[1]["support_1"];
        }
        if ($data[1]["support_2"] !== false) {
            $supports[] = $data[1]["support_2"];
        }
        if ($data[1]["support_3"] !== false) {
            $supports[] = $data[1]["support_3"];
        }
        if ($data[1]["support_4"] !== false) {
            $supports[] = $data[1]["support_4"];
        }
        if ($data[1]["support_5"] !== false) {
            $supports[] = $data[1]["support_5"];
        }
        if ($data[1]["support_6"] !== false) {
            $supports[] = $data[1]["support_6"];
        }
        if ($data[1]["support_7"] !== false) {
            $supports[] = $data[1]["support_7"];
        }
        if ($data[1]["support_8"] !== false) {
            $supports[] = $data[1]["support_8"];
        }
        if ($data[1]["support_9"] !== false) {
            $supports[] = $data[1]["support_9"];
        }
        if ($data[1]["support_10"] !== false) {
            $supports[] = $data[1]["support_10"];
        }

        // persist $model on DB
        try {
            $id = (CustomPostTypeRepository::exists($data[1]["post_name"])) ? CustomPostTypeRepository::getId($data[1]["post_name"]) : Uuid::v4();

            $data = [
                'id' => $id,
                'name' => $data[1]["post_name"],
                'singular_label' => $data[1]["singular_label"],
                'plural_label' => $data[1]["plural_label"],
                'icon' => (isset($data[1]["icon"]['value'])) ? $data[1]["icon"]['value'] : $data[1]["icon"],
                'supports' => $supports,
                'labels' => $data[2],
                'settings' => $data[3]
            ];

            $command = new SaveCustomPostTypeCommand($data);

            $httpStatus = 200;
            $return = [
                'id' => $command->execute(),
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

    /**
     * Sync posts
     */
    public function syncPostsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['postTypes'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing postType'
                ], 500);
            }

            try {
                $postTypes = $data['postTypes'];
                $httpStatus = 200;

                foreach ($postTypes as $postType) {
                    CustomPostTypeRepository::createCustomPostType($postType);
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
