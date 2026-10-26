<?php

namespace ACPT_Lite\Core\API\AJAX\Controllers;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Command\CopyMetaBoxCommand;
use ACPT_Lite\Core\CQRS\Command\CopyMetaFieldCommand;
use ACPT_Lite\Core\CQRS\Command\DeleteMetaGroupCommand;
use ACPT_Lite\Core\CQRS\Command\SaveMetaGroupCommand;
use ACPT_Lite\Core\CQRS\Query\FetchAllFindBelongsQuery;
use ACPT_Lite\Core\CQRS\Query\FetchElementsQuery;
use ACPT_Lite\Core\CQRS\Query\FetchFindQuery;
use ACPT_Lite\Core\CQRS\Query\FetchMetaFieldsFromBelongsQuery;
use ACPT_Lite\Core\CQRS\Query\FetchMetaGroupsQuery;
use ACPT_Lite\Core\CQRS\Query\FetchPreviewLinkQuery;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class MetaController extends AbstractController
{
    /**
     * @throws \Exception
     */
    public function checkMetaBoxFieldNameAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        if (!isset($data['fieldName'])) {
            wp_send_json([
                'success' => false,
                'error' => 'Missing fieldName'
            ]);
        }

        $args = [
            'fieldName' => $data['fieldName'],
        ];

        if (!empty($data['boxName']) && is_string($data['boxName'])) {
            $args['boxName'] = $data['boxName'];
        }

        if (!empty($data['fieldId']) && is_string($data['fieldId'])) {
            $args['excludeFieldId'] = $data['fieldId'];
        }

        wp_send_json([
            'exists' => MetaRepository::existsMetaField($args)
        ]);
    }

    /**
     * @throws \Exception
     */
    public function checkMetaBoxNameAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        if (!isset($data['boxName'])) {
            wp_send_json([
                'success' => false,
                'error' => 'Missing boxName'
            ]);
        }

        $boxName = $data['boxName'];

        wp_send_json([
            'exists' => MetaRepository::existsMetaBox([
                'boxName' => $boxName
            ])
        ]);
    }

    public function copyMetaBoxAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            try {
                $command = new CopyMetaBoxCommand($data);
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
    }

    public function copyMetaBoxesAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['boxIds'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing boxIds'
                ]);
            }

            try {
                foreach ($data['boxIds'] as $boxId) {
                    $command = new CopyMetaBoxCommand([
                        'boxId' => $boxId,
                        'targetGroupId' => $data['targetGroupId'],
                        'delete' => $data['delete'],
                    ]);
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

    public function copyMetaFieldAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            try {
                $command = new CopyMetaFieldCommand($data);
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
    }

    public function copyMetaFieldsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));
            $return = [
                'success' => false,
                'error' => 'Unknown error'
            ];

            if (!isset($data['fieldIds'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing fieldIds'
                ]);
            }

            try {
                foreach ($data['fieldIds'] as $fieldId) {
                    $command = new CopyMetaFieldCommand([
                        'fieldId' => $fieldId,
                        'targetEntityId' => $data['targetEntityId'],
                        'targetEntityType' => $data['targetEntityType'],
                        'delete' => $data['delete'],
                    ]);
                    $command->execute();

                    $return = [
                        'success' => true,
                    ];
                }
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
     * Delete a meta group
     */
    public function deleteMetaAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['id'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing group `id`'
                ]);
            }

            $id = $data['id'];

            try {
                $command = new DeleteMetaGroupCommand($id);
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
     * Execute a shortcode
     */
    public function doShortcodeAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        if (!isset($data['shortcode'])) {
            wp_send_json([
                    'success' => false,
                    'error' => 'Missing taxonomy'
            ]);
        }

        $shortcode = $data['shortcode'];

        wp_send_json([
                'success' => true,
                'data' => WPUtils::renderShortCode($shortcode)
        ]);
    }

    /**
     * @throws \Exception
     */
    public function fetchAllFindBelongsAction(): void
    {
        $query = new FetchAllFindBelongsQuery();

        wp_send_json($query->execute());
    }

    /**
     * Fetch OP meta fields
     * Used by FSE
     */
    public function fetchAllMetaAction(): void
    {
        try {
            $groups = [];
            $allMetaGroups = MetaRepository::get([
                'clonedFields' => true,
            ]);

            foreach ($allMetaGroups as $group) {
                foreach ($group->getBelongs() as $belong) {
                    $belongsTo = $belong->getBelongsTo();
                    $find = $belong->getFind() ?? $belongsTo;
                    $findLabel = $belong->getFindAsSting() ?? $find;

                    if (!isset($groups[$belongsTo])) {
                        $groups[$belongsTo] = [];
                    }

                    if (!isset($groups[$belongsTo][$find])) {
                        $groups[$belongsTo][$find] = [
                            'label' => $findLabel,
                            'records' => [],
                        ];
                    }

                    // avoid duplicating the same group under the same key
                    $alreadyAdded = false;
                    foreach ($groups[$belongsTo][$find]['records'] as $existing) {
                        if ($existing->getId() === $group->getId()) {
                            $alreadyAdded = true;
                            break;
                        }
                    }

                    if (!$alreadyAdded) {
                        $groups[$belongsTo][$find]['records'][] = $group;
                    }
                }
            }

            wp_send_json($groups);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            wp_send_json([
                'success' => false,
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * fetch CPTs or Taxonomies
     * (used by copy meta box/field UI)
     *
     * @throws \Exception
     */
    public function fetchElementsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['belongsTo'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing belongsTo'
                ], 500);
            }

            $belongsTo = $data['belongsTo'];
            $exclude = (isset($data['exclude'])) ? $data['exclude'] : null;

            $query = new FetchElementsQuery($belongsTo, $exclude);

            wp_send_json($query->execute());
        }

        wp_send_json([
            'success' => false,
            'error' => 'no params were sent'
        ], 500);
    }

    /**
     * @throws \Exception
     */
    public function fetchFindAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        if (!isset($data['belongsTo']) && !isset($data['id'])) {
            wp_send_json([
                'success' => false,
                'error' => 'Missing params (`id, belongsTo`)'
            ]);
        }

        $id = $data['id'];
        $belongsTo = $data['belongsTo'];

        $command = new FetchFindQuery((int)$id, $belongsTo);

        wp_send_json($command->execute());
    }

    /**
     * @throws \Exception
     */
    public function fetchFindFromBelongsToAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        if (!isset($data['belongsTo'])) {
            wp_send_json([
                'success' => false,
                'error' => 'Missing params (`belongsTo`)'
            ]);
        }

        $belongsTo = $data['belongsTo'];
        $command = new FetchMetaFieldsFromBelongsQuery($belongsTo);

        wp_send_json($command->execute());
    }

    /**
     * Fetch custom post type meta
     *
     * @throws \Exception
     */
    public function fetchMetaAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        if (empty($data)) {
            $data = [];
        }

        // Single field fetch
        if (isset($data['id'])) {
            $query = new FetchMetaGroupsQuery([
                'id' => $data['id'],
                'formBuilder' => $data['formBuilder'] ?? false,
                'cct' => $data['cct'] ?? true,
                'excludeField' => ((isset($data['excludeField'])) ? $data['excludeField'] : null),
            ]);

            $record = $query->execute();

            if (!empty($record)) {
                wp_send_json($record[0]);
            }

            wp_send_json([]);
        }

        // user fields
        if (isset($data['belongsTo']) && $data['belongsTo'] === MetaTypes::USER) {
            unset($data['find']);
        }

        // media fields
        if (isset($data['find']) && $data['find'] === 'attachment') {
            $data['belongsTo'] = MetaTypes::MEDIA;
            unset($data['find']);
        }

        $data['cct'] = false;

        // count
        $count = MetaRepository::count([
            'search'    => $data['search'] ?? null,
            'groupName' => $data['groupName'] ?? null,
        ]);

        // fetch groups
        $query = new FetchMetaGroupsQuery($data);

        wp_send_json([
            'count' => $count,
            'records' => $query->execute(),
        ]);
    }

    /**
     * Fetch meta field by id
     *
     * @throws \Exception
     */
    public function fetchMetaFieldAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        if (!isset($data['id'])) {
            wp_send_json([
                    'success' => false,
                    'error' => 'Missing id'
            ]);
        }

        $id = $data['id'];
        $lazy = isset($data ['lazy']) ? $data ['lazy'] : false;

        wp_send_json(MetaRepository::getMetaFieldById($id, $lazy));
    }

    public function fetchMetaFieldsFlatMapAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        if (!isset($data['excludeField'])) {
            wp_send_json([
                'success' => false,
                'error' => 'Missing `excludeField`'
            ]);
        }

        wp_send_json(MetaRepository::metaFieldsFlatArray($data['excludeField']));
    }

    /**
     * @throws \Exception
     */
    public function fetchMetaFieldsFromBelongsToAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        if (!isset($data['belongsTo']) && !isset($data['find'])) {
            wp_send_json([
                'success' => false,
                'error' => 'Missing params (`belongsTo`)'
            ]);
        }

        $belongsTo = $data['belongsTo'];
        $query = new FetchMetaFieldsFromBelongsQuery($belongsTo);

        wp_send_json($query->execute());
    }

    /**
     * Fetch meta value
     */
    public function fetchMetaValueAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['fieldName'])) {
                wp_send_json([
                    'success' => false,
                    'error' => "Missing `fieldName` field"
                ]);
            }

            if (!isset($data['objectType'])) {
                wp_send_json([
                    'success' => false,
                    'error' => "Missing `objectType` field"
                ]);
            }

            if (!isset($data['objectId'])) {
                wp_send_json([
                    'success' => false,
                    'error' => "Missing `objectId` field"
                ]);
            }

            $fieldName = $data['fieldName'];
            $objectId = $data['objectId'];
            $objectType = $data['objectType'];

            wp_send_json([
                'value' => Meta::fetch($objectId, $objectType, $fieldName)
            ]);
        }
    }

    /**
     * Fetch preview link
     */
    public function fetchPreviewLinkAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        try {
            $query = new FetchPreviewLinkQuery($data);

            wp_send_json([
                'success' => true,
                'link' => $query->execute(),
            ]);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            wp_send_json([
                'success' => false,
                'error' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * Saves meta
     */
    public function saveMetaAction(): void
    {
        // allow HTML in the description field
        $data = $this->sanitizeJsonData($this->request->post('data'), []);

        if (
            !isset($data['id']) ||
            !isset($data['name'])
        ) {
            wp_send_json([
                'success' => false,
                'error' => 'No data sent'
            ], 500);
        }

        try {
            $httpStatus = 200;
            $command = new SaveMetaGroupCommand($data);
            $return = [
                'id' => $command->execute(),
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

}
