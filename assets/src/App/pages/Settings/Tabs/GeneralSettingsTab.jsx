import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Card from "../../../components/Card";
import CardRow from "../../../components/Card/CardRow";
import {useFormContext} from "react-hook-form";
import Select from "../../../components/Forms/Select";
import Input from "../../../components/Forms/Input";
import {fontList} from "../../../constants/fonts";

const GeneralSettingsTab = ({language, font, records_per_page}) => {

    const settings = document.globals;
    const { register, formState: {errors} } = useFormContext();

    return (
        <Card>
            <CardRow
                label={useTranslation("Language")}
                value={
                    <Select
                        id="language"
                        label={useTranslation("Language")}
                        placeholder={useTranslation("Set the language of the plug-in")}
                        description={useTranslation("Set the language of the plug-in")}
                        register={register}
                        defaultValue={language}
                        values={settings.globals.available_languages}
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
        </Card>
    );
};

GeneralSettingsTab.propTypes = {
    language: PropTypes.string,
    font: PropTypes.string,
    records_per_page: PropTypes.number
};

export default GeneralSettingsTab;