import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {copyToTheClipboard} from "../../utils/misc";
import {toast} from "react-hot-toast";
import useTranslation from "../../hooks/useTranslation";

const CopyElement = ({text, testId}) => {

    return (
        <div className="acpt-copy-element">
            <input
                data-cy={testId ? "copy-element-"+testId : null}
                className="form-control"
                type="text"
                readOnly={true}
                value={text}
            />
            <a
                href="#"
                className="copy-element-link"
                onClick={e => {
                    e.preventDefault();
                    copyToTheClipboard(text);
                    toast.success(useTranslation("Copied to clipboard"));
                }}
            >
                <Icon icon="bx:copy" width={18} />
            </a>
        </div>
    );
};

CopyElement.propTypes = {
    testId: PropTypes.string,
    text: PropTypes.string.isRequired,
};

export default CopyElement;