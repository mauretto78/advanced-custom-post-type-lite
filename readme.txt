=== Custom post types for Wordpress – ACPT Lite ===
Contributors: mauretto78
Donate link: https://acpt.io
Tags: custom post type, custom post types, taxonomy, taxonomies, meta box
Requires at least: 5.1
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 2.0.9
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Create and manage custom post types and taxonomies in seconds. Use the meta fields builder to create complex websites with just a few clicks.

== Description ==

= Features  =

ACPT Lite helps you to craft your website from inside WordPress. There is no need to create child themes or write PHP. No coding skills are required!

Main features:

* Register and manage new custom post types in seconds. Take the total control and become a Master of your CPTs.
* Register, manage and associate custom new taxonimies in just 3 clicks.
* Meta fields manager (choose between 5 field types)
* Generate the ACPT custom shortcode with an interactive block in your WordPress Gutenberg editor.
* Elementor custom widget: manage ACPT meta fields in the Elementor editor
* WooCommerce custom integration: generate and manage product data in few clicks
* REST API basic integration

If you need more power, consider to upgrade to [ACPT](https://acpt.io) :)!

= Credits =

[mauretto78](https://github.com/mauretto78)

== Installation ==

1. Make sure you are using WordPress 5.1 or later and that your server is running PHP 7.0 or later (same requirement as WordPress itself)
2. Install and activate the plugin as usual from the 'Plugins' menu in WordPress.
3. Go to the plugin settings page and set the language.

== Frequently Asked Questions ==

Please refer to main [ACPT](https://acpt.io) website.

== Screenshots ==

1. Custom post types list
2. Register new Custom post type
3. Register new Taxonomy
4. Manage meta fields
5. Meta boxes in the post editor
6. Settings panel
7. Elementor widget

== Privacy Policy ==
Advanced Custom Post Type Lite uses [Appsero](https://appsero.com) SDK to collect some telemetry data upon user's confirmation. This helps us to troubleshoot problems faster & make product improvements.

Appsero SDK **does not gather any data by default.** The SDK only starts gathering basic telemetry data **when a user allows it via the admin notice**. We collect the data to ensure a great user experience for all our users.

Integrating Appsero SDK **DOES NOT IMMEDIATELY** start gathering data, **without confirmation from users in any case.**

Learn more about how [Appsero collects and uses this data](https://appsero.com/privacy-policy/).

== Changelog ==

= 1.0.0 (2021-11-23) =

* First release

= 1.0.1 (2022-01-03) =

* Sync post types action
* WooCommerce basic integration

= 1.0.2 (2022-01-05) =

* Appsero integration

= 1.0.3 (2022-01-23) =

* WooCommerce product data integration
* UI improvements

= 1.0.4 (2022-02-07) =

* Elementor widget integration
* UI improvements

= 1.0.5 (2022-02-19) =

* Fixed bug PHP for <7.2 compatibily
* Taxonomies synchronization
* Improved CPT synchronization
* UI/UX fixes and improvements

= 1.0.6 (2022-03-01) =

* UI/UX fixes and improvements
* Basic integration with Wordpress Rest API
* Edit the selected CTP step from the view
* Edit the selected Taxonomy step from the view

= 1.0.8 (2022-04-26) =

* UI/UX fixes and improvements
* Backend fix on syncronization
* User meta fields

= 1.0.9 (2022-05-02) =

* PHP8 support
* Added MySQL tables prefix

= 1.0.10 (2022-08-01) =

* Taxonomy edit fix
* Broken classname
* Ajax url fix (subfolder installation fix)
* UI/UX fixes and improvements

= 1.0.11 (2022-08-04) =

* DB collation problem fix

= 1.0.12 (2022-08-22) =

* Security option to keep all ACPT data if the plugin is accidentally deactivated

= 1.0.13 (2022-08-30) =

* Fix deactivation bug (class not found)
* Save element is closed or not in LC
* Sync metadata on change ACPT definitions
* Fixed category import
* Import custom taxonomies
* UI/UX improvements
* Removed external reference to iconify library

= 1.0.14 (2023-02-23) =

* Completely new UI (from PRO version)
* Taxonomy meta
* Backend fixes and improvements (from PRO version)
* Renaming DB tables to avoid conflicts with ACPT PRO

= 1.0.15 (2023-03-01) =

* WooCommerce HotFix

= 1.0.16 (2023-04-18) =

* Revised UI (from PRO version)
* Added meta box label
* Fix publicly_queryable custom post type param (now is TRUE by default)
* Fix DB connection (DB port issue)
* Fix destroy schema on deactivate
* Meta field manager: added a button to link label and value in the option element (from PRO version)

= 1.0.17 (2023-04-24) =

* WordPress admin menu labels
* Fix AbstractModal::hydrateFromArray() method (to fix PHP 8 deprecations)
* Fix `menu_position` bug when registering new custom post types

= 2.0.0 (2024-03-29) =

* Brand-new new UI/UX (from ACPT v2.0.1)
* Reusable meta field groups
* 5 meta fields available
* New Gutenberg block
* Localization in 9 languages
* Back-end fixes and improvements (from ACPT v2.0.1)

= 2.0.1 (2024-03-30) =

* Meta group location fix
* MetaRepository::get() fix
* Assets fix

= 2.0.2 (2024-03-30) =

* Meta fields bulk delete fix

= 2.0.6 (2024-07-05) =

* Improvements and fixes from ACPT v2.0.14

= 2.0.7 (2024-07-12) =

* Added get_acpt_field and get_acpt_meta_field_objects functions

= 2.0.9 (2025-01-29) =

* Improvements and fixes from ACPT v2.0.20