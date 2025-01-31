import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    Rating,
    CircularProgress,
    TextField,
    InputAdornment,
    Snackbar,
    Alert
} from '@mui/material';
import { Search as SearchIcon, Gamepad as GamepadIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const popularGames = [
    {
        id: 1,
        title: "The Witcher 3: Wild Hunt",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
        description: "An award-winning open-world RPG with a rich story and stunning visuals.",
        genre: "RPG",
        rating: 4.9,
        difficulty: "Medium",
        playtime: "50 hours"
    },
    {
        id: 2,
        title: "Red Dead Redemption 2",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
        description: "Epic tale of life in America's unforgiving heartland with amazing graphics.",
        genre: "Action-Adventure",
        rating: 4.8,
        difficulty: "Medium",
        playtime: "60 hours"
    },
    {
        id: 3,
        title: "Elden Ring",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
        description: "An epic action-RPG from FromSoftware with a vast, interconnected world.",
        genre: "Action RPG",
        rating: 4.7,
        difficulty: "Hard",
        playtime: "70 hours"
    },
    {
        id: 4,
        title: "Stardew Valley",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
        description: "Relaxing farming simulation RPG with charming pixel art and engaging gameplay.",
        genre: "Simulation",
        rating: 4.8,
        difficulty: "Easy",
        playtime: "40 hours"
    },
    {
        id: 5,
        title: "Cyberpunk 2077",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        description: "Open-world action game set in Night City, a megalopolis obsessed with power.",
        genre: "Action RPG",
        rating: 4.5,
        difficulty: "Medium",
        playtime: "55 hours"
    },
    {
        id: 6,
        title: "Hades",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
        description: "Rogue-like dungeon crawler with fast-paced action and Greek mythology.",
        genre: "Action Roguelike",
        rating: 4.9,
        difficulty: "Medium",
        playtime: "25 hours"
    },
    {
        id: 7,
        title: "Minecraft",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/524220/header.jpg",
        description: "Creative building game with endless possibilities and adventures.",
        genre: "Sandbox",
        rating: 4.8,
        difficulty: "Easy",
        playtime: "Unlimited"
    },
    {
        id: 8,
        title: "God of War",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg",
        description: "Epic adventure through Norse mythology with stunning combat and storytelling.",
        genre: "Action-Adventure",
        rating: 4.9,
        difficulty: "Medium",
        playtime: "30 hours"
    },
    {
        id: 9,
        title: "Hollow Knight",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
        description: "Beautiful, haunting Metroidvania with challenging gameplay and rich lore.",
        genre: "Metroidvania",
        rating: 4.8,
        difficulty: "Hard",
        playtime: "35 hours"
    },
    {
        id: 10,
        title: "Portal 2",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
        description: "Mind-bending puzzle game with innovative mechanics and humor.",
        genre: "Puzzle",
        rating: 4.9,
        difficulty: "Medium",
        playtime: "10 hours"
    }
];

const GameRecommendations = () => {
    const { token, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredGames, setFilteredGames] = useState(popularGames);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const filtered = popularGames.filter(game =>
            game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.genre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGames(filtered);
    }, [searchTerm]);

    const handleAddToPlanner = async (game) => {
        if (!isAuthenticated || !token) {
            setSnackbar({
                open: true,
                message: 'Please log in to add games to your planner',
                severity: 'warning'
            });
            return;
        }

        try {
            // Convert playtime to a standardized format
            let duration = game.playtime;
            if (typeof duration === 'string' && duration.includes('+')) {
                duration = duration.replace('+', '');
            }

            const gameData = {
                title: game.title,
                genre: game.genre,
                description: game.description,
                plannedDate: new Date().toISOString().split('T')[0],
                duration: duration,
                status: "Not Started"
            };

            console.log('Sending request with token:', token);
            const response = await fetch('http://localhost:5000/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(gameData)
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to add to planner');
            }

            setSnackbar({
                open: true,
                message: 'Game added to planner successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding to planner:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to add game to planner. Please try again.',
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
                <GamepadIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4" fontWeight="bold">
                    Game Recommendations
                </Typography>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search games by title or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 4 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Grid container spacing={3}>
                {filteredGames.map((game) => (
                    <Grid item xs={12} sm={6} md={4} key={game.id}>
                        <Card className="hover-card">
                            <CardMedia
                                component="img"
                                height="200"
                                image={game.image}
                                alt={game.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom noWrap>
                                    {game.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <Chip
                                        label={game.genre}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Rating value={game.rating} precision={0.1} size="small" readOnly />
                                        <Typography variant="body2" color="text.secondary">
                                            ({game.rating})
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 2,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {game.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
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

export default GameRecommendations;
