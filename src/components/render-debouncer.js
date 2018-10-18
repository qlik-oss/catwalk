import ReactDOM from 'react-dom';

let timer = null;
let pendingStateMutators = [];
let startTime = null;
function fireAllPendingMutators() {
  ReactDOM.unstable_batchedUpdates(() => {
    pendingStateMutators.forEach(mutator => mutator());
    pendingStateMutators = [];
  });
}

function debounce(stateMutator) {
  pendingStateMutators.push(stateMutator);
  if (timer != null) {
    // Timer already pending
    clearTimeout(timer);
  } else {
    // No timer pending, set start time
    startTime = new Date().getTime();
  }
  const now = new Date().getTime();
  const averageInterMutateInterval = (now - startTime) / pendingStateMutators.length;
  const timerInterval = (averageInterMutateInterval < 32) ? averageInterMutateInterval * 3 + 4 : 100; // Never wait more than 100 ms
  timer = setTimeout(() => {
    fireAllPendingMutators();
    timer = null;
  }, timerInterval);
}


export default debounce;
