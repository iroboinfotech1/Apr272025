import { Button, ButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";

const BookServiceCounter = ({
  handleCounterUpdate,
  service,
  selectedCounterValue,
}) => {
  const [counter, setCounter] = useState(0);
  const [disableDec, setDisableDec] = useState(true);
  useEffect(() => {
    if (selectedCounterValue && selectedCounterValue > 0) {
      setDisableDec(false);
      setCounter(selectedCounterValue);
    }
  }, [selectedCounterValue]);
  const handleIncrement = () => {
    setCounter(counter + 1);
    if (counter > 0) setDisableDec(false);
    handleCounterUpdate(service, counter + 1);
  };

  const handleDecrement = () => {
    setCounter(counter - 1);
    if (counter == 1) setDisableDec(true);
    handleCounterUpdate(service, counter - 1);
  };

  return (
    <ButtonGroup size="small" aria-label="small outlined button group">
      <Button disabled={disableDec} onClick={handleDecrement}>
        -
      </Button>
      <Button disabled>{counter}</Button>
      <Button onClick={handleIncrement}>+</Button>
    </ButtonGroup>
  );
};

export default BookServiceCounter;
