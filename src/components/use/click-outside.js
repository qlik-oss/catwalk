import { useEffect } from 'react';

export default function useClickOutside(selfRef, ongoing, callback) {
  useEffect(() => {
    console.log('1');
    if (!ongoing) return null;
    console.log('2');
    const onClick = (evt) => {
      console.log('3');
      if (!selfRef.current.contains(evt.target)) {
        console.log('4');
        callback(evt);
      }
    };

    document.addEventListener('mouseup', onClick);
    return () => { document.removeEventListener('mouseup', onClick); };
  }, [ongoing, selfRef.current]);
}
