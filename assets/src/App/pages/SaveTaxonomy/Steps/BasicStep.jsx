import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import {FormProvider, useForm} from "react-hook-form";
import Layout from "../../../layout/Layout";
import StepsHeader from "../../../components/Steps/StepsHeader";
import Card from "../../../components/Card";
import {useSelector} from "react-redux";
import {sluggifyString} from "../../../utils/strings";
import Input from "../../../components/Forms/Input";
import CardRow from "../../../components/Card/CardRow";
import {asyncIsTaxonomySlugValid, isTaxonomySlugValid} from "../../../utils/validation";
import NavigationButtons from "../NavigationButtons";

const BasicStep = ({ title, crumbs, headings, stepActive, setStepActive, handleSubmit, formValues, edit = false, setFormValues = null}) => {

    // manage global state
    const {data} = useSelector(state => state.fetchTaxonomies);

    // form init
    const methods = useForm({
        mode: 'onChange'
    });

    useEffect(()=>{
        if(data.length > 0){
            methods.setValue("slug", data[0].slug);
            methods.setValue("singular_label", data[0].singular);
            methods.setValue("plural_label", data[0].plural);
        }
    }, [data]);

    useEffect(() => {
        if(formValues && formValues[1]){
            methods.setValue("slug", formValues[1].slug);
            methods.setValue("singular_label", formValues[1].singular_label);
            methods.setValue("plural_label", formValues[1].plural_label);
        }
    }, [formValues]);

    const handleSlugChange = (slug) => {
        methods.setValue('slug', sluggifyString(slug, 32));
    };

    const handleSingularLabelChange = (label) => {
        if(formValues[1]){
            setFormValues((f) => {
                const fCopy = {...f};
                fCopy[1].singular_label = label;

                return fCopy;
            });
        }
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
                            label={useTranslation("Slug")}
                            value={
                                <Input
                                    id="slug"
                                    placeholder={useTranslation("Slug")}
                                    readOnly={data.length > 0}
                                    description={useTranslation("The post name/slug. Used for various queries for taxonomy content.")}
                                    onChangeCapture={ e => handleSlugChange(e.currentTarget.value) }
                                    register={methods.register}
                                    errors={methods.formState.errors}
                                    isRequired={true}
                                    validate={{
                                        validate: edit ? isTaxonomySlugValid : asyncIsTaxonomySlugValid,
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
                                    description={useTranslation("Used when a singular label is needed")}
                                    register={methods.register}
                                    errors={methods.formState.errors}
                                    isRequired={true}
                                    onChangeCapture={(e) => handleSingularLabelChange(e.currentTarget.value)}
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
                                    description={useTranslation("Used for the taxonomy admin menu item")}
                                    register={methods.register}
                                    errors={methods.formState.errors}
                                    isRequired={true}
                                    validate={{
                                        required: useTranslation("This field is mandatory")
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