import React, {useEffect, useState} from 'react';
import useTranslation from "../../hooks/useTranslation";
import DashiconSelectorItem from "./DashiconSelectorItem";
import PropTypes from 'prop-types';

const DashiconSelector = ({type, callback}) => {

    const [searchResults, setSearchResults] = useState([]);
    const ICONIFY_API_ROOT = 'https://api.iconify.design/';

    /**
     * Filter icons
     * @param search
     */
    const searchIcons = (search) => {
        fetch(`${ICONIFY_API_ROOT}search?query=${search}&prefix=dashicons&limit=96`)
            .then(res => res.json())
            .then(res => {
                setSearchResults(res.icons);
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

                res.uncategorized.map((icon)=>{
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

        if (!wp || !wp.media) {
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

    useEffect(()=>{
        fetchIcons();
    }, []);

    if (type === 'image') {
        return (
            <a
                href="#"
                className="mt-1 acpt-btn acpt-btn-primary-o acpt-btn-block"
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    openWpMedia();
                }}
            >
                {useTranslation("Upload an Image")}
            </a>
        );
    }

    return (
        <React.Fragment>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
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
                    data-cy="icon-picker-wrapper"
                >
                    {searchResults.map((searchResult) => (
                        <DashiconSelectorItem icon={searchResult} callback={callback}/>
                    ))}
                </div>
            )}

        </React.Fragment>
    );
};

DashiconSelector.propTypes = {
    type: PropTypes.string.isRequired,
    callback: PropTypes.func,
};

export default DashiconSelector;