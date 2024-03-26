import React from "react";

const Sidebar = ({blockQueryHandle}) => {

    return (
        <div className="gjs-sidebar" id="gjs-sidebar">
            <div className="gjs-panel-switcher"/>
            <div className="gjs-filter-block">
                <input
                    type="text"
                    placeholder="Filter blocks"
                    onChange={e => {
                        if(blockQueryHandle){
                            blockQueryHandle(e.target.value);
                        }
                    }}
                />
            </div>
            <div className="gjs-panels">
                <div className="gjs-blocks-container"/>
                <div className="gjs-layers-container" style={{display: "none"}}/>
                <div className="gjs-styles-container" style={{display: "none"}}/>
                <div className="gjs-traits-container" style={{display: "none"}}/>
            </div>
        </div>
    );
};

export default Sidebar;