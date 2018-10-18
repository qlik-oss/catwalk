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
  timer = setTimeout(() => {
    fireAllPendingMutators();
    timer = null;
  }, averageInterMutateInterval * 3 + 2);
}


export default debounce;
