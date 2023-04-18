/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[221],{

/***/ 8221:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n    value: true\n}));\n\nvar _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"]) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); } }; }();\n\nvar _react = __webpack_require__(7294);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRouterDom = __webpack_require__(886);\n\nvar _reactRedux = __webpack_require__(4494);\n\nvar _useUnsavedChangesWarning = __webpack_require__(9755);\n\nvar _useUnsavedChangesWarning2 = _interopRequireDefault(_useUnsavedChangesWarning);\n\nvar _misc = __webpack_require__(3154);\n\nvar _fetchMeta = __webpack_require__(4553);\n\nvar _metaTypes = __webpack_require__(1895);\n\nvar _metaStateActions = __webpack_require__(8527);\n\nvar _reactSortableHoc = __webpack_require__(3350);\n\nvar _metaSubmit = __webpack_require__(4717);\n\nvar _deleteAllMeta = __webpack_require__(7209);\n\nvar _reactToastify = __webpack_require__(9249);\n\nvar _Spinner = __webpack_require__(7410);\n\nvar _Spinner2 = _interopRequireDefault(_Spinner);\n\nvar _Layout = __webpack_require__(3067);\n\nvar _Layout2 = _interopRequireDefault(_Layout);\n\nvar _ActionsBar = __webpack_require__(3700);\n\nvar _ActionsBar2 = _interopRequireDefault(_ActionsBar);\n\nvar _Breadcrumbs = __webpack_require__(5827);\n\nvar _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);\n\nvar _Meta = __webpack_require__(7975);\n\nvar _Meta2 = _interopRequireDefault(_Meta);\n\nvar _Modal = __webpack_require__(2651);\n\nvar _Modal2 = _interopRequireDefault(_Modal);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar TaxonomyMeta = function TaxonomyMeta() {\n\n    // manage global state\n    var _useParams = (0, _reactRouterDom.useParams)(),\n        taxonomy = _useParams.taxonomy;\n\n    var dispatch = (0, _reactRedux.useDispatch)();\n\n    var _useSelector = (0, _reactRedux.useSelector)(function (state) {\n        return state.metaStateReducer;\n    }),\n        boxes = _useSelector.boxes,\n        fields = _useSelector.fields,\n        values = _useSelector.values,\n        isSaved = _useSelector.isSaved,\n        isValid = _useSelector.isValid,\n        saveLoading = _useSelector.loading,\n        saveErrors = _useSelector.errors,\n        success = _useSelector.success;\n\n    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {\n        return state.fetchMetaReducer;\n    }),\n        loading = _useSelector2.loading,\n        fetched = _useSelector2.fetched;\n\n    // manage local state\n\n\n    var didMountRef = (0, _react.useRef)(false);\n\n    var _useUnsavedChangesWar = (0, _useUnsavedChangesWarning2.default)(),\n        _useUnsavedChangesWar2 = _slicedToArray(_useUnsavedChangesWar, 3),\n        Prompt = _useUnsavedChangesWar2[0],\n        setDirty = _useUnsavedChangesWar2[1],\n        setPristine = _useUnsavedChangesWar2[2];\n\n    var _useState = (0, _react.useState)(false),\n        _useState2 = _slicedToArray(_useState, 2),\n        modalVisible = _useState2[0],\n        setModalVisible = _useState2[1];\n\n    // set page meta title\n\n\n    (0, _react.useEffect)(function () {\n        (0, _misc.metaTitle)(\"ACPT - taxonomy meta\" + (isSaved ? '' : '*'));\n        if (!isSaved) {\n            setDirty();\n        }\n    }, [isSaved]);\n\n    // fetching data and\n    // populate the UI\n    (0, _react.useEffect)(function () {\n        dispatch((0, _fetchMeta.fetchMeta)(_metaTypes.metaTypes.TAXONOMY, taxonomy));\n    }, [saveLoading]);\n\n    // sortable\n    var onSortEnd = function onSortEnd(_ref) {\n        var oldIndex = _ref.oldIndex,\n            newIndex = _ref.newIndex;\n\n        dispatch((0, _metaStateActions.setBoxes)((0, _reactSortableHoc.arrayMove)(boxes, oldIndex, newIndex)));\n    };\n\n    // handle data submit\n    var handleSubmit = function handleSubmit() {\n        dispatch((0, _metaSubmit.metaSubmit)(values));\n        dispatch((0, _metaStateActions.setStatusSaved)());\n        setPristine();\n    };\n\n    var handleDeleteAll = function handleDeleteAll() {\n        dispatch((0, _deleteAllMeta.deleteAllMeta)(_metaTypes.metaTypes.TAXONOMY, taxonomy));\n        dispatch((0, _metaStateActions.setStatusSaved)());\n        setPristine();\n    };\n\n    // handle form submission outcome\n    (0, _react.useEffect)(function () {\n        if (didMountRef.current) {\n            if (!saveLoading) {\n                if (success) {\n                    setPristine();\n                    _reactToastify.toast.success(\"Taxonomy meta successfully saved\");\n                }\n\n                if (saveErrors.length > 0) {\n                    saveErrors.map(function (error) {\n                        _reactToastify.toast.error(error);\n                    });\n                }\n            }\n        } else {\n            didMountRef.current = true;\n        }\n    }, [saveLoading]);\n\n    if (loading) {\n        return wp.element.createElement(_Spinner2.default, null);\n    }\n\n    var renderDeleteButton = wp.element.createElement(\n        _react2.default.Fragment,\n        null,\n        wp.element.createElement(\n            _Modal2.default,\n            { title: \"Confirm deleting all\", visible: modalVisible },\n            wp.element.createElement(\n                \"p\",\n                null,\n                \"Are you sure?\"\n            ),\n            wp.element.createElement(\n                \"p\",\n                null,\n                wp.element.createElement(\n                    \"a\",\n                    {\n                        href: \"#\",\n                        className: \"acpt-btn acpt-btn-primary\",\n                        onClick: function onClick(e) {\n                            e.preventDefault();\n                            setModalVisible(!modalVisible);\n                            handleDeleteAll();\n                        }\n                    },\n                    \"Yes\"\n                ),\n                \"\\xA0\",\n                wp.element.createElement(\n                    \"a\",\n                    {\n                        href: \"#\",\n                        className: \"acpt-btn acpt-btn-primary-o\",\n                        onClick: function onClick(e) {\n                            e.preventDefault();\n                            setModalVisible(!modalVisible);\n                        }\n                    },\n                    \"No\"\n                )\n            )\n        ),\n        wp.element.createElement(\n            \"button\",\n            {\n                onClick: function onClick(e) {\n                    e.preventDefault();\n                    setModalVisible(!modalVisible);\n                },\n                type: \"submit\",\n                className: \"acpt-btn acpt-btn-danger\"\n            },\n            \"Delete all\"\n        )\n    );\n\n    var buttons = wp.element.createElement(\n        _react2.default.Fragment,\n        null,\n        wp.element.createElement(\n            \"a\",\n            {\n                href: \"#\",\n                onClick: function onClick(e) {\n                    e.preventDefault();\n                    dispatch((0, _metaStateActions.createBox)(_metaTypes.metaTypes.TAXONOMY, taxonomy));\n                },\n                className: \"acpt-btn acpt-btn-primary-o\"\n            },\n            \"Add meta box\"\n        ),\n        boxes.length > 0 ? wp.element.createElement(\n            _react2.default.Fragment,\n            null,\n            wp.element.createElement(\n                \"button\",\n                {\n                    disabled: !isValid,\n                    onClick: function onClick(e) {\n                        e.preventDefault();\n                        handleSubmit();\n                    },\n                    type: \"submit\",\n                    className: \"acpt-btn acpt-btn-primary\"\n                },\n                \"Save\"\n            ),\n            renderDeleteButton\n        ) : wp.element.createElement(\n            _react2.default.Fragment,\n            null,\n            fetched.length > 0 && renderDeleteButton\n        )\n    );\n\n    return wp.element.createElement(\n        _Layout2.default,\n        null,\n        wp.element.createElement(_ActionsBar2.default, {\n            title: taxonomy + \" meta boxes\",\n            actions: buttons\n        }),\n        wp.element.createElement(\n            \"main\",\n            null,\n            wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{\n                    label: \"Registered Taxonomies\",\n                    link: \"/taxonomies\"\n                }, {\n                    label: taxonomy + \" meta boxes\"\n                }] }),\n            Prompt,\n            wp.element.createElement(_Meta2.default, {\n                belongsTo: _metaTypes.metaTypes.TAXONOMY,\n                find: taxonomy,\n                boxes: boxes,\n                fields: fields,\n                onSortEnd: onSortEnd,\n                values: values\n            })\n        )\n    );\n};\n\nexports.default = TaxonomyMeta;\n\n//# sourceURL=webpack://advanced-custom-post-type-lite/./assets/src/App/components/pages/TaxonomyMeta/index.js?");

/***/ })

}]);