
export const hydratePostTypeFormFromStep = (step, data) => {

    if(step === 2){
        return {
            1: {
                post_name:data.name,
                singular_label:data.singular,
                plural_label:data.plural,
                icon:data.icon,
                support_0: data.supports[0] ? data.supports[0] : false,
                support_1: data.supports[1] ? data.supports[1] : false,
                support_2: data.supports[2] ? data.supports[2] : false,
                support_3: data.supports[3] ? data.supports[3] : false,
                support_4: data.supports[4] ? data.supports[4] : false,
                support_5: data.supports[5] ? data.supports[5] : false,
                support_6: data.supports[6] ? data.supports[6] : false,
                support_7: data.supports[7] ? data.supports[7] : false,
                support_8: data.supports[8] ? data.supports[8] : false,
                support_9: data.supports[9] ? data.supports[9] : false,
                support_10: data.supports[10] ? data.supports[10] : false
            }
        };
    }

    if(step === 3){
        return {
            1: {
                post_name:data.name,
                singular_label:data.singular,
                plural_label:data.plural,
                icon:data.icon,
                support_0: data.supports[0] ? data.supports[0] : false,
                support_1: data.supports[1] ? data.supports[1] : false,
                support_2: data.supports[2] ? data.supports[2] : false,
                support_3: data.supports[3] ? data.supports[3] : false,
                support_4: data.supports[4] ? data.supports[4] : false,
                support_5: data.supports[5] ? data.supports[5] : false,
                support_6: data.supports[6] ? data.supports[6] : false,
                support_7: data.supports[7] ? data.supports[7] : false,
                support_8: data.supports[8] ? data.supports[8] : false,
                support_9: data.supports[9] ? data.supports[9] : false,
                support_10: data.supports[10] ? data.supports[10] : false
            },
            2: {
                menu_name: data.labels.menu_name,
                all_items: data.labels.all_items,
                add_new: data.labels.add_new,
                add_new_item: data.labels.add_new_item,
                edit_item:data.labels.edit_item,
                new_item:data.labels.new_item,
                view_item:data.labels.view_item,
                view_items:data.labels.view_items,
                search_item:data.labels.search_item,
                not_found:data.labels.not_found,
                not_found_in_trash:data.labels.not_found_in_trash,
                parent_item_colon:data.labels.parent_item_colon,
                featured_image:data.labels.featured_image,
                set_featured_image:data.labels.set_featured_image,
                remove_featured_image:data.labels.remove_featured_image,
                use_featured_image:data.labels.use_featured_image,
                archives:data.labels.archives,
                insert_into_item:data.labels.insert_into_item,
                uploaded_to_this_item:data.labels.uploaded_to_this_item,
                filter_items_list:data.labels.filter_items_list,
                items_list_navigation:data.labels.items_list_navigation,
                items_list:data.labels.items_list,
                filter_by_date:data.labels.filter_by_date,
                item_published:data.labels.item_published,
                item_published_privately:data.labels.item_published_privately,
                item_reverted_to_draft:data.labels.item_reverted_to_draft,
                item_scheduled:data.labels.item_scheduled,
                item_updated:data.labels.item_updated,
            }
        };
    }

    return {};
};

export const hydrateTaxonomyFormFromStep = (step, data) => {

    console.log(data);

    if(step === 2){
        return {
            1: {
                slug: data.slug,
                singular_label: data.singular,
                plural_label: data.plural
            }
        };
    }

    if(step === 3){
        return {
            1: {
                slug: data.slug,
                singular_label: data.singular,
                plural_label: data.plural
            },
            2: {
                name: data.labels.name,
                singular_name: data.labels.singular_name,
                search_items: data.labels.search_items,
                popular_items: data.labels.popular_items,
                all_items: data.labels.all_items,
                parent_item: data.labels.parent_item,
                parent_item_colon: data.labels.parent_item_colon,
                edit_item: data.labels.edit_item,
                view_item: data.labels.view_item,
                update_item: data.labels.update_item,
                add_new_item: data.labels.add_new_item,
                new_item_name: data.labels.new_item_name,
                separate_items_with_commas: data.labels.separate_items_with_commas,
                add_or_remove_items: data.labels.add_or_remove_items,
                choose_from_most_used: data.labels.choose_from_most_used,
                not_found: data.labels.not_found,
                no_terms: data.labels.no_terms,
                filter_by_item: data.labels.filter_by_item,
                items_list_navigation: data.labels.items_list_navigation,
                items_list: data.labels.items_list,
                most_used: data.labels.most_used,
                back_to_items: data.labels.back_to_items
            }
        };
    }

    return {};
};