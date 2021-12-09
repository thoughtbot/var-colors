import { render, h } from 'preact';
import './styles/index.scss';

const app = (
    <div>
      <div>
        <b>Source</b>
        <div className="input-row">
          <label htmlFor="styles">
            <input type="radio" id="styles" name="source" value="styles" checked />
            <span>Local styles</span>
          </label>
          <label htmlFor="selection">
            <input type="radio" id="selection" name="source" value="selection" />
            <span>Selection</span>
          </label>
        </div>

        <b>Format</b>
        <div className="input-row">
          <label htmlFor="css">
            <input type="radio" id="css" name="format" value="css" checked />
            <span>CSS</span>
          </label>
          <label htmlFor="sass">
            <input type="radio" id="sass" name="format" value="sass" />
            <span>Sass</span>
          </label>

        </div>
      </div>
      <button onClick={ e => parent.postMessage({ pluginMessage: { type: 'copy' } }, '*') }>
        Copy Variables to Clipboard
      </button>

      <div>Hide me!</div>
    </div>
)

window.onload = function() {
  render(app, document.getElementById("app"));
}
