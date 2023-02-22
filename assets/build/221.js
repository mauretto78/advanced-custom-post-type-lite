(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[221],{

/***/ 8221:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

var _reactRedux = __webpack_require__(4494);

var _useUnsavedChangesWarning = __webpack_require__(9755);

var _useUnsavedChangesWarning2 = _interopRequireDefault(_useUnsavedChangesWarning);

var _misc = __webpack_require__(3154);

var _fetchMeta = __webpack_require__(4553);

var _metaTypes = __webpack_require__(1895);

var _metaStateActions = __webpack_require__(8527);

var _reactSortableHoc = __webpack_require__(3350);

var _metaSubmit = __webpack_require__(4717);

var _deleteAllMeta = __webpack_require__(7209);

var _reactToastify = __webpack_require__(9249);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _Meta = __webpack_require__(7975);

var _Meta2 = _interopRequireDefault(_Meta);

var _Modal = __webpack_require__(2651);

var _Modal2 = _interopRequireDefault(_Modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaxonomyMeta = function TaxonomyMeta() {

    // manage global state
    var _useParams = (0, _reactRouterDom.useParams)(),
        taxonomy = _useParams.taxonomy;

    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaStateReducer;
    }),
        boxes = _useSelector.boxes,
        fields = _useSelector.fields,
        values = _useSelector.values,
        isSaved = _useSelector.isSaved,
        isValid = _useSelector.isValid,
        saveLoading = _useSelector.loading,
        saveErrors = _useSelector.errors,
        success = _useSelector.success;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchMetaReducer;
    }),
        loading = _useSelector2.loading,
        fetched = _useSelector2.fetched;

    // manage local state


    var didMountRef = (0, _react.useRef)(false);

    var _useUnsavedChangesWar = (0, _useUnsavedChangesWarning2.default)(),
        _useUnsavedChangesWar2 = _slicedToArray(_useUnsavedChangesWar, 3),
        Prompt = _useUnsavedChangesWar2[0],
        setDirty = _useUnsavedChangesWar2[1],
        setPristine = _useUnsavedChangesWar2[2];

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalVisible = _useState2[0],
        setModalVisible = _useState2[1];

    // set page meta title


    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)("ACPT - taxonomy meta" + (isSaved ? '' : '*'));
        if (!isSaved) {
            setDirty();
        }
    }, [isSaved]);

    // fetching data and
    // populate the UI
    (0, _react.useEffect)(function () {
        dispatch((0, _fetchMeta.fetchMeta)(_metaTypes.metaTypes.TAXONOMY, taxonomy));
    }, [saveLoading]);

    // sortable
    var onSortEnd = function onSortEnd(_ref) {
        var oldIndex = _ref.oldIndex,
            newIndex = _ref.newIndex;

        dispatch((0, _metaStateActions.setBoxes)((0, _reactSortableHoc.arrayMove)(boxes, oldIndex, newIndex)));
    };

    // handle data submit
    var handleSubmit = function handleSubmit() {
        dispatch((0, _metaSubmit.metaSubmit)(values));
        dispatch((0, _metaStateActions.setStatusSaved)());
        setPristine();
    };

    var handleDeleteAll = function handleDeleteAll() {
        dispatch((0, _deleteAllMeta.deleteAllMeta)(_metaTypes.metaTypes.TAXONOMY, taxonomy));
        dispatch((0, _metaStateActions.setStatusSaved)());
        setPristine();
    };

    // handle form submission outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!saveLoading) {
                if (success) {
                    setPristine();
                    _reactToastify.toast.success("Taxonomy meta successfully saved");
                }

                if (saveErrors.length > 0) {
                    saveErrors.map(function (error) {
                        _reactToastify.toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [saveLoading]);

    if (loading) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    var renderDeleteButton = wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            { title: "Confirm deleting all", visible: modalVisible },
            wp.element.createElement(
                "p",
                null,
                "Are you sure?"
            ),
            wp.element.createElement(
                "p",
                null,
                wp.element.createElement(
                    "a",
                    {
                        href: "#",
                        className: "acpt-btn acpt-btn-primary",
                        onClick: function onClick(e) {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                            handleDeleteAll();
                        }
                    },
                    "Yes"
                ),
                "\xA0",
                wp.element.createElement(
                    "a",
                    {
                        href: "#",
                        className: "acpt-btn acpt-btn-primary-o",
                        onClick: function onClick(e) {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                        }
                    },
                    "No"
                )
            )
        ),
        wp.element.createElement(
            "button",
            {
                onClick: function onClick(e) {
                    e.preventDefault();
                    setModalVisible(!modalVisible);
                },
                type: "submit",
                className: "acpt-btn acpt-btn-danger"
            },
            "Delete all"
        )
    );

    var buttons = wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "a",
            {
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    dispatch((0, _metaStateActions.createBox)(_metaTypes.metaTypes.TAXONOMY, taxonomy));
                },
                className: "acpt-btn acpt-btn-primary-o"
            },
            "Add meta box"
        ),
        boxes.length > 0 ? wp.element.createElement(
            _react2.default.Fragment,
            null,
            wp.element.createElement(
                "button",
                {
                    disabled: !isValid,
                    onClick: function onClick(e) {
                        e.preventDefault();
                        handleSubmit();
                    },
                    type: "submit",
                    className: "acpt-btn acpt-btn-primary"
                },
                "Save"
            ),
            renderDeleteButton
        ) : wp.element.createElement(
            _react2.default.Fragment,
            null,
            fetched.length > 0 && renderDeleteButton
        )
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(_ActionsBar2.default, {
            title: taxonomy + " meta boxes",
            actions: buttons
        }),
        wp.element.createElement(
            "main",
            null,
            wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                    label: "Registered Taxonomies",
                    link: "/taxonomies"
                }, {
                    label: taxonomy + " meta boxes"
                }] }),
            Prompt,
            wp.element.createElement(_Meta2.default, {
                belongsTo: _metaTypes.metaTypes.TAXONOMY,
                find: taxonomy,
                boxes: boxes,
                fields: fields,
                onSortEnd: onSortEnd,
                values: values
            })
        )
    );
};

exports.default = TaxonomyMeta;

/***/ })

}]);
//# sourceMappingURL=221.js.map