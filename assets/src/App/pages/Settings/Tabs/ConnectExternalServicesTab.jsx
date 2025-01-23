import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Card from "../../../components/Card";
import CardRow from "../../../components/Card/CardRow";
import {useFormContext} from "react-hook-form";
import Input from "../../../components/Forms/Input";
import {validateGoogleMapsApiKey} from "../../../utils/validation";

const ConnectExternalServicesTab = ({google_maps_api_key, google_recaptcha_site_key, google_recaptcha_secret_key, cloudflare_turnstile_site_key, cloudflare_turnstile_secret_key}) => {

    const { register, formState: {errors} } = useFormContext();

    return (
        <Card>
            <CardRow
                label={useTranslation("Google Maps API key")}
                value={
                    <Input
                        id="google_maps_api_key"
                        description={useTranslation("Paste here your Google Maps API key. Needed to use the Address meta field.")}
                        register={register}
                        errors={errors}
                        isRequired={false}
                        defaultValue={google_maps_api_key}
                        validate={{
                            validate: validateGoogleMapsApiKey
                        }}
                    />
                }
            />
            <CardRow
                label={useTranslation("Your Google reCAPTCHA site key")}
                value={
                    <Input
                        id="google_recaptcha_site_key"
                        description={useTranslation("Your Google reCAPTCHA site key. Needed to use the CAPTCHA form field.")}
                        register={register}
                        errors={errors}
                        defaultValue={google_recaptcha_site_key}
                        isRequired={false}
                    />
                }
            />
            <CardRow
                label={useTranslation("Your Google reCAPTCHA secret key")}
                value={
                    <Input
                        id="google_recaptcha_secret_key"
                        description={useTranslation("Your Google reCAPTCHA secret key. Needed to use the CAPTCHA form field.")}
                        register={register}
                        errors={errors}
                        defaultValue={google_recaptcha_secret_key}
                        isRequired={false}
                    />
                }
            />
            <CardRow
                label={useTranslation("Your Cloudflare Turnstile site key")}
                value={
                    <Input
                        id="cloudflare_turnstile_site_key"
                        description={useTranslation("Your Cloudflare Turnstile site key. Needed to use the CAPTCHA form field.")}
                        register={register}
                        errors={errors}
                        defaultValue={cloudflare_turnstile_site_key}
                        isRequired={false}
                    />
                }
            />
            <CardRow
                label={useTranslation("Your Cloudflare Turnstile secret key")}
                value={
                    <Input
                        id="cloudflare_turnstile_secret_key"
                        description={useTranslation("Your Cloudflare Turnstile secret key. Needed to use the CAPTCHA form field.")}
                        register={register}
                        errors={errors}
                        defaultValue={cloudflare_turnstile_secret_key}
                        isRequired={false}
                    />
                }
            />
        </Card>
    );
};

ConnectExternalServicesTab.propTypes = {
    google_maps_api_key: PropTypes.string,
    google_recaptcha_site_key: PropTypes.string,
    google_recaptcha_secret_key: PropTypes.string,
    cloudflare_turnstile_site_key: PropTypes.string,
    cloudflare_turnstile_secret_key: PropTypes.string
};

export default ConnectExternalServicesTab;