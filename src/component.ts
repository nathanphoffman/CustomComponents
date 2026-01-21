
type Trigger = string;
type Handler = (e: Event) => void;
type Selector = string;
type CustomElementName = string;

export type ComponentEvent = {
    trigger: Trigger
    handler: Handler
    selector: Selector
}

type Defaults = object | undefined;

type ProfileElement = {
    onUpdate?: ()=>{},
    executeUpdate?: ()=>{},
    selector: Selector,
    attribute?: string | "className" | "id" | "style" | "value",
    value: ()=>{}
}

type Profile = {
    [key: string]: ProfileElement
};

// we must use the constructor as it is not an instance we are passing but the component class
type ComponentConstructor = new (...args: any[]) => Component<object>;

export function defineElements(arr: [CustomElementName, ComponentConstructor][]) {

    function defineElement(name: CustomElementName, elementClass: ComponentConstructor) {
        customElements.define(name, elementClass);
    }

    //arr.forEach(([name, elementClass]) => registerFunction(name, elementClass));
    arr.forEach(([name, elementClass]) => defineElement(name, elementClass));
}

export class Component<T extends Defaults> extends HTMLElement {

    MAX_REFRESH_SECONDS: number = 5 as const;

    firstRefreshAttempt: number = 0;
    defaults: T;
    events: ComponentEvent[] = [];
    safeRefreshId: number = 0;

    // this is used to store user preferences without updating state such as storing input field data
    // this is useful when wanting to store data you can easily look at later for retrieval rather than dom fetching
    profile: Profile;

    constructor(defaults?: T, profile?: Profile) {
        super();
        this.defaults = defaults || {} as never;
        this.profile = profile || {} as never;
    }

    // Base Methods:
    connectedCallback() {
        this.unsafeHardRefresh();
    }

    disconnectedCallback() {
        console.log('disconnect was called');
        this.removeEvents();
    }

    setDefaults(defaults: T) {
        console.log("was clicked");
        this.defaults = defaults;
        this.safeHardRefresh();
    }

    setProfile(profile: Profile) {

    }

    // can be used to trigger a manual refresh, this is considered much more performant and safer 
    // than calling refresh directly
    safeHardRefresh(ms?: number) {

        const now: number = (new Date).getTime();
        if (this.firstRefreshAttempt == 0) this.firstRefreshAttempt = now;

        // prevent refreshing from ever taking more than MAX_REFRESH_SECONDS incase debouncing keeps preventing a refresh
        if (this.firstRefreshAttempt > 0 && now > (this.firstRefreshAttempt + this.MAX_REFRESH_SECONDS * 1000)) {
            this.unsafeHardRefresh();
        }
        else {
            clearTimeout(this.safeRefreshId);
            this.safeRefreshId = setTimeout(this.unsafeHardRefresh.bind(this), ms || 200);
        }
    }

    // Added Methods:
    unsafeHardRefresh() {
        // The next thing I need to do is render instead to a hidden element and do a compare on that hidden element
        // Then add each element back to the dom one at a time
        console.log("refresh called");
        this.firstRefreshAttempt = 0;
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

    onInput(selector: Selector, handler: Handler, delay: number = 250) {

        this.onChange(selector, handler);
        this.onKeyup(selector, handler);
    }

    onKeyup(selector: Selector, handler: Handler) {
        this.onEvent("keyup", selector, handler)
    }

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