import {fieldTypes} from "../constants/fields";

/**
 *
 * @param fieldType
 * @return {{icon: string, label: string}}
 */
export const resolveField = (fieldType) => {

    let icon = 'bx:bx-map';
    let label = 'Address';

    switch (fieldType) {
        case fieldTypes.ADDRESS_MULTI:
            icon="bx:bxs-map";
            label="Address(multiple)";
            break;
        case fieldTypes.BUTTON:
            icon="bx:bx-pointer";
            label="Button";
            break;
        case fieldTypes.CAPTCHA:
            icon="bx:bx-lock";
            label="Captcha";
            break;
        case fieldTypes.CLONE:
            icon="bx:bx-copy-alt";
            label="Clone";
            break;
        case fieldTypes.COUNTRY:
            icon="bx:bx-flag";
            label="Country";
            break;
        case fieldTypes.COLOR:
            icon="bx:bx-color-fill";
            label="Color";
            break;
        case fieldTypes.CURRENCY:
            icon="bx:bx-euro";
            label="Currency";
            break;
        case fieldTypes.WEIGHT:
            icon="bx:bx-tachometer";
            label="Weight";
            break;
        case fieldTypes.LENGTH:
            icon="bx:bx-ruler";
            label="Length";
            break;
        case fieldTypes.DATE:
            icon="bx:bx-calendar";
            label="Date";
            break;
        case fieldTypes.EDITOR:
            icon="bx:bx-font-color";
            label="Editor";
            break;
        case fieldTypes.EMAIL:
            icon="bx:bx-envelope";
            label="Email";
            break;
        case fieldTypes.HIDDEN:
            icon="ant-design:eye-invisible-outlined";
            label="Hidden";
            break;
        case fieldTypes.NUMBER:
            icon="bx:bx-hash";
            label="Number";
            break;
        case fieldTypes.PASSWORD:
            icon="bx:bx-key";
            label="Password";
            break;
        case fieldTypes.PHONE:
            icon="bx:bx-phone";
            label="Phone";
            break;
        case fieldTypes.TEXT:
            icon="bx:bx-text";
            label="Text";
            break;
        case fieldTypes.TEXTAREA:
            icon="bx:bx-pen";
            label="Textarea";
            break;
        case fieldTypes.LIST:
            icon="bx:bx-list-ul";
            label="List";
            break;
        case fieldTypes.HTML:
            icon="bx:bx-code-alt";
            label="HTML";
            break;
        case fieldTypes.URL:
            icon="bx:bx-link";
            label="Url";
            break;
        case fieldTypes.SELECT:
            icon="bx:bx-select-multiple";
            label="Select";
            break;
        case fieldTypes.SELECT_MULTI:
            icon="bx:bxs-select-multiple";
            label="Select(multiple)";
            break;
        case fieldTypes.POST_OBJECT:
            icon="bx:pen";
            label="Post";
            break;
        case fieldTypes.POST_OBJECT_MULTI:
            icon="bxs:pen";
            label="Post(multiple)";
            break;
        case fieldTypes.TERM_OBJECT:
            icon="bx:purchase-tag-alt";
            label="Term";
            break;
        case fieldTypes.TERM_OBJECT_MULTI:
            icon="bxs:purchase-tag-alt";
            label="Term(multiple)";
            break;
        case fieldTypes.TOGGLE:
            icon="bx:bx-toggle-right";
            label="Toggle";
            break;
        case fieldTypes.EMBED:
            icon="bx:bx-extension";
            label="Embed";
            break;
        case fieldTypes.FILE:
            icon="bx:bx-cloud-upload";
            label="File";
            break;
        case fieldTypes.GALLERY:
            icon="bx:bx-images";
            label="Gallery";
            break;
        case fieldTypes.IMAGE:
            icon="bx:bx-image";
            label="Image";
            break;
        case fieldTypes.VIDEO:
            icon="bx:bx-video";
            label="Video";
            break;
        case fieldTypes.TABLE:
            icon="bx:table";
            label="Table";
            break;
        case fieldTypes.POST:
            icon="bx:bx-repost";
            label="Relationship";
            break;
        case fieldTypes.TIME:
            icon="bx:time-five";
            label="Time";
            break;
        case fieldTypes.TURNSTILE:
            icon="fa-brands:cloudflare";
            label="Cloudflare Turnstile";
            break;
        case fieldTypes.REPEATER:
            icon="bx:folder-plus";
            label="Repeater";
            break;
        case fieldTypes.USER:
            icon="bx:user";
            label="User";
            break;
        case fieldTypes.USER_MULTI:
            icon="bx:user-plus";
            label="User(multiple)";
            break;
        case fieldTypes.CHECKBOX:
            icon="bx:checkbox-checked";
            label="Checkbox";
            break;
        case fieldTypes.RADIO:
            icon="bx:radio-circle-marked";
            label="Radio";
            break;
        case fieldTypes.DATE_RANGE:
            icon="bx:calendar-check";
            label="DateRange";
            break;
        case fieldTypes.DATE_TIME:
            icon="bxs:calendar-check";
            label="DateTime";
            break;
        case fieldTypes.FLEXIBLE:
            icon="bx:hive";
            label="Flexible";
            break;
        case fieldTypes.ICON:
            icon="bx:wink-smile";
            label="Icon";
            break;
        case fieldTypes.RANGE:
            icon="bx:slider-alt";
            label="Range";
            break;
        case fieldTypes.RATING:
            icon="bx:star";
            label="Rating";
            break;
        case fieldTypes.WORDPRESS_POST_THUMBNAIL:
            icon="bxl:wordpress";
            label="PostThumbnail";
            break;
        case fieldTypes.WORDPRESS_POST_TITLE:
            icon="bxl:wordpress";
            label="PostTitle";
            break;
        case  fieldTypes.WORDPRESS_POST_CONTENT:
            icon="bxl:wordpress";
            label="PostContent";
            break;
        case  fieldTypes.WORDPRESS_POST_EXCERPT:
            icon="bxl:wordpress";
            label="PostExcerpt";
            break;
        case  fieldTypes.WORDPRESS_POST_DATE:
            icon="bxl:wordpress";
            label="PostDate";
            break;
        case  fieldTypes.WORDPRESS_POST_AUTHOR:
            icon="bxl:wordpress";
            label="PostAuthor";
            break;
        case  fieldTypes.WORDPRESS_POST_TAXONOMIES:
            icon="bxl:wordpress";
            label="PostTaxonomies";
            break;
        case fieldTypes.WORDPRESS_USER_EMAIL:
            icon="bxl:wordpress";
            label="UserEmail";
            break;
        case fieldTypes.WORDPRESS_USER_FIRST_NAME:
            icon="bxl:wordpress";
            label="UserFirstName";
            break;
        case  fieldTypes.WORDPRESS_USER_LAST_NAME:
            icon="bxl:wordpress";
            label="UserLastName";
            break;
        case  fieldTypes.WORDPRESS_USER_USERNAME:
            icon="bxl:wordpress";
            label="Username";
            break;
        case  fieldTypes.WORDPRESS_USER_PASSWORD:
            icon="bxl:wordpress";
            label="UserPassword";
            break;
        case  fieldTypes.WORDPRESS_USER_BIO:
            icon="bxl:wordpress";
            label="UserBio";
            break;
        case fieldTypes.WORDPRESS_TERM_NAME:
            icon="bxl:wordpress";
            label="TermName";
            break;
        case fieldTypes.WORDPRESS_TERM_DESCRIPTION:
            icon="bxl:wordpress";
            label="TermDescription";
            break;
        case fieldTypes.WORDPRESS_TERM_SLUG:
            icon="bxl:wordpress";
            label="TermSlug";
            break;
    }

    return {icon, label};
};