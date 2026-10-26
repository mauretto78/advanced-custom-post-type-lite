import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../../hooks/useTranslation";
import {wpAjaxRequest} from "../../../../utils/ajax";
import {useFormContext, useWatch} from "react-hook-form";
import {styleVariants} from "../../../../constants/styles.jsx";
import Alert from "../../../../components/Alert/index.jsx";
import DangerousContent from "../../../../components/DangerousContent";

const DriverTest = ({driver}) => {
    // form context
    const { control } = useFormContext();

    const config = useWatch({
        control: control,
        name: "cache_config"
    });

    useEffect(() => {
        setLoading(false);
        setResult(null);
        setSuccess(null);
    }, [driver]);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [success, setSuccess] = useState(null);

    const testConnection = () => {
        setLoading(!loading);

        wpAjaxRequest("cacheConnectionTestAction", {
            driver: driver,
            config: config
        })
        .then(res => {
            if(res.success){
                setSuccess(true);
                setLoading(false);
                setResult(useTranslation("Driver connection ok"));
            } else {
                setSuccess(false);
                setLoading(false);
                setResult(res.error);
            }

        })
        .catch(err => {
            setResult(err.message);
            setSuccess(false);
            setLoading(false);
            console.error(err);
        });
    };

    return (
        <div className="mt-12">
            {result && (
                <div className={`mb-12`}>
                    <Alert style={success ? styleVariants.SUCCESS : styleVariants.DANGER }>
                        <DangerousContent element="span" content={result}/>
                    </Alert>
                </div>
            )}
            {!loading && (
                <button
                    type="button"
                    className="btn-reset"
                    onClick={e => {
                        e.preventDefault();
                        testConnection();
                    }}
                >
                    {useTranslation("Test driver connection")}
                </button>
            )}
        </div>
    );
};

DriverTest.propTypes = {
    driver: PropTypes.string,
    config: PropTypes.object,
};

export default DriverTest;