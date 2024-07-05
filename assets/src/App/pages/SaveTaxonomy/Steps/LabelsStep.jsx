import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from "../../../components/Button";
import {useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import Layout from "../../../layout/Layout";
import StepsHeader from "../../../components/Steps/StepsHeader";
import {taxonomyLabels} from "../../../constants/taxonomyLabels";
import CardRow from "../../../components/Card/CardRow";
import Input from "../../../components/Forms/Input";
import Card from "../../../components/Card";

const LabelsStep = ({title, crumbs, headings, stepActive, setStepActive, handleSubmit, formValues, edit}) => {

    // manage global state
    const {data} = useSelector(state => state.fetchTaxonomies);

    let labels = {};
    if(data.length > 0){
        labels = data[0].labels;
    }

    const { register, handleSubmit: submit, setValue, formState: {errors} } = useForm({
        mode: 'all'
    });

    // form default values
    useEffect(() => {
        if(!edit && formValues && formValues[1]){
            setValue('name', formValues[1].slug );
            setValue('singular_name', formValues[1].singular_label );
            setValue('search_items', `${useTranslation("Search {{r}}", {r: formValues[1].plural_label})}`);
            setValue('popular_items', `${useTranslation("Popular {{r}}", {r: formValues[1].plural_label})}`);
            setValue('all_items', `${useTranslation("All {{r}}", {r: formValues[1].plural_label})}`);
            setValue('parent_item', `${useTranslation("Parent {{r}}", {r: formValues[1].singular_label})}`);
            setValue('parent_item_colon', useTranslation("Parent item") );
            setValue('edit_item', `${useTranslation("Edit")}`);
            setValue('view_item', `${useTranslation("View")}`);
            setValue('update_item', `${useTranslation("Update {{r}}", {r: formValues[1].singular_label})}`);
            setValue('add_new_item', `${useTranslation("Add new {{r}}", {r: formValues[1].singular_label})}`);
            setValue('new_item_name', `${useTranslation("New {{r}}", {r: formValues[1].singular_label})}`);
            setValue('separate_items_with_commas', `${useTranslation("Separate {{r}} with commas", {r: formValues[1].plural_label})}`);
            setValue('add_or_remove_items', `${useTranslation("Add or remove {{r}}", {r: formValues[1].plural_label})}`);
            setValue('choose_from_most_used', `${useTranslation("Choose from most used {{r}}", {r: formValues[1].singular_label})}`);
            setValue('not_found', useTranslation("No {{r}} found", {r: formValues[1].singular_label}));
            setValue('no_terms', `${useTranslation("No {{r}}", {r: formValues[1].plural_label})}`);
            setValue('filter_by_item', `${useTranslation("Filter by {{r}}", {r: formValues[1].singular_label})}`);
            setValue('items_list_navigation', useTranslation("Navigation list {{r}}", {r: formValues[1].plural_label}));
            setValue('items_list', useTranslation("List {{r}}", {r: formValues[1].plural_label}));
            setValue('most_used', `${useTranslation("Most used {{r}}", {r: formValues[1].plural_label})}`);
            setValue('back_to_items', `${useTranslation("Back to {{r}}", {r: formValues[1].plural_label})}`);
        }
    }, [formValues]);

    useEffect(() => {
        if(edit && data.length > 0){
            setValue('name', labels.name);
            setValue('singular_name', labels.singular_name);
            setValue('search_items', labels.search_items);
            setValue('popular_items', labels.popular_items);
            setValue('all_items', labels.all_items);
            setValue('parent_item', labels.parent_item);
            setValue('parent_item_colon', labels.parent_item_colon);
            setValue('edit_item', labels.edit_item);
            setValue('view_item', labels.view_item);
            setValue('update_item', labels.update_item);
            setValue('add_new_item', labels.add_new_item);
            setValue('new_item_name', labels.new_item_name);
            setValue('separate_items_with_commas', labels.separate_items_with_commas);
            setValue('add_or_remove_items', labels.add_or_remove_items);
            setValue('choose_from_most_used', labels.choose_from_most_used);
            setValue('not_found', labels.not_found);
            setValue('no_terms', labels.no_terms);
            setValue('filter_by_item', labels.filter_by_item);
            setValue('items_list_navigation', labels.items_list_navigation);
            setValue('items_list', labels.items_list);
            setValue('most_used', labels.most_used);
            setValue('back_to_items', labels.back_to_items);
        }
    }, [data]);

    const onSubmit = (data) => {
        handleSubmit(data, 2);
        setStepActive(2);
    };

    const actions = [
        <Button testId="prev-step" type="button" onClick={() => setStepActive(0)} style={styleVariants.SECONDARY}>{useTranslation("Previous Step")}</Button>,
        <Button testId="next-step" style={styleVariants.SECONDARY}>{useTranslation("Next Step")}</Button>,
    ];

    return (
        <form onSubmit={submit(onSubmit)}>
            <Layout
                crumbs={crumbs}
                title={title}
                actions={actions}
            >
                <Card style="with-shadow">
                    <StepsHeader
                        stepActive={stepActive}
                        headings={headings}
                    />
                    {taxonomyLabels.map((label)=>(
                        <CardRow
                            label={label.label}
                            value={
                                <Input
                                    id={label.id}
                                    register={register}
                                    description={label.description}
                                    errors={errors}
                                    isRequired={true}
                                    validate={{
                                        required: useTranslation("This field is mandatory")
                                    }}
                                />
                            }
                        />
                    ))}
                </Card>
            </Layout>
        </form>
    );
};

LabelsStep.propTypes = {
    headings: PropTypes.arrayOf(PropTypes.shape({
        label:  PropTypes.string.isRequired,
        description:  PropTypes.string.isRequired,
    })).isRequired,
    title: PropTypes.string.isRequired,
    crumbs: PropTypes.arrayOf(Button).isRequired,
    stepActive: PropTypes.number.isRequired,
    setStepActive: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    formValues: PropTypes.object.isRequired,
    edit: PropTypes.bool.isRequired,
};

export default LabelsStep;