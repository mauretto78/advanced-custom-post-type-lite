import React, {useCallback, useEffect, useMemo, useRef} from "react";
import PropTypes from "prop-types";
import {FormProvider, useForm, useWatch} from "react-hook-form";
import {toast} from "react-hot-toast";

import useTranslation from "../../hooks/useTranslation.jsx";
import {useTableQueryState} from "../../hooks/useTableQueryState.jsx";

import Alert from "../Alert/index.jsx";
import BulkActions from "../BulkActions/index.jsx";
import TablePagination from "./TablePagination.jsx";
import TableSearchInput from "./TableSearchInput.jsx";

import {styleVariants} from "../../constants/styles.jsx";
import {BULK_ACTIONS_MAP} from "../../constants/bulkActions.jsx";

import {download} from "../../utils/files.jsx";
import {hideElements} from "../../utils/localStorage.jsx";
import {wpAjaxRequest} from "../../utils/ajax.jsx";
import {setCookieMessage} from "../../utils/cookies.jsx";
import {scrollToTop} from "../../utils/scroll.jsx";
import {isRTLOrientation, refreshPage} from "../../utils/misc.jsx";

const defaultIsSelectable = () => true;

const Table = ({
       columns,
       data,
       total,
       page = 1,
       baseLink,
       belongsTo,
       noRecordsElement,
       forceUpdate,
       children,
       renderRow,
       rowKey = "id",
       searchComponent: SearchComponent = TableSearchInput,
       bulkActions = ["delete", "duplicate", "hide"],
       isSelectable = defaultIsSelectable,
   }) => {

    const methods = useForm({
        mode: "all",
        defaultValues: {
            elements: {},
            action: ""
        }
    });

    const selectAllRef = useRef(null);
    const lastSelectedRef = useRef(null);

    const watchedElements = useWatch({
        control: methods.control,
        name: "elements"
    });

    const {
        sortKey,
        sortOrder,
        setSort
    } = useTableQueryState();

    // -----------------------------
    // Stable row key getter
    // -----------------------------
    const getRowKey = useCallback((row) => {
        return typeof rowKey === "function"
            ? rowKey(row)
            : row[rowKey];
    }, [rowKey]);

    // -----------------------------
    // Precomputed rows
    // -----------------------------
    const rows = useMemo(() => {
        return (data || []).map(row => ({
            row,
            key: getRowKey(row),
            selectable: isSelectable(row),
        }));
    }, [data, getRowKey, isSelectable]);

    // -----------------------------
    // Init form state
    // -----------------------------
    useEffect(() => {
        if (!rows.length) return;

        const values = {};

        rows.forEach(({ key, selectable }) => {
            if (selectable) {
                values[key] = false;
            }
        });

        methods.reset({
            ...methods.getValues(),
            elements: values
        });
    }, [rows]);

    // -----------------------------
    // Global listeners
    // -----------------------------
    useEffect(() => {
        if (typeof forceUpdate !== "function") return;

        const handler = () => forceUpdate();

        document.addEventListener("restoredElement", handler);
        document.addEventListener("hideElement", handler);

        return () => {
            document.removeEventListener("restoredElement", handler);
            document.removeEventListener("hideElement", handler);
        };
    }, [forceUpdate]);

    // -----------------------------
    // Sync master checkbox
    // -----------------------------
    useEffect(() => {
        if (!watchedElements || !selectAllRef.current) return;

        const values = Object.values(watchedElements);

        selectAllRef.current.checked =
            values.length > 0 &&
            values.every(Boolean);
    }, [watchedElements]);

    // -----------------------------
    // Row selection
    // -----------------------------
    const handleSelect = useCallback((id, checked, event) => {

        const selectableIds = rows
            .filter(r => r.selectable)
            .map(r => r.key);

        const multiSelect =
            (event.shiftKey || event.ctrlKey) &&
            lastSelectedRef.current !== null;

        if (multiSelect) {

            const start = selectableIds.indexOf(lastSelectedRef.current);
            const end = selectableIds.indexOf(id);

            const [min, max] = [start, end].sort((a, b) => a - b);

            for (let i = min; i <= max; i++) {
                methods.setValue(
                    `elements.${selectableIds[i]}`,
                    checked
                );
            }

        } else {
            methods.setValue(`elements.${id}`, checked);
        }

        lastSelectedRef.current = id;

    }, [rows]);

    const handleSelectAll = useCallback((checked) => {

        const values = {};

        rows.forEach(({ key, selectable }) => {
            if (selectable) {
                values[key] = checked;
            }
        });

        methods.setValue("elements", values);

    }, [rows]);

    // -----------------------------
    // Bulk submit
    // -----------------------------
    const executeAjaxAction = async (action, formData) => {

        const res = await wpAjaxRequest(
            "bulkActionsAction",
            formData
        );

        if (!res.success) {
            toast.error(res.error);
            return;
        }

        if (res.data !== undefined && res.filename) {
            download(res.filename, res.data);
            methods.resetField("elements");
            methods.resetField("action");
            return;
        }

        if (action === "delete") {
            setCookieMessage("Record successfully deleted.");
        }

        if (action === "duplicate") {
            setCookieMessage("Record successfully duplicated.");
        }

        methods.resetField("elements");
        methods.resetField("action");

        scrollToTop();
        refreshPage();
    };

    const onSubmit = async (formData) => {

        const action = formData.action;

        if (!action) return;

        if (!Object.keys(BULK_ACTIONS_MAP).includes(action)) {
            return;
        }

        formData.belongsTo = belongsTo;

        try {

            switch (action) {

                case "hide":
                    hideElements(formData);
                    document.dispatchEvent(
                        new Event("hideElement")
                    );

                    methods.resetField("elements");
                    methods.resetField("action");
                    break;

                default:
                    await executeAjaxAction(action, formData);
            }

        } catch (error) {
            console.error(error);
            toast.error(
                useTranslation("Unknown error, please retry later")
            );
        }
    };

    // -----------------------------
    // Empty state
    // -----------------------------
    if (!rows.length) {
        return (
            <div className="flex-column s-24">
                <SearchComponent />

                {noRecordsElement ? (
                    noRecordsElement
                ) : (
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation("No records found.")}
                    </Alert>
                )}
            </div>
        );
    }

    // -----------------------------
    // Render
    // -----------------------------
    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="mb-24">
                    <SearchComponent />
                </div>
                <BulkActions
                    belongsTo={belongsTo}
                    actions={bulkActions}
                />
                <div className="flex-column s-24">
                    <div className="responsive b-rounded">
                        <table className={`acpt-table rounded ${isRTLOrientation()}`}>

                            <thead>
                                <tr>
                                    <th style={{ width: "24px" }}>
                                        <label className="checkbox" htmlFor="all" aria-label={useTranslation("Select all")}>
                                            <input
                                                ref={selectAllRef}
                                                type="checkbox"
                                                id="all"
                                                onChange={(e) =>
                                                    handleSelectAll(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <span />
                                        </label>
                                    </th>
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            width={column.width || ""}
                                            className={
                                                column.key &&
                                                column.sortable
                                                    ? "sortable cursor-pointer"
                                                    : ""
                                            }
                                            onClick={() => {
                                                if (
                                                    column.key &&
                                                    column.sortable
                                                ) {
                                                    setSort(column.key);
                                                }
                                            }}
                                        >
                                            {column.cell}

                                            {column.key === sortKey && (
                                                <span>
                                                    {sortOrder === "asc"
                                                        ? " ↑"
                                                        : " ↓"}
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {renderRow
                                    ? rows.map(({ row, key, selectable }) =>
                                        renderRow(row, {
                                            rowKey: key,
                                            selectable,
                                            handleSelect
                                        })
                                    )
                                    : children
                                }
                            </tbody>
                        </table>
                    </div>
                    <TablePagination
                        totalRows={total}
                        currentPage={page}
                        baseLink={baseLink}
                    />
                </div>
            </form>
        </FormProvider>
    );
};

Table.propTypes = {
    page: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        sortable: PropTypes.bool,
        cell: PropTypes.node,
    })).isRequired,
    data: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    baseLink: PropTypes.string.isRequired,
    belongsTo: PropTypes.string.isRequired,
    noRecordsElement: PropTypes.element,
    renderRow: PropTypes.func,

    rowKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),

    searchComponent: PropTypes.elementType,

    bulkActions: PropTypes.arrayOf(
        PropTypes.oneOf(
            Object.keys(BULK_ACTIONS_MAP)
        )
    ),

    isSelectable: PropTypes.func,
};

export default Table;