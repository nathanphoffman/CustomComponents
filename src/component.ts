
type Trigger = string;
type Handler = ()=>void;
type Selector = string;
type CustomElementName = string;

export type Event = {
    trigger: Trigger
    handler: Handler
    selector: Selector
}

type State = object | undefined;
type Profile = object | undefined;

// we must use the constructor as it is not an instance we are passing but the component class
type ComponentConstructor = new (...args: any[]) => Component<object, object>;

export function defineElements(arr: [CustomElementName, ComponentConstructor][]) {

    function defineElement(name: CustomElementName, elementClass: ComponentConstructor) {
        customElements.define(name, elementClass);
    }

    //arr.forEach(([name, elementClass]) => registerFunction(name, elementClass));
    arr.forEach(([name, elementClass]) => defineElement(name, elementClass));
}

export class Component<T extends State, P extends Profile> extends HTMLElement {

    state: T;
    events: Event[] = [];

    // this is used to store user preferences without updating state such as storing input field data
    // this is useful when wanting to store data you can easily look at later for retrieval rather than dom fetching
    profile: P;

    constructor(state?: T, profile?: P) {
        super();
        this.state = state || {} as never;
        this.profile = profile || {} as never;
    }

    // Base Methods:
    connectedCallback() {
        this.refresh();
    }

    disconnectedCallback() {
        console.log('disconnect was called');
        this.removeEvents();
    }

    setState(state: T) {
        this.state = state;
        this.refresh();
    }

    // Added Methods:
    refresh() {
        this.innerHTML = this.render();
        this.removeEvents();
        this.registerEvents();
    }

    onClick(selector: Selector, handler: Handler) {
        this.onEvent("click", selector, handler)
    }

    onChange(selector: Selector, handler: Handler) {
        this.onEvent("change", selector, handler)
    }

    onEvent(trigger: Trigger, selector: Selector, handler: Handler) {
        this.events.push({ selector, trigger, handler });
    }

    registerEvents() {
        this.events.forEach(({ selector, trigger, handler }) => {
            const elements = this.querySelectorAll(selector);
            elements.forEach((element) => {
                element.addEventListener(trigger, handler);
                this.events.push({ selector, trigger, handler });
            });
        });
    }

    removeEvents() {
        this.events.forEach(({ selector, trigger, handler }) => {
            const elements = this.querySelectorAll(selector);
            elements.forEach((el) => el.removeEventListener(trigger, handler));
        });
    }

    render(): string {
        throw new Error("Required method 'render' must be implemented.");
    }
}