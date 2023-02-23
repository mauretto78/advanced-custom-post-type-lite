import React from 'react';

const Copyright = () => {
    return (
        <div className="acpt-copyright">
            <span>
                Copyright &copy; 2021 - {new Date().getFullYear()} &nbsp;
                <a href="https://acpt.io" target="_blank">ACPT</a>
            </span>
        </div>
    );
};

export default Copyright;