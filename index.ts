
import { Component, defineElements } from './src/component';

class Root extends Component<never, never> {
    constructor() {
        super()
    }

    render() {
        return `<div>
            <h1>Welcome to my component2!</h1>
            <c-clicker></c-clicker>
        </div>`;
    }
}

class Clicker extends Component<{ clicked: string }, { input?: string | null }> {
    constructor() {
        super({ clicked: "default click" }, { input: "default" });
    }

    render() {
        this.onClick('p.hello', () => this.setState({ clicked: "clicked!" }));
        this.onChange('input', () => this.profile.input = this.querySelector('input')?.value);

        return /* HTML */`
            <p>This is a child <p class="hello">hello ${this.state.clicked}</p>.</p>
            <input type="text" class="input-box" value="${this.profile.input}"/>
        `
    }
}

defineElements([
    ['c-root', Root],
    ['c-clicker', Clicker]
]);
