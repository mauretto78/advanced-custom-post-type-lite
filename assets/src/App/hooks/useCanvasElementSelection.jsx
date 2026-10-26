import {useCallback} from 'react';
import {useCanvasSidebar} from "../components/CanvasLayout/CanvasSidebarContext.jsx";

// Enter/Space (and clicks) inside an inline editor must never be hijacked as "select".
export const INLINE_EDIT_GUARD = 'input, textarea, select, [contenteditable]';

// A card's own toolbar (.actions: deselect, duplicate, copy, delete...) is a sibling of
// its select target, so any toolbar found *inside* a select target belongs to a nested
// card (repeater/flexible child, option-page child). Pressing one of its buttons focuses
// it on mousedown; if that focus reached the parent's handler, the parent got selected and
// the child's toolbar (and the delete modal it had just opened) unmounted (#1392).
const NESTED_TOOLBAR = '.actions';

const isInNestedToolbar = (e) => {
    const toolbar = e.target?.closest?.(NESTED_TOOLBAR);
    return !!toolbar && toolbar !== e.currentTarget && !!e.currentTarget?.contains?.(toolbar);
};

// React events bubble through portals along the *React* tree: a modal opened from a
// nested card's toolbar (the delete confirmation) is rendered in <body>, yet its focus
// and clicks still reach the parent card's handlers. Ignore anything that isn't
// actually inside this card in the DOM.
const isOutsideCard = (e) => !!e.currentTarget?.contains && !e.currentTarget.contains(e.target);

const isForeignEvent = (e) => isOutsideCard(e) || isInNestedToolbar(e);

/**
 * Shared click + focus selection handlers for a CanvasLayout element card.
 *
 * Ticket #1279: the card wrapper is a plain <div> (no role / tabindex / onKeyDown)
 * so it can't be a `nested-interactive` container (the drag handle, inline rename,
 * type badge and switches all live inside it). Selection splits in two:
 *   - onClick  = pointer select (click anywhere on the card); also reopens a
 *                collapsed CanvasLayout sidebar, where the settings are shown
 *   - onFocus  = keyboard "selection-follows-focus" (focusing any real control
 *                inside the card — handle, rename, type badge, switch — selects it)
 *
 * @param {object}   args
 * @param {boolean}  args.isActive        this card is already the selected one
 * @param {Function} args.onSelect        (e) => void — dispatch the manager's setActive… action
 * @param {string}   [args.clickGuard]    selector; e.target.closest(clickGuard) → ignore the click
 * @param {string}   [args.focusGuard]    selector; e.target.closest(focusGuard) → ignore the focus
 * @param {boolean}  [args.preventDefault] call e.preventDefault() in the click handler
 *                                         (parity with the sites that used to)
 * @returns {{onSelectClick: Function, onSelectFocus: Function}}
 */
export default function useCanvasElementSelection({
    isActive,
    onSelect,
    clickGuard = INLINE_EDIT_GUARD,
    focusGuard = INLINE_EDIT_GUARD,
    preventDefault = false,
}) {
    const {expand: expandSidebar} = useCanvasSidebar();

    const onSelectClick = useCallback((e) => {
        if (isForeignEvent(e)) {
            e.stopPropagation();
            return;
        }
        if (clickGuard && e.target.closest(clickGuard)) return;
        if (preventDefault) e.preventDefault();
        e.stopPropagation();
        onSelect(e); // idempotent re-select if already active — matches previous behaviour
        // the selected card's settings live in the sidebar: reopen it if collapsed
        expandSidebar();
    }, [clickGuard, preventDefault, onSelect, expandSidebar]);

    const onSelectFocus = useCallback((e) => {
        // Always first: a focus event bubbles in React, so a nested card
        // (Meta repeater/flexible children, option-page children) must not
        // also select its parent.
        e.stopPropagation();
        if (isForeignEvent(e)) return;
        if (focusGuard && e.target.closest(focusGuard)) return;
        if (isActive) return; // no redundant dispatch / sidebar re-render churn while tabbing
        onSelect(e);
    }, [focusGuard, isActive, onSelect]);

    return {onSelectClick, onSelectFocus};
}
