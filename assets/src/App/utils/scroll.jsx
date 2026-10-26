export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToId = (id, yOffset = -230) => {

    // check if id is string
    if(typeof id !== 'string'){
        return;
    }

    const element = document.getElementById(id);

    if(element){
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
};