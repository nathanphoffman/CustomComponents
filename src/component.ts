
const c = [];

export function defineElements(arr) {

    function defineElement(name, elementClass) {
        customElements.define(name, elementClass);
    }


    //arr.forEach(([name, elementClass]) => registerFunction(name, elementClass));
    arr.forEach(([name, elementClass]) => defineElement(name, elementClass));
}

export class Component extends HTMLElement {

    constructor(state, preference) {
        super();
        this.state = state;
        this.preference = preference;
        this.events = [];
    }

    // Base Methods:
    connectedCallback() {
        this.refresh();
    }

    disconnectedCallback() {
        console.log('disconnect was called');
        this.removeEvents();
    }

    setState(state) {
        this.state = state;
        this.refresh();
    }

    // Added Methods:
    refresh() {
        this.innerHTML = this.render();
        this.removeEvents();
        this.registerEvents();
    }

    onClick(selector, handler) {
        this.onEvent("click", selector, handler)
    }

    onChange(selector, handler) {
        this.onEvent("change", selector, handler)
    }

    onEvent(event, selector, handler) {
        this.events.push({ selector, type: event, handler });
    }

    registerEvents() {
        this.events.forEach(({ selector, type, handler }) => {
            const elements = this.querySelectorAll(selector);
            elements.forEach((element) => {
                element.addEventListener(type, handler);
                this.events.push({ element, type, handler });
            });
        });
    }

    removeEvents() {
        this.events.forEach(({ selector, type, handler }) => {
            const elements = this.querySelectorAll(selector);
            elements.forEach((el) => el.removeEventListener(type, handler));
        });
    }

    render() {
        throw new Error("Required method 'render' must be implemented.");
    }
}