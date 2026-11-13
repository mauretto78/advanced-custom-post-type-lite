import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import useTranslation from "../../hooks/useTranslation";
import DropdownMenu from "../DropdownMenu";
import Badge from "../Badge/index.jsx";
import {primaryColor} from "../../utils/colors";
import {styleVariants} from "../../constants/styles";
import {brokenEntityProps} from "../../props/brokenEntityProps.js";

/**
 * The row of an admin list for a record whose definition no longer loads
 * (AbstractRepository::getForAdminList() returns it as a BrokenEntityObject).
 * It stays in the list so the rows match the total, and the only thing the admin
 * can do with it is delete it (M13).
 *
 * Layout: an empty selection cell (the row can't be selected), the name, one cell
 * spanning the list's middle columns with the label and the error, and the
 * actions menu holding only `deleteAction`.
 *
 * @param {object} record          the BrokenEntityObject
 * @param {number} columnsCount    the list's column definitions, not counting the selection column
 * @param {React.ReactElement} deleteAction  the list's own delete modal for this record
 */
const BrokenListRow = memo(({record, columnsCount, deleteAction}) => {

    const label = record.label || record.name;

    return (
        <tr data-testid={`broken-row-${record.name}`}>
            <td style={{width: "24px"}} />
            <td>
                {record.name}
            </td>
            <td colSpan={Math.max(1, columnsCount - 2)}>
                <div className="flex-column s-4">
                    {record.label && record.label !== record.name && (
                        <span>{record.label}</span>
                    )}
                    <span>
                        <Badge icon="bx:error" style={styleVariants.DANGER}>
                            {useTranslation("Can't be loaded")}
                        </Badge>
                    </span>
                    <span className="font-size-xs">
                        {useTranslation("Its definition is invalid. Delete it, or check the error log.")}
                    </span>
                    {record.error && (
                        <code className="font-size-xs">{record.error}</code>
                    )}
                </div>
            </td>
            <td>
                <DropdownMenu
                    name={`broken-row-menu-${record.id}`}
                    label={`${useTranslation("Actions for")} ${label}`}
                    buttonClass={styleVariants.OUTLINED_SECONDARY}
                    anchor={
                        <Icon icon="bx:dots-vertical-rounded" color={primaryColor()} width={24} />
                    }
                    links={[deleteAction]}
                />
            </td>
        </tr>
    );
});

BrokenListRow.propTypes = {
    record: PropTypes.shape(brokenEntityProps).isRequired,
    columnsCount: PropTypes.number.isRequired,
    deleteAction: PropTypes.element.isRequired,
};

export default BrokenListRow;
