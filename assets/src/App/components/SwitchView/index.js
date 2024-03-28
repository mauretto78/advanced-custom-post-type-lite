import React from 'react';
import {Icon} from "@iconify/react";
import ButtonGroup from "../../components/ButtonGroup";
import {localStorageVars} from "../../constants/localStorage";
import PropTypes from 'prop-types';

const SwitchView = ({view, setView, localStorageKey}) => {

    const handleSwitchView = (view) => {
        setView(view);
        const savedSwitchView = localStorage.getItem(localStorageVars.META_VIEW) ? JSON.parse(localStorage.getItem(localStorageVars.META_VIEW)).filter((i) => i.id !== localStorageKey) : [];
        const newSwitchItem = {
            id: localStorageKey,
            view: view,
        };

        savedSwitchView.push(newSwitchItem);

        localStorage.setItem(localStorageVars.META_VIEW, JSON.stringify(savedSwitchView));
    };

    return (
        <ButtonGroup
            activeBtn={view === 'list' ? 0 : 1}
            buttons={[
                <button data-cy="list-view" type="button" onClick={() => handleSwitchView('list')}><Icon icon="bx:list-ul" width={18} /></button>,
                <button data-cy="tabular-view" type="button" onClick={() => handleSwitchView('tabular')}><Icon icon="bx:table" width={18} /></button>,
            ]}
        />
    );
};

SwitchView.propTypes = {
    localStorageKey: PropTypes.string.isRequired,
    setView: PropTypes.func.isRequired,
    view: PropTypes.number.isRequired,
};

export default SwitchView;