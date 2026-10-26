import useTranslation from "../hooks/useTranslation.jsx";

/**
 * Builds a dnd-kit `Announcements` object (the `DndContext`/`CanvasLayout`
 * `announcements` prop) with domain-specific item labels instead of dnd-kit's
 * generic "Draggable item <id>..." default text (WCAG 4.1.3 Status Messages).
 *
 * Deliberately avoids useTranslation's `{{key}}` interpolation for the dynamic
 * label: interpolation only fires when the exact string is already present in
 * document.globals.translations, so an untranslated/un-synced string would
 * render the literal placeholder. Concatenating the label after a short,
 * always-safe translated fragment sidesteps that.
 *
 * @param {(activeOrOver: {data: {current: Object}}) => string} getItemLabel
 */
export const createDndAnnouncements = (getItemLabel) => ({
    onDragStart({active}) {
        return `${getItemLabel(active)} ${useTranslation("picked up")}.`;
    },
    onDragOver({active, over}) {
        return over
            ? `${getItemLabel(active)} ${useTranslation("moved to a new position")}.`
            : `${getItemLabel(active)} ${useTranslation("is no longer over a drop target")}.`;
    },
    onDragEnd({active, over}) {
        return over
            ? `${getItemLabel(active)} ${useTranslation("dropped")}.`
            : `${useTranslation("Drop cancelled")} — ${useTranslation("released outside a valid drop target")}.`;
    },
    onDragCancel({active}) {
        return `${useTranslation("Dragging cancelled")}. ${getItemLabel(active)} ${useTranslation("was returned to its original position")}.`;
    },
});
