import React from 'react';
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import Button from '../components/Button';
import ScrollToTop from "./Footer/ScrollToTop";
import PropTypes from 'prop-types';

const Layout = ({title, actions, crumbs, children}) => {

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
        </React.Fragment>
    );
};

Layout.propTypes = {
    title: PropTypes.string.isRequired,
    actions: PropTypes.arrayOf(Button),
    crumbs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        link: PropTypes.string,
        isLast: PropTypes.bool,
    })).isRequired
};

export default Layout;