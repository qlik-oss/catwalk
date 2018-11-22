import { useEffect } from 'react';

export default function useClickOutside(selfRef, ongoing, callback) {
  useEffect(() => {
    if (!ongoing) return null;

    const onClick = (evt) => {
      if (!selfRef.current.contains(evt.target)) {
        callback(evt);
      }
    };

    document.addEventListener('mouseup', onClick);
    return () => { document.removeEventListener('mouseup', onClick); };
  }, [ongoing]);
}
