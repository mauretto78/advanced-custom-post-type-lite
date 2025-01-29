import React from 'react';
import {Icon} from "@iconify/react";
import ButtonGroup from "../../components/ButtonGroup";
import {localStorageVars} from "../../constants/localStorage";
import PropTypes from 'prop-types';

const SwitchView = ({view, setView, localStorageKey, choices}) => {

    let buttons = [];

    choices.map(c => {
        switch (c) {
            case "list":
                buttons.push(<button data-cy="list-view" data-view="list" type="button" onClick={() => handleSwitchView('list')}><Icon icon="bx:list-ul" width={18} /></button>);
                break;

            case "accordion":
                buttons.push(<button data-cy="accordion-view" data-view="accordion" type="button" onClick={() => handleSwitchView('accordion')}><Icon icon="nimbus:accordion" width={18} /></button>);
                break;

            case "tabular":
                buttons.push(<button data-cy="tabular-view" data-view="tabular" type="button" onClick={() => handleSwitchView('tabular')}><Icon icon="bx:table" width={18} /></button>);
                break;
        }
    });

    /**
     *
     * @return {number}
     */
    const getActivetBtn = () => {
        switch (view) {
            case "list":
                return 0;

            case "tabular":
                return 1;

            case "accordion":
                return 2;
        }
    };

    const handleSwitchView = (v) => {
        setView(v);
        const savedSwitchView = localStorage.getItem(localStorageVars.META_VIEW) ? JSON.parse(localStorage.getItem(localStorageVars.META_VIEW)).filter((i) => i.id !== localStorageKey) : [];
        const newSwitchItem = {
            id: localStorageKey,
            view: v,
        };

        savedSwitchView.push(newSwitchItem);

        localStorage.setItem(localStorageVars.META_VIEW, JSON.stringify(savedSwitchView));
    };

    return (
        <ButtonGroup
            activeBtn={view}
            buttons={buttons}
        />
    );
};

SwitchView.propTypes = {
    localStorageKey: PropTypes.string.isRequired,
    setView: PropTypes.func.isRequired,
    view: PropTypes.number.isRequired,
    choices: PropTypes.array.isRequired,
};

export default SwitchView;