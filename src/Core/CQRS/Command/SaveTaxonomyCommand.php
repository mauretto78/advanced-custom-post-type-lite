<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\ReservedTerms;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\Wordpress\Translator;

class SaveTaxonomyCommand implements CommandInterface, LogFormatInterface
{
    /**
     * @var array<string, mixed>
     */
    private array $data;

    /**
     * SaveTaxonomyCommand constructor.
     *
     * @param array<string, mixed> $data
     */
    public function __construct(array $data)
    {
        $this->data = $this->normalizeData($data);
    }

    /**
     * Normalizes the provided data by removing trailing slashes from specific rewrite rule settings.
     *
     * @param array<string, mixed> $data The input data containing settings that may include rewrite rules.
     * @return array<string, mixed> The normalized data with updated rewrite rule settings.
     */
    private function normalizeData(array $data): array
    {
        if (isset($data['settings']['rewrite']) && isset($data['settings']['rewrite']['slug'])) {
            $data['settings']['rewrite']['slug'] = trim($data['settings']['rewrite']['slug'], "/");
        }

        if (isset($data['settings']['custom_rewrite'])) {
            $data['settings']['custom_rewrite'] = trim($data['settings']['custom_rewrite'], "/");
        }

        return $data;
    }

    /**
     * @return string|null
     * @throws \Exception
     */
    public function execute(): ?string
    {
        try {
            $data = $this->data;
            $taxonomyModel = TaxonomyModel::hydrateFromArray([
                'id' => ($data['id'] ? $data['id'] : Uuid::v4()),
                'slug' => @$data["slug"],
                'singular' => @$data["singular_label"],
                'plural' => @$data["plural_label"],
                'native' => false,
                'labels' => $data['labels'] ?? [],
                'settings' => $data['settings'] ?? [],
            ]);

            if (in_array($taxonomyModel->getSlug(), ReservedTerms::list())) {
                throw new \Exception('Slug must not collide with any reserved term. Please see the <a href="https://developer.wordpress.org/reference/functions/register_taxonomy/#reserved-terms" target="_blank">official docs</a> for more info');
            }

            TaxonomyRepository::save($taxonomyModel);

            // Assoc post types
            if (isset($data['post_types']) && is_array($data['post_types'])) {
                foreach ($data['post_types'] as $post_type) {
                    // Assoc ACPT post type definition
                    $post_id = CustomPostTypeRepository::getId($post_type);

                    if (!empty($post_id) && !empty($taxonomyModel->getId())) {
                        $command = new AssocTaxonomyToCustomPostTypeCommand($post_id, $taxonomyModel->getId());
                        $command->execute();
                    }

                    $singular = Translator::translateString($data["singular_label"]);
                    $plural = Translator::translateString($data["plural_label"]);
                    $labels = $data['labels'];

                    $labels['name'] = Translator::translateString(@$labels['name']);
                    $labels['singular_name'] = Translator::translateString(@$labels['singular_label']);
                    $labels['search_items'] = Translator::translateString(@$labels['search_items']);
                    $labels['popular_items'] = Translator::translateString(@$labels['popular_items']);
                    $labels['all_items'] = Translator::translateString(@$labels['all_items']);
                    $labels['parent_item'] = Translator::translateString(@$labels['parent_item']);
                    $labels['parent_item_colon'] = Translator::translateString(@$labels['parent_item_colon']);
                    $labels['edit_item'] = Translator::translateString(@$labels['edit_item']);
                    $labels['view_item'] = Translator::translateString(@$labels['view_item']);
                    $labels['update_item'] = Translator::translateString(@$labels['update_item']);
                    $labels['add_new_item'] = Translator::translateString(@$labels['add_new_item']);
                    $labels['new_item_name'] = Translator::translateString(@$labels['new_item_name']);
                    $labels['separate_items_with_commas'] = Translator::translateString(@$labels['separate_items_with_commas']);
                    $labels['add_or_remove_items'] = Translator::translateString(@$labels['add_or_remove_items']);
                    $labels['choose_from_most_used'] = Translator::translateString(@$labels['choose_from_most_used']);
                    $labels['not_found'] = Translator::translateString(@$labels['not_found']);
                    $labels['no_terms'] = Translator::translateString(@$labels['no_terms']);
                    $labels['filter_by_item'] = Translator::translateString(@$labels['filter_by_item']);
                    $labels['items_list_navigation'] = Translator::translateString(@$labels['items_list_navigation']);
                    $labels['items_list'] = Translator::translateString(@$labels['items_list']);
                    $labels['back_to_items'] = Translator::translateString(@$labels['back_to_items']);
                    $labels['item_link'] = Translator::translateString(@$labels['item_link']);
                    $labels['item_link_description'] = Translator::translateString(@$labels['item_link_description']);
                    $labels['menu_name'] = Translator::translateString(@$labels['menu_name']);
                    $labels['name_admin_bar'] = Translator::translateString(@$labels['name_admin_bar']);
                    $labels['archives'] = Translator::translateString(@$labels['archives']);

                    $modelOptions = array_merge(
                        [
                            'singular_label' =>  $singular,
                            'plural' => $plural,
                            'labels' => $labels,
                        ],
                        $data['settings']
                    );

                    $options = array_merge(
                        [
                            "hierarchical" => false,
                            "label" => $data["slug"],
                            "singular_label" => $plural,
                            "show_ui" => true,
                            "query_var" => true,
                            'show_admin_column' => true,
                            "show_in_rest" => true,
                            "rewrite" => ["slug" => strtolower(trim($data["slug"], "/"))]
                        ],
                        $modelOptions
                    );

                    // custom_rewrite
                    if (isset($data['custom_rewrite']) && $data['rewrite'] === true && !empty($data['custom_rewrite'])) {
                        $options['rewrite'] = [
                            'slug' => trim($data['custom_rewrite'], "/"),
                        ];
                    }

                    // with_front
                    if (isset($data['with_front']) && $data['rewrite'] === true) {
                        if (!is_array($options['rewrite'])) {
                            $options['rewrite'] = [];
                        }

                        $options['rewrite']['with_front'] = $data['with_front'];
                    }

                    // hierarchical
                    if (isset($data['rewrite_hierarchical']) && $data['rewrite'] === true) {
                        if (!is_array($options['rewrite'])) {
                            $options['rewrite'] = [];
                        }

                        $options['rewrite']['hierarchical'] = $data['rewrite_hierarchical'];
                    }

                    if (!taxonomy_exists(strtolower($data["slug"]))) {
                        register_taxonomy(
                            strtolower($data["slug"]),
                            $post_type,
                            $options
                        );
                    }
                }
            }

            ACPT_Lite_DB::flushCache();
            flush_rewrite_rules();

            do_action("acpt/taxonomy/save", $this, $taxonomyModel);

            return $taxonomyModel->getId();
        } catch (\Exception $exception) {
            // Re-throw instead of swallowing to `return null`. Every caller
            // (saveTaxonomyAction, register_acpt_taxonomy, REST v1, the
            // abilities layer) already wraps ->execute() in its own try/catch
            // that logs via `acpt/error` and builds a failure response - but
            // none of them checked the return value, so a swallowed exception
            // (e.g. a reserved-slug save) was reported as success:true with
            // nothing persisted. Matches SaveCustomPostTypeCommand, which never
            // swallowed its exceptions. Ticket #1252.
            throw $exception;
        }
    }

    /**
     * @inheritDoc
     */
    public function logFormat(): array
    {
        return [
            "class" => SaveTaxonomyCommand::class,
            'data' => $this->data
        ];
    }
}
