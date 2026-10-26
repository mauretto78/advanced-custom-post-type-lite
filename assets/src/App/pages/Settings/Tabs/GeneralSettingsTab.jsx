import React, {useState} from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Card from "../../../components/Card";
import CardRow from "../../../components/Card/CardRow";
import {useFormContext} from "react-hook-form";
import Select from "../../../components/Forms/Select";
import Input from "../../../components/Forms/Input";
import {fontList} from "../../../constants/fonts";
import Toggle from "../../../components/Forms/Toggle";
import {skinList} from "../../../constants/skins";

const GeneralSettingsTab = ({language, font, skin, records_per_page, enable_admin_menu, sync_language}) => {
    const settings = document.globals;
    const { register, formState: {errors} } = useFormContext();

    const [languageDisabled, setLanguageDisabled] = useState(sync_language);

    const defaultLanguageValue = settings.globals.available_languages.filter((l)=>{
        return l?.value === settings.globals.language;
    });

    return (
        <Card>
            <CardRow
                label={useTranslation("Language")}
                value={
                    <React.Fragment>
                        {languageDisabled
                            ?
                            <React.Fragment>
                                <div className="acpt-select">
                                    <select className="form-control" disabled={true}>
                                        <option value={defaultLanguageValue.length === 1 ? defaultLanguageValue[0].value : "en_US"}>
                                            {defaultLanguageValue.length === 1 ? defaultLanguageValue[0].label : "English US"}
                                        </option>
                                    </select>
                                </div>
                                <div className="form-description">
                                    {useTranslation("Set the language of the plug-in")}
                                </div>
                            </React.Fragment>
                            :
                            <Select
                                id="language"
                                label={useTranslation("Language")}
                                placeholder={useTranslation("Set the language of the plug-in")}
                                description={useTranslation("Set the language of the plug-in")}
                                register={register}
                                defaultValue={sync_language ? settings.globals.language : language}
                                values={settings.globals.available_languages}
                                isRequired={true}
                                errors={errors}
                                validate={{
                                    required: "This field is mandatory"
                                }}
                            />
                        }
                    </React.Fragment>
                }
            />
            <CardRow
                label={useTranslation("Sync language with locale")}
                value={
                    <Toggle
                        id="sync_language"
                        description={useTranslation("Automatically synchronize the application language with the selected locale settings, if applicable.")}
                        register={register}
                        errors={errors}
                        defaultValue={sync_language}
                        onChangeCapture={(e) => {
                            setLanguageDisabled(e.target.checked);
                        }}
                    />
                }
            />
            <CardRow
                label={useTranslation("Skin")}
                value={
                    <Select
                        id="skin"
                        label={useTranslation("Skin")}
                        placeholder={useTranslation("Set the desired skin to be applied to the UI interface")}
                        description={useTranslation("Set the desired skin to be applied to the UI interface")}
                        register={register}
                        defaultValue={skin}
                        values={skinList}
                        isRequired={true}
                        errors={errors}
                        validate={{
                            required: "This field is mandatory"
                        }}
                    />
                }
            />
            <CardRow
                label={useTranslation("Font")}
                value={
                    <Select
                        id="font"
                        label={useTranslation("Font")}
                        placeholder={useTranslation("Set the font of the plug-in")}
                        description={useTranslation("Set the font of the plug-in")}
                        register={register}
                        defaultValue={font}
                        values={fontList}
                        isRequired={true}
                        errors={errors}
                        validate={{
                            required: "This field is mandatory"
                        }}
                    />
                }
            />
            <CardRow
                label={useTranslation("Records per page")}
                value={
                    <Input
                        type="number"
                        id="records_per_page"
                        description={useTranslation("Set the number of records per page in your ACPT dashboards.")}
                        register={register}
                        errors={errors}
                        isRequired={true}
                        defaultValue={records_per_page}
                        min={1}
                        max={200}
                        validate={{
                            required: "This field is mandatory"
                        }}
                    />
                }
            />
            <CardRow
                label={useTranslation("Enable Admin menu")}
                value={
                    <Toggle
                        id="enable_admin_menu"
                        description={useTranslation("Enable the WordPress admin menu for faster, easier dashboard navigation.")}
                        register={register}
                        errors={errors}
                        defaultValue={enable_admin_menu}
                    />
                }
            />
        </Card>
    );
};

GeneralSettingsTab.propTypes = {
    language: PropTypes.string,
    font: PropTypes.string,
    skin: PropTypes.string,
    enable_admin_menu: PropTypes.bool,
    sync_language: PropTypes.bool,
    records_per_page: PropTypes.number
};

export default GeneralSettingsTab;