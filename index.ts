
import { Component, defineElements } from './src/component';

class Root extends Component<never, never> {
    constructor() {
        super()
    }

    render() {
        return `<div>
            <h1>Welcome to this example!</h1>
            <c-clicker></c-clicker>
        </div>`;
    }
}

type ClickerState = { clicked: string }
type ClickerProfile = { input?: string | null, input2?: string | null }

class Clicker extends Component<ClickerState, ClickerProfile> {
    constructor() {
        super({ clicked: "has not been clicked" }, { input: "this text saves to profile", input2: "calls safeRefresh onchange" });
    }

    render() {
        this.onClick('p', () => this.setState({ clicked: "was clicked!" }));
        this.onChange('input.one', (e) => this.profile.input = (e.target as HTMLInputElement).value);
        
        this.onInput('input.two', (e) => {
            this.profile.input2 = (e.target as HTMLInputElement).value;
            this.safeRefresh(500);
        });

        return /* HTML */`
            <p>This text has an onclick handler on it and "${this.state.clicked}" this is tracked with state.</p>
            <br/>
            <div>Below is an input field that onchange writes its value to the profile but not to state</div>
            <input type="text" class="one" value="${this.profile.input}"/>
            <div>Since profile is not written to state a refresh is not normally triggered unless one is triggered elsewhere.</div>
            <div>The value currently in the profile for this field is "${this.profile.input}".  You can click the first text above to trigger a rerender to update this text.</div>
            <br/>

            <div>A solution to rerendering data with something not in state is to use safeRefresh(), calling refresh() is highly illadvised </div>
            <div>Saferefresh debounces itself, so that multiple calls to it will not trigger it often, this time can be bypassed</div>
            <br/>
            
            <div>Below is an input field that triggers the safeRefresh function onchange, it is set to 2 seconds which means you must leave it alone for 2 seconds to update the text below it</div>
            <input type="text" class="two" value="${this.profile.input2}"/>
            <div>Here is the text currently stored: ${this.profile.input2}</div>

        `
    }
}

defineElements([
    ['c-root', Root],
    ['c-clicker', Clicker]
]);
