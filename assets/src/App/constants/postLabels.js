// please refer to
// https://developer.wordpress.org/reference/functions/get_post_type_labels/
import useTranslation from "../hooks/useTranslation";

export const postLabels = [
    {
        id: "menu_name",
        label: useTranslation("Menu Name"),
        description: useTranslation("Label for the menu name. Default is the same as name."),
    },
    {
        id: "all_items",
        label: useTranslation("All items"),
        description: useTranslation("Label to signify all items in a submenu link. Default is ‘All Posts’ / ‘All Pages’."),
    },
    {
        id: "add_new",
        label: useTranslation("Add New"),
        description: useTranslation("Default is ‘Add New’ for both hierarchical and non-hierarchical types."),
    },
    {
        id: "add_new_item",
        label: useTranslation("Add New Item"),
        description: useTranslation("Label for adding a new singular item. Default is ‘Add New Post’ / ‘Add New Page’."),
    },
    {
        id: "edit_item",
        label: useTranslation("Edit Item"),
        description: useTranslation("Label for editing a singular item. Default is ‘Edit Post’ / ‘Edit Page’."),
    },
    {
        id: "new_item",
        label: useTranslation("New Item"),
        description: useTranslation("Label for the new item page title. Default is ‘New Post’ / ‘New Page’."),
    },
    {
        id: "view_item",
        label: useTranslation("View Item"),
        description: useTranslation("Label for viewing a singular item. Default is ‘View Post’ / ‘View Page’."),
    },
    {
        id: "view_items",
        label: useTranslation("View Items"),
        description: useTranslation("Label for viewing post type archives. Default is ‘View Posts’ / ‘View Pages’."),
    },
    {
        id: "search_item",
        label: useTranslation("Search Item"),
        description: useTranslation("Label for searching plural items. Default is ‘Search Posts’ / ‘Search Pages’."),
    },
    {
        id: "not_found",
        label: useTranslation("Not Found"),
        description: useTranslation("Label used when no items are found. Default is ‘No posts found’ / ‘No pages found’."),
    },
    {
        id: "not_found_in_trash",
        label: useTranslation("Not Found in Trash"),
        description: useTranslation("Label used when no items are in the Trash. Default is ‘No posts found in Trash’ / ‘No pages found in Trash’."),
    },
    {
        id: "parent_item_colon",
        label: useTranslation("Parent"),
        description: useTranslation("Label used to prefix parents of hierarchical items. Not used on non-hierarchical post types. Default is ‘Parent Page:’."),
    },
    {
        id: "featured_image",
        label: useTranslation("Featured Image"),
        description: useTranslation("Label for the featured image meta box title. Default is ‘Featured image’."),
    },
    {
        id: "set_featured_image",
        label: useTranslation("Set Featured Image"),
        description: useTranslation("Label for setting the featured image. Default is ‘Set featured image’."),
    },
    {
        id: "remove_featured_image",
        label: useTranslation("Remove Featured Image"),
        description: useTranslation("Label for removing the featured image. Default is ‘Remove featured image’."),
    },
    {
        id: "use_featured_image",
        label: useTranslation("Use Featured Image"),
        description: useTranslation("Label in the media frame for using a featured image. Default is ‘Use as featured image’."),
    },
    {
        id: "archives",
        label: useTranslation("Archives"),
        description: useTranslation("Label for archives in nav menus. Default is ‘Post Archives’ / ‘Page Archives’."),
    },
    {
        id: "insert_into_item",
        label: useTranslation("Insert into item"),
        description: useTranslation("Label for the media frame button. Default is ‘Insert into post’ / ‘Insert into page’."),
    },
    {
        id: "uploaded_to_this_item",
        label: useTranslation("Uploaded to this Item"),
        description: useTranslation("Label for the media frame filter. Default is ‘Uploaded to this post’ / ‘Uploaded to this page’."),
    },
    {
        id: "filter_items_list",
        label: useTranslation("Filter Items List"),
        description: useTranslation("Label for the table views hidden heading. Default is ‘Filter posts list’ / ‘Filter pages list’."),
    },
    {
        id: "items_list_navigation",
        label: useTranslation("Items List Navigation"),
        description: useTranslation("Label for the table pagination hidden heading. Default is ‘Posts list navigation’ / ‘Pages list navigation’."),
    },
    {
        id: "items_list",
        label: useTranslation("Items List"),
        description: useTranslation("Label for the table hidden heading. Default is ‘Posts list’ / ‘Pages list’."),
    },
    {
        id: "filter_by_date",
        label: useTranslation("Filter by date"),
        description: useTranslation("Label for the date filter in list tables. Default is ‘Filter by date’."),
    },
    {
        id: "item_published",
        label: useTranslation("Item published"),
        description: useTranslation("Label used when an item is published. Default is ‘Post published.’ / ‘Page published.’"),
    },
    {
        id: "item_published_privately",
        label: useTranslation("Item published privately"),
        description: useTranslation("Label used when an item is published with private visibility. Default is ‘Post published privately.’ / ‘Page published privately.’"),
    },
    {
        id: "item_reverted_to_draft",
        label: useTranslation("Item reverted to draft"),
        description: useTranslation("Label used when an item is switched to a draft. Default is ‘Post reverted to draft.’ / ‘Page reverted to draft.’"),
    },
    {
        id: "item_scheduled",
        label: useTranslation("Item scheduled"),
        description: useTranslation("Label used when an item is scheduled for publishing. Default is ‘Post scheduled.’ / ‘Page scheduled.’"),
    },
    {
        id: "item_updated",
        label: useTranslation("Item updated"),
        description: useTranslation("Label used when an item is updated. Default is ‘Post updated.’ / ‘Page updated.’"),
    },
];