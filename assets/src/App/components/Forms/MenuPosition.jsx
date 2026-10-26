import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import InputHidden from "./InputHidden";
import {sizes} from "../../constants/forms.jsx";
import {stripHtml} from "../../utils/strings.jsx";

const MenuPosition = ({id, size = "default", register, setValue, defaultValue, description}) => {

    const positionRef = useRef(null);
    const menuRef = useRef(null);

    const onChangeCapture = () => {
        const position = positionRef.current.value;
        const menu = menuRef.current.value;

        if(position && menu){
            const newPosition = (position === 'after') ? (parseInt(menu) + 1) : (parseInt(menu) - 1);
            setValue(id, newPosition);
        }
    };

    /**
     *
     * @return {[]}
     */
    const menuItems = () => {

        let menu = [];

        for (const [key, value] of Object.entries(document.globals.menu)) {
            menu.push({
                label: (value[0] !== '' ? stripHtml(value[0]) : '----'),
                value: key
            });
        }

        return menu;
    };

    /**
     *
     * @return {{position: null, menu: null}}
     */
    const defaultPositionValues = () => {

        if(!defaultValue){
            return {
                position: null,
                menu: null
            }
        }

        const defaultValueInt = parseInt(defaultValue);

        for (const [key, values] of Object.entries(document.globals.menu)) {

            if((parseInt(key) + 1) === defaultValueInt){
                return {
                    position: 'after',
                    menu: key
                }
            }

            if((parseInt(key) - 1) === defaultValueInt){
                return {
                    position: 'before',
                    menu: key
                }
            }
        }

        const menuItems = Object.keys(document.globals.menu);
        const menuIndex = menuItems.findIndex((i) => parseInt(i) === parseInt(defaultValue));

        if(Object.entries(document.globals.menu)[menuIndex+1]){
            return {
                position: 'before',
                menu: Object.entries(document.globals.menu)[menuIndex+1][0]
            }
        }

        if(Object.entries(document.globals.menu)[menuIndex-1]){
            return {
                position: 'after',
                menu: Object.entries(document.globals.menu)[menuIndex-1][0]
            }
        }

        return {
            position: null,
            menu: null
        }
    };

    return (
        <React.Fragment>
            <InputHidden
                register={register}
                id={id}
                value={defaultValue}
            />
            <div className="i-flex-center s-8 w-100">
                <div className={`acpt-select w-50 ${size}`}>
                    <select
                        ref={positionRef}
                        data-testid={`position-${id}`}
                        className={`form-control ${size}`}
                        onChangeCapture={onChangeCapture}
                        defaultValue={defaultPositionValues().position}
                    >
                        <option value="">{useTranslation("Select")}</option>
                        <option value="after">{useTranslation("After")}</option>
                        <option value="before">{useTranslation("Before")}</option>
                    </select>
                </div>
                <div className={`acpt-select w-50 ${size}`}>
                    <select
                        ref={menuRef}
                        data-testid={`menu-${id}`}
                        className={`form-control ${size}`}
                        onChangeCapture={onChangeCapture}
                        defaultValue={defaultPositionValues().menu}
                    >
                        <option value="">{useTranslation("Select")}</option>
                        {menuItems().map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {description && (
                <div className="form-description">{description}</div>
            )}
        </React.Fragment>
    );
};

MenuPosition.propTypes = {
    size: PropTypes.oneOf(sizes),
    id: PropTypes.string.isRequired,
    // A round trip through RHF's native hidden <input> (InputHidden below)
    // returns a string even though it was seeded as a number -- comparisons
    // in defaultPositionValues() above coerce with parseInt().
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    description: PropTypes.string,
    setValue: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
};

export default MenuPosition;