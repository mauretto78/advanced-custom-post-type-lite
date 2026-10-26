/**
 *
 * @param text
 */
export const copyToTheClipboard = (text) => {
    // Modern Clipboard API (requires HTTPS/secure context)
    if(navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => console.log(`'copied ${text} to clipboard'`))
            .catch(err => console.error('Failed to copy:', err));
    } else {
        // Fallback for HTTP or unsupported browsers
        // Create temporary element to select and copy
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            console.log(`'copied ${text} to clipboard'`);
        } catch(err) {
            console.error('Failed to copy:', err);
        }
        document.body.removeChild(textArea);
    }
};

/**
 * Determines if the current document orientation is set to Right-to-Left (RTL).
 *
 * This function checks the global `is_rtl` property in the document's globals
 * and returns 'rtl' if the orientation is right-to-left. Otherwise, it returns an
 * empty string if the document is not in RTL orientation.
 *
 * @function
 * @returns {string} Returns 'rtl' for Right-to-Left orientation, or an empty string for other orientations.
 */
export const isRTLOrientation = () => {
    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    return globals.is_rtl ? 'rtl' : '';
}

/**
 * Change document's <title>
 * @param title
 */
export const metaTitle = (title) => {
    const originalDocumentTitle = document.title.split("‹");
    const secondSegment = originalDocumentTitle[1];

    document.title = secondSegment !== undefined ? `${title} ‹ ${secondSegment}` : title;
};

/**
 * Add current class to admin menu link
 * @param link
 */
export const changeCurrentAdminMenuLink = (link) => {

    const menuWrapper = document.querySelector('#toplevel_page_acpt-lite .wp-submenu');

    if(menuWrapper && menuWrapper.childNodes && menuWrapper.childNodes.length > 0){
        menuWrapper.childNodes.forEach((currentValue, currentIndex, listObj) => {
            const links = currentValue.getElementsByTagName('a');

            for(let i = 0; i < links.length; i++) {
                let elem = links[i];
                let href = elem.getAttribute("href");
                let toCompare = 'admin.php?page=acpt-lite'+link;

                if( toCompare === href ){
                    currentValue.classList.add("current");
                } else {
                    currentValue.classList.remove("current");
                }
            }
        });
    }
};

export const refreshPage = (timeout = 0) => {
    setTimeout(function () {
        window.location.reload();
    }, timeout);
};

export const  delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
};