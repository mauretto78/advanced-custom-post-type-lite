import {fetchSettingValue} from "./objects";

// ── Token map — mirrors design-tokens.css ─────────────────────────────────────
// Keys match the skin class names; 'light' is the default theme.

const TOKENS = {
    light: {
        base:               "#131313",
        primary:            "#3858e9",
        paleGray:           "#f8f8f8",
        lightGray:          "#dddddd",
        gray:               "#777777",
        mediumGray:         "#aaaaaa",
        danger:             "#e53935",
        title:              "#131313",
        withActiveBorderBg: "#eff6fc80",
        success:            "#0b8a6a",
        warning:            "#946b1c",
        info:               "#9656c0",
        accent:               "#0891b2",
        bgColor:            "#f0f0f1",
        headerColor:        "#2c3338",
        surfaceColor:       "#ffffff",
        surfaceColorRaised: "#f8f8f8",
    },
    dark: {
        base:               "#fff",
        primary:            "#7b9aff",
        paleGray:           "#242B2F",
        lightGray:          "#4a5568",
        gray:               "#cbd5e0",
        mediumGray:         "#8a9bb0",
        danger:             "#ff6b6e",
        title:              "#f0f0f0",
        withActiveBorderBg: "#4d5a6280",
        success:            "#00d9a8",
        warning:            "#f0b429",
        info:               "#c49de0",
        accent:               "#22d3ee",
        bgColor:            "#1d2327",
        headerColor:        "#1d2327",
        surfaceColor:       "#1d2327",
        surfaceColorRaised: "#3a4248",
    },
    midnight: {
        base:               "#fff",
        primary:            "#6d88ff",
        paleGray:           "#102035",
        lightGray:          "#1f3655",
        gray:               "#8ab4cc",
        mediumGray:         "#5f8db8",
        danger:             "#ff6b6e",
        title:              "#e8f2f8",
        withActiveBorderBg: "#13254080",
        success:            "#00dfb0",
        warning:            "#f0b429",
        info:               "#c49de0",
        accent:               "#22d3ee",
        bgColor:            "#070d17",
        headerColor:        "#0b1624",
        surfaceColor:       "#0d1b2e",
        surfaceColorRaised: "#132540",
    },
    airy: {
        base:               "#1e1a26",
        primary:            "#3858e9",
        paleGray:           "#e2d9ed",
        lightGray:          "#b3a6c2",
        gray:               "#6e6080",
        mediumGray:         "#b3a6c2",
        danger:             "#c4302f",
        title:              "#1e1a26",
        withActiveBorderBg: "#d6ecf780",
        success:            "#0e8a6d",
        warning:            "#8f6515",
        info:               "#8a52b0",
        accent:               "#0b7a8a",
        bgColor:            "#f5f0fb",
        headerColor:        "#2c3338",
        surfaceColor:       "#ffffff",
        surfaceColorRaised: "#faf7fd",
    },
};


// ── Helper ────────────────────────────────────────────────────────────────────

export const getSkin = () => {
    const { settings } = document.globals;
    return fetchSettingValue("skin", settings, "light");
};

const token = (key) => {
    const skin = getSkin();
    return (TOKENS[skin] ?? TOKENS.light)[key];
};

// ── Exports ───────────────────────────────────────────────────────────────────

export const logoColor              = () => { return "#02c39a" };

export const baseColor              = () => token("base");
export const primaryColor           = () => token("primary");
export const lightGray              = () => token("lightGray");
export const paleGray               = () => token("paleGray");
export const grayColor              = () => token("gray");
export const mediumGray             = () => token("mediumGray");
export const mediumGrayColor        = () => token("mediumGray");
export const dangerColor            = () => token("danger");
export const titleColor             = () => token("title");
export const withActiveBorderBgColor= () => token("withActiveBorderBg");
export const successColor           = () => token("success");
export const warningColor           = () => token("warning");
export const infoColor              = () => token("info");
export const accentColor            = () => token("accent");
export const whiteColor             = ()  => "#fff";
export const bgColor                = () => token("bgColor");
export const headerColor            = () => token("headerColor");
export const surfaceColor           = () => token("surfaceColor");
export const surfaceColorRaised     = () => token("surfaceColorRaised");
