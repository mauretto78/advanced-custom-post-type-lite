import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';
import {isArray} from '../../utils/objects';
import useTranslation from "../../hooks/useTranslation";
import {likeThat} from "../../utils/strings";
import {sizes} from "../../constants/forms.jsx";
import {selectValuesPropType} from "../../constants/propShapes.jsx";

const SelectMulti = ({size= 'default', placeholder, id, disabled = false, defaultValue, description, values, validate, register, errors, setValue, clearErrors, maxItems}) => {

    const error = get(errors, id);

    const [currentValues, setCurrentValues] = useState((defaultValue && isArray(defaultValue)) ? defaultValue : []);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const triggerRef = useRef();

    // Escape-to-close, focus restored to the trigger — same pattern as
    // Modal/DropdownMenu. Scoped to only listen while open.
    useEffect(() => {
        if(!dropdownOpen){
            return;
        }

        const handleKeyDown = (e) => {
            if(e.key === 'Escape'){
                e.stopPropagation();
                setDropdownOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [dropdownOpen]);

    /**
     *
     * @return {*}
     */
    const renderItems = () => {

        try {
            if(currentValues && isArray(currentValues) && currentValues.length > 0){
                return (
                    <React.Fragment>
                        {currentValues && isArray(currentValues) && currentValues.map((value) => {

                            /**
                             *
                             * @return {*}
                             */
                            const renderLabel = () => {

                                const filterValue = values.filter(v => {

                                    if(v.options){
                                        const filterOptValue = v.options.filter(o => o.value.toString() === value.toString());

                                        return filterOptValue.length === 1;
                                    }

                                    return v.value === value;
                                });

                                if(filterValue?.length === 1){
                                    if(filterValue[0].options){
                                        const filterOptValue = filterValue[0].options.filter(o => o.value.toString() === value.toString());

                                        if(filterOptValue?.length === 1){
                                            return filterOptValue[0].label;
                                        }
                                    }

                                    return filterValue[0].label;
                                }

                                return value;
                            };

                            return (
                                <span key={value} className="item">
                                    <span className={`label font-size-${size}`}>
                                        {renderLabel()}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn-reset close-item"
                                        aria-label={useTranslation("Remove item")}
                                        onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            if(!disabled){
                                                setCurrentValues((val) => {
                                                    const newArray = val.filter(v => v !== value);
                                                    setValue(id, newArray);
                                                    setDropdownOpen(false);

                                                    if(error){
                                                        clearErrors(id);
                                                    }

                                                    return newArray;
                                                });
                                            }
                                        }}
                                    >
                                        &times;
                                </button>
                            </span>
                            );
                        })}
                    </React.Fragment>
                );
            }

            return <span>{placeholder ? placeholder : useTranslation('Select items')}</span>;
        } catch (e) {
            return <span>{placeholder ? placeholder : useTranslation('Select items')}</span>;
        }
    };

    /**
     *
     * @return {*}
     */
    const renderClearAll = () =>  {
        return (
            <button
                type="button"
                className="btn-reset close"
                data-testid={`select-multi-clear-all-${id}`}
                aria-label={useTranslation("Clear all")}
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();

                    if(!disabled){
                        setCurrentValues((val) => {
                            setValue(id, []);
                            clearErrors(id);
                            setDropdownOpen(false);

                            return [];
                        });
                    }
                }}
            >
                &times;
            </button>
        );
    };

    const flattenValues = (items) => {
        return items.reduce((acc, item) => {
            if(item.options){
                return acc.concat(flattenValues(item.options));
            }

            return acc.concat(item.value);
        }, []);
    };

    const handleSelectAll = () => {
        setCurrentValues(() => {

            const allValues = flattenValues(values);

            setValue(id, allValues);
            clearErrors(id);
            setDropdownOpen(false);

            return allValues;
        });
    };

    /**
     *
     * @return {*}
     */
    const renderDropdown = () => {

        if(maxItems && currentValues?.length >= maxItems){
            return null;
        }

        const elements = renderListElements(values);

        if(elements?.length === 0){
            return (
                <div
                    data-testid={`select-multi-no-items-${id}`}
                    className="select-items"
                >
                    <div className="p-24">
                        {useTranslation("No items")}
                    </div>
                </div>
            );
        }

        return (
            <div
                data-testid={`select-multi-items-${id}`}
                className="select-items"
            >
                <div className="search-box">
                    <input
                        type="text"
                        className={`form-control ${size}`}
                        placeholder={useTranslation("Filter items")}
                        defaultValue={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>
                <ul
                    role="listbox"
                    className={`select-items-list font-size-${size}`}
                >
                    {elements}
                </ul>
                {!maxItems && (
                    <div className={`select-all font-size-${size}`}>
                        <button
                            type="button"
                            className="btn-reset"
                            onClick={e => {
                                e.preventDefault();
                                handleSelectAll();
                            }}
                        >
                            {useTranslation("Select all")}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    /**
     *
     * @param elements
     */
    const renderListElements = (elements) => {
        return elements
            .filter((element) => {
                if(searchTerm !== '' && element.value && element.label){
                    return (
                        likeThat(element.value, searchTerm) ||
                        likeThat(element.label, searchTerm)
                    );
                }

                return true;
            })
            .filter((element) => {
                if(element.value){
                    return currentValues.findIndex(v => v === element.value) === -1;
                }

                return true;
            })
            .map((element, index) => {

                if(element.options){
                    return (
                        <React.Fragment key={element.label ?? index}>
                            <li className="optgroup">
                                {element.label}
                            </li>
                            {renderListElements(element.options)}
                        </React.Fragment>
                    );
                }

                const selectItem = () => {
                    setCurrentValues((val) => {
                        const newArray = [...val, element.value];
                        setValue(id, newArray);
                        setDropdownOpen(!dropdownOpen);

                        if(error){
                            clearErrors(id);
                        }

                        return newArray;
                    });
                };

                return (
                    <li
                        key={index}
                        role="option"
                        aria-selected={false}
                        tabIndex={0}
                        className="select-item"
                        onClick={e => {
                            // CardRow wraps this in a native <label> for a11y; without
                            // preventDefault the browser also fires a synthetic click on
                            // the first labelable descendant (e.g. the search input),
                            // corrupting this selection. See SelectMulti's other button
                            // handlers (clear-all, select-all, chip-remove) for the same
                            // pattern.
                            e.preventDefault();
                            e.stopPropagation();
                            selectItem();
                        }}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' || e.key === ' '){
                                e.preventDefault();
                                selectItem();
                            }
                        }}
                    >
                        {element.label}
                    </li>
                );
            })
    };

    return (
        <React.Fragment>
            <div
                className="acpt-select-multi"
                data-testid={`select-multi-${id}`}
            >
                <input
                    id={id}
                    name={id}
                    type="hidden"
                    defaultValue={currentValues}
                    data-testid={`select-multi-${id}-input`}
                    {...register(id, validate)}
                />
                <div
                    ref={triggerRef}
                    className={`placeholder ${size} ${error ? 'has-errors': ''} ${disabled ? 'disabled' : ''}`}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                    onClick={e => {
                        // See the item onClick below: CardRow's native <label> wrapper
                        // forwards an extra synthetic click to the first labelable
                        // descendant (e.g. the "Clear all" button) unless prevented.
                        e.preventDefault();
                        e.stopPropagation();

                        if(!disabled){
                            setDropdownOpen(!dropdownOpen);
                        }
                    }}
                    onKeyDown={(e) => {
                        if((e.key === 'Enter' || e.key === ' ') && !disabled){
                            e.preventDefault();
                            setDropdownOpen(!dropdownOpen);
                        }
                    }}
                >
                    <div data-testid={`select-multi-${id}-items`} className="items">{renderItems()}</div>
                    {!dropdownOpen && currentValues?.length > 0 && renderClearAll()}
                    <div className="divider"/>
                    <div className="caret"/>
                </div>
                {dropdownOpen && renderDropdown()}
            </div>
            {error && <div className="invalid-feedback">{error.message}</div>}
            {description && (
                <div className="form-description">{description}</div>
            )}
        </React.Fragment>
    );
};

SelectMulti.propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.oneOf(sizes),
    placeholder: PropTypes.string,
    // a caller may still hold a legacy single-string value (e.g. a
    // ConditionalRenderingElement value before it's normalized to an
    // array) -- isArray() above already falls back to [] for that case.
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    description: PropTypes.string,
    disabled: PropTypes.bool,
    values: selectValuesPropType.isRequired,
    validate: PropTypes.object,
    register: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    maxItems: PropTypes.number
};

export default SelectMulti;