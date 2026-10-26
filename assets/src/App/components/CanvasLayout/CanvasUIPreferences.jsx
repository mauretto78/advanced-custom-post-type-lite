import PropTypes from 'prop-types';
import useUIPreference from "../../hooks/useUIPreference.jsx";
import useTranslation from "../../hooks/useTranslation.jsx";
import {Icon} from "@iconify/react";
import IconRadioGroup from "../Forms/IconRadioGroup.jsx";
import {extraOptionShape} from "../../constants/propShapes.jsx";

// Renders a single extra toggle option with its own localStorage state
const ExtraOption = ({preferenceId, option}) => {

    const {value, toggle} = useUIPreference(preferenceId, option.preferenceKey, option.defaultValue);
    // active = feature is "on": for defaultValue=true (e.g. simpleMode), active when !value; for defaultValue=false, active when value
    const isActive = option.defaultValue ? !value : value;

    return (
        <button
            type="button"
            aria-pressed={isActive}
            className={`cursor-pointer element b-rounded bg-white p-space-btn i-flex-center s-8 ${isActive ? 'with-primary-border color-primary' : 'with-border'}`}
            title={option.label}
            onClick={() => {
                toggle();
                option.onToggle?.();
            }}
        >
            <Icon icon={option.icon} width={18} />
            <span className="canvas-toolbar__label">{option.label}</span>
        </button>
    );
};

ExtraOption.propTypes = {
    preferenceId: PropTypes.string,
    option: extraOptionShape.isRequired,
};

const CanvasUIPreferences = ({preferenceId, toolbarRef, noDistractionMode, onToggleNoDistraction, sidebarPosition, setSidebarPosition, sidebarToggle, extraOptions = []}) => {
    const tNoDistraction = useTranslation("No distraction");
    const tSidebarPosition = useTranslation("Sidebar position");

    return (
        <div ref={toolbarRef} className="canvas-toolbar">
            <div className="i-flex-center s-12">
                {sidebarToggle && (
                    <button
                        type="button"
                        aria-expanded={!sidebarToggle.isCollapsed}
                        aria-controls={sidebarToggle.controlsId}
                        title={sidebarToggle.label}
                        className="cursor-pointer element b-rounded bg-white p-space-btn i-flex-center s-8 with-border"
                        onClick={sidebarToggle.onToggle}
                    >
                        <Icon icon={sidebarToggle.icon} width={18} />
                        <span className="canvas-toolbar__label">{sidebarToggle.label}</span>
                    </button>
                )}
                {extraOptions.map(option => (
                    <ExtraOption
                        key={option.id}
                        preferenceId={preferenceId}
                        option={option}
                    />
                ))}
                <button
                    type="button"
                    aria-pressed={noDistractionMode}
                    className={`cursor-pointer element b-rounded bg-white p-space-btn i-flex-center s-8 ${noDistractionMode ? 'with-primary-border color-primary' : 'with-border'}`}
                    title={tNoDistraction}
                    onClick={onToggleNoDistraction}
                >
                    <Icon icon="boxicons:eye" width={18} />
                    <span className="canvas-toolbar__label">{tNoDistraction}</span>
                </button>
            </div>
            <div className="i-flex-center s-8">
                {/* the radio group carries its own aria-label */}
                <div className="canvas-toolbar__label" aria-hidden="true">
                    {tSidebarPosition}
                </div>
                <IconRadioGroup
                    name={`sidebar-position-${preferenceId ?? 'canvas'}`}
                    ariaLabel={tSidebarPosition}
                    value={sidebarPosition}
                    onChange={setSidebarPosition}
                    options={[
                        {value: 'left', icon: 'boxicons:sidebar', label: useTranslation("Sidebar on the left")},
                        {value: 'right', icon: 'boxicons:sidebar-right', label: useTranslation("Sidebar on the right")},
                    ]}
                />
            </div>
        </div>
    );
};

CanvasUIPreferences.propTypes = {
    preferenceId:           PropTypes.string,
    toolbarRef:             PropTypes.object,
    noDistractionMode:      PropTypes.bool.isRequired,
    onToggleNoDistraction:  PropTypes.func.isRequired,
    sidebarPosition:        PropTypes.oneOf(['left', 'right']).isRequired,
    setSidebarPosition:     PropTypes.func.isRequired,
    sidebarToggle:          PropTypes.shape({
        isCollapsed: PropTypes.bool.isRequired,
        onToggle:    PropTypes.func.isRequired,
        controlsId:  PropTypes.string.isRequired,
        label:       PropTypes.string.isRequired,
        icon:        PropTypes.string.isRequired,
    }),
    extraOptions:           PropTypes.arrayOf(extraOptionShape),
};

export default CanvasUIPreferences;
