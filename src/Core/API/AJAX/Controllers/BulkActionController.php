<?php

namespace ACPT_Lite\Core\API\AJAX\Controllers;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\API\Exceptions\NotFoundException;
use ACPT_Lite\Core\CQRS\Command\DeleteCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Command\DeleteMetaGroupCommand;
use ACPT_Lite\Core\CQRS\Command\DeleteTaxonomyCommand;
use ACPT_Lite\Core\CQRS\Command\DeleteWooCommerceProductDataCommand;
use ACPT_Lite\Core\CQRS\Command\DuplicateCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Command\DuplicateMetaGroupCommand;
use ACPT_Lite\Core\CQRS\Command\DuplicateTaxonomyCommand;
use ACPT_Lite\Core\CQRS\Command\DuplicateWooCommerceProductDataCommand;

class BulkActionController extends AbstractController
{
    public function bulkActionsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['action'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing action'
                ]);
            }

            if (!isset($data['belongsTo'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing belongsTo'
                ]);
            }

            if (!isset($data['elements'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing elements'
                ]);
            }

            $action = $data['action'];
            $elements = $data['elements'];
            $belongsTo = $data['belongsTo'];
            $command = null;

            /** @var string[] $failedDeletes elements whose delete returned false (ticket #1246) */
            $failedDeletes = [];

            try {
                switch ($action) {
                    case "delete":
                        foreach ($elements as $element => $toDelete) {
                            if ($toDelete) {
                                switch ($belongsTo) {
                                    default:
                                    case MetaTypes::CUSTOM_POST_TYPE:
                                        $command = new DeleteCustomPostTypeCommand($element);
                                        break;

                                    case MetaTypes::TAXONOMY:
                                        $command = new DeleteTaxonomyCommand($element);
                                        break;

                                    case MetaTypes::META:
                                        $command = new DeleteMetaGroupCommand($element);
                                        break;

                                    case "woo_product_data":
                                        $command = new DeleteWooCommerceProductDataCommand($element);
                                        break;
                                }

                                if ($command !== null) {
                                    $command->execute();
                                }
                            }
                        }

                        break;

                        // duplicate
                    case "duplicate":
                        foreach ($elements as $element => $toDuplicate) {
                            if ($toDuplicate) {
                                switch ($belongsTo) {
                                    default:
                                    case MetaTypes::CUSTOM_POST_TYPE:
                                        $command = new DuplicateCustomPostTypeCommand($element);
                                        break;

                                    case MetaTypes::TAXONOMY:
                                        $command = new DuplicateTaxonomyCommand($element);
                                        break;

                                    case MetaTypes::META:
                                        $command = new DuplicateMetaGroupCommand($element);
                                        break;

                                    case "woo_product_data":
                                        $command = new DuplicateWooCommerceProductDataCommand($element);
                                        break;
                                }

                                $command->execute();
                            }
                        }

                        break;
                }

                if (!empty($failedDeletes)) {
                    wp_send_json([
                        'success' => false,
                        'error'   => sprintf(
                            '%d of the selected items could not be deleted.',
                            count($failedDeletes)
                        ),
                        'failed'  => $failedDeletes,
                    ]);
                }

                wp_send_json([
                    'success' => true,
                ]);
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                wp_send_json([
                    'success' => false,
                    'error' => $exception->getMessage()
                ]);
            }
        }
    }

    public function duplicateAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        if (!isset($data['find'])) {
            wp_send_json([
                'success' => false,
                'error' => 'Missing `find`'
            ]);
        }

        if (!isset($data['belongsTo'])) {
            wp_send_json([
                'success' => false,
                'error' => 'Missing `belongsTo`'
            ]);
        }

        try {
            $belongsTo = $data['belongsTo'];
            $element = $data['find'];

            switch ($belongsTo) {
                default:
                case MetaTypes::CUSTOM_POST_TYPE:
                    $command = new DuplicateCustomPostTypeCommand($element);
                    break;

                case MetaTypes::TAXONOMY:
                    $command = new DuplicateTaxonomyCommand($element);
                    break;

                case MetaTypes::META:
                    $command = new DuplicateMetaGroupCommand($element);
                    break;

                case "woo_product_data":
                    $command = new DuplicateWooCommerceProductDataCommand($element);
                    break;
            }

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
