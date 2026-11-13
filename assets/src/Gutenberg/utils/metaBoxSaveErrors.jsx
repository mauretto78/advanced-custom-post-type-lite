/**
 * The block editor saves the classic meta boxes in a background request, so the
 * save errors ACPT keeps in the `acpt_errors` cookie (AbstractSaveMetaCommand:
 * field validation and CCT save failures) were only shown on the next page load,
 * while the editor said "Post updated." (#1455, M10).
 * This shows them as soon as the meta box save ends.
 */

export const COOKIE_NAME = 'acpt_errors';

// the ids core/editor gives its "Post updated." / "Draft saved." notice
// ("editor-save" in current WordPress, "SAVE_POST_NOTICE_ID" in older versions)
export const SAVE_POST_NOTICE_IDS = ['editor-save', 'SAVE_POST_NOTICE_ID'];

/**
 * The messages are HTML (esc_html / wp_kses_post on the PHP side):
 * the editor notices print plain text
 *
 * @param {string} html
 * @return {string}
 */
const toPlainText = (html) => {
    try {
        const doc = new DOMParser().parseFromString(String(html), 'text/html');

        return (doc.body.textContent || '').trim();
    } catch (e) {
        return String(html);
    }
};

/**
 * Read the save errors from a cookie string (document.cookie).
 * The value is the JSON of Cookie::set(), url-encoded by PHP's setcookie().
 *
 * @param {string} cookieString
 * @return {{level: string, message: string}[]}
 */
export const parseSaveErrors = (cookieString) => {
    if (typeof cookieString !== 'string' || cookieString === '') {
        return [];
    }

    const prefix = COOKIE_NAME + '=';
    const raw = cookieString
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.indexOf(prefix) === 0);

    if (!raw) {
        return [];
    }

    let decoded;

    try {
        // a literal "+" is always encoded as %2B: a bare one is a space
        decoded = JSON.parse(decodeURIComponent(raw.substring(prefix.length).replace(/\+/g, ' ')));
    } catch (e) {
        return [];
    }

    if (!Array.isArray(decoded)) {
        return [];
    }

    return decoded
        .filter((item) => item && typeof item === 'object' && item.message)
        .map((item) => ({
            level: item.level === 'error' ? 'error' : 'warning',
            message: toPlainText(item.message),
        }))
        .filter((item) => item.message !== '');
};

/**
 * Cookie::set() passes no path, so the browser stored the cookie under the
 * directory of the request that set it (/…/wp-admin): expire it there,
 * or the next page load shows the same errors again.
 *
 * @return {void}
 */
export const clearSaveErrorsCookie = () => {
    const pathname = window.location.pathname || '/';
    const path = pathname.substring(0, pathname.lastIndexOf('/')) || '/';

    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
};

/**
 * Show the errors left in the cookie, replacing the "Post updated." notice.
 *
 * @param {object} data wp.data
 * @return {boolean} whether there was any error
 */
export const showSaveErrors = (data) => {
    const errors = parseSaveErrors(document.cookie);

    if (errors.length === 0) {
        return false;
    }

    const notices = data.dispatch('core/notices');

    SAVE_POST_NOTICE_IDS.forEach((id) => notices.removeNotice(id));
    errors.forEach((error) => {
        notices.createNotice(error.level, error.message, {isDismissible: true});
    });

    clearSaveErrorsCookie();

    return true;
};

/**
 * Watch the meta box save of the post editor, and show the errors when it ends.
 *
 * @param {object} data wp.data (defaults to the global one)
 * @return {function|null} the unsubscribe function, null when there is nothing to watch
 */
export const watchMetaBoxSaveErrors = (data = (typeof wp !== 'undefined' ? wp.data : undefined)) => {
    if (!data || typeof data.subscribe !== 'function' || typeof data.select !== 'function') {
        return null;
    }

    let wasSaving = false;

    return data.subscribe(() => {
        // not registered in the site editor or the widgets screen
        const editPost = data.select('core/edit-post');

        if (!editPost || typeof editPost.isSavingMetaBoxes !== 'function') {
            return;
        }

        const isSaving = !!editPost.isSavingMetaBoxes();

        if (wasSaving && !isSaving) {
            // not from inside the listener: dispatching while the stores notify their
            // listeners nests every other subscriber's work (ACF's re-runs editor
            // selectors on each notification) until the call stack overflows
            setTimeout(() => showSaveErrors(data), 0);
        }

        wasSaving = isSaving;
    });
};
