import React from 'react';
import {createRoot} from 'react-dom/client';
import * as serviceWorker from './tools/serviceWorker';
import App from "./App";
import {Provider} from "react-redux";
import store from "./redux/store";
import {ErrorBoundary} from "react-error-boundary";
// styles
import "./scss/app.scss";
import ErrorBoundaryFallback from "./components/Errors/ErrorBoundaryFallback";
import {refreshPage} from "./utils/misc";

document.addEventListener( 'DOMContentLoaded', function() {
    const container = document.getElementById( 'acpt-admin-app' );
    const root = createRoot(container);

    if(typeof container !== 'undefined' && container !== null) {
        root.render(
            <Provider store={store}>
                <ErrorBoundary
                    FallbackComponent={ErrorBoundaryFallback}
                    onReset={() => {
                        refreshPage();
                    }}
                >
                    <App />
                </ErrorBoundary>
            </Provider>
        );
    }
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();