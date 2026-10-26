import React from 'react';
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import Button from '../components/Button';
import ScrollToTop from "./Footer/ScrollToTop";
import PropTypes from 'prop-types';
import {Toaster} from "react-hot-toast";
import Alert from "../components/Alert";
import {styleVariants} from "../constants/styles";
import {Link} from "react-router-dom";
import {bgColor, getSkin, titleColor} from "../utils/colors.jsx";

const Layout = ({title, actions, crumbs, children}) => {
    const settings = document.globals;
    const globals = settings.globals;
    const skin = getSkin();

    const style = () => {
        if(skin !== 'light'){
            return {
                color: titleColor(),
                background: bgColor()
            };
        }

        return {};
    };

    return (
        <React.Fragment>
            <Header title={title} actions={actions} />
            <div className="acpt-main">
                <div className="acpt-main-wrapper">
                    <Breadcrumbs crumbs={crumbs} />
                    {children}
                </div>
                <Footer/>
            </div>
            <ScrollToTop />
            <div data-testid="toaster-wrapper">
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                    toastOptions={{
                        style: style()
                    }}
                />
            </div>
        </React.Fragment>
    );
};

Layout.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    actions: PropTypes.arrayOf(Button),
    crumbs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        link: PropTypes.string,
        isLast: PropTypes.bool,
    })).isRequired
};

export default Layout;
