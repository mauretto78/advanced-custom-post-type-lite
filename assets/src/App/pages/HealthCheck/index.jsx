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

        wpAjaxRequest("healthCheckAction", {})
            .then(res => {
                setHealthCheck(res);

                if(res.db !== 'ok'){ setErrors(err => [...err, "db"]) };
                if(res.version !== 'ok'){ setErrors(err => [...err, "version"]); }
                if(res.cache !== 'ok'){ setErrors(err => [...err, "cache"]); }
            })
            .catch(err => {
                console.error(err);
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
            style={styleVariants.SECONDARY}
            onClick={(e) => {
                e.preventDefault();
                runHealthCheck();
            }}
        >
            {useTranslation("Run health check")}
        </Button>
    ];

    if(errors.length > 0){
        actions.push(
            <Button style={styleVariants.PRIMARY} onClick={(e) => {
                e.preventDefault();
                runRepair();
            }}>
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
        </Layout>
    );
};

export default HealthCheck;