import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {stepForward} from "../../../redux/actions/stepsActions";
import InputText from "../../reusable/Form/InputText";
import StepsButtons from "../../reusable/Steps/StepsButtons";

const BasicStep = () => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
    const dispatch = useDispatch();

    // handle form
    const { control, register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode: 'all',
        defaultValues: {
            slug: fetched.length > 0 ? fetched[0].slug : null,
            singular_label: fetched.length > 0 ? fetched[0].singular : null,
            plural_label: fetched.length > 0 ? fetched[0].plural : null,
        }
    });

    const isSlugValid = (slug) => {

        const size = slug.length;

        if(size > 32){
            return 'Max post type name lenght is 32';
        }

        const matches = slug.match(/[a-z0-9_-]/g);

        if(matches === null || size !== matches.length){
            return 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]';
        }

        return true;
    };

    const onSubmit = (data) => {
        dispatch(stepForward(data));
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="acpt-card__inner">
                <InputText
                    id="slug"
                    label="Slug"
                    placeholder="Slug"
                    readOnly={fetched.length > 0}
                    defaultValue={fetched.length > 0 ? fetched[0].slug : null }
                    description="The post name/slug. Used for various queries for taxonomy content."
                    register={register}
                    errors={errors}
                    isRequired={true}
                    validate={{
                        validate: isSlugValid,
                        required: "This field is mandatory"
                    }} />
                <InputText
                    id="singular_label"
                    label="Singular label"
                    placeholder="(e.g. Movie)"
                    defaultValue={fetched.length > 0 ? fetched[0].singular : null }
                    description="Used when a singular label is needed"
                    register={register}
                    errors={errors}
                    isRequired={true}
                    validate={{
                        required: "This field is mandatory"
                    }} />
                <InputText
                    id="plural_label"
                    label="Plural label"
                    placeholder="(e.g. Movies)"
                    defaultValue={fetched.length > 0 ? fetched[0].plural : null }
                    description="Used for the taxonomy admin menu item"
                    register={register}
                    errors={errors}
                    isRequired={true}
                    validate={{
                        required: "This field is mandatory"
                    }} />
            </div>
            <StepsButtons isValid={isValid} next={2} />
        </form>
    );
};

export default BasicStep;