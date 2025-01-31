import React, { useState } from 'react';
import { Container } from '@mui/material';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <Container maxWidth="sm">
            {isLogin ? (
                <Login onToggleForm={() => setIsLogin(false)} />
            ) : (
                <Register onToggleForm={() => setIsLogin(true)} />
            )}
        </Container>
    );
};

export default AuthPage;
