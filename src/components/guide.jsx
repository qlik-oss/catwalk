import React,
{
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import steps from './guide-steps';

import './guide.pcss';

// The component needs to be wrapped in `forwardRef` to give access to the
// ref object assigned using the `ref` prop.
const Guide = forwardRef((props, ref) => {
  const [runGuide, setRunGuide] = useState(!localStorage.getItem('catwalkGuide'));
  const [stepIndex, setStepIndex] = useState(0);

  // Any instance of the component is extended with what is returned from the
  // callback passed as the second argument.
  useImperativeHandle(ref, () => ({
    startGuideFunc() {
      if (!runGuide) {
        setRunGuide(true);
      }
    },
  }));

  const setStep = (stepName) => {
    setRunGuide(false);
    setStepIndex(steps.findIndex(s => s.step === stepName));
    setTimeout(() => setRunGuide(true), 300);
  };

  const onClick = useCallback((evt) => {
    let parentElemName = evt.target.parentElement.className;
    if (parentElemName) {
      parentElemName = parentElemName.trim();
    }

    if (parentElemName === 'field') {
      // a click in the field (to open the filterbox).
      // stop and start the guide in order to highlight the opened filterbox.
      setRunGuide(false);
      setRunGuide(true);
    }
    if (parentElemName === 'add-button') {
      // a click on the big hypercube builder button.
      setStep('selectEntity');
    } else if (parentElemName === 'expression' || parentElemName === 'expression-list') {
      // a click on an expression in the hypercube builder.
      let nbrOfColumns = 0;
      const table = document.getElementsByClassName('hypercube-table');
      if (table.length > 0) {
        const virtTable = table[0].getElementsByClassName('ReactVirtualized__Table');
        if (virtTable.length > 0) {
          nbrOfColumns = virtTable[0].getAttribute('aria-colcount');
        }
      }
      if (nbrOfColumns > 0) {
        setStep('cubeFinished');
      } else {
        setStep('addAnotherColumn');
      }
    } else if (parentElemName === 'column-add-button') {
      // a click on the little add button in the hypercube builder.
      setStep('selectAnotherEntity');
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const {
      action, index, type, status,
    } = data;

    if ([EVENTS.TOUR_START].includes(type)) {
      document.addEventListener('mouseup', onClick);
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunGuide(false);
      setStepIndex(0);
      localStorage.setItem('catwalkGuide', 'catwalk');
      document.removeEventListener('mouseup', onClick);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const newStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      // Update state to advance the guide
      setStepIndex(newStepIndex);
    }
  };

  return (
    <Joyride
      continuous
      stepIndex={stepIndex}
      showProgress
      showSkipButton
      disableBeacon
      run={runGuide}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#398ab5',
        },
      }}
      steps={steps}
    />
  );
});

export default Guide;
