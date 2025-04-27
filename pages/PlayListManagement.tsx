import React, { useEffect, useState } from "react";
import Index from "./playlist/index";
import withAuth from '../HOC/withAuth';

function PlayListManagement() {
    return (       
        <Index></Index>
    )
}

export default withAuth(PlayListManagement);