import { useState, useEffect } from 'react';

export default function useLayout(model) {
  const [layout, setLayout] = useState(null);
  useEffect(() => {
    if (!model) return () => {};
    const modelChanged = async () => {
      const newLayout = await model.getLayout();
      setLayout(newLayout);
    };
    model.on('changed', modelChanged);
    modelChanged();
    return () => {
      model.removeListener('changed', modelChanged);
    };
  }, [model]);
  return layout;
}
