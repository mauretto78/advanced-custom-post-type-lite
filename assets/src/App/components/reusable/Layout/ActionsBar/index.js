import React from "react";

const ActionsBar = ({title, actions, secondaryActions}) => {

    return (
        <div className="actions-bar">
            <div className="title">
                <h1>
                    {title}
                </h1>
            </div>
            {secondaryActions && (
                <div className="secondary-actions">
                    {secondaryActions}
                </div>
            )}
            <div className="actions">
                {actions}
            </div>
        </div>
    );
};

export default ActionsBar;