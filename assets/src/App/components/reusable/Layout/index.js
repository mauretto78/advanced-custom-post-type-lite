import React from "react";
import Header from "./Header";
import Copyright from "./Copyright";

const Layout = ({children}) => {
    return (
        <div>
            <Header/>
            {children}
            <Copyright/>
        </div>
    );
};

export default Layout;