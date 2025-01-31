import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Alert,
    Snackbar
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const GamePlanner = () => {
    const { token } = useAuth();
    const [games, setGames] = useState([]);
    const [gameData, setGameData] = useState({
        title: '',
        genre: '',
        description: '',
        plannedDate: '',
        duration: '',
        status: 'Not Started'
    });
    const [editingGame, setEditingGame] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const statusOptions = ['Not Started', 'In Progress', 'Completed'];

    useEffect(() => {
        fetchGames();
    }, [token]);

    const fetchGames = async () => {
        try {
            const response = await fetch(`${API_URL}/api/games`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setGames(data);
            }
        } catch (error) {
            console.error('Error fetching games:', error);
            showSnackbar('Error fetching games', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingGame 
                ? `${API_URL}/api/games/${editingGame._id}`
                : `${API_URL}/api/games`;
            
            const method = editingGame ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...gameData,
                    plannedDate: new Date(gameData.plannedDate).toISOString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save game');
            }

            showSnackbar(editingGame ? 'Game updated successfully!' : 'Game added successfully!', 'success');
            setGameData({
                title: '',
                genre: '',
                description: '',
                plannedDate: '',
                duration: '',
                status: 'Not Started'
            });
            setEditingGame(null);
            setOpenDialog(false);
            fetchGames();
        } catch (error) {
            console.error('Error saving game:', error);
            showSnackbar(error.message || 'Error saving game', 'error');
        }
    };

    const handleDelete = async (gameId) => {
        try {
            const response = await fetch(`${API_URL}/api/games/${gameId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                showSnackbar('Game deleted successfully!', 'success');
                fetchGames();
            }
        } catch (error) {
            console.error('Error deleting game:', error);
            showSnackbar('Error deleting game', 'error');
        }
    };

    const handleEdit = (game) => {
        setEditingGame(game);
        setGameData({
            title: game.title,
            genre: game.genre,
            description: game.description || '',
            plannedDate: game.plannedDate ? new Date(game.plannedDate).toISOString().split('T')[0] : '',
            duration: game.duration || '',
            status: game.status || 'Not Started'
        });
        setOpenDialog(true);
    };

    const handleChange = (e) => {
        setGameData({ ...gameData, [e.target.name]: e.target.value });
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Game Plans
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        setEditingGame(null);
                        setGameData({
                            title: '',
                            genre: '',
                            description: '',
                            plannedDate: '',
                            duration: '',
                            status: 'Not Started'
                        });
                        setOpenDialog(true);
                    }}
                >
                    Add New Game Plan
                </Button>
            </Box>

            <Grid container spacing={3}>
                {games.map((game) => (
                    <Grid item xs={12} sm={6} md={4} key={game._id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="h6" gutterBottom>
                                        {game.title}
                                    </Typography>
                                    <Box>
                                        <IconButton onClick={() => handleEdit(game)} size="small">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(game._id)} size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography color="textSecondary" gutterBottom>
                                    Genre: {game.genre}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {game.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Planned Date: {new Date(game.plannedDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Duration: {game.duration} hours
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Status: {game.status}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingGame ? 'Edit Game Plan' : 'Add New Game Plan'}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Game Title"
                                    name="title"
                                    value={gameData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Genre"
                                    name="genre"
                                    value={gameData.genre}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={gameData.description}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Planned Date"
                                    name="plannedDate"
                                    value={gameData.plannedDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Duration (hours)"
                                    name="duration"
                                    value={gameData.duration}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Status"
                                    name="status"
                                    value={gameData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {editingGame ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

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

export default GamePlanner;
