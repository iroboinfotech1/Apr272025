import * as React from "react";
export const isValidPlayDuration = (input) => {
    let pattern = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
    return pattern.test(input);
};
