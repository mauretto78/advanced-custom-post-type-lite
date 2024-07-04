import useTranslation from "../../../../hooks/useTranslation";

export const deviceManager = () => {

    return {
        devices: [
            {
                name: useTranslation('Desktop'),
                width: '', // default size
            },
            {
                name: useTranslation('Tablet'),
                width: '678px', // this value will be used on canvas width
                widthMedia: '800px', // this value will be used in CSS @media
            },
            {
                name: useTranslation('Mobile'),
                width: '320px', // this value will be used on canvas width
                widthMedia: '480px', // this value will be used in CSS @media
            }
        ]
    };
};