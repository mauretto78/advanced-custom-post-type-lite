import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import Select from "./Select";
import InputHidden from "./InputHidden";

const MenuPosition = ({id, register, setValue, defaultValue, description}) => {

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

        const stripHtml = (label) => {

            const stripped = label.replace(/(<([^>]+)>)/gi, "");

            if(label.length !== stripped.length){
                return label.split(" ")[0];
            }

            return label;
        };

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

        for (const [key, values] of Object.entries(document.globals.menu)) {

            if((parseInt(key) + 1) === defaultValue){
                return {
                    position: 'after',
                    menu: key
                }
            }

            if((parseInt(key) - 1) === defaultValue){
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
            <div className="i-flex-center s-8">
                <div className="acpt-select">
                    <select
                        ref={positionRef}
                        data-cy={`position-${id}`}
                        className="form-control"
                        onChangeCapture={onChangeCapture}
                        defaultValue={defaultPositionValues().position}
                    >
                        <option value="">{useTranslation("Select")}</option>
                        <option value="after">{useTranslation("After")}</option>
                        <option value="before">{useTranslation("Before")}</option>
                    </select>
                </div>
                <div className="acpt-select">
                    <select
                        ref={menuRef}
                        data-cy={`menu-${id}`}
                        className="form-control"
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
    id: PropTypes.string.isRequired,
    defaultValue: PropTypes.number,
    description: PropTypes.string,
    setValue: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
};

export default MenuPosition;