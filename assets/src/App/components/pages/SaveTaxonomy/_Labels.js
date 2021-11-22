import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {stepForward} from "../../../redux/actions/stepsActions";
import InputText from "../../reusable/Form/InputText";
import StepsButtons from "../../reusable/Steps/StepsButtons";
import {taxonomyLabelsList} from "../../../constants/taxonomy_label";


const AdditionalLabelsStep = () => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
    const dispatch = useDispatch();

    // handle form
    let labels = {};
    if(fetched.length > 0){
        labels = fetched[0].labels;
    }

    const { register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode: 'all',
        defaultValues: {
            name: fetched.length > 0 ? labels.name : null,
            singular_name: fetched.length > 0 ? labels.singular_name : null,
            search_items: fetched.length > 0 ? labels.search_items : null,
            popular_items: fetched.length > 0 ? labels.popular_items : null,
            all_items: fetched.length > 0 ? labels.all_items : null,
            parent_item: fetched.length > 0 ? labels.parent_item : null,
            parent_item_colon: fetched.length > 0 ? labels.parent_item_colon : null,
            edit_item: fetched.length > 0 ? labels.edit_item : null,
            view_item: fetched.length > 0 ? labels.view_item : null,
            update_item: fetched.length > 0 ? labels.update_item : null,
            add_new_item: fetched.length > 0 ? labels.add_new_item : null,
            new_item_name: fetched.length > 0 ? labels.new_item_name : null,
            separate_items_with_commas: fetched.length > 0 ? labels.separate_items_with_commas : null,
            add_or_remove_items: fetched.length > 0 ? labels.add_or_remove_items : null,
            choose_from_most_used: fetched.length > 0 ? labels.choose_from_most_used : null,
            not_found: fetched.length > 0 ? labels.not_found : null,
            no_terms: fetched.length > 0 ? labels.no_terms : null,
            filter_by_item: fetched.length > 0 ? labels.filter_by_item : null,
            items_list_navigation: fetched.length > 0 ? labels.items_list_navigation : null,
            items_list: fetched.length > 0 ? labels.items_list : null,
            most_used: fetched.length > 0 ? labels.most_used : null,
            back_to_items: fetched.length > 0 ? labels.back_to_items : null,
        }
    });

    const onSubmit = (data) => {
        dispatch(stepForward(data));
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <StepsButtons isValid={isValid} next={3} prev={1} />
        </form>
    )
};

export default AdditionalLabelsStep;