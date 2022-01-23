import React from 'react';
import '../../../scss/woocommerce.scss';

const WooCommerceListElement = ( {icon, label}) => {
    return (
        <div>
            <span className={`mr-1 wcicon-${icon}`} />
            {label}
        </div>
    );
};

export default WooCommerceListElement;