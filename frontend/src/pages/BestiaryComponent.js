import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Form, Badge, Button } from 'react-bootstrap';
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

    // Fetch animals from API
    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                setLoading(true);
                
                // Try multiple authentication methods
                let headers = {
                    'Content-Type': 'application/json',
                };
                // ( Not lus to go and see what auth)
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

    // Get type color for badges
    const getTypeColor = (type) => {
        const colors = {
            'Predator': 'danger',
            'Large Mammal': 'primary',
            'Antelope': 'success',
            'Small and Medium Mammal': 'warning'
        };
        return colors[type] || 'secondary';
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary" />
                <div className="mt-2">Loading animals...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-3">
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
            </Container>
        );
    }

    return (
        <Container className="bestiary-component">
            {/* Filters Section */}
            <Container className="bestiary-filters mb-4">
                <Row className="g-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Search Animals</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Filter by Type</Form.Label>
                            <Form.Select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                {getAnimalTypes().map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                
                <div className="mt-2">
                    <small className="text-muted">
                        Showing {filteredAnimals.length} of {animals.length} animals
                    </small>
                </div>
            </Container>

            {/* Animals Grid */}
            <Container className="bestiary-cards-wrapper">
                {filteredAnimals.length === 0 ? (
                    <div className="text-center py-5">
                        <h5>No animals found</h5>
                        <p className="text-muted">
                            {searchTerm || selectedType !== 'All' 
                                ? 'Try adjusting your search or filter criteria.'
                                : 'No animals available at the moment.'
                            }
                        </p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {filteredAnimals.map((animal) => (
                            <Col key={animal.id} xs={12} sm={6} md={4} lg={3}>
                                <Card className="bestiary-card h-100">
                                    <div className="card-image-wrapper">
                                        <Card.Img
                                            variant="top"
                                            src={animal.image_url}
                                            alt={animal.name}
                                            className="bestiary-card-image"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-animal.jpg'; // Fallback image
                                            }}
                                        />
                                        <Badge 
                                            bg={getTypeColor(animal.type)} 
                                            className="type-badge"
                                        >
                                            {animal.type}
                                        </Badge>
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="animal-name">
                                            {animal.name}
                                        </Card.Title>
                                        <Card.Text className="animal-description flex-grow-1">
                                            {animal.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </Container>
    );
};

export default BestiaryComponent;