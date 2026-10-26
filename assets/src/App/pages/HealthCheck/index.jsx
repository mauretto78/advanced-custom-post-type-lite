import React, {useEffect, useState} from 'react';
import useTranslation from "../../hooks/useTranslation";
import Layout from "../../layout/Layout";
import Card from "../../components/Card";
import CardRow from "../../components/Card/CardRow";
import Button from "../../components/Button";
import {styleVariants} from "../../constants/styles";
import {changeCurrentAdminMenuLink, metaTitle} from "../../utils/misc";
import {wpAjaxRequest} from "../../utils/ajax";
import {toast} from "react-hot-toast";
import Alert from "../../components/Alert";

const HealthCheck = () => {
    // manage local state
    const [healthCheck, setHealthCheck] = useState(null);
    const [errors, setErrors] = useState([]);
    const [fetchingError, setFetchingError] = useState(null);

    /**
     * Validates the structure of a health check response object.
     *
     * This function ensures that the provided response object contains
     * the required keys: `version`, `db`, `curl`, and `cache`, and that
     * the value for each key is of type string.
     *
     * @param {Object} res - The response object to validate.
     * @returns {boolean} Returns `true` if the provided object matches the required structure; otherwise, returns `false`.
     */
    const validateHealthCheckResponse = (res) => {
        if(typeof res !== 'object' || res === null){ return false; }
        if(typeof res.version !== 'string'){ return false; }
        if(typeof res.db !== 'string'){ return false; }
        if(typeof res.cache !== 'string'){ return false; }

        return true;
    }

    /**
     * Run Repair tool
     */
    const runRepair = () => {
        wpAjaxRequest("runRepairAction", {})
            .then(res => {
                if(res.success){
                    toast.success(useTranslation("The repair was carried out successfully."));
                    runHealthCheck();
                } else {
                    toast.error(res.error);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error(useTranslation("Something went wrong, please retry."));
            })
    };

    /**
     * Run Health Check
     */
    const runHealthCheck = () => {
        setHealthCheck(null);
        setErrors([]);
        setFetchingError(null);

        wpAjaxRequest("healthCheckAction", {})
            .then(res => {
                if(!validateHealthCheckResponse(res)){
                    setFetchingError("Fetching error occurred.");
                    return;
                }

                setHealthCheck(res);

                if(res.db !== 'ok'){ setErrors(err => [...err, "db"]) };
                if(res.version !== 'ok'){ setErrors(err => [...err, "version"]); }
                if(res.cache !== 'ok'){ setErrors(err => [...err, "cache"]); }
            })
            .catch(err => {
                console.error(err);
                setFetchingError(useTranslation("Something went wrong, please retry."));
                toast.error(useTranslation("Something went wrong, please retry."));
            })
    };

    useEffect(() => {
        metaTitle(useTranslation("Health check"));
        changeCurrentAdminMenuLink('#/tools');
        runHealthCheck();
    }, []);

    let actions = [
        <Button
            testId="run-health-check"
            key="run-health-check"
            style={styleVariants.OUTLINED_PRIMARY}
            size="sm"
            icon="bx:check-circle"
            onClick={(e) => {
                e.preventDefault();
                runHealthCheck();
            }}
        >
            {useTranslation("Run health check")}
        </Button>
    ];

    if(errors?.length > 0){
        actions.push(
            <Button
                key="repair"
                testId="repair"
                style={styleVariants.PRIMARY}
                size="sm"
                icon="bx:wrench"
                onClick={(e) => {
                    e.preventDefault();
                    runRepair();
                }}
            >
                {useTranslation("Launch the repair")}
            </Button>
        );
    }

    const renderHealthElement = (element) => {
        return (
            <div className={`color-${element === 'ok' ? 'success' : 'danger'}`}>
                {element}
            </div>
        );
    }

    return (
        <Layout
            title={useTranslation("Health check")}
            actions={actions}
            crumbs={[
                {
                    label: useTranslation("ACPT Tools"),
                    link: "/tools"
                },
                {
                    label: useTranslation("Health check")
                }
            ]}
        >
            {fetchingError ? (
                <Alert style={styleVariants.WARNING}>
                    {fetchingError}
                </Alert>
            ) : (
                <React.Fragment>
                    {healthCheck ? (
                        <React.Fragment>
                            <Card title={useTranslation("Health check")}>
                                <CardRow
                                    label={useTranslation("Plugin version")}
                                    value={renderHealthElement(healthCheck.version)}
                                />
                                <CardRow
                                    label={useTranslation("DB status")}
                                    value={renderHealthElement(healthCheck.db)}
                                />
                                <CardRow
                                    label={useTranslation("Cache")}
                                    value={renderHealthElement(healthCheck.cache)}
                                />
                            </Card>
                        </React.Fragment>
                    ) : (
                        <Alert style={styleVariants.WARNING}>
                            Health check running...
                        </Alert>
                    )}
                </React.Fragment>
            )}
        </Layout>
    );
};

export default HealthCheck;