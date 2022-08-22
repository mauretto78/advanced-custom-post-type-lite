
export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToBottom = () => {
    window.scrollTo({ top: (document.body.scrollHeight + 120), behavior: 'smooth' })
};

export const scrollToTargetId = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({behavior: 'smooth'}, true);
};