'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const ComponentWithAuth: React.FC = (props) => {
        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
};

export default withAuth;
