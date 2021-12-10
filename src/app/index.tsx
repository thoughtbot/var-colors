import { Component, render, h } from 'preact';
import { figmaRGBToHex } from '@figma-plugin/helpers';
import slugify from 'slugify';
import './styles/index.scss';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      source: "styles",
      format: "css"
    };
  }

  onChangeValue = (event) => {
    if (event.target.name === "source") {
      this.setState({ source: event.target.value });
    }

    if (event.target.name === "format") {
      this.setState({ format: event.target.value });
    }
  };

  render(_, { source, format}) {
    return (
      <div>
        <p>Source: { this.state.source }</p>
        <p>Format: { this.state.format }</p>
        <div onChange={ this.onChangeValue }>
          <b>Source</b>
          <div className="input-row">
            <label htmlFor="styles">
              <input
              type="radio"
              id="styles"
              name="source"
              value="styles"
              checked={ this.state.source === "styles"} />
              <span>Local styles</span>
            </label>
            <label htmlFor="selection">
              <input
              type="radio"
              id="selection"
              name="source"
              value="selection"
              checked={ this.state.source === "selection" } />
              <span>Selection</span>
            </label>
          </div>

          <b>Format</b>
          <div className="input-row">
            <label htmlFor="css">
              <input
              type="radio"
              id="css"
              name="format"
              value="css"
              checked={ this.state.format === "css" } />
              <span>CSS</span>
            </label>
            <label htmlFor="sass">
              <input
              type="radio"
              id="sass"
              name="format"
              value="sass"
              checked={ this.state.format === "sass" }/>
              <span>Sass</span>
            </label>

          </div>
        </div>
        <button onClick={ e => parent.postMessage({ pluginMessage: { type: 'copy', source: this.state.source, format: this.state.format } }, '*') }>
          Copy Variables to Clipboard
        </button>

        <pre id="copy" class="hide-visually"></pre>
      </div>
    )
  }
}

window.onload = function() {
  render(<App />, document.getElementById("app"));
}

window.onmessage = function(event) {
  let msg = event.data.pluginMessage;

  if (msg.type === 'colors') {
    let dict = msg.colors
    let data = stringifyColors(msg.colors, msg.format)
    copy(data, msg.colors.length)
  }
}

function stringifyColors(dict, format) {
  let data;

  switch(format) {
    case "css":
      data = dict.map(c => `--${ slugify(c.name.toLowerCase()) }: ${ figmaRGBToHex(c.color) };`).join(`\n`);
      break;
    case "sass":
      data = dict.map(c => `$${ slugify(c.name.toLowerCase()) }: ${ figmaRGBToHex(c.color) };`).join(`\n`);
      break;
    default:
      return;
  }

  return data;
}

function copy(string, amount) {
    let copyArea = document.querySelector("#copy");
    copyArea.innerText = string;
    let range = document.createRange();
    let selection = window.getSelection();
    range.selectNodeContents(copyArea);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");

    let plural = amount === 1 ? "variable" : "variables";

    parent.postMessage({ pluginMessage: { type: 'notify', message: `Copied ${amount} ${plural} to clipboard` } }, '*')
}
