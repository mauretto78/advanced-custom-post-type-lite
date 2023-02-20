import React from 'react';

const CustomPostTypeLabel = ({element}) => {

    // Note: can be used also for Taxonomy

    return (
        <React.Fragment>
            {element.isNative
                ?
                <span className={`acpt-badge acpt-badge-native`}>
                    <span className="label">
                        Native
                    </span>
                </span>
                :
                <span className={`acpt-badge acpt-badge-${element.isWooCommerce === true ? 'woocommerce' : 'custom' }`}>
                    <span className="label">
                        {element.isWooCommerce === true ? 'WooCommerce' : 'Custom' }
                    </span>
                </span>
            }
        </React.Fragment>
    );
};

export default CustomPostTypeLabel;