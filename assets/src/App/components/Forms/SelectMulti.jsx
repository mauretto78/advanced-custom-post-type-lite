import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';
import {isArray} from '../../utils/objects';
import useTranslation from "../../hooks/useTranslation";
import {likeThat} from "../../utils/strings";

const SelectMulti = ({placeholder, id, disabled = false, defaultValue, description, values, validate, register, errors, setValue, clearErrors, maxItems}) => {

    const error = get(errors, id);

    const [currentValues, setCurrentValues] = useState((defaultValue && isArray(defaultValue)) ? defaultValue : []);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

                                if(filterValue.length === 1){
                                    if(filterValue[0].options){
                                        const filterOptValue = filterValue[0].options.filter(o => o.value.toString() === value.toString());

                                        if(filterOptValue.length === 1){
                                            return filterOptValue[0].label;
                                        }
                                    }

                                    return filterValue[0].label;
                                }

                                return value;
                            };

                            return (
                                <span className="item">
                                <span className="label">
                                    {renderLabel()}
                                </span>
                                <a
                                    href="#"
                                    className="close-item"
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
                                </a>
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
            <a
                href="#"
                className="close"
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
            </a>
        );
    };

    /**
     *
     * @return {*}
     */
    const renderDropdown = () => {

        if(maxItems && currentValues.length >= maxItems){
            return null;
        }

        return (
            <div className="select-items">
                <div className="search-box">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={useTranslation("Filter items")}
                        defaultValue={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>
                <ul
                    tabIndex={0}
                    className="select-items-list"
                >
                    {renderListElements(values)}
                </ul>
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
                        <React.Fragment>
                            <li className="optgroup">
                                {element.label}
                            </li>
                            {renderListElements(element.options)}
                        </React.Fragment>
                    );
                }

                return (
                    <li
                        key={index}
                        tabIndex={index+1}
                        className="select-item"
                        onClick={() => {
                            setCurrentValues((val) => {
                                const newArray = [...val, element.value];
                                setValue(id, newArray);
                                setDropdownOpen(!dropdownOpen);

                                if(error){
                                    clearErrors(id);
                                }

                                return newArray;
                            });
                        }}
                    >
                        {element.label}
                    </li>
                );
            })
    };

    return (
        <React.Fragment>
            <div className="acpt-select-multi">
                <input
                    id={id}
                    name={id}
                    type="hidden"
                    defaultValue={currentValues}
                    {...register(id, validate)}
                />
                <div
                    className={`placeholder ${error ? 'has-errors': ''} ${disabled ? 'disabled' : ''}`}
                    onClick={() => {
                        if(!disabled){
                            setDropdownOpen(!dropdownOpen);
                        }
                    }}
                >
                    <div className="items">{renderItems()}</div>
                    {!dropdownOpen && currentValues.length > 0 && renderClearAll()}
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
    placeholder: PropTypes.string,
    defaultValue: PropTypes.array,
    description: PropTypes.string,
    disabled: PropTypes.bool,
    values: PropTypes.array.isRequired,
    validate: PropTypes.func,
    register: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,
    maxItems: PropTypes.number
};

export default SelectMulti;