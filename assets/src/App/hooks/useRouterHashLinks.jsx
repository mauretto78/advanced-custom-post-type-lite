import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

/**
 * Routes clicks on plain links to this page's own `#/...` routes (list rows, the
 * WordPress admin menu) through the router.
 *
 * Left to the browser, such a link changes the hash behind the router's back: the
 * history entry it creates carries no router index, so the router can't block a
 * navigation away from it (a back button press there can't be undone) and
 * `useBlocker` (UnsavedChangesModal) failed silently.
 *
 * Bubble phase, after React's own handlers: a click a component already handled
 * (a react-router <Link>, an anchor whose onClick calls preventDefault) is left alone.
 */
const useRouterHashLinks = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const routeThroughRouter = (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const link = event.target instanceof Element ? event.target.closest('a[href]') : null;

            if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) {
                return;
            }

            const url = new URL(link.getAttribute('href'), window.location.href);
            const here = window.location;

            if (url.origin !== here.origin || url.pathname !== here.pathname || url.search !== here.search || !url.hash.startsWith('#/')) {
                return;
            }

            event.preventDefault();
            navigate(url.hash.slice(1));
        };

        document.addEventListener('click', routeThroughRouter);

        return () => document.removeEventListener('click', routeThroughRouter);
    }, [navigate]);
};

export default useRouterHashLinks;
