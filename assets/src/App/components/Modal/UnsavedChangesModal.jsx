import React from 'react';
import PropTypes from 'prop-types';
import {useBlocker} from "react-router-dom";
import Modal from "./index";
import Button from "../Button";
import {styleVariants} from "../../constants/styles";
import useTranslation from "../../hooks/useTranslation";

/**
 * Asks before leaving the page in-app (a link, another group, the browser's back button)
 * while `when` is true. `useConfirmTabClose` only covers closing or reloading the tab.
 * A change of the query string alone (a tab, a filter) is not leaving the page.
 *
 * The router can only block a navigation it makes itself: plain `<a href="#/...">` links
 * go through it thanks to useRouterHashLinks (RouterRoot), or blocking fails silently.
 */
const UnsavedChangesModal = ({when}) => {

    const blocker = useBlocker(({currentLocation, nextLocation}) =>
        when && currentLocation.pathname !== nextLocation.pathname
    );

    const isBlocked = blocker.state === 'blocked';

    const stay = () => {
        if (blocker.state === 'blocked') {
            blocker.reset();
        }
    };

    const leave = () => {
        if (blocker.state === 'blocked') {
            blocker.proceed();
        }
    };

    return (
        <Modal
            title={useTranslation("Unsaved changes")}
            size="small"
            visible={isBlocked}
            setVisible={(visible) => !visible && stay()}
            testId="unsaved-changes"
            buttons={[
                <Button
                    key="stay"
                    type="button"
                    testId="unsaved-changes-stay"
                    style={styleVariants.PRIMARY}
                    size="sm"
                    icon="bx:arrow-back"
                    onClick={stay}
                >
                    {useTranslation("Stay on this page")}
                </Button>,
                <Button
                    key="leave"
                    type="button"
                    testId="unsaved-changes-leave"
                    style={styleVariants.OUTLINED_DANGER}
                    size="sm"
                    icon="bx:log-out"
                    onClick={leave}
                >
                    {useTranslation("Leave without saving")}
                </Button>,
            ]}
        >
            {useTranslation("You have unsaved changes. If you leave this page, they will be lost.")}
        </Modal>
    );
};

UnsavedChangesModal.propTypes = {
    when: PropTypes.bool.isRequired,
};

export default UnsavedChangesModal;
