
/**
 * Capitalize text
 *
 * @param txt
 * @return {string}
 */
export const capitalizeTxt = (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1); //or if you want lowercase the rest txt.slice(1).toLowerCase();
};

/**
 * Converts [0,0,20,0,'px'] into 0px 0px 20px 0px
 * @param values
 * @return {string|null}
 */
export const squaresToString = (values) => {

    if(values && typeof values !== 'undefined'){
        return values[0]+values[4]+" "+values[1]+values[4]+" "+values[2]+values[4]+" "+values[3]+values[4];
    }

    return null;
};

/**
 * For the UI the padding cannot be 0
 * (example: overlapping nested divs)
 */
export const generatePadding = (padding) => {

    const minPadding = 10;

    if(padding !== null && typeof padding !== 'undefined') {
        let paddings = [];

        if(padding[0] < minPadding){ paddings.push(minPadding) } else { paddings.push(padding[0]) }
        if(padding[0] < minPadding){ paddings.push(minPadding) } else { paddings.push(padding[1]) }
        if(padding[0] < minPadding){ paddings.push(minPadding) } else { paddings.push(padding[2]) }
        if(padding[0] < minPadding){ paddings.push(minPadding) } else { paddings.push(padding[3]) }
        if(padding[4] !== null){  paddings.push(padding[4]); } else {  paddings.push("px"); }

        return squaresToString(paddings);
    }

    return minPadding+'px';
};

/**
 *
 * @param item
 * @param searchTerm
 * @return {boolean}
 */
export const likeThat = (item, searchTerm) => {
    return item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
};

/**
 *
 * @param string
 * @return {*}
 */
export const addSlashes = (string) => {
    return string.replace(/\\/g, '\\\\').
    replace(/\u0008/g, '\\b').
    replace(/\t/g, '\\t').
    replace(/\n/g, '\\n').
    replace(/\f/g, '\\f').
    replace(/\r/g, '\\r').
    replace(/'/g, '\\\'').
    replace(/"/g, '\\"');
}