/**
 *
 * @param record
 * @param metaKey
 * @param defaultValue
 * @return {*}
 */
export const getFormMetadataDefaultValue = (record, metaKey, defaultValue = null) => {

    if(record && record.meta.length > 0){
        const filtered = record.meta.filter(m => m.key === metaKey);

        return (filtered.length > 0) ? filtered[0].value : defaultValue;
    }

    return defaultValue;
};