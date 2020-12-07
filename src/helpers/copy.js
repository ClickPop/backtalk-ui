import { useRef } from 'react';

export const useCopy = () => {
  const ref = useRef();
  const copy = (e) => {
    e.preventDefault();
    if (ref.current) {
      const copyFrom = document.createElement('textarea');
      copyFrom.value = ref.current.text;
      document.body.appendChild(copyFrom);
      copyFrom.select();
      document.execCommand('copy');
      copyFrom.remove();
    }
  };
  return [ref, copy];
};
