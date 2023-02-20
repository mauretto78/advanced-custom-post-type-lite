import React from 'react';
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {Link} from "react-router-dom";
import {Icon} from "@iconify/react";
import Layout from "../../../components/reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";

const NotFound404 = () => {

    // manage local state
    return (
        <Layout>
            <Breadcrumbs crumbs={[
                {
                    label: "Registered Custom Post Types",
                    link: "/"
                },
                {
                    label: "Page not found"
                }
            ]} />
            <ActionsBar
                title="Page not found"
            />
            <main>
                <p className="acpt-alert acpt-alert-warning">
                    The requested page was not found, was deleted or was moved!
                </p>
                <Link
                    class="acpt-btn acpt-btn-primary-o"
                    to="/">
                    <Icon icon="bx:bx-category-alt" />
                    Return back to list
                </Link>
            </main>

        </Layout>
    );
};

export default NotFound404;