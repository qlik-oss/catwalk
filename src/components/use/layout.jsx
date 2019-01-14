import { useState, useEffect } from 'react';
import debounce from '../render-debouncer';

export default function useLayout(model) {
  const [layout, setLayout] = useState();

  useEffect(() => {
    if (!model) return null;

    let isKilled = false;

    const modelChanged = async () => {
      try {
        const newLayout = model.getAppLayout
          ? await model.getAppLayout()
          : await model.getLayout();
        if (!isKilled) {
          debounce(() => {
            setLayout(newLayout);
          });
        }
      } catch (err) {
        setLayout(null);
      }
    };

    model.on('changed', modelChanged);
    modelChanged();

    return () => {
      isKilled = true;
      model.removeListener('changed', modelChanged);
    };
  }, [model && model.id]);

  return layout;
}
