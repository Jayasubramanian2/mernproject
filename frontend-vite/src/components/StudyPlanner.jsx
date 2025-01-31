import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Card,
    CardContent,
    IconButton,
    MenuItem,
    Snackbar,
    Alert,
    LinearProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const StudyPlanner = () => {
    const { token } = useAuth();
    const [studies, setStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingStudy, setEditingStudy] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [studyData, setStudyData] = useState({
        title: '',
        subject: '',
        description: '',
        plannedDate: '',
        duration: '',
        status: 'Not Started'
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const fetchStudies = async () => {
        try {
            const response = await fetch(`${API_URL}/api/studies`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch studies');
            const data = await response.json();
            setStudies(data);
        } catch (error) {
            console.error('Error fetching studies:', error);
            showSnackbar('Failed to fetch studies', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudies();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudyData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingStudy 
                ? `${API_URL}/api/studies/${editingStudy._id}`
                : `${API_URL}/api/studies`;
            
            const method = editingStudy ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...studyData,
                    plannedDate: new Date(studyData.plannedDate).toISOString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save study plan');
            }

            showSnackbar(editingStudy ? 'Study plan updated successfully!' : 'Study plan added successfully!');
            setStudyData({
                title: '',
                subject: '',
                description: '',
                plannedDate: '',
                duration: '',
                status: 'Not Started'
            });
            setEditingStudy(null);
            setOpenDialog(false);
            fetchStudies();
        } catch (error) {
            console.error('Error saving study plan:', error);
            showSnackbar(error.message || 'Error saving study plan', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this study plan?')) return;
        
        try {
            const response = await fetch(`${API_URL}/api/studies/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete study plan');
            
            showSnackbar('Study plan deleted successfully');
            fetchStudies();
        } catch (error) {
            console.error('Error deleting study plan:', error);
            showSnackbar('Failed to delete study plan', 'error');
        }
    };

    const handleEdit = (study) => {
        setEditingStudy(study);
        setStudyData({
            title: study.title,
            subject: study.subject,
            description: study.description || '',
            plannedDate: study.plannedDate ? new Date(study.plannedDate).toISOString().split('T')[0] : '',
            duration: study.duration || '',
            status: study.status || 'Not Started'
        });
        setOpenDialog(true);
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ fontSize: 32 }} />
                    Study Planner
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setEditingStudy(null);
                        setStudyData({
                            title: '',
                            subject: '',
                            description: '',
                            plannedDate: '',
                            duration: '',
                            status: 'Not Started'
                        });
                        setOpenDialog(true);
                    }}
                >
                    Add Study Plan
                </Button>
            </Box>

            <Grid container spacing={3}>
                {studies.map((study) => (
                    <Grid item xs={12} sm={6} md={4} key={study._id}>
                        <Card className="hover-card">
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {study.title}
                                    </Typography>
                                    <Box>
                                        <IconButton size="small" onClick={() => handleEdit(study)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(study._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Subject: {study.subject}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {study.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Planned Date: {new Date(study.plannedDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Duration: {study.duration}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Status: {study.status}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingStudy ? 'Edit Study Plan' : 'Add Study Plan'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={studyData.title}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Subject"
                            name="subject"
                            value={studyData.subject}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={studyData.description}
                            onChange={handleInputChange}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <TextField
                            fullWidth
                            label="Planned Date"
                            name="plannedDate"
                            type="date"
                            value={studyData.plannedDate}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth
                            label="Duration (e.g., 2 hours)"
                            name="duration"
                            value={studyData.duration}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            select
                            label="Status"
                            name="status"
                            value={studyData.status}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        >
                            <MenuItem value="Not Started">Not Started</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingStudy ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
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

export default StudyPlanner;
