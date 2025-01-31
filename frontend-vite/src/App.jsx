import React, { useState } from 'react';
import { Container, Box, Tabs, Tab, Typography, CircularProgress } from '@mui/material';
import GamePlanner from './components/GamePlanner';
import StudyPlanner from './components/StudyPlanner';
import GameRecommendations from './components/GameRecommendations';
import StudyRecommendations from './components/StudyRecommendations';
import TrendingGames from './components/TrendingGames';
import AuthPage from './components/auth/AuthPage';
import UserProfile from './components/auth/UserProfile';
import Header from './components/layout/Header';
import { useAuth } from './context/AuthContext';

function App() {
  const [value, setValue] = useState(0);
  const { user, loading } = useAuth();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onTabChange={setValue} />
      
      <Container maxWidth="lg" sx={{ flex: 1, mt: 4 }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Game Planner" />
              <Tab label="Study Planner" />
              <Tab label="Game Recommendations" />
              <Tab label="Study Recommendations" />
              <Tab label="Trending Games" />
              <Tab label="Profile" />
            </Tabs>
          </Box>

          {value === 0 && <GamePlanner />}
          {value === 1 && <StudyPlanner />}
          {value === 2 && <GameRecommendations />}
          {value === 3 && <StudyRecommendations />}
          {value === 4 && <TrendingGames />}
          {value === 5 && <UserProfile />}
        </Box>
      </Container>
    </Box>
  );
}

export default App;
