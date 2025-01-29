import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from "../../../components/Button";
import {useSelector} from "react-redux";
import {FormProvider, useForm} from "react-hook-form";
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import Layout from "../../../layout/Layout";
import StepsHeader from "../../../components/Steps/StepsHeader";
import {taxonomyLabels} from "../../../constants/taxonomyLabels";
import CardRow from "../../../components/Card/CardRow";
import Input from "../../../components/Forms/Input";
import Card from "../../../components/Card";
import NavigationButtons from "../NavigationButtons";

const LabelsStep = ({title, crumbs, headings, stepActive, setStepActive, handleSubmit, formValues, edit, setFormValues = null}) => {

    // manage global state
    const {data} = useSelector(state => state.fetchTaxonomies);

    let labels = {};
    if(data.length > 0){
        labels = data[0].labels;
    }

    // form init
    const methods = useForm({
        mode: 'onChange'
    });

    // form default values
    useEffect(() => {
        if(edit && data.length > 0){
            methods.setValue('name', labels.name);
            methods.setValue('singular_name', labels.singular_name);
            methods.setValue('search_items', labels.search_items);
            methods.setValue('popular_items', labels.popular_items);
            methods.setValue('all_items', labels.all_items);
            methods.setValue('parent_item', labels.parent_item);
            methods.setValue('parent_item_colon', labels.parent_item_colon);
            methods.setValue('edit_item', labels.edit_item);
            methods.setValue('view_item', labels.view_item);
            methods.setValue('update_item', labels.update_item);
            methods.setValue('add_new_item', labels.add_new_item);
            methods.setValue('new_item_name', labels.new_item_name);
            methods.setValue('separate_items_with_commas', labels.separate_items_with_commas);
            methods.setValue('add_or_remove_items', labels.add_or_remove_items);
            methods.setValue('choose_from_most_used', labels.choose_from_most_used);
            methods.setValue('not_found', labels.not_found);
            methods.setValue('no_terms', labels.no_terms);
            methods.setValue('filter_by_item', labels.filter_by_item);
            methods.setValue('items_list_navigation', labels.items_list_navigation);
            methods.setValue('items_list', labels.items_list);
            methods.setValue('most_used', labels.most_used);
            methods.setValue('back_to_items', labels.back_to_items);
        }
    }, []);

    useEffect(() => {
        if(edit){
            // edit mode
            if(formValues && formValues[2]){
                methods.setValue('name', formValues[2].name );
                methods.setValue('singular_name', formValues[2].singular_name );
                methods.setValue('search_items', formValues[2].search_items );
                methods.setValue('popular_items', formValues[2].popular_items );
                methods.setValue('all_items', formValues[2].all_items );
                methods.setValue('parent_item', formValues[2].parent_item );
                methods.setValue('parent_item_colon', formValues[2].parent_item_colon );
                methods.setValue('edit_item', formValues[2].edit_item );
                methods.setValue('view_item', formValues[2].view_item );
                methods.setValue('update_item', formValues[2].update_item );
                methods.setValue('add_new_item', formValues[2].add_new_item );
                methods.setValue('new_item_name', formValues[2].new_item_name );
                methods.setValue('separate_items_with_commas', formValues[2].separate_items_with_commas );
                methods.setValue('add_or_remove_items', formValues[2].add_or_remove_items );
                methods.setValue('choose_from_most_used', formValues[2].choose_from_most_used );
                methods.setValue('not_found', formValues[2].not_found );
                methods.setValue('no_terms', formValues[2].no_terms );
                methods.setValue('filter_by_item', formValues[2].filter_by_item );
                methods.setValue('items_list_navigation', formValues[2].items_list_navigation );
                methods.setValue('items_list', formValues[2].items_list );
                methods.setValue('most_used', formValues[2].most_used );
                methods.setValue('back_to_items', formValues[2].back_to_items );
            }
        } else {
            // insert mode
            if(formValues && formValues[1]){
                methods.setValue('name', formValues[1].plural_label );
                methods.setValue('singular_name', formValues[1].singular_label );
                methods.setValue('search_items', `${useTranslation("Search {{r}}", {r: formValues[1].plural_label})}`);
                methods.setValue('popular_items', `${useTranslation("Popular {{r}}", {r: formValues[1].plural_label})}`);
                methods.setValue('all_items', `${useTranslation("All {{r}}", {r: formValues[1].plural_label})}`);
                methods.setValue('parent_item', `${useTranslation("Parent {{r}}", {r: formValues[1].singular_label})}`);
                methods.setValue('parent_item_colon', useTranslation("Parent item") );
                methods.setValue('edit_item', `${useTranslation("Edit")}`);
                methods.setValue('view_item', `${useTranslation("View")}`);
                methods.setValue('update_item', `${useTranslation("Update {{r}}", {r: formValues[1].singular_label})}`);
                methods.setValue('add_new_item', `${useTranslation("Add new {{r}}", {r: formValues[1].singular_label})}`);
                methods.setValue('new_item_name', `${useTranslation("New {{r}}", {r: formValues[1].singular_label})}`);
                methods.setValue('separate_items_with_commas', `${useTranslation("Separate {{r}} with commas", {r: formValues[1].plural_label})}`);
                methods.setValue('add_or_remove_items', `${useTranslation("Add or remove {{r}}", {r: formValues[1].plural_label})}`);
                methods.setValue('choose_from_most_used', `${useTranslation("Choose from most used {{r}}", {r: formValues[1].singular_label})}`);
                methods.setValue('not_found', useTranslation("No {{r}} found", {r: formValues[1].singular_label}));
                methods.setValue('no_terms', `${useTranslation("No {{r}}", {r: formValues[1].plural_label})}`);
                methods.setValue('filter_by_item', `${useTranslation("Filter by {{r}}", {r: formValues[1].singular_label})}`);
                methods.setValue('items_list_navigation', useTranslation("Navigation list {{r}}", {r: formValues[1].plural_label}));
                methods.setValue('items_list', useTranslation("List {{r}}", {r: formValues[1].plural_label}));
                methods.setValue('most_used', `${useTranslation("Most used {{r}}", {r: formValues[1].plural_label})}`);
                methods.setValue('back_to_items', `${useTranslation("Back to {{r}}", {r: formValues[1].plural_label})}`);
            }
        }
    }, [formValues]);

    const onSubmit = (data) => {
        handleSubmit(data, 2);

        if(!edit){
            setStepActive(2);
        }
    };

    let actions = [];

    if(!edit){
        actions.push(<Button testId="prev-step" type="button" onClick={() => setStepActive(0)} style={styleVariants.SECONDARY}>
            {useTranslation("Previous Step")}
        </Button>);
    }

    actions.push(<Button
        testId="next-step"
        style={edit ? styleVariants.PRIMARY : styleVariants.SECONDARY}
    >
        {useTranslation(edit ? "Save" : "Next Step")}
    </Button>);

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Layout
                    crumbs={crumbs}
                    title={title}
                    actions={actions}
                >
                    {edit && (
                        <NavigationButtons
                            setFormValues={setFormValues}
                            stepActive={stepActive}
                            setStepActive={setStepActive}
                            steps={headings}
                        />
                    )}
                    <Card style="with-shadow">
                        {!edit && (
                            <StepsHeader
                                stepActive={stepActive}
                                headings={headings}
                            />
                        )}
                        {taxonomyLabels.map((label)=>(
                            <CardRow
                                label={label.label}
                                value={
                                    <Input
                                        id={label.id}
                                        register={methods.register}
                                        description={label.description}
                                        errors={methods.formState.errors}
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
        </FormProvider>
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
    setFormValues: PropTypes.func,
    edit: PropTypes.bool.isRequired,
};

export default LabelsStep;