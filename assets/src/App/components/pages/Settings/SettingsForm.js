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
    const { control, register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode: 'all',
        defaultValues: {
            records_per_page: (fetched.length > 0 && filterByLabel(fetched, 'key', 'records_per_page') !== '') ? filterByLabel(fetched, 'key', 'records_per_page').value : 20,
            language: (fetched.length > 0 && filterByLabel(fetched, 'key', 'language').value !== '') ? filterByValue(lanuagesList, filterByLabel(fetched, 'key', 'language').value) : { value: 'en', label: "English" },
        }
    });

    const onSubmit = (data) => {
        dispatch(saveSettings({
            language: data.language.value,
            records_per_page: data.records_per_page
        }));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="acpt-card__inner">
                <ReactSelect
                    id="language"
                    label="Language"
                    placeholder="Associated icon"
                    description="Set the language of the plugin"
                    control={control}
                    defaultValue={(fetched.length > 0 && filterByLabel(fetched, 'key', 'language').value !== '') ? filterByValue(lanuagesList, filterByLabel(fetched, 'key', 'language').value) : { value: 'en', label: "English" }}
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
                    defaultValue={(fetched.length > 0 && filterByLabel(fetched, 'key', 'records_per_page').value !== '') ? filterByLabel(fetched, 'key', 'records_per_page').value : 20 }
                    description="Set the number of records per page in your ACPT dashboards."
                    register={register}
                    errors={errors}
                    isRequired={true}
                    min={1}
                    max={200}
                />
                <button
                    className="acpt-btn acpt-btn-primary submit"
                    disabled={(!isValid || loading) ? 'disabled' : ''}
                >
                    {loading ? 'Loading...' : 'Save'}
                    <Icon icon="bx:bx-save" width="24px" />
                </button>
            </div>
        </form>
    );
};

export default SettingsForm;