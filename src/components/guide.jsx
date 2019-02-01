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
    isGuideRunning() {
      return runGuide;
    },
  }));

  const getNbrOfColumnsInCube = () => {
    let nbrOfColumns = 0;
    const table = document.getElementsByClassName('hypercube-table');
    if (table.length > 0) {
      const virtTable = table[table.length - 1].getElementsByClassName('ReactVirtualized__Table');
      if (virtTable.length > 0) {
        nbrOfColumns = virtTable[0].getAttribute('aria-colcount');
      }
    }
    return nbrOfColumns;
  };

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
      const nbrOfColumns = getNbrOfColumnsInCube();
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

  const endGuide = () => {
    setRunGuide(false);
    setStepIndex(0);
    localStorage.setItem('catwalkGuide', 'catwalk');
    document.removeEventListener('mouseup', onClick);
  };

  const readyToProceed = (newStepIndex) => {
    if (newStepIndex < steps.length) {
      const stepName = steps[newStepIndex].step;
      if (stepName === 'selections') {
        const selections = document.querySelector('.selections-inner li');
        if (!selections) return false;
      } else if (stepName === 'selectEntity' || stepName === 'selectAnotherEntity') {
        const overlay = document.getElementsByClassName('cube-column-chooser');
        if (overlay.length <= 0) {
          return false;
        }
      } else if (stepName === 'addAnotherColumn') {
        // we need to have a hypercube with a column in order for the step to be valid.
        const nbrOfColumns = getNbrOfColumnsInCube();
        if (nbrOfColumns <= 0) {
          return false;
        }
      } else if (stepName === 'cubeFinished') {
        const nbrOfColumns = getNbrOfColumnsInCube();
        if (nbrOfColumns > 0) {
          return false;
        }
      }
    }
    // we are ready to proceed with this step.
    return true;
  };

  const handleJoyrideCallback = (data) => {
    const {
      action, index, type, status,
    } = data;
    if ([EVENTS.TOUR_START].includes(type)) {
      document.addEventListener('mouseup', onClick);
    } else if ([ACTIONS.START].includes(action) && index === 0) {
      // if the guide is restarted there will be no EVENTS.TOUR_START, the EventListener must
      // be added on ACTION.START and step 0.
      document.addEventListener('mouseup', onClick);
    } else if ([ACTIONS.CLOSE].includes(action) || [STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      if (runGuide) {
        endGuide();
      }
    } else if ([EVENTS.STEP_AFTER].includes(type)) {
      const newStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      if (action !== ACTIONS.PREV && !readyToProceed(newStepIndex)) {
        // we are not ready to proceed to the next step. Reset the current step.
        // The stop/start of the guide is needed to reset the Joyride events, or it will
        // be somewhere in between steps, statewise.
        setRunGuide(false);
        setStepIndex(index);
        setTimeout(() => setRunGuide(true), 100);
      } else {
        // Update state to advance the guide
        setStepIndex(newStepIndex);
      }
    } else if ([EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // The target could not be found. Go to next step.
      const newStepIndex = index + 1;
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
      disableOverlayClose
      run={runGuide}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#398ab5',
        },
        buttonClose: {
          display: 'none',
        },
        buttonSkip: {
          color: '#398ab5',
        },
      }}
      steps={steps}
    />
  );
});

export default Guide;
