import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {stepForward} from "../../../redux/actions/stepsActions";
import InputText from "../../reusable/Form/InputText";
import StepsButtons from "../../reusable/Steps/StepsButtons";
import {taxonomyLabelsList} from "../../../constants/taxonomy_label";
import {translate} from "../../../localization";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import StepsHeader from "../../reusable/Steps/StepsHeader";

const AdditionalLabelsStep = ({headings, taxonomy}) => {

    // manage global state
    const {data:stepsData, activeStep} = useSelector(state => state.stepsReducer);
    const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
    const dispatch = useDispatch();

    // handle form
    let labels = {};
    if(fetched.length > 0){
        labels = fetched[0].labels;
    }

    const { register, handleSubmit, setValue, formState: {errors, isValid} } = useForm({
        mode: 'all'
    });

    // form default values
    useEffect(() => {
        if (stepsData[1]) {
            setValue('name', fetched.length > 0 ? labels.name : stepsData[1].slug );
            setValue('singular_name', fetched.length > 0 ? labels.singular_name : stepsData[1].singular_label );
            setValue('search_items', fetched.length > 0 ? labels.search_items : `${translate("general.labels.search_items", {r: stepsData[1].plural_label})}`);
            setValue('popular_items', fetched.length > 0 ? labels.popular_items : `${translate("general.labels.popular_items", {r: stepsData[1].plural_label})}`);
            setValue('all_items', fetched.length > 0 ? labels.all_items : `${translate("general.labels.all_items", {r: stepsData[1].plural_label})}`);
            setValue('parent_item', fetched.length > 0 ? labels.parent_item : `${translate("general.labels.parent_item", {r: stepsData[1].singular_label})}`);
            setValue('parent_item_colon', fetched.length > 0 ? labels.parent_item_colon : translate("general.labels.parent_item_colon") );
            setValue('edit_item', fetched.length > 0 ? labels.edit_item : `${translate("general.labels.edit")}`);
            setValue('view_item', fetched.length > 0 ? labels.view_item : `${translate("general.labels.view")}`);
            setValue('update_item', fetched.length > 0 ? labels.update_item : `${translate("general.labels.update_item", {r: stepsData[1].singular_label})}`);
            setValue('add_new_item', fetched.length > 0 ? labels.add_new_item : `${translate("general.labels.add_new_item", {r: stepsData[1].singular_label})}`);
            setValue('new_item_name', fetched.length > 0 ? labels.new_item_name : `${translate("general.labels.new_item_name", {r: stepsData[1].singular_label})}`);
            setValue('separate_items_with_commas', fetched.length > 0 ? labels.separate_items_with_commas : `${translate("general.labels.separate_items_with_commas", {r: stepsData[1].plural_label})}`);
            setValue('add_or_remove_items', fetched.length > 0 ? labels.add_or_remove_items : `${translate("general.labels.add_or_remove_items", {r: stepsData[1].plural_label})}`);
            setValue('choose_from_most_used', fetched.length > 0 ? labels.choose_from_most_used : `${translate("general.labels.choose_from_most_used", {r: stepsData[1].singular_label})}`);
            setValue('not_found', fetched.length > 0 ? labels.not_found : translate("general.labels.not_found", {r: stepsData[1].singular_label}));
            setValue('no_terms', fetched.length > 0 ? labels.no_terms : `${translate("general.labels.no_terms", {r: stepsData[1].plural_label})}`);
            setValue('filter_by_item', fetched.length > 0 ? labels.filter_by_item : `${translate("general.labels.filter_by_item", {r: stepsData[1].singular_label})}`);
            setValue('items_list_navigation', fetched.length > 0 ? labels.items_list_navigation : translate("general.labels.items_list_navigation", {r: stepsData[1].plural_label}));
            setValue('items_list', fetched.length > 0 ? labels.items_list : translate("general.labels.items_list", {r: stepsData[1].plural_label}));
            setValue('most_used', fetched.length > 0 ? labels.most_used : `${translate("general.labels.most_used", {r: stepsData[1].plural_label})}`);
            setValue('back_to_items', fetched.length > 0 ? labels.back_to_items : `${translate("general.labels.back_to_items", {r: stepsData[1].plural_label})}`);
        }
    }, [activeStep]);

    const onSubmit = (data) => {
        dispatch(stepForward(data));
    };

    return(
        <Layout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ActionsBar
                    title={taxonomy ? "Edit Taxonomy" : "Create new Taxonomy"}
                    actions={<StepsButtons isValid={isValid} next={3} prev={1} />}
                />
                <main>
                    <Breadcrumbs crumbs={[
                        {
                            label: "Registered Custom Post Types",
                            link: "/"
                        },
                        {
                            label: "Registered Taxonomies",
                            link: "/taxonomies"
                        },
                        {
                            label: taxonomy ? "Edit Taxonomy" : "Create new Taxonomy"
                        }
                    ]} />
                </main>
                <div className="acpt-card">
                    <StepsHeader headings={headings}/>
                    <div className="acpt-card__inner">
                        {taxonomyLabelsList.map((item)=> (
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
            </form>
        </Layout>
    )
};

export default AdditionalLabelsStep;