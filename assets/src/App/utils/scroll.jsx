
export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToBottom = () => {
    window.scrollTo({ top: (document.body.scrollHeight + 120), behavior: 'smooth' })
};

export const scrollToTargetId = (id) => {
    const element = document.getElementById(id);

    if (element) {
        element.scrollIntoView({behavior: 'smooth'}, true);
    }
};

export const scrollToId = (id, yOffset = -230) => {

    const element = document.getElementById(id);

    if(element){
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
};

function isVisible(domElement) {
    return new Promise(resolve => {
        const o = new IntersectionObserver(([entry]) => {
            resolve(entry.intersectionRatio === 1);
            o.disconnect();
        });
        o.observe(domElement);
    });
}