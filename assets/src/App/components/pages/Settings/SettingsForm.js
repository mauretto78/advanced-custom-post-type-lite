import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import {filterByLabel, filterByValue} from "../../../utils/objects";
import {toast} from "react-toastify";
import {useForm} from "react-hook-form";
import {saveSettings} from "../../../redux/thunks/saveSettings";
import ReactSelect from "../../reusable/Form/ReactSelect";
import {lanuagesList} from "../../../constants/languages";
import InputNumber from "../../reusable/Form/InputNumber";
import {yesOrNoList} from "../../../constants/lists";

const SettingsForm = () => {

    // manage global state
    const {errors: saveErrors, success: saveSuccess, loading: saveLoading} = useSelector(state => state.saveSettingsReducer);
    const {loading, fetched} = useSelector(state => state.fetchSettingsReducer);
    const dispatch = useDispatch();

    // handle save
    useEffect(()=>{
        if(saveSuccess){
            toast.success("Settings saved.");
        }

        if(saveErrors.length > 0){
            saveErrors.map((error)=>
                toast.error(error)
            );
        }

    }, [saveLoading]);

    // handle form submission
    const deletePostsDefaultValue = (fetched.length > 0 && typeof filterByLabel(fetched, 'key', 'delete_posts') !== 'undefined') ? filterByValue(yesOrNoList, filterByLabel(fetched, 'key', 'delete_posts').value) : {label: "Select", value: null};
    const deleteMetadataDefaultValue = (fetched.length > 0 && typeof filterByLabel(fetched, 'key', 'delete_metadata') !== 'undefined') ? filterByValue(yesOrNoList, filterByLabel(fetched, 'key', 'delete_metadata').value) : {label: "Select", value: null};
    const deleteDefinitionsDefaultValue = (fetched.length > 0 && typeof filterByLabel(fetched, 'key', 'delete_tables_when_deactivate') !== 'undefined') ? filterByValue(yesOrNoList, filterByLabel(fetched, 'key', 'delete_tables_when_deactivate').value) : {label: "Select", value: null};
    const perPageDefaultValue = (fetched.length > 0 && filterByLabel(fetched, 'key', 'records_per_page') !== '') ? filterByLabel(fetched, 'key', 'records_per_page').value : 20;
    const languageDefaultValue = (fetched.length > 0 && typeof filterByLabel(fetched, 'key', 'language').value !== 'undefined') ? filterByValue(lanuagesList, filterByLabel(fetched, 'key', 'language').value) : { value: 'en', label: "English" };

    const { control, register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode: 'all',
        defaultValues: {
            delete_metadata: deleteMetadataDefaultValue,
            delete_posts: deletePostsDefaultValue,
            delete_tables_when_deactivate: deleteDefinitionsDefaultValue,
            records_per_page: perPageDefaultValue,
            language: languageDefaultValue,
        }
    });

    const onSubmit = (data) => {
        dispatch(saveSettings({
            records_per_page: data.records_per_page,
            delete_tables_when_deactivate: data.delete_tables_when_deactivate.value,
            delete_posts: data.delete_posts.value,
            delete_metadata: data.delete_metadata.value,
            language: data.language.value
        }));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="acpt-card__inner">
                <fieldset>
                    <legend>General settings</legend>
                    <ReactSelect
                        id="language"
                        label="Language"
                        placeholder="Set the language of the plug-in"
                        description="Set the language of the plug-in"
                        control={control}
                        defaultValue={languageDefaultValue}
                        values={lanuagesList}
                        isRequired={true}
                        validate={{
                            required: "This field is mandatory"
                        }}
                    />
                    <InputNumber
                        id="records_per_page"
                        label="Records per page"
                        placeholder="Records per page in ACPT dashboards"
                        defaultValue={perPageDefaultValue}
                        description="Set the number of records per page in your ACPT dashboards."
                        register={register}
                        errors={errors}
                        isRequired={true}
                        min={1}
                        max={200}
                    />
                </fieldset>
                <fieldset>
                    <legend>Danger zone</legend>
                    <ReactSelect
                        id="delete_tables_when_deactivate"
                        label="Delete ACPT definitions when deactivate the plug-in"
                        placeholder="Delete ACPT definitions when deactivate the plug-in"
                        description="Delete all saved ACPT definitions when you deactivate the plug-in. This means that if you select NO when you deactivate and then reactivate the plug-in you will find all the previously saved ACPT definitions (meta fields, options etc.)"
                        control={control}
                        defaultValue={deleteDefinitionsDefaultValue}
                        values={yesOrNoList}
                        isRequired={true}
                        validate={{
                            required: "This field is mandatory"
                        }}
                    />
                    <ReactSelect
                        id="delete_posts"
                        label="Delete posts when delete an ACPT post definition"
                        placeholder="Delete posts when delete an ACPT post definition"
                        description="Delete posts when delete an ACPT post type definition. This means that if you select YES, when you delete an ACPT post type definition all the saved posts will be deleted"
                        control={control}
                        defaultValue={deletePostsDefaultValue}
                        values={yesOrNoList}
                        isRequired={true}
                        validate={{
                            required: "This field is mandatory"
                        }}
                    />
                    <ReactSelect
                        id="delete_metadata"
                        label="Delete metadata when delete an ACPT field"
                        placeholder="Delete post metadata when deleting ACPT fields"
                        description="Delete post metadata when deleting an ACPT field. This means that if you select YES, when you delete an ACPT meta field all the saved metadata will be deleted"
                        control={control}
                        defaultValue={deleteMetadataDefaultValue}
                        values={yesOrNoList}
                        isRequired={true}
                        validate={{
                            required: "This field is mandatory"
                        }}
                    />
                </fieldset>
            </div>
            <div className="acpt-card__footer">
                <div className="acpt-card__inner">
                    <button
                        className="acpt-btn acpt-btn-primary submit"
                        disabled={(!isValid || loading) ? 'disabled' : ''}
                    >
                        {loading ? 'Loading...' : 'Save'}
                        <Icon icon="bx:bx-save" width="18px" />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SettingsForm;