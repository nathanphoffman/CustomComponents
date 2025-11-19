
const c = [];

function defineElements(arr) {
    arr.forEach(([name, elementClass]) => registerFunction(name, elementClass));
    arr.forEach(([name, elementClass]) => defineElement(name, elementClass));
}

function defineElement(name, elementClass) {
    customElements.define(name, elementClass);
}

function registerFunction(name, elementClass) {
    c[name] = getElementRenderer(name);
}

function getElementRenderer(name) {
    return (str, events) => {

        return `<${name}>${str || ''}</${name}>`;
    };
}

['h1', 'h2', 'h3', 'section', 'p', 'div', 'span', 'button']
    .forEach((name) => window[name] = getElementRenderer(name));

class Component extends HTMLElement {

    constructor() {
        super();
        this.events = [];
    }

    connectedCallback() {
        this.innerHTML = this.render();
        this.registerEvents();
    }

    onClick(selector, handler) {
        this.events.push({ selector, type: 'click', handler });
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
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
    }

    disconnectedCallback() {
        this.removeEvents();
    }

    render() {
        throw new Error("Required method 'requiredMethod' must be implemented.");
    }
}

//c[my - component]()

class Page extends Component {
    constructor() {
        super();
    }

    render() {
        return div(h1(c['my-component-child']()));
    }
}

class Page2 extends Component {
    constructor() {
        super();
    }

    render() {
        this.onClick('p.hello', () => console.log('clicked'));
        return `<p>This is a child <p class="hello">hello</p component.</p>`
    }
}

defineElements([
    ['my-component', Page],
    ['my-component-child', Page2]
]);

