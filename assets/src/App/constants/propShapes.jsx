import PropTypes from 'prop-types';

// {value,label} option, or an optgroup {label, options:[...]} — matches
// Select.jsx / SelectMulti.jsx / ReactSelect.jsx's actual renderer logic.
export const selectOptionShape = PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
});

export const selectOptionOrGroupShape = PropTypes.oneOfType([
    selectOptionShape,
    PropTypes.shape({
        label: PropTypes.string.isRequired,
        originalLabel: PropTypes.string,
        options: PropTypes.arrayOf(selectOptionShape).isRequired,
    }),
]);

export const selectValuesPropType = PropTypes.arrayOf(selectOptionOrGroupShape);

// dnd-kit DndContext#announcements — see utils/dndAnnouncements.jsx's
// createDndAnnouncements(), which always returns exactly these 4 keys.
export const dndAnnouncementsShape = PropTypes.shape({
    onDragStart: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragCancel: PropTypes.func,
});

// dnd-kit useSortable/useDraggable `attributes` (DraggableAttributes)
export const dndAttributesShape = PropTypes.shape({
    role: PropTypes.string,
    tabIndex: PropTypes.number,
    'aria-disabled': PropTypes.bool,
    'aria-roledescription': PropTypes.string,
    'aria-describedby': PropTypes.string,
});

// CanvasLayout/CanvasUIPreferences "extra toolbar toggle" descriptor.
export const extraOptionShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    preferenceKey: PropTypes.string.isRequired,
    defaultValue: PropTypes.bool.isRequired,
    onToggle: PropTypes.func,
    icon: PropTypes.string,
});

// BelongsModal / BelongCondition-family location-rule row
export const belongShape = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    belongsTo: PropTypes.string,
    rule: PropTypes.string, // legacy key, see BelongsModal's belong.rule ?? belong.belongsTo
    operator: PropTypes.string,
    find: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // legacy key
    logic: PropTypes.oneOf(['AND', 'OR']),
});

// Raw inline style bag (React CSSProperties) — used by Button/Badge's `css`
// prop and Select's `style` prop.
export const inlineStyleShape = PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]));
