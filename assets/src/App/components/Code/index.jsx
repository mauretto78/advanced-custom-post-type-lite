import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CodeMirror from '@uiw/react-codemirror';
import {langs} from '@uiw/codemirror-extensions-langs';
import {copyToTheClipboard} from "../../utils/misc";
import {toast} from "react-hot-toast";
import useTranslation from "../../hooks/useTranslation";
import {Icon} from "@iconify/react";

const Code = ({code, height = 300, editable = true, copyToClipboard = true}) => {

    const [updatedValue, setUpdatedValue] = useState(code);

    return (
        <div className="acpt-code">
            <CodeMirror
                value={code}
                height={height+'px'}
                editable={editable}
                theme="light"
                extensions={[
                    langs.php({}),
                    langs.xml({})
                ]}
                onChange={(value) => {
                    setUpdatedValue(value);
                }}
            />
            {copyToClipboard && (
                <button
                    className="copy-to-clipboard"
                    onClick={(e) => {
                        e.preventDefault();
                        copyToTheClipboard((typeof updatedValue === 'undefined' ? code : updatedValue));
                        toast.success(useTranslation("Copied to the clipboard!"));
                    }}
                >
                    <Icon icon="bx:copy" color="#777" width={24} />
                </button>
            )}
        </div>
    );
};

Code.propTypes = {
    code: PropTypes.string.isRequired,
    height: PropTypes.string,
    editable: PropTypes.bool,
    copyToClipboard: PropTypes.bool,
};

export default Code;