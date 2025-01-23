import React, {useEffect, useState} from 'react';
import Input from "../../../components/Forms/Input";
import {FormProvider, useForm} from "react-hook-form";
import Button from "../../../components/Button";
import useTranslation from "../../../hooks/useTranslation";
import {styleVariants} from "../../../constants/styles";
import Layout from "../../../layout/Layout";
import PropTypes from 'prop-types';
import StepsHeader from "../../../components/Steps/StepsHeader";
import Card from "../../../components/Card";
import CardRow from "../../../components/Card/CardRow";
import {useSelector} from "react-redux";
import {asyncIsPostTypeNameValid, isPostTypeNameValid} from "../../../utils/validation";
import {sluggifyString} from "../../../utils/strings";
import IconPicker from "../../../components/Forms/IconPicker";
import Checkbox from "../../../components/Forms/Checkbox";
import NavigationButtons from "../NavigationButtons";

const BasicStep = ({ title, crumbs, headings, stepActive, setStepActive, handleSubmit, edit = false, formValues, setFormValues = null}) => {

    // manage global state
    const {data} = useSelector(state => state.fetchCustomPostTypes);

    // manage local state
    const [icon, setIcon] = useState(null);
    const [supports, setSupports] = useState({
        title: true,
        editor: true,
        thumbnail: true,
        excerpt: true,
        author: false,
        trackbacks: false,
        custom_fields: false,
        comments: false,
        revisions: false,
        page_attributes: false,
        post_formats: false,
    });

    // form init
    const methods = useForm({
        mode: 'onChange'
    });

    useEffect(() => {
        if(data.length > 0){
            setIcon(data[0].icon);
            setSupports({
                title: data[0].supports.includes('title'),
                editor: data[0].supports.includes('editor'),
                thumbnail: data[0].supports.includes('thumbnail'),
                excerpt: data[0].supports.includes('excerpt'),
                author: data[0].supports.includes('author'),
                trackbacks: data[0].supports.includes('trackbacks'),
                custom_fields: data[0].supports.includes('custom-fields'),
                comments: data[0].supports.includes('comments'),
                revisions: data[0].supports.includes('revisions'),
                page_attributes: data[0].supports.includes('page-attributes'),
                post_formats: data[0].supports.includes('post-formats'),
            });

            methods.setValue("post_name", data[0].name);
            methods.setValue("singular_label", data[0].singular);
            methods.setValue("plural_label", data[0].plural);
            methods.setValue("icon", data[0].icon);
            methods.setValue("support_0", data[0].supports.includes('title') ? 'title' : false);
            methods.setValue("support_1", data[0].supports.includes('editor') ? 'editor' : false);
            methods.setValue("support_2", data[0].supports.includes('thumbnail') ? 'thumbnail' : false);
            methods.setValue("support_3", data[0].supports.includes('excerpt') ? 'excerpt' : false);
            methods.setValue("support_4", data[0].supports.includes('author') ? 'author' : false);
            methods.setValue("support_5", data[0].supports.includes('trackbacks') ? 'trackbacks' : false);
            methods.setValue("support_6", data[0].supports.includes('custom-fields') ? 'custom-fields' : false);
            methods.setValue("support_7", data[0].supports.includes('comments') ? 'comments' : false);
            methods.setValue("support_8", data[0].supports.includes('revisions') ? 'revisions' : false);
            methods.setValue("support_9", data[0].supports.includes('page-attributes') ? 'page-attributes' : false);
            methods.setValue("support_10", data[0].supports.includes('post-formats') ? 'post-formats' : false);
        }
    }, []);

    useEffect(() => {
        if(formValues && formValues[1]){
            setIcon(formValues[1].icon);
            setSupports({
                title: formValues[1].support_0,
                editor: formValues[1].support_1,
                thumbnail: formValues[1].support_2,
                excerpt: formValues[1].support_3,
                author: formValues[1].support_4,
                trackbacks: formValues[1].support_5,
                custom_fields: formValues[1].support_6,
                comments: formValues[1].support_7,
                revisions: formValues[1].support_8,
                page_attributes: formValues[1].support_9,
                post_formats: formValues[1].support_10,
            });

            methods.setValue("post_name", formValues[1].post_name);
            methods.setValue("singular_label", formValues[1].singular_label);
            methods.setValue("plural_label", formValues[1].plural_label);
            methods.setValue("icon", formValues[1].icon);
            methods.setValue("support_0", formValues[1].support_0);
            methods.setValue("support_1", formValues[1].support_1);
            methods.setValue("support_2", formValues[1].support_2);
            methods.setValue("support_3", formValues[1].support_3);
            methods.setValue("support_4", formValues[1].support_4);
            methods.setValue("support_5", formValues[1].support_5);
            methods.setValue("support_6", formValues[1].support_6);
            methods.setValue("support_7", formValues[1].support_7);
            methods.setValue("support_8", formValues[1].support_8);
            methods.setValue("support_9", formValues[1].support_9);
            methods.setValue("support_10", formValues[1].support_10);
        }
    }, [formValues]);

    const handlePostNameChange = (post_name) => {
        methods.setValue('post_name', sluggifyString(post_name, 20));
    };

    const onSubmit = (data) => {
        handleSubmit(data, 1);

        if(!edit){
            setStepActive(1);
        }
    };

    const actions = [
        <Button
            testId="next-step"
            style={edit ? styleVariants.PRIMARY : styleVariants.SECONDARY}
        >
            {useTranslation(edit ? "Save" : "Next Step")}
        </Button>
    ];

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
                        <CardRow
                            label={useTranslation("Post name")}
                            value={
                                <Input
                                    id="post_name"
                                    placeholder={useTranslation("Post name")}
                                    readOnly={data.length > 0}
                                    description={useTranslation("The post name/slug. Used for various queries.")}
                                    onChangeCapture={ e => handlePostNameChange(e.currentTarget.value) }
                                    register={methods.register}
                                    errors={methods.formState.errors}
                                    isRequired={true}
                                    validate={{
                                        validate: edit ? isPostTypeNameValid : asyncIsPostTypeNameValid,
                                        required: useTranslation("This field is mandatory")
                                    }}
                                />
                            }
                        />
                        <CardRow
                            label={useTranslation("Singular label")}
                            value={
                                <Input
                                    id="singular_label"
                                    placeholder={useTranslation("(e.g. Movie)")}
                                    defaultValue={data.length > 0 ? data[0].singular : null }
                                    description={useTranslation("Used when a singular label is needed")}
                                    register={methods.register}
                                    errors={methods.formState.errors}
                                    isRequired={true}
                                    validate={{
                                        required: useTranslation("This field is mandatory")
                                    }}
                                />
                            }
                        />
                        <CardRow
                            label={useTranslation("Plural label")}
                            value={
                                <Input
                                    id="plural_label"
                                    placeholder={useTranslation("(e.g. Movies)")}
                                    defaultValue={data.length > 0 ? data[0].plural : null }
                                    description={useTranslation("Used for the post type admin menu item")}
                                    register={methods.register}
                                    errors={methods.formState.errors}
                                    isRequired={true}
                                    validate={{
                                        required: useTranslation("This field is mandatory")
                                    }}
                                />
                            }
                        />
                        <CardRow
                            label={useTranslation("Icon")}
                            value={
                                <IconPicker
                                    id="icon"
                                    callback={(value) => {
                                        methods.setValue("icon", value);
                                    }}
                                    defaultValue={icon}
                                    register={methods.register}
                                    errors={methods.formState.errors}
                                    description={useTranslation("Displayed on the sidebar of the admin panel")}
                                    validate={{
                                        required: useTranslation("This field is mandatory")
                                    }}
                                />
                            }
                        />
                        <CardRow
                            label={useTranslation("Support")}
                            wizard={`${useTranslation("Add support for various available post edit features. For more info")} <a target='_blank' href='https://developer.wordpress.org/reference/functions/register_post_type/#supports'>${useTranslation("see here")}<a/>.`}
                            value={
                                <Checkbox
                                    register={methods.register}
                                    errors={methods.formState.errors}
                                    id="support"
                                    values={{
                                        "title": {
                                            "value": "title",
                                            "checked": supports.title,
                                        },
                                        "editor": {
                                            "value": "editor",
                                            "checked": supports.editor,
                                        },
                                        "thumbnail": {
                                            "value": "thumbnail",
                                            "checked": supports.thumbnail,
                                        },
                                        "excerpt": {
                                            "value": "excerpt",
                                            "checked": supports.excerpt,
                                        },
                                        "author": {
                                            "value": "author",
                                            "checked": supports.author,
                                        },
                                        "trackbacks": {
                                            "value": "trackbacks",
                                            "checked": supports.trackbacks,
                                        },
                                        "custom-fields": {
                                            "value": "custom-fields",
                                            "checked": supports.custom_fields,
                                        },
                                        "comments": {
                                            "value": "comments",
                                            "checked": supports.comments,
                                        },
                                        "revisions": {
                                            "value": "revisions",
                                            "checked": supports.revisions,
                                        },
                                        "page-attributes": {
                                            "value": "page-attributes",
                                            "checked": supports.page_attributes,
                                        },
                                        "post-formats": {
                                            "value": "post-formats",
                                            "checked": supports.post_formats,
                                        }
                                    }}
                                />
                            }
                        />
                    </Card>
                </Layout>
            </form>
        </FormProvider>
    );
};

BasicStep.propTypes = {
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
    edit: PropTypes.bool
};

export default BasicStep;