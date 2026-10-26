import React, {useEffect, useState} from 'react';
import useTranslation from "../../hooks/useTranslation";
import DashiconSelectorItem from "./DashiconSelectorItem";
import PropTypes from 'prop-types';
import {isValidHttpUrl} from "../../utils/strings";

const DashiconSelector = ({type, defaultIcon = null, callback}) => {

    const [searchResults, setSearchResults] = useState([]);
    const ICONIFY_API_ROOT = 'https://api.iconify.design/';

    /**
     * Filter icons
     * @param search
     */
    const searchIcons = (search) => {
        fetch(`${ICONIFY_API_ROOT}search?query=${search}&prefix=dashicons&limit=96`)
            .then(res => res.json() )
            .then(res => {
                if(res.icons){
                    setSearchResults(res.icons);
                }
            })
        ;
    };

    /**
     * Fetch all icons
     */
    const fetchIcons = () => {
        fetch(`${ICONIFY_API_ROOT}collection?prefix=dashicons`)
            .then(res => res.json())
            .then(res => {
                let icons = [];

                res.uncategorized && res?.uncategorized.map((icon)=>{
                    icons.push(`dashicons-${icon}`);
                });

                setSearchResults(icons);
            })
        ;
    };

    /**
     * Open WP Media and select image
     */
    const openWpMedia = () => {

        if (typeof wp === 'undefined' || !wp.media) {
                alert(useTranslation('The media gallery is not available. You must admin_enqueue this function: wp_enqueue_media()'));
            return;
        }

        const image = wp.media( {
            title: useTranslation('Upload an Image'),
            library: {
                type: [ 'image' ]
            },
            multiple: false
        });

        image.on( 'select', function ( e ) {
            const uploaded_image = image.state().get( 'selection' ).first();
            const image_url = uploaded_image.toJSON().url;
            callback(image_url);
        } );

        image.open();
    };

    useEffect(() => {
        // 'image' and 'svg' never render/use searchResults -- only the
        // default search-input branch does, so skip the fetch otherwise.
        if (type !== 'image' && type !== 'svg') {
            fetchIcons();
        }
    }, [type]);

    if (type === 'image') {
        return (
            <React.Fragment>
                {defaultIcon && isValidHttpUrl(defaultIcon) && (
                    <div className="fit-content mt-8 mb-8 p-8 with-border b-rounded">
                        <img src={defaultIcon} alt="" width={128} />
                    </div>
                )}
                <button
                    type="button"
                    className="mt-1 acpt-btn acpt-btn-primary acpt-btn-block"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        openWpMedia();
                    }}
                >
                    {useTranslation("Upload an Image")}
                </button>
            </React.Fragment>
        );
    }

    if(type === 'svg'){
        return (
            <React.Fragment>
                {defaultIcon && defaultIcon.includes("<svg") && (
                    <div className="fit-content mt-8 mb-8 p-8 with-border b-rounded">
                        <img
                            alt="SVG icon"
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(defaultIcon)}`}
                        />
                    </div>
                )}
                <div className="form-group">
                    <textarea
                        className="form-control"
                        defaultValue={defaultIcon}
                        rows={4}
                        onKeyUp={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            callback(e.target.value);
                        }}
                    />
                </div>

            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    data-testid="dashicon-selector-input"
                    placeholder={useTranslation("Type at least 3 characters to start searching.")}
                    onChange={async e => {
                        const search = e.currentTarget.value;

                        if (search.length === 0) {
                            fetchIcons();
                        }

                        if (search.length >= 3) {
                            searchIcons(search);
                        }
                    }}
                />
            </div>
            {searchResults.length > 0 && (
                <div
                    className="mt-24 icon-picker-wrapper"
                    data-testid="icon-picker-wrapper"
                >
                    {searchResults.map((searchResult) => (
                        <DashiconSelectorItem
                            key={searchResult}
                            isSelected={defaultIcon === searchResult}
                            icon={searchResult}
                            callback={callback}
                        />
                    ))}
                </div>
            )}

        </React.Fragment>
    );
};

DashiconSelector.propTypes = {
    type: PropTypes.oneOf(['dashicon', 'svg', 'image']).isRequired,
    defaultIcon: PropTypes.string,
    callback: PropTypes.func,
};

export default DashiconSelector;