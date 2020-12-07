import { useRef, useState } from 'react';

export const useCopy = () => {
  const [copied, setCopied] = useState(false);
  const ref = useRef();
  const copy = async (e) => {
    e.preventDefault();
    if (ref.current) {
      try {
        await navigator.clipboard.writeText(ref.current.text);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      } catch (err) {
        console.error(err);
        //TODO add error
      }
    }
  };
  return [ref, copy, copied];
};
