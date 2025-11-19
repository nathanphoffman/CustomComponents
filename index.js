
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

    constructor(state) {
        super();
        this.state = state;
        this.events = [];
        //setTimeout(()=>this.disconnectedCallback(),1500);
    }

    setState(state) {
        this.state = state;
        this.refresh();
    }

    connectedCallback() {
        this.refresh();
    }

    refresh() {
        this.innerHTML = this.render();
        this.removeEvents();
        this.registerEvents();
    }

    onClick(selector, handler) {
        this.onEvent("click",selector,handler)
    }

    onChange(selector, handler) {
        this.onEvent("change",selector,handler)
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
            elements.forEach((el)=>el.removeEventListener(type, handler));
        });
    }

    disconnectedCallback() {
        console.log('disconnectdd was called');
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
        super({clicked: "default click"});
    }

    render() {
        this.onClick('p.hello', () => this.setState({clicked:"clicked!"}));
        return `<p>This is a child <p class="hello">hello ${this.state.clicked}</p component.</p>`
    }
}

defineElements([
    ['my-component', Page],
    ['my-component-child', Page2]
]);

