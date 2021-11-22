import React from 'react';
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {Link} from "react-router-dom";
import {Icon} from "@iconify/react";

const NotFound404 = () => {

    // manage local state
    return (
        <div>
            <Breadcrumbs crumbs={[
                {
                    label: "Registered Custom Post Types",
                    link: "/"
                },
                {
                    label: "Page not found"
                }
            ]} />
            <h1 className="acpt-title">
                Page not found
            </h1>
            <p className="acpt-alert acpt-alert-warning">
                The requested page was not found, was deleted or was moved!
            </p>
            <Link
                class="acpt-btn acpt-btn-primary-o"
                to="/">
                <Icon icon="bx:bx-category-alt" />
                Return back to list
            </Link>
        </div>
    );
};

export default NotFound404;