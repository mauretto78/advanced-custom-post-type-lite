import PropTypes from "prop-types";

// BrokenEntityObject.php -- a record whose definition no longer loads, as an
// admin list fetched with `includeBroken: true` returns it (M13). Entity-specific
// extras (e.g. a table's `tableGroupId`) may be present too.
export const brokenEntityProps = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    broken: PropTypes.oneOf([true]).isRequired,
    error: PropTypes.string,
};
