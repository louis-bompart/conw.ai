import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { type ConwayStore } from '@conwai/engine';
import { repeat } from 'lit/directives/repeat.js';

@customElement('conway-grid')
export class ConwayGrid extends LitElement {

  @state()
  engine: ConwayStore;

  get width(): number {
    return this.engine.getState().game.width;
  }

  get height(): number {
    return this.engine.getState().game.height;
  }

  protected willUpdate(_changedProperties: PropertyValues): void {
    if (_changedProperties.has('engine')) {
      this.engine.subscribe(() => {
        this.requestUpdate();
      });
    }
  }

  static styles = css`
    :host {
      display: block;
    }
    .grid {
      display: grid;
      gap: 1px;
      background-color: #2e303a;
      border: 1px solid #2e303a;
      width: max-content;
      padding: 1px;
      border-radius: 4px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
    }
    .cell {
      background-color: #1f2028;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
      width: 20px;
      height: 20px;
      border-radius: 2px;
    }
    .cell:hover {
      transform: scale(1.15);
      z-index: 1;
      position: relative;
      background-color: #3b3e4f;
    }
    .cell.alive {
      background-color: #c084fc;
      box-shadow: 0 0 10px rgba(192, 132, 252, 0.6);
      z-index: 2;
    }
  `;

  render() {
    if (!this.engine) return html`<p>Loading</p>`;

    return html`
      <div class="grid" style="grid-template-columns: repeat(${this.width}, 1fr)">
        ${repeat(
      new Array(this.width * this.height), (_, i) => {
        const x = i % this.width;
        const y = Math.floor(i / this.width);
        return html`
            <div 
              class="cell ${this.engine.getState().grid[y][x] ? 'alive' : ''}" 
              @click=${() => this.engine.getState().toggleCell(x, y)}
            ></div>`;
      })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'conway-grid': ConwayGrid;
  }
}