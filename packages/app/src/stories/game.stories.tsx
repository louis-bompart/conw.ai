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
    SAVE_REQUEST: `${ADDON_ID}/save-request`,
    SAVE: `${ADDON_ID}/save`,
};

type CustomArgs = {
    width: number
    height: number
    initialState: string
}

const meta = preview.type<{ args: CustomArgs & { [key in Exclude<string, keyof CustomArgs>]: never } }>().meta({
    title: 'The Game of Life',
    argTypes: {
        width: { name: 'Grid width', control: 'number', description: 'Width of the grid' },
        height: { name: 'Grid height', control: 'number', description: 'Height of the grid' },
        initialState: { name: 'Initial state', control: 'text', description: 'Initial state of the grid' },
        currentState: { control: 'text', name: 'Current state', table: { readOnly: true } },
        engine: { control: 'object', table: { disable: true } }
    },
    args: {
        width: 30,
        height: 20,
        initialState: ''
    },
    render: () => html`
        <conway-grid></conway-grid>
        `,
    play: ({ canvasElement, args }) => {
        const engine = createConwayStore(args.width, args.height, args.initialState);
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
        channel.on(EVENTS.SAVE_REQUEST, () => {
            channel.emit(EVENTS.SAVE, engine.getState().game.toString());
        });

        return gridElement;
    }
});

export const Default = meta.story({
    name: 'Blank Canvas'
});

export const PulsarPeriod3 = meta.story({
    name: 'Pulsar Period 3',
    args: {
        width: 50,
        height: 50,
        initialState: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADjgAAAAAAAAAAAAAAhQgAAAAAIUIAAAAACFCAAAAAAOOAAAAAAAAAAAAAAA44AAAAAAhQgAAAAAIUIAAAAACFCAAAAAAAAAAAAAADjgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==-2500'
    }
});