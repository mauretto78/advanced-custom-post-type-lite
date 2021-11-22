/**
 * Determines if _ is lodash or not
 */
export const isLodash = () => {
    let isLodash = false;

    // If _ is defined and the function _.forEach exists then we know underscore OR lodash are in place
    if ( 'undefined' != typeof( _ ) && 'function' == typeof( _.forEach ) ) {

        // A small sample of some of the functions that exist in lodash but not underscore
        const funcs = [ 'get', 'set', 'at', 'cloneDeep' ];

        // Simplest if assume exists to start
        isLodash  = true;

        funcs.forEach( function ( func ) {
            // If just one of the functions do not exist, then not lodash
            isLodash = ( 'function' != typeof( _[ func ] ) ) ? false : isLodash;
        } );
    }

    if ( isLodash ) {
        // We know that lodash is loaded in the _ variable
        return true;
    }

    return false;
};