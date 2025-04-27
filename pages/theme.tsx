import React, { useEffect, useState } from "react";
import Index from "../pages/playlist/manage/theme/index";
import withAuth from '../HOC/withAuth';

function ThemeManagement() {
    return (       
        <Index></Index>
    )
}
export default withAuth(ThemeManagement);