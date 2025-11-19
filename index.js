
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
    return (str)=>`<${name}>${str || ''}</${name}>`;
}

['h1', 'h2','h3', 'section', 'p', 'div', 'span', 'button'].forEach((name) => window[name] = getElementRenderer(name));

class Component extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.render();
    }

    disconnectedCallback() {
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
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
        return `<p>This is a child component.</p>`
    }
}

defineElements([
    ['my-component', Page],
    ['my-component-child', Page2]
]);

