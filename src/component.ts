
type Trigger = string;
type Handler = (e: Event) => void;
type Selector = string;
type CustomElementName = string;

export type ComponentEvent = {
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
    events: ComponentEvent[] = [];
    safeRefreshId: number = 0;

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
        console.log("was clicked");
        this.state = state;
        this.refresh();
    }

    // can be used to trigger a manual refresh, this is considered much more performant and safer 
    // than calling redirect directly
    safeRefresh(ms?: number) {
        clearTimeout(this.safeRefreshId);
        this.safeRefreshId = setTimeout(this.refresh.bind(this), ms || 500);
    }

    // Added Methods:
    refresh() {
        //console.log("number of events is ", this.events.length)
        //console.log(this.events);
        console.log("refresh called");
        this.removeEvents();
        this.innerHTML = this.render();
        this.registerEvents();
        console.log(this.events);
    }

    onClick(selector: Selector, handler: Handler) {
        console.log("onclick called");
        this.onEvent("click", selector, handler)
    }

    onChange(selector: Selector, handler: Handler) {
        this.onEvent("change", selector, handler)
    }
    /*
        onInput(selector: Selector, handler: Handler, delay: number = 250) {
    
            const debouncedHandler = handler;
    
            this.onChange(selector, );
            this.keyup
            
        }
    
        onKeyup(selector: Selector, handler: Handler) {
    
        }
    */
    onEvent(trigger: Trigger, selector: Selector, handler: Handler) {
        this.events.push({ selector, trigger, handler });
    }

    // must register the events after they are added due to the composition of events happening before the return of the html
    registerEvents() {
        this.events.forEach(({ selector, trigger, handler }) => {
            const elements = this.querySelectorAll(selector);
            elements.forEach((element) => {
                element.addEventListener(trigger, handler);
            });
        });
    }
        

    removeEvents() {
        this.events.forEach(({ selector, trigger, handler }) => {
            const elements = this.querySelectorAll(selector);
            elements.forEach((el) => el.removeEventListener(trigger, handler));
        });

        this.events = [];
    }

    render(): string {
        throw new Error("Required method 'render' must be implemented.");
    }
}