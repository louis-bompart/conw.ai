import React, { Fragment, memo } from 'react';
import { AddonPanel, TabsState, Button } from 'storybook/internal/components';
import { useTheme } from 'storybook/theming';
import { EVENTS } from './constants';
import { useChannel } from 'storybook/manager-api';

interface PanelProps {
  active?: boolean;
}

export const Panel: React.FC<PanelProps> = memo(function MyPanel(props: PanelProps) {
  const theme = useTheme();
  const emit = useChannel({});

  return (
    <AddonPanel active={props.active ?? false}>
      <div>
        <Button onClick={() => emit(EVENTS.PLAY)}>Play</Button>
        <Button onClick={() => emit(EVENTS.PAUSE)}>Pause</Button>
        <Button onClick={() => emit(EVENTS.TICK)}>Tick</Button>
        <Button onClick={() => emit(EVENTS.CLEAR)}>Clear</Button>
      </div>
    </AddonPanel>
  );
});


// import { useChannel } from 'storybook/manager-api';
// import { EVENTS } from './constants';
// import { styled } from 'storybook/theming';

// const Container = styled.div({
//   padding: '16px',
//   display: 'flex',
//   gap: '8px',
// });

// export const Panel = (props: any) => {
//   const emit = useChannel({});

//   return (
//     <Container>
//       <button onClick={() => emit(EVENTS.PLAY)}>Play</button>
//       <button onClick={() => emit(EVENTS.PAUSE)}>Pause</button>
//       <button onClick={() => emit(EVENTS.TICK)}>Tick</button>
//       <button onClick={() => emit(EVENTS.CLEAR)}>Clear</button>
//     </Container>
//   );
// };
