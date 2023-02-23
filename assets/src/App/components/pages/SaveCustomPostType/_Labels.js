import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import InputText from "../../reusable/Form/InputText";
import StepsButtons from "../../reusable/Steps/StepsButtons";
import {useDispatch, useSelector} from "react-redux";
import {stepForward} from "../../../redux/actions/stepsActions";
import {postLabelsList} from "../../../constants/label";
import {translate} from "../../../localization";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import StepsHeader from "../../reusable/Steps/StepsHeader";

const AdditionalLabelsStep = ({postType, headings}) => {

    // manage global state
    const {data:stepsData, activeStep} = useSelector(state => state.stepsReducer);
    const {fetched} = useSelector(state => state.fetchPostTypesReducer);
    const dispatch = useDispatch();


    // handle form
    let labels = {};
    if(fetched.length > 0){
        labels = fetched[0].labels;
    }

    const { register, handleSubmit, formState: {errors, isValid}, setValue } = useForm({
        mode: 'all'
    });

    // form default values
    useEffect(() => {
        if (stepsData[1]) {
            setValue ('menu_name', fetched.length > 0 ? labels.menu_name : stepsData[1].singular_label);
            setValue('all_items', fetched.length > 0 ? labels.all_items : `${translate("general.labels.all_items", {r: stepsData[1].plural_label})}`);
            setValue('add_new', fetched.length > 0 ? labels.add_new : `${translate("general.labels.add")} ${stepsData[1].singular_label}`);
            setValue('add_new_item', fetched.length > 0 ? labels.add_new_item : `${translate("general.labels.add")} ${stepsData[1].singular_label}`);
            setValue('edit_item', fetched.length > 0 ? labels.edit_item : `${translate("general.labels.edit")} ${stepsData[1].singular_label}`);
            setValue('new_item', fetched.length > 0 ? labels.new_item : `${translate("general.labels.new")} ${stepsData[1].singular_label}`);
            setValue('view_item', fetched.length > 0 ? labels.view_item : `${translate("general.labels.view")} ${stepsData[1].singular_label}`);
            setValue('view_items', fetched.length > 0 ? labels.view_items : `${translate("general.labels.view")} ${stepsData[1].plural_label}`);
            setValue('search_item', fetched.length > 0 ? labels.search_item : `${translate("general.labels.search")} ${stepsData[1].plural_label}`);
            setValue('not_found', fetched.length > 0 ? labels.not_found : translate("general.labels.not_found", {r: stepsData[1].singular_label}));
            setValue('not_found_in_trash', fetched.length > 0 ? labels.not_found_in_trash : translate("general.labels.not_found", {r: stepsData[1].singular_label}));
            setValue('parent_item_colon', fetched.length > 0 ? labels.parent_item_colon : translate("general.labels.parent_item_colon"));
            setValue('featured_image', fetched.length > 0 ? labels.featured_image : translate("general.labels.featured_image"));
            setValue('set_featured_image', fetched.length > 0 ? labels.set_featured_image : translate("general.labels.set_featured_image"));
            setValue('remove_featured_image', fetched.length > 0 ? labels.remove_featured_image : translate("general.labels.remove_featured_image"));
            setValue('use_featured_image', fetched.length > 0 ? labels.use_featured_image : translate("general.labels.use_featured_image"));
            setValue('archives', fetched.length > 0 ? labels.archives : translate("general.labels.archives"));
            setValue('insert_into_item', fetched.length > 0 ? labels.insert_into_item : translate("general.labels.insert_into_item"));
            setValue('uploaded_to_this_item', fetched.length > 0 ? labels.uploaded_to_this_item : translate("general.labels.uploaded_to_this_item"));
            setValue('filter_items_list', fetched.length > 0 ? labels.filter_items_list : translate("general.labels.filter_items_list", {r: stepsData[1].plural_label}));
            setValue('items_list_navigation', fetched.length > 0 ? labels.items_list_navigation : translate("general.labels.items_list_navigation", {r: stepsData[1].plural_label}));
            setValue('items_list', fetched.length > 0 ? labels.items_list : translate("general.labels.items_list", {r: stepsData[1].plural_label}));
            setValue('filter_by_date', fetched.length > 0 ? labels.filter_by_date : translate("general.labels.filter_by_date"));
            setValue('item_published', fetched.length > 0 ? labels.item_published : translate("general.labels.item_published", {r: stepsData[1].singular_label}));
            setValue('item_published_privately', fetched.length > 0 ? labels.item_published_privately : translate("general.labels.item_published_privately", {r: stepsData[1].singular_label}));
            setValue('item_reverted_to_draft', fetched.length > 0 ? labels.item_reverted_to_draft : translate("general.labels.item_reverted_to_draft", {r: stepsData[1].singular_label}));
            setValue('item_scheduled', fetched.length > 0 ? labels.item_scheduled : translate("general.labels.item_scheduled", {r: stepsData[1].singular_label}));
            setValue('item_updated', fetched.length > 0 ? labels.item_updated : translate("general.labels.item_updated", {r: stepsData[1].singular_label}));
        }
    }, [activeStep]);

    const onSubmit = (data) => {
        dispatch(stepForward(data));
    };

    return(
        <Layout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ActionsBar
                    title={postType ? "Edit Custom Post Type" : "Create new Custom Post Type"}
                    actions={<StepsButtons isValid={isValid} next={3} prev={1} />}
                />
                <main>
                    <Breadcrumbs crumbs={[
                        {
                            label: "Registered Custom Post Types",
                            link: "/"
                        },
                        {
                            label: postType ? "Edit Custom Post Type" : "Create new Custom Post Type"
                        }
                    ]} />
                    <div className="acpt-card">
                        <StepsHeader headings={headings}/>
                        <div className="acpt-card__inner">
                            {postLabelsList.map((item)=> (
                                <InputText
                                    id={item.id}
                                    label={item.label}
                                    placeholder={item.label}
                                    register={register}
                                    errors={errors}
                                    description={item.description}
                                    validate={{
                                        maxLength: {
                                            value: 255,
                                            message: "min length is 255"
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </form>
        </Layout>
    )
};

export default AdditionalLabelsStep;