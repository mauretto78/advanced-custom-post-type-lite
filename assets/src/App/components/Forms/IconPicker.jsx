import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import Button from "../Button";
import {styleVariants} from "../../constants/styles";
import DashiconSelector from "../DashiconSelector";
import Modal from "../../components/Modal";
import ElementIcon from "../ElementIcon";
import {get} from 'react-hook-form';

const IconPicker = ({callback, id, validate, register, description, defaultValue, errors}) => {

    const error = get(errors, id);
    const [icon, setIcon] = useState(defaultValue);
    const [modalVisible, setModalVisible] = useState(false);
    const [iconPicker, setIconPicker] = useState(null);

    const handleCallback = (value) => {
        setIcon(value);
        callback(value);
        setModalVisible(false);
    };
    
    useEffect(() => {
        if(defaultValue !== null){
            setIcon(defaultValue);
        }
    }, [defaultValue]);

    return (
        <React.Fragment>
            {modalVisible && (
                <Modal
                    title={useTranslation("Choose icon")}
                    visible={modalVisible}
                    testId={id}
                >
                    <div className="text-left">
                        <label className="form-label" htmlFor="icon-picker">
                            {useTranslation("Select icon type from the list")}
                        </label>
                        <select
                            data-cy="select-icon"
                            onChange={(e)=>{
                                e.preventDefault();
                                e.stopPropagation();
                                setIconPicker(e.currentTarget.value);
                            }}
                            defaultValue={iconPicker}
                            className="form-control"
                            id="icon-picker"
                        >
                            <option value="">{useTranslation("--Select--")}</option>
                            <option value="dashicon">{useTranslation("Select a Dashicon")}</option>
                            <option value="image">{useTranslation("Upload an icon image")}</option>
                        </select>
                    </div>
                    {iconPicker && (
                        <div className="mt-8">
                            <DashiconSelector
                                type={iconPicker}
                                defaultIcon={icon}
                                callback={handleCallback}
                            />
                        </div>
                    )}
                </Modal>
            )}

            <div className="flex-center s-8">
                {icon && (
                    <ElementIcon value={icon} />
                )}
                <input
                    id={id}
                    name={id}
                    type="text"
                    data-cy="input-icon"
                    value={icon ? icon : ''}
                    className={`hidden`}
                    {...register(id, validate)}
                />
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModalVisible(!modalVisible);
                    }}
                    style={styleVariants.SECONDARY}
                    size="sm"
                    testId={id}
                >
                    {useTranslation("Choose icon")}
                </Button>
            </div>
            {description && (
                <div className="form-description">{description}</div>
            )}
            {error && <div data-cy="input-error-icon" className="invalid-feedback">{error.message}</div>}
        </React.Fragment>
    );
};

IconPicker.propTypes = {
    id: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    description: PropTypes.string,
    callback: PropTypes.func,
    validate: PropTypes.func,
    register: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,


};

export default IconPicker;