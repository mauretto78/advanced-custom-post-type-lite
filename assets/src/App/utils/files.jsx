/**
 * Checks if a file exists at the given URL.
 *
 * This function verifies whether the specified URL points to an existing file
 * by making a synchronous HTTP `HEAD` request to the resource. It first validates
 * that the input string is a well-formed HTTP or HTTPS URL. If the validation fails,
 * it returns `false`. Otherwise, it performs the request to determine the file's existence.
 *
 * Note: Due to the use of synchronous requests, its usage may block further execution,
 * and it is not recommended for performance-sensitive applications.
 *
 * @param {string} url - The URL to check the existence of.
 * @returns {boolean} - Returns `true` if the file exists, otherwise `false`.
 */
export const fileExists = (url) =>
{
    function isValidHttpUrl(string) {

        if(
            string === null ||
            string === '' ||
            string === undefined
        ){
            return false;
        }

        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    if(!isValidHttpUrl(url)){
        return false;
    }

    const http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();

    return http.status >= 200 && http.status < 300;
};

/**
 * Nicely format bytes to a human readable string
 *
 * please see:
 * https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 *
 * @param bytes
 * @param decimals
 * @return {string}
 */
export const formatBytes = (bytes, decimals = 2) => {

    if(
        bytes === null ||
        bytes === '' ||
        bytes === undefined
    ){
        return ''
    }

    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Download file
 * @param filename
 * @param text
 */
export const download = (filename, text) => {
    const element = document.createElement( 'a' );
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

/**
 *
 * @param filename
 * @return {*}
 */
export const getFileExtension = (filename) => {

    // check if filename is string
    if(typeof filename !== 'string'){return ''}

    return filename.split('.').pop();
};