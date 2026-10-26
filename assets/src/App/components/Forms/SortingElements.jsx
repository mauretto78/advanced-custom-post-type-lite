import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import InputHidden from "./InputHidden.jsx";
import useTranslation from "../../hooks/useTranslation.jsx";

const SortingElements = ({id, register, setValue, defaultValue, description}) => {

    const orderByRef = useRef(null);
    const orderDirectionRef = useRef(null);

    const orderByValues = [
        {label: 'Date', value: 'date'},
        {label: 'Menu Order', value: 'menu_order'},
        {label: 'Title', value: 'title'},
        {label: 'Modified', value: 'modified'},
        {label: 'Random', value: 'rand'},
        {label: 'ID', value: 'ID'},
        {label: 'Author', value: 'author'},
        {label: 'Comment Count', value: 'comment_count'},
        {label: 'Name', value: 'name'},
        {label: 'Parent', value: 'parent'},
    ];

    const orderDirectionValues = [
        {label: 'Ascending', value: 'ASC'},
        {label: 'Descending', value: 'DESC'},
    ];

    const onChangeCapture = () => {
        const orderBy = orderByRef.current.value;
        const direction = orderDirectionRef.current.value;

        if(orderDirectionRef && direction){
            setValue(id, {
                orderBy: orderBy,
                direction: direction,
            });
        }
    };

    return (
        <React.Fragment>
            <InputHidden
                register={register}
                id={id}
                value={defaultValue ? JSON.stringify(defaultValue) : ''}
            />
            <div className="i-flex-center s-8 w-100">
                <div className="acpt-select w-50">
                    <select
                        ref={orderByRef}
                        data-testid={`orderBy-${id}`}
                        className="form-control"
                        onChangeCapture={onChangeCapture}
                        defaultValue={defaultValue && defaultValue.orderBy ? defaultValue.orderBy : 'date'}
                    >
                        <option value="">{useTranslation("Select")}</option>
                        {orderByValues.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {useTranslation(item.label)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="acpt-select w-50">
                    <select
                        ref={orderDirectionRef}
                        data-testid={`direction-${id}`}
                        className="form-control"
                        onChangeCapture={onChangeCapture}
                        defaultValue={defaultValue && defaultValue.direction ? defaultValue.direction : 'DESC'}
                    >
                        <option value="">{useTranslation("Select")}</option>
                        {orderDirectionValues.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {useTranslation(item.label)}
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
}

SortingElements.propTypes = {
    id: PropTypes.string.isRequired,
    defaultValue: PropTypes.shape({
        orderBy: PropTypes.string,
        direction: PropTypes.string,
    }),
    description: PropTypes.string,
    setValue: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
};

export default SortingElements;