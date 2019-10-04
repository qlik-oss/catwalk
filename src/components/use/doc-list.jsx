import usePromise from 'react-use-promise';

export default function useDocList(global) {
  return usePromise(() => (global ? global.getDocList() : null), [global]);
}
