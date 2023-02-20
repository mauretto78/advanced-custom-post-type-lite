
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

export const scrollToId = (id, yOffset = -130) => {

    const element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({top: y, behavior: 'smooth'});
};