/**
 * Flatten nested children/block-fields into a flat fields array.
 * Each child gets parentId, each block-field gets blockId.
 * Called during hydration (data from API → Redux).
 */
export const flattenFields = (fields) => {
    if (!fields || !Array.isArray(fields)) return [];

    const flat = [];

    const flatten = (fieldList) => {
        fieldList.forEach(field => {
            const {children, ...fieldWithoutChildren} = field;

            // Keep blocks as definitions but extract their nested fields
            if (fieldWithoutChildren.blocks && Array.isArray(fieldWithoutChildren.blocks)) {
                fieldWithoutChildren.blocks = fieldWithoutChildren.blocks.map(block => {
                    const {fields: blockFields, ...blockWithoutFields} = block;

                    // Flatten block fields (and any of their own nested
                    // children/blocks, e.g. a repeater field inside a
                    // flexible-content block) into the root array
                    if (blockFields && Array.isArray(blockFields)) {
                        const blockFieldsWithParent = blockFields.map(blockField => ({
                            ...blockField,
                            parentId: field.id,
                            blockId: block.id,
                        }));
                        flatten(blockFieldsWithParent);
                    }

                    return blockWithoutFields;
                });
            }

            flat.push(fieldWithoutChildren);

            // Flatten children (repeater fields) into the root array
            if (children && Array.isArray(children) && children.length > 0) {
                const childrenWithParent = children.map(child => ({
                    ...child,
                    parentId: field.id,
                    blockId: child.blockId || null,
                }));
                flatten(childrenWithParent);
            }
        });
    };

    flatten(fields);
    return flat;
};

/**
 * Reconstruct nested structure from flat fields array for backend submission.
 * Called before sending data to the backend.
 */
export const nestFields = (flatFields) => {
    if (!flatFields || !Array.isArray(flatFields)) return [];

    // Reattaches a field's own children (by parentId) and, if it defines
    // blocks, each block's own fields (by blockId) -- recursively, so a
    // field nested at any depth (e.g. a repeater field living inside a
    // flexible-content block) is hydrated the same way as a root field.
    // ancestorIds guards against a parentId/blockId cycle (e.g. a field
    // reparented into its own descendant) recursing forever.
    const hydrateField = (field, ancestorIds) => {
        const nested = {...field};

        if (ancestorIds.has(field.id)) {
            console.error(`nestFields: cycle detected at field "${field.name}" (${field.id}); truncating this branch`);
            nested.children = [];
            if (Array.isArray(nested.blocks)) nested.blocks = nested.blocks.map(b => ({...b, fields: []}));
            return nested;
        }

        const nextAncestorIds = new Set(ancestorIds);
        nextAncestorIds.add(field.id);

        const children = flatFields.filter(f => f.parentId === field.id && !f.blockId);
        nested.children = children.map(child => hydrateField(child, nextAncestorIds));

        if (nested.blocks && Array.isArray(nested.blocks)) {
            nested.blocks = nested.blocks.map(block => ({
                ...block,
                fields: flatFields.filter(f => f.blockId === block.id).map(f => hydrateField(f, nextAncestorIds)),
            }));
        }

        return nested;
    };

    // Root fields: no parentId AND no blockId
    return flatFields
        .filter(f => !f.parentId && !f.blockId)
        .map(field => hydrateField(field, new Set()));
};

/**
 * Flatten every box's fields into the same flat, parentId/blockId-linked
 * shape flattenFields() produces -- used wherever RHF's `boxes` value is
 * seeded directly from an API payload (whose fields are the nested tree
 * shape, each carrying a real `children`/block-`fields` array). Without
 * this, nestFields() -- which assumes a flat input -- can't find any
 * children by parentId and silently overwrites them with [] on the next
 * submit. Mirrors what the Redux `hydrateState` reducer already does for
 * `group.boxes` (see metaStateSlice.jsx), so RHF and Redux agree on shape.
 */
export const hydrateFormBoxes = (boxes) =>
    (boxes ?? []).map(box => ({...box, fields: flattenFields(box.fields ?? [])}));

/**
 * True if candidateId is fieldId itself or one of its descendants, walking
 * the same parentId/blockId edges nestFields() does above. Used to reject a
 * drag-and-drop reparent that would create the cycle nestFields() guards
 * against (e.g. dropping a field into its own "drop children here" zone).
 */
export const isFieldOrDescendant = (flatFields, fieldId, candidateId) => {
    if (!fieldId || !candidateId) return false;
    if (fieldId === candidateId) return true;
    if (!flatFields || !Array.isArray(flatFields)) return false;

    const field = flatFields.find(f => f.id === fieldId);
    const ownBlockIds = new Set((field?.blocks ?? []).map(b => b.id));
    const directChildren = flatFields.filter(f => f.parentId === fieldId || ownBlockIds.has(f.blockId));

    return directChildren.some(child => isFieldOrDescendant(flatFields, child.id, candidateId));
};

