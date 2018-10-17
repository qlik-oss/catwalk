import ReactDOM from 'react-dom';

let timer = null;
let pendingStateMutators = [];

function fireAllPendingMutators() {
  ReactDOM.unstable_batchedUpdates(() => {
    pendingStateMutators.forEach(mutator => mutator());
    pendingStateMutators = [];
  });
}

function debounce(stateMutator) {
  pendingStateMutators.push(stateMutator)

  if (timer != null) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    fireAllPendingMutators();
    timer = null;
  }, 20);
}


export default debounce;
