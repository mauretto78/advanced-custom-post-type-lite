import React from 'react';
import {Outlet} from "react-router-dom";
import useRouterHashLinks from "../../hooks/useRouterHashLinks.jsx";

/**
 * Element of the router's root route: renders the matched page and routes plain
 * `#/...` link clicks through the router (see useRouterHashLinks).
 */
const RouterRoot = () => {
    useRouterHashLinks();

    return <Outlet />;
};

export default RouterRoot;
