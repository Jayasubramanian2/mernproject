import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    CircularProgress,
    TextField,
    InputAdornment,
    Avatar,
    IconButton,
    Tooltip,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Search as SearchIcon,
    School as SchoolIcon,
    AccessTime as TimeIcon,
    Bookmark as BookmarkIcon,
    Share as ShareIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const studyResources = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        platform: "Udemy",
        instructor: "Dr. Angela Yu",
        image: "https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg",
        description: "Comprehensive web development course covering HTML, CSS, JavaScript, Node.js, and more.",
        category: "Web Development",
        rating: 4.8,
        duration: "65 hours",
        level: "Beginner to Advanced",
        price: "$19.99"
    },
    {
        id: 2,
        title: "Machine Learning Specialization",
        platform: "Coursera",
        instructor: "Andrew Ng",
        image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/fb/434900b53611e5a5b959c9ddc0b5ea/Banner3.png",
        description: "Learn machine learning from Stanford University faculty, covering supervised learning, unsupervised learning, and best practices.",
        category: "Machine Learning",
        rating: 4.9,
        duration: "80 hours",
        level: "Intermediate",
        price: "Free (Certificate: $49)"
    },
    {
        id: 3,
        title: "Python for Everybody",
        platform: "edX",
        instructor: "Charles Severance",
        image: "https://www.py4e.com/images/python-for-everybody.jpg",
        description: "Learn Python programming from scratch, perfect for beginners with no coding experience.",
        category: "Programming",
        rating: 4.7,
        duration: "40 hours",
        level: "Beginner",
        price: "Free (Certificate: $39)"
    },
    {
        id: 4,
        title: "React - The Complete Guide",
        platform: "Udemy",
        instructor: "Maximilian Schwarzmüller",
        image: "https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg",
        description: "Master React.js with Hooks, Redux, React Router, and modern React development practices.",
        category: "Web Development",
        rating: 4.8,
        duration: "48 hours",
        level: "All Levels",
        price: "$19.99"
    },
    {
        id: 5,
        title: "CS50: Introduction to Computer Science",
        platform: "Harvard/edX",
        instructor: "David J. Malan",
        image: "https://prod-discovery.edx-cdn.org/media/course/image/da1b2400-322b-459b-97b0-0c557f05d017-ef1e27c6afed.small.png",
        description: "Harvard's introduction to computer science and programming, covering multiple languages and concepts.",
        category: "Computer Science",
        rating: 4.9,
        duration: "100 hours",
        level: "Beginner to Intermediate",
        price: "Free (Certificate: $90)"
    },
    {
        id: 6,
        title: "AWS Certified Solutions Architect",
        platform: "A Cloud Guru",
        instructor: "Ryan Kroonenburg",
        image: "https://res.cloudinary.com/acloud-guru/image/fetch/c_thumb,f_auto,q_auto/https://acg-wordpress-content-production.s3.us-west-2.amazonaws.com/app/uploads/2020/10/AWS-Certified-Solutions-Architect-Associate-SAA-C02.jpg",
        description: "Comprehensive AWS certification preparation course with hands-on labs.",
        category: "Cloud Computing",
        rating: 4.8,
        duration: "35 hours",
        level: "Intermediate",
        price: "$29/month"
    },
    {
        id: 7,
        title: "Complete Data Science Bootcamp",
        platform: "Udemy",
        instructor: "365 Careers",
        image: "https://img-c.udemycdn.com/course/480x270/1754098_e0df_3.jpg",
        description: "Learn data science, Python, SQL, Power BI, and statistical analysis.",
        category: "Data Science",
        rating: 4.7,
        duration: "70 hours",
        level: "Beginner to Advanced",
        price: "$19.99"
    },
    {
        id: 8,
        title: "UI/UX Design Specialization",
        platform: "Coursera",
        instructor: "California Institute of the Arts",
        image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/4a/49a4d0f10611e7a17f49cbaa0b62ca/Course1Logo_1200x1200.jpg",
        description: "Master the principles of visual design, UX research, and prototyping.",
        category: "Design",
        rating: 4.6,
        duration: "55 hours",
        level: "Beginner",
        price: "Free (Certificate: $49)"
    },
    {
        id: 9,
        title: "Flutter & Dart - Complete Development Course",
        platform: "Udemy",
        instructor: "Maximilian Schwarzmüller",
        image: "https://img-c.udemycdn.com/course/480x270/1708340_7108_5.jpg",
        description: "Build native iOS and Android apps with Flutter, Google's UI toolkit.",
        category: "Mobile Development",
        rating: 4.8,
        duration: "45 hours",
        level: "Intermediate",
        price: "$19.99"
    },
    {
        id: 10,
        title: "Cybersecurity Specialization",
        platform: "Coursera",
        instructor: "University of Maryland",
        image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/08/33f720502a11e59e72391aa537f5c9/JPEG_20150622_637.jpg",
        description: "Learn cybersecurity concepts, tools, and best practices from industry experts.",
        category: "Cybersecurity",
        rating: 4.7,
        duration: "90 hours",
        level: "Intermediate to Advanced",
        price: "Free (Certificate: $49)"
    }
];

const StudyRecommendations = () => {
    const { token, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResources, setFilteredResources] = useState(studyResources);
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
        const filtered = studyResources.filter(resource =>
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.instructor.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredResources(filtered);
    }, [searchTerm]);

    const handleAddToPlanner = async (resource) => {
        if (!isAuthenticated || !token) {
            setSnackbar({
                open: true,
                message: 'Please log in to add courses to your planner',
                severity: 'warning'
            });
            return;
        }

        try {
            const studyData = {
                title: resource.title,
                subject: resource.category,
                description: `${resource.description}\n\nInstructor: ${resource.instructor}\nPlatform: ${resource.platform}\nPrice: ${resource.price}`,
                plannedDate: new Date().toISOString().split('T')[0],
                duration: resource.duration,
                status: "Not Started"
            };

            console.log('Sending request with token:', token);
            const response = await fetch('http://localhost:5000/api/studies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(studyData)
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to add to planner');
            }

            setSnackbar({
                open: true,
                message: 'Course added to planner successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding to planner:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to add course to planner. Please try again.',
                severity: 'error'
            });
        }
    };

    const getLevelColor = (level) => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return '#4caf50';
            case 'intermediate':
                return '#ff9800';
            case 'advanced':
                return '#f44336';
            default:
                return '#757575';
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
                <SchoolIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4" fontWeight="bold">
                    Study Recommendations
                </Typography>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by title, category, or tags..."
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
                {filteredResources.map((resource) => (
                    <Grid item xs={12} sm={6} md={4} key={resource.id}>
                        <Card className="hover-card">
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        {resource.instructor.split(' ').map(n => n[0]).join('')}
                                    </Avatar>
                                    <Box>
                                        <Tooltip title="Save for later">
                                            <IconButton size="small">
                                                <BookmarkIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Share">
                                            <IconButton size="small">
                                                <ShareIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>

                                <Typography variant="h6" gutterBottom>
                                    {resource.title}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <TimeIcon fontSize="small" color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        {resource.duration}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {resource.instructor} • {resource.platform}
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        label={resource.level}
                                        size="small"
                                        sx={{
                                            bgcolor: `${getLevelColor(resource.level)}15`,
                                            color: getLevelColor(resource.level),
                                            fontWeight: 600,
                                            mr: 1
                                        }}
                                    />
                                    <Chip
                                        label={resource.category}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
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
                                    {resource.description}
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                </Box>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleAddToPlanner(resource)}
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

export default StudyRecommendations;
