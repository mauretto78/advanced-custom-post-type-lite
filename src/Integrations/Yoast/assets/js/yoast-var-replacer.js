/**
 * @see https://gist.github.com/erikyo/53ec6a1b2264135dae95e866194a0a8a
 */

var pluginName = "advanced-custom-post-type";
var ReplaceVar = window.YoastReplaceVarPlugin && window.YoastReplaceVarPlugin.ReplaceVar;
var placeholders = {};

var modifiableFields = [
    "content",
    "title",
    "snippet_title",
    "snippet_meta",
    "primary_category",
    "data_page_title",
    "data_meta_desc",
];

var replaceVarPluginAvailable = function() {
    if ( typeof ReplaceVar === "undefined" ) {
        if ( config.debug ) {
            console.log( "Additional replace variables in the Snippet Window requires Yoast SEO >= 5.3." );
        }

        return false;
    }

    return true;
};

/**
 * Variable replacement plugin for WordPress.
 *
 * @returns {void}
 */
var YoastReplaceVarPlugin = function () {

    if ( ! replaceVarPluginAvailable() ) {
        return;
    }

    this._app = YoastSEO.app;
    this._app.registerPlugin(pluginName, {status: "ready"});
    this._store = YoastSEO.store;

    this.registerReplacements();
    this.registerModifications( this._app );
    this.registerEvents();
};

/**
 * Registers the modifications for the plugin on initial load.
 *
 * @param {app} app The app object.
 *
 * @returns {void}
 */
YoastReplaceVarPlugin.prototype.registerModifications = function (app) {
    var callback = this.replaceVariables.bind(this);

    for (var i = 0; i < modifiableFields.length; i++) {
        app.registerModification(modifiableFields[i], callback, pluginName, 10);
    }
};

/**
 * Registers all the placeholders and their replacements.
 *
 * @returns {void}
 */
YoastReplaceVarPlugin.prototype.registerReplacements = function () {
    for (var i = 0; i < replacementsMap.length; i++) {
        const replacementsMapElement = replacementsMap[i];
        this.addReplacement(new ReplaceVar(replacementsMapElement.snippet, replacementsMapElement.replace));
    }
};

/**
 * Runs the different replacements on the data-string.
 *
 * @param {string} data The data that needs its placeholders replaced.
 *
 * @returns {string} The data with all its placeholders replaced by actual values.
 */
YoastReplaceVarPlugin.prototype.replaceVariables = function (data) {

    if (typeof data !== "undefined") {
        for (var i = 0; i < replacementsMap.length; i++) {
            const replacementsMapElement = replacementsMap[i];
            var regExp = new RegExp(replacementsMapElement.snippet,'g');

            data = data.replace(regExp, () => {
                return replacementsMapElement.replace;
            });
        }

        data = this.replacePlaceholders( data );
    }

    return data;
};

/**
 * Adds a replacement object to be used when replacing placeholders.
 *
 * @param {ReplaceVar} replacement The replacement to add to the placeholders.
 *
 * @returns {void}
 */
YoastReplaceVarPlugin.prototype.addReplacement = function (replacement) {
    placeholders[replacement.placeholder] = replacement;
    this._store.dispatch({
        type: "SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE",
        name: replacement.placeholder.replace(/^%%|%%$/g, ""),
        value: replacement.placeholder,
    });
};

/**
 * Reloads the app to apply possibly made changes in the content.
 *
 * @returns {void}
 */
YoastReplaceVarPlugin.prototype.declareReloaded = function() {
    this._app.pluginReloaded( pluginName );
    this._store.dispatch( { type: "SNIPPET_EDITOR_REFRESH" } );
};

/**
 * Replaces placeholder variables with their replacement value.
 *
 * @param {string} text The text to have its placeholders replaced.
 *
 * @returns {string} The text in which the placeholders have been replaced.
 */
YoastReplaceVarPlugin.prototype.replacePlaceholders = function (text) {
    for (var i = 0; i < placeholders.length; i++) {
        var replaceVar = placeholders[i];

        text = text.replace(
            new RegExp(replaceVar.getPlaceholder(true), "g"), replaceVar.replacement
        );
    }
    return text;
};

/**
 * Initializes the Additional ReplaceVars plugin.
 *
 * @returns {void}
 */
function initializeReplacevarPlugin() {

    // replacementsMap is passed by above PHP script
    if(typeof replacementsMap === 'undefined'){
        return;
    }

    // When YoastSEO is available, just instantiate the plugin.
    if (typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined") {
        new YoastReplaceVarPlugin(); // eslint-disable-line no-new
        return;
    }

    // Otherwise, add an event that will be executed when YoastSEO will be available.
    jQuery(window).on(
        "YoastSEO:ready",
        function () {
            console.log('ready');
            new YoastReplaceVarPlugin(); // eslint-disable-line no-new
        }
    );
}

initializeReplacevarPlugin();