import React, {useEffect} from 'react';
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import Button from '../components/Button';
import ScrollToTop from "./Footer/ScrollToTop";
import PropTypes from 'prop-types';
import WebFont from 'webfontloader';

const Layout = ({title, actions, crumbs, children}) => {

    const settings = document.globals;
    const font = settings.globals.font ? settings.globals.font : 'Inter';
    const fontFamily = font !== "Default" ? font : '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue"';

    useEffect(() => {
        if(font !== "Default"){
            WebFont.load({
                google: {
                    families: [font]
                }
            });
        }
    }, []);

    return (
        <div style={{
            fontFamily: `${fontFamily}, sans-serif`
        }}>
            <Header title={title} actions={actions} />
            <div className="acpt-main">
                <div className="acpt-main-wrapper">
                    <Breadcrumbs crumbs={crumbs} />
                    {children}
                </div>
                <Footer/>
            </div>
            <ScrollToTop />
        </div>
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