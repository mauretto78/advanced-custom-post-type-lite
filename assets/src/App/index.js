import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import * as serviceWorker from './tools/serviceWorker';
import {configureStore} from "./redux/configureStore";
import App from "./App";
// scss
import "./scss/app.scss";

document.addEventListener( 'DOMContentLoaded', function() {
    const element = document.getElementById( 'acpt-admin-app' );

    if( typeof element !== 'undefined' && element !== null ) {
        ReactDOM.render(
            <Provider store={configureStore}>
                <App />
            </Provider>
        , element);
    }
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();