import {useEffect} from "react";

export const useConfirmTabClose = (isUnsafeTabClose) => {

    const confirmationMessage = 'You have unsaved changes. Continue?';

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isUnsafeTabClose) {
                event.returnValue = confirmationMessage;
                return confirmationMessage;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () =>
            window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isUnsafeTabClose]);
};