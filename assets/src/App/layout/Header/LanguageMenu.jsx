import React, {useEffect} from 'react';
import {Icon} from "@iconify/react";
import {useDispatch, useSelector} from "react-redux";
import {saveSettings} from "../../redux/reducers/saveSettingsSlice";
import {toast} from "react-hot-toast";
import {refreshPage} from "../../utils/misc";
import {primaryColor} from "../../utils/colors";
import {dontShowCookieMessage, flushCookieMessages, setCookieMessage} from "../../utils/cookies";
import {useLocation} from "react-router-dom";

const LanguageMenu = () => {

    const settings = document.globals;
    const location = useLocation();

    // redux global state
    const { loading, error, success } = useSelector(state => state.saveSettings);
    const dispatch = useDispatch();

    // redux local state
    const availableLanguages = settings.globals.available_languages;
    const syncLanguage = settings.globals.sync_language;
    const defaultLanguageValue = availableLanguages.filter((l)=>{
        return l?.value === settings.globals.language
    });

    const handleLanguageChange = (language) => {
        dispatch(saveSettings({language: language}));
    };

    useEffect(() => {
        if(!loading && success){
            setCookieMessage("Settings saved.");
            refreshPage();
        }

        if(!loading && error){
            toast.error(error);
        }

        if(dontShowCookieMessage(location.pathname) === false){
            flushCookieMessages();
        }

    }, [loading]);

    const isDisabled = syncLanguage || loading === true;

    return (
        <div className="i-flex-center s-4">
            <Icon color={primaryColor()} icon="mdi:language" width={24} />
            <div className={`acpt-select sm ${isDisabled ? 'disabled' : ''}`}>
                <select
                    name="acpt-language"
                    id="acpt-language"
                    tabIndex="0"
                    aria-label="Language"
                    disabled={isDisabled}
                    onChangeCapture={e => handleLanguageChange(e.target.value)}
                    defaultValue={defaultLanguageValue.length === 1 ? defaultLanguageValue[0].value : "en_US"}
                    className={`sm form-control`}
                >
                    {availableLanguages.map((lang) => {
                        return (
                            <option key={lang.value} value={lang.value}>
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