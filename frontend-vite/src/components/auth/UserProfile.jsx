import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Avatar,
    Container
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
    const { user, logout } = useAuth();

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                        sx={{ 
                            width: 100, 
                            height: 100, 
                            bgcolor: 'primary.main',
                            fontSize: '2rem'
                        }}
                    >
                        {user?.username?.[0]?.toUpperCase()}
                    </Avatar>

                    <Typography variant="h5">
                        {user?.username}
                    </Typography>

                    <Typography color="textSecondary">
                        {user?.email}
                    </Typography>

                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={logout}
                        sx={{ mt: 2 }}
                    >
                        Sign Out
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default UserProfile;
