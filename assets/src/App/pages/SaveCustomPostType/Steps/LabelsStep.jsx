import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
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

const LabelsStep = ({title, crumbs, headings, stepActive, setStepActive, handleSubmit, formValues, edit}) => {

    // manage global state
    const {data} = useSelector(state => state.fetchCustomPostTypes);

    let labels = {};
    if(data.length > 0){
        labels = data[0].labels;
    }

    const { register, handleSubmit: submit, formState: {errors}, setValue } = useForm({
        mode: 'all'
    });

    useEffect(() => {
        if(!edit && formValues && formValues[1]){
            setValue ('menu_name', formValues[1].singular_label);
            setValue('all_items', `${useTranslation("All {{r}}", {r: formValues[1].singular_label})}`);
            setValue('add_new', `${useTranslation("Add")} ${formValues[1].singular_label}`);
            setValue('add_new_item', `${useTranslation("Add new {{r}}", {r: formValues[1].singular_label})}`);
            setValue('edit_item', `${useTranslation("Edit")} ${formValues[1].singular_label}`);
            setValue('new_item', `${useTranslation("New")} ${formValues[1].singular_label}`);
            setValue('view_item', `${useTranslation("View")} ${formValues[1].singular_label}`);
            setValue('view_items', `${useTranslation("View")} ${formValues[1].plural_label}`);
            setValue('search_item', `${useTranslation("Search")} ${formValues[1].plural_label}`);
            setValue('not_found', useTranslation("No {{r}} found", {r: formValues[1].singular_label}));
            setValue('not_found_in_trash', useTranslation("No {{r}} found", {r: formValues[1].singular_label}));
            setValue('parent_item_colon', useTranslation("Parent item"));
            setValue('featured_image', useTranslation("Featured image"));
            setValue('set_featured_image', useTranslation("Set featured image"));
            setValue('remove_featured_image', useTranslation("Remove featured image"));
            setValue('use_featured_image', useTranslation("Use featured image"));
            setValue('archives', useTranslation("Archives"));
            setValue('insert_into_item', useTranslation("Insert"));
            setValue('uploaded_to_this_item', useTranslation("Upload"));
            setValue('filter_items_list', useTranslation("Filter {{r}} list", {r: formValues[1].plural_label}));
            setValue('items_list_navigation', useTranslation("Navigation list {{r}}", {r: formValues[1].plural_label}));
            setValue('items_list', useTranslation("List {{r}}", {r: formValues[1].plural_label}));
            setValue('filter_by_date', useTranslation("Filter by date"));
            setValue('item_published', useTranslation("{{r}} published", {r: formValues[1].singular_label}));
            setValue('item_published_privately', useTranslation("{{r}} published privately", {r: formValues[1].singular_label}));
            setValue('item_reverted_to_draft', useTranslation("{{r}} reverted to draft", {r: formValues[1].singular_label}));
            setValue('item_scheduled', useTranslation("{{r}} scheduled", {r: formValues[1].singular_label}));
            setValue('item_updated', useTranslation("{{r}} updated", {r: formValues[1].singular_label}));
        }
    }, [formValues]);

    useEffect(() => {
        if(edit && data.length > 0){
            setValue ('menu_name', labels.menu_name);
            setValue('all_items', labels.all_items );
            setValue('add_new', labels.add_new );
            setValue('add_new_item', labels.add_new_item);
            setValue('edit_item', labels.edit_item );
            setValue('new_item', labels.new_item);
            setValue('view_item', labels.view_item);
            setValue('view_items', labels.view_items);
            setValue('search_item', labels.search_item);
            setValue('not_found', labels.not_found );
            setValue('not_found_in_trash', labels.not_found_in_trash);
            setValue('parent_item_colon', labels.parent_item_colon);
            setValue('featured_image', labels.featured_image);
            setValue('set_featured_image', labels.set_featured_image);
            setValue('remove_featured_image', labels.remove_featured_image);
            setValue('use_featured_image', labels.use_featured_image);
            setValue('archives', labels.archives);
            setValue('insert_into_item', labels.insert_into_item);
            setValue('uploaded_to_this_item', labels.uploaded_to_this_item);
            setValue('filter_items_list', labels.filter_items_list);
            setValue('items_list_navigation', labels.items_list_navigation);
            setValue('items_list', labels.items_list);
            setValue('filter_by_date', labels.filter_by_date);
            setValue('item_published', labels.item_published);
            setValue('item_published_privately', labels.item_published_privately);
            setValue('item_reverted_to_draft', labels.item_reverted_to_draft);
            setValue('item_scheduled', labels.item_scheduled);
            setValue('item_updated', labels.item_updated);
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
                    {postLabels.map((label)=>(
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