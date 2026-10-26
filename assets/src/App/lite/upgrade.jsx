/**
 * ACPT Lite: where the "available in ACPT PRO" hints lead.
 *
 * Every link carries UTM parameters, so the upgrade funnel can be measured
 * per surface (field picker, field settings, plugin menu, ...).
 */
export const UPGRADE_BASE_URL = "https://acpt.io/checkout/";

/**
 * @param {string} surface e.g. "field-types", "field-settings", "plugin-menu"
 * @param {string|null} feature e.g. "repeater", "conditional-rendering"
 * @return {string}
 */
export const upgradeUrl = (surface, feature = null) => {
    const params = new URLSearchParams({
        utm_source: "acpt-lite",
        utm_medium: "plugin",
        utm_campaign: surface,
    });

    if (feature) {
        params.set("utm_content", feature);
    }

    return `${UPGRADE_BASE_URL}?${params.toString()}`;
};

/**
 * "SelectMulti" → "Select multi", "QRCode" → "QR code", "HTML" → "HTML"
 *
 * @param {string} type
 * @return {string}
 */
export const humanizeFieldType = (type) => {
    const words = type.match(/[A-Z]{2,}(?=[A-Z][a-z]|$)|[A-Z]?[a-z]+|[A-Z]+/g) ?? [type];

    return words
        .map((word, index) => {
            if (word.length > 1 && word === word.toUpperCase()) {
                return word;
            }

            return index === 0 ? word : word.toLowerCase();
        })
        .join(" ");
};
