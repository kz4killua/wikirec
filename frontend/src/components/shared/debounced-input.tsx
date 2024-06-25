import { Input, InputProps } from "../ui/input";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';


interface DebouncedInputProps extends InputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>
}


export function DebouncedInput(props : DebouncedInputProps) {
  const [inputValue, setInputValue] = useState('')
  const latestChangeEvent = useRef<React.ChangeEvent<HTMLInputElement>>()

  const debouncedOnChange = useCallback(
    debounce((value) => {
      if (latestChangeEvent.current) {
        props.onChange(latestChangeEvent.current);
      }
    }, 200), 
    [props.onChange]
  );

  // Call the debounced function whenever the inputValue changes
  useEffect(() => {
    debouncedOnChange(inputValue);
    return () => {
        debouncedOnChange.cancel();
    };
  }, [inputValue, debouncedOnChange]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
    latestChangeEvent.current = event;
  }

  return (
    <Input 
      {...props} 
      value={inputValue} 
      onChange={handleChange}
    />
  )

}