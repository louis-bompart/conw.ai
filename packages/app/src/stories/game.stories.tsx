import preview from '../../.storybook/preview.ts'
import '../style.css'; // ensure styles are loaded
import { addons } from 'storybook/preview-api';
import { createConwayStore } from '@conwai/engine';
import '../components/conway-grid'; // Import the lit component
import { html } from 'lit';

const ADDON_ID = 'conwai/addon-conway';
const EVENTS = {
    PLAY: `${ADDON_ID}/play`,
    PAUSE: `${ADDON_ID}/pause`,
    TICK: `${ADDON_ID}/tick`,
    CLEAR: `${ADDON_ID}/clear`,
};

const meta = preview.meta({
    title: 'GameOfLife/LitGrid',
});

export const Default = meta.story({
    render: () => html`
        <conway-grid></conway-grid>
        `,
    play: ({ canvasElement }) => {
        const engine = createConwayStore(30, 20);

        const gridElement = canvasElement.querySelector('conway-grid') as any;
        if (!gridElement) throw new Error('Grid element not found');
        gridElement.engine = engine;

        const channel = addons.getChannel();
        // Remove existing listeners if necessary to prevent memory leaks in hot reloads
        channel.removeAllListeners(EVENTS.PLAY);
        channel.removeAllListeners(EVENTS.PAUSE);
        channel.removeAllListeners(EVENTS.TICK);
        channel.removeAllListeners(EVENTS.CLEAR);

        channel.on(EVENTS.PLAY, () => engine.getState().play());
        channel.on(EVENTS.PAUSE, () => engine.getState().pause());
        channel.on(EVENTS.TICK, () => engine.getState().tick());
        channel.on(EVENTS.CLEAR, () => engine.getState().clear());

        return gridElement;
    }
});