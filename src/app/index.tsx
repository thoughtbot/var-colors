import { Component, render, h } from 'preact';
import { figmaRGBToHex, figmaRGBToWebRGB } from '@figma-plugin/helpers';
import slugify from 'slugify';
import './styles/index.scss';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      source: "styles",
      format: "css",
      colorFormat: "hex"
    };
  }

  onChangeValue = (event) => {
    if (event.target.name === "source") {
      this.setState({ source: event.target.value });
    }

    if (event.target.name === "format") {
      this.setState({ format: event.target.value });
    }

    if (event.target.name === "colorFormat") {
      this.setState({ colorFormat: event.target.value });
    }
  };

  render(_, { source, format}) {
    return (
      <div>
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

          <b>Variables format</b>
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
            <label htmlFor="json">
              <input
              type="radio"
              id="json"
              name="format"
              value="json"
              checked={ this.state.format === "json" }/>
              <span>JSON</span>
            </label>
          </div>

          <b>Color format</b>
          <select value={ this.state.colorFormat } name="colorFormat">
            <option value="hex">Hex</option>
            <option value="rgb">RGB</option>
          </select>
        </div>
        <button onClick={ e => parent.postMessage({ pluginMessage: { type: 'copy', settings: this.state } }, '*') }>
          Copy to Clipboard
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
    let data = stringifyColors(msg.colors, msg.settings.format, msg.settings.colorFormat)
    copy(data, msg.colors.length)
  }
}

function stringifyColors(dict, format, colorFormat) {
  let data;

  switch(format) {
    case "css":
      data = dict.map(c => `--${ formatName(c.name.toLowerCase()) }: ${ formatColor(c.color, colorFormat) };`).join(`\n`);
      break;
    case "sass":
      data = dict.map(c => `$${ formatName(c.name.toLowerCase()) }: ${ formatColor(c.color, colorFormat) };`).join(`\n`);
      break;
    case "json":
      data = {}
      dict.forEach(c => {
        let name = formatName(c.name.toLowerCase())
        data[name] = formatColor(c.color, colorFormat)
      })
      data = JSON.stringify(data, null, 4)
      break;
    default:
      return;
  }

  return data;
}

function formatName(string) {
  let s = string.replace('/', '-');
  s = slugify(s);
  return s;
}

function formatColor(color, format) {
  switch(format) {
    case "hex":
      return figmaRGBToHex(color);
      break;
    case "rgb":
      return `rgb(${figmaRGBToWebRGB(color)})`.replace(",", " ");
      break;
    default:
      return;
  }
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
