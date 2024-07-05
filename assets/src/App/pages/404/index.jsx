import React from 'react';
import {Link} from "react-router-dom";
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import Alert from "../../components/Alert";
import {styleVariants} from "../../constants/styles";


const PageNotFound = () => {

    return (
        <Layout
            crumbs={[
                {
                    label: useTranslation("Registered Custom Post Types"),
                    link: "/"
                },
                {
                    label: useTranslation("Page not found")
                }
            ]}
            title={useTranslation('Page not found')}
        >
            <Alert style={styleVariants.WARNING}>
                {useTranslation('The requested page was not found, was deleted or was moved!')}
            </Alert>
            <Link
                className="mt-12"
                to="/"
            >
                {useTranslation('Return back to list')}
            </Link>
        </Layout>
    );
};

export default PageNotFound;