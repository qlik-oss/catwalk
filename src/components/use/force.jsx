import { useState } from 'react';

const toggle = state => !state;

export default function useForce() {
  const [, force] = useState(true);
  const forceUpdate = () => {
    force(toggle);
  };

  return forceUpdate;
}
