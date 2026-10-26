// please refer to
// https://developer.wordpress.org/reference/functions/get_taxonomy_labels/
import useTranslation from "../hooks/useTranslation";

export const taxonomyLabels = [
    {
        id: "name",
        label: useTranslation("Menu Name"),
        description: useTranslation("General name for the taxonomy, usually plural. The same as and overridden by $tax->label. Default 'Tags/Categories'."),
    },
    {
        id: "singular_name",
        label: useTranslation("Singular name"),
        description: useTranslation("Name for one object of this taxonomy. Default 'Tag/Category'"),
    },
    {
        id: "search_items",
        label: useTranslation("Search items"),
        description: useTranslation("Search Tags/Search Categories"),
    },
    {
        id: "popular_items",
        label: useTranslation("Popular items"),
        description: useTranslation("This label is only used for non-hierarchical taxonomies. Default 'Popular Tags'."),
    },
    {
        id: "all_items",
        label: useTranslation("All items"),
        description: useTranslation("All Tags/All Categories"),
    },
    {
        id: "parent_item",
        label: useTranslation("Parent item"),
        description: useTranslation("This label is only used for hierarchical taxonomies. Default 'Parent Category'."),
    },
    {
        id: "parent_item_colon",
        label: useTranslation("Parent item colon"),
        description: useTranslation("The same as parent_item, but with colon : in the end."),
    },
    {
        id: "edit_item",
        label: useTranslation("Edit item"),
        description: useTranslation("Edit Tag/Edit Category."),
    },
    {
        id: "view_item",
        label: useTranslation("View item"),
        description: useTranslation("View Tag/View Category."),
    },
    {
        id: "update_item",
        label: useTranslation("Update item"),
        description: useTranslation("Update Tag/Update Category."),
    },
    {
        id: "add_new_item",
        label: useTranslation("Add new item"),
        description: useTranslation("Add New Tag/Add New Category."),
    },
    {
        id: "new_item_name",
        label: useTranslation("New item name"),
        description: useTranslation("New Tag Name/New Category Name."),
    },
    {
        id: "separate_items_with_commas",
        label: useTranslation("Separate items with commas"),
        description: useTranslation("This label is only used for non-hierarchical taxonomies. Default 'Separate tags with commas', used in the meta box."),
    },
    {
        id: "add_or_remove_items",
        label: useTranslation("Add or remove items"),
        description: useTranslation("This label is only used for non-hierarchical taxonomies. Default 'Add or remove tags', used in the meta box when JavaScript is disabled."),
    },
    {
        id: "choose_from_most_used",
        label: useTranslation("Choose from most used"),
        description: useTranslation("This label is only used on non-hierarchical taxonomies. Default 'Choose from the most used tags', used in the meta box."),
    },
    {
        id: "not_found",
        label: useTranslation("Not found"),
        description: useTranslation("No tags found/No categories found', used in the meta box and taxonomy list table."),
    },
    {
        id: "no_terms",
        label: useTranslation("No terms"),
        description: useTranslation("No tags/No categories', used in the posts and media list tables."),
    },
    {
        id: "filter_by_item",
        label: useTranslation("Filter by item"),
        description: useTranslation("This label is only used for hierarchical taxonomies. Default 'Filter by category', used in the posts list table."),
    },
    {
        id: "items_list_navigation",
        label: useTranslation("Items list navigation"),
        description: useTranslation("Label for the table pagination hidden heading."),
    },
    {
        id: "items_list",
        label: useTranslation("Items list"),
        description: useTranslation("Label for the table hidden heading."),
    },
    {
        id: "most_used",
        label: useTranslation("Most used"),
        description: useTranslation("Title for the Most Used tab. Default 'Most Used'."),
    },
    {
        id: "back_to_items",
        label: useTranslation("Back to items"),
        description: useTranslation("Label displayed after a term has been updated."),
    },
    ];