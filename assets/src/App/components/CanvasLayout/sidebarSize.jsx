// The canvas sidebar width is kept and persisted in pixels, not as a % of the
// layout. A % persisted on a wide monitor (e.g. 55%) made the sidebar wider
// than the canvas on a laptop.

// The sidebar never takes more than this share of the whole layout when it is
// restored, so the canvas always keeps at least half of the room.
export const SIDEBAR_MAX_SHARE = 0.5;

const storageKey = (preferenceId) => `acpt_${preferenceId}_sidebar_width`;

export const readSidebarWidth = (preferenceId) => {
    try {
        const stored = parseInt(localStorage.getItem(storageKey(preferenceId)), 10);

        return Number.isFinite(stored) && stored > 0 ? stored : null;
    } catch (e) {
        return null;
    }
};

export const writeSidebarWidth = (preferenceId, width) => {
    try {
        localStorage.setItem(storageKey(preferenceId), String(Math.round(width)));
    } catch (e) {
        // storage unavailable (private mode, quota): the width just isn't remembered
    }
};

/**
 * The sidebar width to start with: the stored width (or the default), kept
 * within [minSize, maxSize] and, when the layout width is known, within
 * SIDEBAR_MAX_SHARE of it (never below minSize).
 *
 * @param {{stored: ?number, defaultSize: number, minSize: number, maxSize: number, groupWidth: ?number}} args
 * @return {number}
 */
export const resolveSidebarWidth = ({stored, defaultSize, minSize, maxSize, groupWidth}) => {
    let max = maxSize;

    if (groupWidth && groupWidth > 0) {
        max = Math.min(max, Math.max(minSize, Math.floor(groupWidth * SIDEBAR_MAX_SHARE)));
    }

    const wanted = stored ?? defaultSize;

    return Math.max(minSize, Math.min(max, wanted));
};
