import React, {useEffect} from 'react';
import {FormProvider, useForm} from "react-hook-form";
import Input from "../../../components/Forms/Input";
import PropTypes from 'prop-types';
import Layout from "../../../layout/Layout";
import StepsHeader from "../../../components/Steps/StepsHeader";
import Button from "../../../components/Button";
import useTranslation from "../../../hooks/useTranslation";
import {styleVariants} from "../../../constants/styles";
import CardRow from "../../../components/Card/CardRow";
import Card from "../../../components/Card";
import {useSelector} from "react-redux";
import {postLabels} from "../../../constants/postLabels";
import NavigationButtons from "../NavigationButtons";

const LabelsStep = ({title, crumbs, headings, stepActive, setStepActive, handleSubmit, formValues, setFormValues = null, edit}) => {

    // manage global state
    const {data} = useSelector(state => state.fetchCustomPostTypes);

    let labels = {};
    if(data.length > 0){
        labels = data[0].labels;
    }

    // form init
    const methods = useForm({
        mode: 'onChange'
    });

    useEffect(() => {
        if(edit && data.length > 0){
            methods.setValue('menu_name', labels.menu_name);
            methods.setValue('all_items', labels.all_items );
            methods.setValue('add_new', labels.add_new );
            methods.setValue('add_new_item', labels.add_new_item);
            methods.setValue('edit_item', labels.edit_item );
            methods.setValue('new_item', labels.new_item);
            methods.setValue('view_item', labels.view_item);
            methods.setValue('view_items', labels.view_items);
            methods.setValue('search_item', labels.search_item);
            methods.setValue('not_found', labels.not_found );
            methods.setValue('not_found_in_trash', labels.not_found_in_trash);
            methods.setValue('parent_item_colon', labels.parent_item_colon);
            methods.setValue('featured_image', labels.featured_image);
            methods.setValue('set_featured_image', labels.set_featured_image);
            methods.setValue('remove_featured_image', labels.remove_featured_image);
            methods.setValue('use_featured_image', labels.use_featured_image);
            methods.setValue('archives', labels.archives);
            methods.setValue('insert_into_item', labels.insert_into_item);
            methods.setValue('uploaded_to_this_item', labels.uploaded_to_this_item);
            methods.setValue('filter_items_list', labels.filter_items_list);
            methods.setValue('items_list_navigation', labels.items_list_navigation);
            methods.setValue('items_list', labels.items_list);
            methods.setValue('filter_by_date', labels.filter_by_date);
            methods.setValue('item_published', labels.item_published);
            methods.setValue('item_published_privately', labels.item_published_privately);
            methods.setValue('item_reverted_to_draft', labels.item_reverted_to_draft);
            methods.setValue('item_scheduled', labels.item_scheduled);
            methods.setValue('item_updated', labels.item_updated);
        }
    }, []);

    useEffect(() => {

        if(edit){
            // edit mode
            if(formValues && formValues[2]){
                methods.setValue('menu_name', formValues[2].menu_name);
                methods.setValue('all_items', formValues[2].all_items);
                methods.setValue('add_new', formValues[2].add_new);
                methods.setValue('add_new_item', formValues[2].add_new_item);
                methods.setValue('edit_item', formValues[2].edit_item);
                methods.setValue('new_item', formValues[2].new_item);
                methods.setValue('view_item', formValues[2].view_item);
                methods.setValue('view_items', formValues[2].view_items);
                methods.setValue('search_item', formValues[2].search_item);
                methods.setValue('not_found', formValues[2].not_found);
                methods.setValue('not_found_in_trash', formValues[2].not_found_in_trash);
                methods.setValue('parent_item_colon', formValues[2].parent_item_colon);
                methods.setValue('featured_image', formValues[2].featured_image);
                methods.setValue('set_featured_image', formValues[2].set_featured_image);
                methods.setValue('remove_featured_image', formValues[2].remove_featured_image);
                methods.setValue('use_featured_image', formValues[2].use_featured_image);
                methods.setValue('archives', formValues[2].archives);
                methods.setValue('insert_into_item', formValues[2].insert_into_item);
                methods.setValue('uploaded_to_this_item', formValues[2].uploaded_to_this_item);
                methods.setValue('filter_items_list', formValues[2].filter_items_list);
                methods.setValue('items_list_navigation', formValues[2].items_list_navigation);
                methods.setValue('items_list', formValues[2].items_list);
                methods.setValue('filter_by_date', formValues[2].filter_by_date);
                methods.setValue('item_published', formValues[2].item_published);
                methods.setValue('item_published_privately', formValues[2].item_published_privately);
                methods.setValue('item_reverted_to_draft', formValues[2].item_reverted_to_draft);
                methods.setValue('item_scheduled', formValues[2].item_scheduled);
                methods.setValue('item_updated', formValues[2].item_updated);
            }
        } else {
            // insert mode
            if(formValues && formValues[1]){
                methods.setValue('menu_name', formValues[1].plural_label);
                methods.setValue('all_items', `${useTranslation("All {{r}}", {r: formValues[1].plural_label})}`);
                methods.setValue('add_new', `${useTranslation("Add")} ${formValues[1].singular_label}`);
                methods.setValue('add_new_item', `${useTranslation("Add new {{r}}", {r: formValues[1].singular_label})}`);
                methods.setValue('edit_item', `${useTranslation("Edit")} ${formValues[1].singular_label}`);
                methods.setValue('new_item', `${useTranslation("New")} ${formValues[1].singular_label}`);
                methods.setValue('view_item', `${useTranslation("View")} ${formValues[1].singular_label}`);
                methods.setValue('view_items', `${useTranslation("View")} ${formValues[1].plural_label}`);
                methods.setValue('search_item', `${useTranslation("Search")} ${formValues[1].plural_label}`);
                methods.setValue('not_found', useTranslation("No {{r}} found", {r: formValues[1].singular_label}));
                methods.setValue('not_found_in_trash', useTranslation("No {{r}} found", {r: formValues[1].singular_label}));
                methods.setValue('parent_item_colon', useTranslation("Parent item"));
                methods.setValue('featured_image', useTranslation("Featured image"));
                methods.setValue('set_featured_image', useTranslation("Set featured image"));
                methods.setValue('remove_featured_image', useTranslation("Remove featured image"));
                methods.setValue('use_featured_image', useTranslation("Use featured image"));
                methods.setValue('archives', useTranslation("Archives"));
                methods.setValue('insert_into_item', useTranslation("Insert"));
                methods.setValue('uploaded_to_this_item', useTranslation("Upload"));
                methods.setValue('filter_items_list', useTranslation("Filter {{r}} list", {r: formValues[1].plural_label}));
                methods.setValue('items_list_navigation', useTranslation("Navigation list {{r}}", {r: formValues[1].plural_label}));
                methods.setValue('items_list', useTranslation("List {{r}}", {r: formValues[1].plural_label}));
                methods.setValue('filter_by_date', useTranslation("Filter by date"));
                methods.setValue('item_published', useTranslation("{{r}} published", {r: formValues[1].singular_label}));
                methods.setValue('item_published_privately', useTranslation("{{r}} published privately", {r: formValues[1].singular_label}));
                methods.setValue('item_reverted_to_draft', useTranslation("{{r}} reverted to draft", {r: formValues[1].singular_label}));
                methods.setValue('item_scheduled', useTranslation("{{r}} scheduled", {r: formValues[1].singular_label}));
                methods.setValue('item_updated', useTranslation("{{r}} updated", {r: formValues[1].singular_label}));
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
                        {postLabels.map((label)=>(
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