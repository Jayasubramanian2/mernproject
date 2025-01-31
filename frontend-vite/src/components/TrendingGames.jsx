import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Tooltip,
    CircularProgress,
    Chip,
    LinearProgress,
    Button,
    Snackbar,
    Alert
} from '@mui/material';
import {
    TrendingUp as TrendingIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    People as PeopleIcon,
    Star as StarIcon,
    AddToQueue as AddToQueueIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const trendingGames = [
    {
        id: 1,
        title: "Baldur's Gate 3",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
        popularity: 98,
        playerCount: "875K",
        rating: 4.9,
        genre: "RPG",
        releaseDate: "2023",
        liked: false
    },
    {
        id: 2,
        title: "Palworld",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
        popularity: 95,
        playerCount: "1.2M",
        rating: 4.7,
        genre: "Survival",
        releaseDate: "2024",
        liked: false
    },
    {
        id: 3,
        title: "Helldivers 2",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg",
        popularity: 92,
        playerCount: "450K",
        rating: 4.6,
        genre: "Action",
        releaseDate: "2024",
        liked: false
    },
    {
        id: 4,
        title: "Enshrouded",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1203630/header.jpg",
        popularity: 90,
        playerCount: "350K",
        rating: 4.5,
        genre: "Survival",
        releaseDate: "2024",
        liked: false
    },
    {
        id: 5,
        title: "Lethal Company",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg",
        popularity: 88,
        playerCount: "200K",
        rating: 4.8,
        genre: "Horror",
        releaseDate: "2023",
        liked: false
    },
    {
        id: 6,
        title: "Like a Dragon: Infinite Wealth",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1899330/header.jpg",
        popularity: 85,
        playerCount: "180K",
        rating: 4.7,
        genre: "Action RPG",
        releaseDate: "2024",
        liked: false
    }
];

const TrendingGames = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setGames(trendingGames);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleLike = (gameId) => {
        setGames(games.map(game =>
            game.id === gameId ? { ...game, liked: !game.liked } : game
        ));
    };

    const handleAddToPlanner = async (game) => {
        try {
            const gameData = {
                title: game.title,
                genre: game.genre,
                description: `A trending game with ${game.playerCount} active players and a ${game.rating}/5.0 rating.`,
                plannedDate: new Date().toISOString().split('T')[0], // Today's date as default
                duration: "2", // Default duration
                status: "Not Started"
            };

            const response = await fetch(`${API_URL}/api/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(gameData)
            });

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: 'Game added to planner successfully!',
                    severity: 'success'
                });
            } else {
                throw new Error('Failed to add game to planner');
            }
        } catch (error) {
            console.error('Error adding game to planner:', error);
            setSnackbar({
                open: true,
                message: 'Failed to add game to planner. Please try again.',
                severity: 'error'
            });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="fade-in">
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4" fontWeight="bold">
                    Trending Games
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {games.map((game, index) => (
                    <Grid item xs={12} sm={6} md={4} key={game.id}>
                        <Card className="hover-card">
                            <CardMedia
                                component="img"
                                height="180"
                                image={game.image}
                                alt={game.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {index + 1}. {game.title}
                                    </Typography>
                                    <Tooltip title={game.liked ? 'Unlike' : 'Like'}>
                                        <IconButton
                                            onClick={() => handleLike(game.id)}
                                            color={game.liked ? 'error' : 'default'}
                                            size="small"
                                        >
                                            {game.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <Chip
                                        label={game.genre}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={game.releaseDate}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Popularity
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={game.popularity}
                                            sx={{
                                                flexGrow: 1,
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: 'rgba(0,0,0,0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 4,
                                                    background: 'linear-gradient(90deg, #2196f3, #1976d2)'
                                                }
                                            }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {game.popularity}%
                                        </Typography>
                                    </Box>
                                </Box>

                                <Grid container spacing={1} sx={{ mb: 2 }}>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PeopleIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {game.playerCount} players
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <StarIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {game.rating} / 5.0
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<AddToQueueIcon />}
                                    onClick={() => handleAddToPlanner(game)}
                                    className="button-hover"
                                >
                                    Add to Planner
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TrendingGames;
