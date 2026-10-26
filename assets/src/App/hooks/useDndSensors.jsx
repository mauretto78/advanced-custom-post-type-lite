import {useMemo} from "react";
import {KeyboardSensor, MouseSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";

/**
 * Canonical dnd-kit sensor set for every ACPT drag-and-drop builder.
 * Always includes KeyboardSensor (WCAG 2.1.1 Keyboard) alongside MouseSensor.
 *
 * coordinateGetter is intentionally left undefined by default — dnd-kit's
 * plain step-based getter works for any droppable shape (SortableContext or
 * raw useDraggable/useDroppable half-zones), whereas sortableKeyboardCoordinates
 * needs an actual SortableContext and can jump between a neighbor's drop-zone
 * halves otherwise. Only SortableList opts into it explicitly.
 *
 * dnd-kit's own useSensor()/useSensors() memoize by object *identity*
 * (useMemo([sensor, options]) / useMemo([...sensors])), and DndContext tears
 * down and reinstantiates every sensor whenever that identity changes — which
 * silently kills an in-progress keyboard drag (arrow keys move it, but the
 * final Space/Enter never reaches onDragEnd) if it happens mid-drag. Callers
 * naturally pass activationConstraint as an inline literal
 * (`{activationConstraint: {distance: 4}}`), a fresh object every render, so
 * this hook re-derives it from primitives via useMemo instead of trusting
 * the caller's object reference.
 */
const useDndSensors = ({activationConstraint, coordinateGetter, withPointerSensor = false} = {}) => {
    const {distance, delay, tolerance} = activationConstraint ?? {};

    const sensorOptions = useMemo(() => {
        if (distance === undefined && delay === undefined && tolerance === undefined) {
            return undefined;
        }
        const constraint = {};
        if (distance !== undefined) constraint.distance = distance;
        if (delay !== undefined) constraint.delay = delay;
        if (tolerance !== undefined) constraint.tolerance = tolerance;
        return {activationConstraint: constraint};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [distance, delay, tolerance]);

    const keyboardOptions = useMemo(
        () => coordinateGetter ? {coordinateGetter} : undefined,
        [coordinateGetter]
    );

    const pointerSensor  = useSensor(PointerSensor, sensorOptions);
    const mouseSensor    = useSensor(MouseSensor, sensorOptions);
    const keyboardSensor = useSensor(KeyboardSensor, keyboardOptions);

    return useSensors(
        withPointerSensor ? pointerSensor : null,
        mouseSensor,
        keyboardSensor,
    );
};

export default useDndSensors;
