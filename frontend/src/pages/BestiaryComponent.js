import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import './BestiaryComponent.css';
import { checkAuthStatus } from "../controllers/UsersController";

const BestiaryComponent = () => {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Get unique animal types for filtering
    const getAnimalTypes = () => {
        const types = [...new Set(animals.map(animal => animal.type))];
        return ['All', ...types.sort()];
    };

    // Get type/status color for visual indicators
    const getTypeColor = (status) => {
        const colors = {
            'Endangered': '#FF5722',
            'Near Threatened': '#FF9800', 
            'Vulnerable': '#FFC107',
            'Least Concern': '#4CAF50',
            'Predator': '#ff6b00',
            'Large Mammal': '#2196F3',
            'Antelope': '#4CAF50',
            'Small and Medium Mammal': '#9C27B0'
        };
        return colors[status] || '#757575';
    };

    // Fetch animals from API
    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                setLoading(true);
                
                // Try multiple authentication methods
                let headers = {
                    'Content-Type': 'application/json',
                };
                // (Not lus to find the auth)
                // Method 1: Try using your existing checkAuthStatus function
                try {
                    const authData = await checkAuthStatus();
                    console.log('Auth data:', authData); // Debug log
                    
                    if (authData && authData.token) {
                        headers['Authorization'] = `Bearer ${authData.token}`;
                    } else if (authData && authData.accessToken) {
                        headers['Authorization'] = `Bearer ${authData.accessToken}`;
                    }
                } catch (authError) {
                    console.log('checkAuthStatus failed:', authError);
                }
                
                // Method 2: Try common token storage locations
                const possibleTokens = [
                    localStorage.getItem('authToken'),
                    localStorage.getItem('token'),
                    localStorage.getItem('accessToken'),
                    localStorage.getItem('jwt'),
                    sessionStorage.getItem('authToken'),
                    sessionStorage.getItem('token'),
                    sessionStorage.getItem('accessToken'),
                    sessionStorage.getItem('jwt'),
                ];
                
                const token = possibleTokens.find(t => t && t !== 'null' && t !== 'undefined');
                if (token && !headers['Authorization']) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                console.log('Request headers:', headers); // Debug log
                
                const response = await fetch('https://bushbuddy-api-dev.onrender.com/discover/bestiary', {
                    method: 'GET',
                    headers: headers,
                    credentials: 'include', // Include cookies if needed
                });
                
                console.log('Response status:', response.status); // Debug log
                console.log('Response headers:', response.headers); // Debug log
                
                if (!response.ok) {
                    if (response.status === 401) {
                        // Try to get more info about the auth error
                        const errorText = await response.text();
                        console.log('401 Error details:', errorText);
                        throw new Error('Authentication failed. Please check your login status.');
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('API Response:', data); // Debug log
                
                if (data.success && data.data) {
                    setAnimals(data.data);
                    setFilteredAnimals(data.data);
                } else {
                    throw new Error('Invalid data format received');
                }
            } catch (err) {
                console.error('Error fetching bestiary data:', err);
                setError(`Failed to load animals: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();
    }, []);

    // Filter animals based on type and search term
    useEffect(() => {
        let filtered = animals;

        // Filter by type
        if (selectedType !== 'All') {
            filtered = filtered.filter(animal => animal.type === selectedType);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(animal =>
                animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                animal.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredAnimals(filtered);
    }, [animals, selectedType, searchTerm]);

    return (
        <Container className="bestiary-component">
            {/* Header Section */}
            <div className="bestiary-header">
                <h2 className="bestiary-title">Bestiary</h2>
                <button className="achievements-button">
                    Achievements
                </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="bestiary-filters">
                {/* Search and Filter Row */}
                <div className="bestiary-controls">
                    <div className="bestiary-search-container">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        <input
                            type="text"
                            className="bestiary-search-input"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-dropdown-container">
                        <span className="filter-dropdown-label">All</span>
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="filter-pills-container">
                    {getAnimalTypes().map(type => (
                        <button
                            key={type}
                            className={`filter-pill ${selectedType === type ? 'active' : ''}`}
                            onClick={() => setSelectedType(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Results Counter */}
                <div className="results-counter">
                    Showing {filteredAnimals.length} of {animals.length} animals
                </div>
            </div>

            {/* Animals Grid */}
            <div className="bestiary-cards-wrapper">
                {loading ? (
                    <div className="loading-container">
                        <Spinner animation="border" role="status" variant="light" />
                        <div className="mt-2">Loading animals...</div>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <Alert variant="danger">
                            <Alert.Heading>Error Loading Bestiary</Alert.Heading>
                            <p>{error}</p>
                            <hr />
                            <div className="d-flex justify-content-end">
                                <Button 
                                    variant="outline-danger" 
                                    onClick={() => window.location.reload()}
                                >
                                    Retry
                                </Button>
                            </div>
                        </Alert>
                    </div>
                ) : filteredAnimals.length === 0 ? (
                    <div className="empty-state">
                        <h5>No animals found</h5>
                        <p>
                            {searchTerm || selectedType !== 'All' 
                                ? 'Try adjusting your search or filter criteria.'
                                : 'No animals available at the moment.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="row">
                        {filteredAnimals.map((animal) => (
                            <div key={animal.id}>
                                <Card className="bestiary-card h-100">
                                    <div className="card-image-wrapper">
                                        <Card.Img
                                            variant="top"
                                            src={animal.image_url}
                                            alt={animal.name}
                                            className="bestiary-card-image"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-animal.jpg';
                                            }}
                                        />
                                        <Badge className="type-badge">
                                            {animal.type}
                                        </Badge>
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="animal-name">
                                            {animal.name}
                                        </Card.Title>
                                        <div className="status-indicator">
                                            <div 
                                                className="status-dot"
                                                style={{ backgroundColor: getTypeColor(animal.type) }}
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default BestiaryComponent;