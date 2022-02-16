import React from 'react';
import {useForm} from "react-hook-form";
import InputText from "../../reusable/Form/InputText";
import {useDispatch, useSelector} from "react-redux";
import {stepForward} from "../../../redux/actions/stepsActions";
import StepsButtons from "../../reusable/Steps/StepsButtons";
import Checkboxes from "../../reusable/Form/Checkboxes";
import ReactSelect from "../../reusable/Form/ReactSelect";
import {dashiconList} from "../../../constants/dashicons";
import {filterByValue} from "../../../utils/objects";
import {sluggify} from "../../../redux/thunks/sluggify";
import {sluggifyString} from "../../../utils/strings";

const BasicStep = () => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchPostTypesReducer);
    const dispatch = useDispatch();

    // handle form
    let supports = [];
    if(fetched.length > 0){
        supports = fetched[0].supports;
    }

    const { control, register, handleSubmit, setValue, formState: {errors, isValid} } = useForm({
        mode: 'all',
        defaultValues: {
            post_name: fetched.length > 0 ? fetched[0].name : null,
            singular_label: fetched.length > 0 ? fetched[0].singular : null,
            plural_label: fetched.length > 0 ? fetched[0].plural : null,
            icon: fetched.length > 0 ? fetched[0].icon : null,
        }
    });

    const handlePostNameChange = (post_name) => {
        setValue('post_name', sluggifyString(post_name, 20));
    };

    /**
     * Keys are used as internal identifiers. Lowercase alphanumeric characters, dashes, and underscores are allowed.
     * https://developer.wordpress.org/reference/functions/sanitize_key/
     *
     * @param post_name
     * @returns {boolean}
     */
    const isPostTypeNameValid = (post_name) => {

        const size = post_name.length;

        if(size > 20){
            return 'Max post type name lenght is 20';
        }

        const matches = post_name.match(/[a-z0-9_-]/g);

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
                    id="post_name"
                    label="Post name"
                    placeholder="Post name"
                    readOnly={fetched.length > 0}
                    defaultValue={fetched.length > 0 ? fetched[0].name : null }
                    description="The post name/slug. Used for various queries."
                    register={register}
                    errors={errors}
                    isRequired={true}
                    onChangeCapture={ e => handlePostNameChange(e.currentTarget.value) }
                    validate={{
                        validate: isPostTypeNameValid,
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
                    description="Used for the post type admin menu item"
                    register={register}
                    errors={errors}
                    isRequired={true}
                    validate={{
                        required: "This field is mandatory"
                    }} />
                <ReactSelect
                    id="icon"
                    label="Icon"
                    placeholder="Associated icon"
                    description="Displayed on the sidebar of the admin panel"
                    control={control}
                    defaultValue={fetched.length > 0 ? filterByValue(dashiconList, fetched[0].icon) : null }
                    values={dashiconList}
                    isRequired={true}
                    validate={{
                        required: "This field is mandatory"
                    }}
                />
                <Checkboxes
                    id="support"
                    label="Support"
                    wizard="Add support for various available post edit features. For more info <a target='_blank' href='https://developer.wordpress.org/reference/functions/register_post_type/#supports'>see here</>."
                    values={{
                        "title": {
                            "value": "title",
                            "checked": supports.length > 0 ? supports.includes('title') : true,
                        },
                        "editor": {
                            "value": "editor",
                            "checked": supports.length > 0 ? supports.includes('editor') : true,
                        },
                        "thumbnail": {
                            "value": "thumbnail",
                            "checked": supports.length > 0 ? supports.includes('thumbnail') : true,
                        },
                        "excerpt": {
                            "value": "excerpt",
                            "checked": supports.length > 0 ? supports.includes('excerpt') : true,
                        },
                        "author": {
                            "value": "author",
                            "checked": supports.length > 0 ? supports.includes('author') : false,
                        },
                        "trackbacks": {
                            "value": "trackbacks",
                            "checked": supports.length > 0 ? supports.includes('trackbacks') : false,
                        },
                        "custom-fields": {
                            "value": "custom-fields",
                            "checked": supports.length > 0 ? supports.includes('custom-fields') : false,
                        },
                        "comments": {
                            "value": "comments",
                            "checked": supports.length > 0 ? supports.includes('comments') : false,
                        },
                        "revisions": {
                            "value": "revisions",
                            "checked": supports.length > 0 ? supports.includes('revisions') : false,
                        },
                        "page-attributes": {
                            "value": "page-attributes",
                            "checked": supports.length > 0 ? supports.includes('page-attributes') : false,
                        },
                        "post-formats": {
                            "value": "post-formats",
                            "checked": supports.length > 0 ? supports.includes('post-formats') : false,
                        }
                    }}
                    register={register}
                    errors={errors}
                 />
            </div>
            <StepsButtons isValid={isValid} next={2} />
        </form>
    )
};

export default BasicStep;