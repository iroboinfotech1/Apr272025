import { Button, ButtonGroup } from "@mui/material";
import React, { useState } from "react";

interface IncDecCounterProps {
    onIncreaseClick: () => void;
    onDecreaseClick: () => void;
    value: number;
}
const IncDecCounter: React.FC<IncDecCounterProps> = ({onDecreaseClick,onIncreaseClick,value}) => {
    return (
        <ButtonGroup size="small" aria-label="small outlined button group">
            <Button disabled={value < 1} onClick={onDecreaseClick}>-</Button>
            <Button disabled>{value}</Button>
            <Button onClick={onIncreaseClick}>+</Button>
        </ButtonGroup>
    );

}
export default IncDecCounter;
