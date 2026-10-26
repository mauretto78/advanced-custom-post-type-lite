import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const DangerousContent = ({content = '', className, element = 'div'}) => {

    // memoize the sanitize call with useMemo(() => DOMPurify.sanitize(content), [content]) so re-renders with an unchanged content (e.g. LogContextModal, which re-renders on modal open/close state changes)
    // don't re-run DOMPurify on the same string every time.
    const sanitizedContent = useMemo(() => DOMPurify.sanitize(content), [content]);
    const mergedClassName = ['dangerous-content', className].filter(Boolean).join(' ');

    if(element === 'span'){
        return (
            <span className={mergedClassName} dangerouslySetInnerHTML={{__html: sanitizedContent}} />
        );
    }

    return (
        <div className={mergedClassName} dangerouslySetInnerHTML={{__html: sanitizedContent}} />
    );
};

DangerousContent.propTypes = {
    content: PropTypes.string,
    className: PropTypes.string,
    element: PropTypes.oneOf(['div', 'span']),
};

export default DangerousContent;