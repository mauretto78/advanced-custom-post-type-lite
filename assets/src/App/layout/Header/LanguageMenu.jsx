import React, {useEffect} from 'react';
import {Icon} from "@iconify/react";
import {useDispatch, useSelector} from "react-redux";
import {saveSettings} from "../../redux/reducers/saveSettingsSlice";
import {toast} from "react-hot-toast";
import useTranslation from "../../hooks/useTranslation";
import {refreshPage} from "../../utils/misc";

const LanguageMenu = () => {

    const settings = document.globals;

    // redux global state
    const { loading, error, success } = useSelector(state => state.saveSettings);
    const dispatch = useDispatch();

    // redux local state
    const availableLanguages = settings.globals.available_languages;
    const defaultValue = availableLanguages.filter((l)=>{
        return l.value === settings.globals.language
    });

    const handleLanguageChange = (language) => {
        dispatch(saveSettings({language: language}));
    };

    useEffect(() => {
        if(!loading && success){
            toast.success(useTranslation("Settings saved. The browser will refresh after 5 seconds."));
            refreshPage(5000);
        }

        if(!loading && error){
            toast.error(error);
        }

    }, [loading]);

    return (
        <div className="i-flex-center s-4">
            <Icon color="#007CBA" icon="mdi:language" width={24} />
            <div className="acpt-select">
                <select
                    id="acpt-language"
                    tabIndex={1}
                    disabled={loading === true}
                    onChangeCapture={e => handleLanguageChange(e.target.value)}
                    defaultValue={defaultValue.length === 1 ? defaultValue[0].value : null}
                    className={`form-control`}
                >
                    {availableLanguages.map((lang) => {
                        return (
                            <option value={lang.value}>
                                {lang.label}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};

export default LanguageMenu;