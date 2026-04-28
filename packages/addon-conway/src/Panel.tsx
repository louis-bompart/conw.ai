import React, { memo } from 'react';
import { AddonPanel, Button } from 'storybook/internal/components';
import { useTheme } from 'storybook/theming';
import { EVENTS } from './constants';
import { useChannel, useStorybookApi } from 'storybook/manager-api';

interface PanelProps {
  active?: boolean;
}
export const Panel: React.FC<PanelProps> = memo(function MyPanel(props: PanelProps) {
  const theme = useTheme();
  const api = useStorybookApi()
  const emit = useChannel({
    [EVENTS.SAVE]: (payload: string) => {
      navigator.clipboard.writeText(payload);
      api.addNotification({
        id: 'conway-save',
        content: {
          headline: 'Simulation state saved',
          subHeadline: 'Grid has been copied to the clipboard.',
        },
      })
    },
  });
  return (
    <AddonPanel active={props.active ?? false}>
      <div>
        <Button onClick={() => emit(EVENTS.PLAY)}>Play</Button>
        <Button onClick={() => emit(EVENTS.PAUSE)}>Pause</Button>
        <Button onClick={() => emit(EVENTS.TICK)}>Tick</Button>
        <Button onClick={() => emit(EVENTS.CLEAR)}>Clear</Button>
        <Button onClick={() => emit(EVENTS.SAVE_REQUEST)}>Save</Button>
      </div>
    </AddonPanel>
  );
});
