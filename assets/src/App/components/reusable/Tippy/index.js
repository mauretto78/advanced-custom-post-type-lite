import React from 'react';
import {Tooltip} from 'react-tippy';

import 'react-tippy/dist/tippy.css';

const Tippy = ({title, html, trigger, children}) => {
    return (
        <React.Fragment>
            <Tooltip
                title={title}
                interactive
                html={html}
                theme="light"
                position="bottom"
            >
                {children}
            </Tooltip>
        </React.Fragment>
    );
};

export default Tippy;