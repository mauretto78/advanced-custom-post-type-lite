
export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToBottom = () => {
    window.scrollTo({ top: (document.body.scrollHeight + 120), behavior: 'smooth' })
};