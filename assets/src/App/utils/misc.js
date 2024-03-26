/**
 *
 * @param text
 */
export const copyToTheClipboard = (text) => {

    // text.select();
    // text.setSelectionRange(0, 99999);

    console.log(`'copied ${text} to clipboard'`);
    navigator.clipboard.writeText(text);
};

/**
 * Change document's <title>
 * @param title
 */
export const metaTitle = (title) => {
    const originalDocumentTitle = document.title.split("‹");
    document.title = `${title} ‹ ${originalDocumentTitle[1]}`;
};

/**
 * Add current class to admin menu link
 * @param link
 */
export const changeCurrentAdminMenuLink = (link) => {

    const menuWrapper = document.querySelector('#toplevel_page_advanced-custom-post-type .wp-submenu');

    menuWrapper.childNodes.forEach((currentValue, currentIndex, listObj) => {
        const links = currentValue.getElementsByTagName('a');

        for(let i = 0; i < links.length; i++) {
            let elem = links[i];
            let href = elem.getAttribute("href");
            let toCompare = 'admin.php?page=advanced-custom-post-type'+link;

            if( toCompare === href ){
                currentValue.classList.add("current");
            } else {
                currentValue.classList.remove("current");
            }
        }
    });
};

export const refreshPage = (timeout = 0) => {
    setTimeout(function () {
        window.location.reload();
    }, timeout);
};

export const  delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
};