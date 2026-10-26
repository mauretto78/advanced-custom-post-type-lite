import React, {useCallback, useId, useLayoutEffect, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {DndContext, rectIntersection, pointerWithin} from '@dnd-kit/core';
import {Icon} from "@iconify/react";
import {Group, Panel, Separator, usePanelRef} from 'react-resizable-panels';
import useUIPreference from "../../hooks/useUIPreference.jsx";
import CanvasUIPreferences from "./CanvasUIPreferences.jsx";
import {readSidebarWidth, resolveSidebarWidth, writeSidebarWidth} from "./sidebarSize.jsx";
import CanvasSidebarContext from "./CanvasSidebarContext.jsx";
import useTranslation from "../../hooks/useTranslation.jsx";
import {dndAnnouncementsShape, extraOptionShape} from "../../constants/propShapes.jsx";

// Width of the strip left in place of a collapsed sidebar (holds the expand button).
export const SIDEBAR_COLLAPSED_SIZE = 48;

// Chevrons point to where the sidebar goes when hiding, or comes from when showing.
const toggleIcon = (sidebarPosition, isCollapsed) => {
    const towardsLeft = (sidebarPosition === 'left') !== isCollapsed;

    return towardsLeft ? "bx:chevrons-left" : "bx:chevrons-right";
};

const CanvasLayout = ({
    sensors,
    onDragEnd,
    collisionDetection = rectIntersection,
    announcements,
    sidebar,
    canvas,
    dragOverlay,
    id = 'canvas-layout',
    preferenceId,
    wrapperRef,
    wrapperClassName,
    toolbarRef,
    extraOptions = [],
    sidebarDefaultSize = 450,
    sidebarMinSize = 400,
    sidebarMaxSize = 700,
}) => {
    const resolvedPreferenceId = preferenceId ?? id;

    const {value: noDistractionMode, toggle: toggleNoDistractionMode} = useUIPreference(
        resolvedPreferenceId, 'no_distraction_mode', false
    );

    const {value: sidebarPosition, set: setSidebarPosition} = useUIPreference(
        resolvedPreferenceId, 'sidebar_position', "left"
    );

    const {value: sidebarCollapsed, set: setSidebarCollapsed} = useUIPreference(
        resolvedPreferenceId, 'sidebar_collapsed', false
    );
    const sidebarCollapsedRef = useRef(sidebarCollapsed);
    sidebarCollapsedRef.current = sidebarCollapsed;
    const sidebarContentId = `canvas-sidebar-${useId().replace(/:/g, '')}`;

    // The sidebar width is kept in pixels (not as a % of the layout): it keeps
    // its width when the window resizes and the canvas takes the difference.
    // On mount, a stored width wider than half of the layout is capped, so a
    // width set on a wide monitor doesn't squeeze the canvas on a laptop.
    const innerWrapperRef = useRef(null);
    const sidebarPanelRef = usePanelRef();
    const sidebarWidthRef = useRef(null);
    const lastSidebarPixelsRef = useRef(null);

    if (sidebarWidthRef.current === null) {
        sidebarWidthRef.current = resolveSidebarWidth({
            stored: readSidebarWidth(resolvedPreferenceId),
            defaultSize: sidebarDefaultSize,
            minSize: sidebarMinSize,
            maxSize: sidebarMaxSize,
        });
        lastSidebarPixelsRef.current = sidebarWidthRef.current;
    }

    const setWrapperRef = useCallback((node) => {
        innerWrapperRef.current = node;
        if (wrapperRef) {
            wrapperRef.current = node;
        }
    }, [wrapperRef]);

    useLayoutEffect(() => {
        const capped = resolveSidebarWidth({
            stored: sidebarWidthRef.current,
            defaultSize: sidebarDefaultSize,
            minSize: sidebarMinSize,
            maxSize: sidebarMaxSize,
            groupWidth: innerWrapperRef.current?.clientWidth,
        });

        if (capped !== sidebarWidthRef.current) {
            // the cap is not saved: the user's own width comes back on a wider screen
            lastSidebarPixelsRef.current = capped;
            sidebarWidthRef.current = capped;
            sidebarPanelRef.current?.resize(capped);
        }

        if (sidebarCollapsedRef.current) {
            sidebarPanelRef.current?.collapse();
        }
    }, []);

    // The sidebar sticks below the page header while the canvas scrolls (#1401).
    // The header's height changes with the title and the screen width, so its
    // bottom edge is measured into --canvas-sticky-top instead of hardcoded.
    useLayoutEffect(() => {
        const updateStickyTop = () => {
            const header = document.querySelector('.acpt-header-bottom');
            const wrapper = innerWrapperRef.current;

            if (!wrapper) {
                return;
            }

            const top = header
                ? (parseFloat(getComputedStyle(header).top) || 0) + header.getBoundingClientRect().height
                : 0;

            wrapper.style.setProperty('--canvas-sticky-top', `${Math.round(top)}px`);
        };

        updateStickyTop();
        window.addEventListener('resize', updateStickyTop);

        return () => window.removeEventListener('resize', updateStickyTop);
    }, []);

    // Saved only when the width really changed (a drag on the separator);
    // a collapsed sidebar's strip width is never saved.
    const handleLayoutChanged = () => {
        const pixels = lastSidebarPixelsRef.current;

        if (pixels !== null && pixels > SIDEBAR_COLLAPSED_SIZE + 1 && Math.abs(pixels - sidebarWidthRef.current) > 1) {
            sidebarWidthRef.current = pixels;
            writeSidebarWidth(resolvedPreferenceId, pixels);
        }
    };

    // Reopens at the remembered width: the library's own expand() falls back
    // to the minimum when the sidebar was already collapsed on load.
    const expandSidebar = useCallback(() => {
        if (sidebarCollapsedRef.current) {
            sidebarPanelRef.current?.resize(sidebarWidthRef.current);
            setSidebarCollapsed(false);
        }
    }, [setSidebarCollapsed]);

    const toggleSidebar = () => {
        if (sidebarCollapsed) {
            expandSidebar();
        } else {
            sidebarPanelRef.current?.collapse();
            setSidebarCollapsed(true);
        }
    };

    const sidebarContext = useMemo(
        () => ({isCollapsed: sidebarCollapsed, expand: expandSidebar}),
        [sidebarCollapsed, expandSidebar]
    );

    const tShowSidebar = useTranslation("Show sidebar");
    const tHideSidebar = useTranslation("Hide sidebar");

    const sidebarPanel =
        <Panel
            id={`sidebar-panel-${id}`}
            panelRef={sidebarPanelRef}
            // while collapsed the default is the strip: switching the sidebar
            // side re-registers the panels from their defaults
            defaultSize={sidebarCollapsed ? SIDEBAR_COLLAPSED_SIZE : sidebarWidthRef.current}
            minSize={sidebarMinSize}
            maxSize={sidebarMaxSize}
            collapsible
            collapsedSize={SIDEBAR_COLLAPSED_SIZE}
            groupResizeBehavior="preserve-pixel-size"
            onResize={(size) => {
                lastSidebarPixelsRef.current = size.inPixels;

                // a drag past the minimum collapses the panel (and back): keep the preference in sync
                const collapsed = size.inPixels <= SIDEBAR_COLLAPSED_SIZE + 1;
                if (collapsed !== sidebarCollapsedRef.current) {
                    sidebarCollapsedRef.current = collapsed;
                    setSidebarCollapsed(collapsed);
                }
            }}
        >
            {sidebarCollapsed && (
                <div className={`canvas-sidebar-strip canvas-sidebar-strip--${sidebarPosition}`}>
                    <button
                        type="button"
                        className="btn-reset canvas-sidebar-strip__toggle"
                        aria-label={tShowSidebar}
                        title={tShowSidebar}
                        aria-expanded={false}
                        aria-controls={sidebarContentId}
                        onClick={expandSidebar}
                    >
                        <Icon icon={toggleIcon(sidebarPosition, true)} width={20} />
                    </button>
                </div>
            )}
            {/* kept mounted (search text, open groups survive), but out of the
                tab order and the accessibility tree while collapsed */}
            <div id={sidebarContentId} className="canvas-sidebar-content" hidden={sidebarCollapsed}>
                {sidebar}
            </div>
        </Panel>;

    const canvasSeparator = <Separator><div className="resizer"/></Separator>;

    const canvasPanel = <Panel>
        <div className="canvas with-dots bg-pale-gray" style={{
            minHeight: '300px',
        }}>
            <CanvasUIPreferences
                preferenceId={resolvedPreferenceId}
                toolbarRef={toolbarRef}
                noDistractionMode={noDistractionMode}
                onToggleNoDistraction={toggleNoDistractionMode}
                sidebarPosition={sidebarPosition}
                setSidebarPosition={setSidebarPosition}
                sidebarToggle={{
                    isCollapsed: sidebarCollapsed,
                    onToggle: toggleSidebar,
                    controlsId: sidebarContentId,
                    label: sidebarCollapsed ? tShowSidebar : tHideSidebar,
                    icon: toggleIcon(sidebarPosition, sidebarCollapsed),
                }}
                extraOptions={extraOptions}
            />
            {canvas}
        </div>
    </Panel>;

    return (
        <CanvasSidebarContext.Provider value={sidebarContext}>
            <DndContext
                onDragEnd={onDragEnd}
                collisionDetection={collisionDetection}
                sensors={sensors}
                accessibility={{announcements}}
                autoScroll
            >
                <div
                    id={id}
                    ref={setWrapperRef}
                    className={`canvas-wrapper${noDistractionMode ? ' no-distraction-mode' : ''} ${wrapperClassName ? wrapperClassName : ''}`}
                >
                    <Group onLayoutChanged={handleLayoutChanged}>
                        {sidebarPosition === 'left' ? (
                            <React.Fragment>
                                {sidebarPanel}
                                {canvasSeparator}
                                {canvasPanel}
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {canvasPanel}
                                {canvasSeparator}
                                {sidebarPanel}
                            </React.Fragment>
                        )}
                    </Group>
                </div>
                {dragOverlay}
            </DndContext>
        </CanvasSidebarContext.Provider>
    );
};

CanvasLayout.propTypes = {
    sensors:             PropTypes.array.isRequired,
    onDragEnd:           PropTypes.func.isRequired,
    collisionDetection:  PropTypes.func,
    announcements:       dndAnnouncementsShape,
    sidebar:             PropTypes.node.isRequired,
    canvas:              PropTypes.node.isRequired,
    dragOverlay:         PropTypes.node.isRequired,
    id:                  PropTypes.string,
    preferenceId:        PropTypes.string,
    wrapperRef:          PropTypes.object,
    wrapperClassName:    PropTypes.string,
    toolbarRef:          PropTypes.object,
    extraOptions:        PropTypes.arrayOf(extraOptionShape),
    sidebarDefaultSize:  PropTypes.number,
    sidebarMinSize:      PropTypes.number,
    sidebarMaxSize:      PropTypes.number,
};

export default CanvasLayout;
