import {createContext, useContext} from 'react';

/**
 * Lets anything rendered inside a CanvasLayout reach its sidebar, e.g. to
 * reopen a collapsed sidebar when a canvas card is clicked (its settings
 * are shown there). Outside a CanvasLayout every call is a no-op.
 */
const CanvasSidebarContext = createContext({
    isCollapsed: false,
    expand: () => {},
});

export const useCanvasSidebar = () => useContext(CanvasSidebarContext);

export default CanvasSidebarContext;
