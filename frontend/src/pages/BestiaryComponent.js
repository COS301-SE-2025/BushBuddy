import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button, Badge, Modal } from 'react-bootstrap';
import './BestiaryComponent.css';
import { checkAuthStatus } from '../controllers/UsersController';
import { DiscoveryController, handleFetchBestiaryAnimals } from '../controllers/DiscoveryController';

const BestiaryComponent = () => {
	const [animals, setAnimals] = useState([]);
	const [filteredAnimals, setFilteredAnimals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedType, setSelectedType] = useState('All');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedAnimal, setSelectedAnimal] = useState(null);
	const [showAnimalModal, setShowAnimalModal] = useState(false);

	// Get unique animal types for filtering
	const getAnimalTypes = () => {
		const types = [...new Set(animals.map((animal) => animal.type))];
		return ['All', ...types.sort()];
	};

	// Get type/status color for visual indicators
	const getTypeColor = (status) => {
		const colors = {
			Endangered: '#FF5722',
			'Near Threatened': '#FF9800',
			Vulnerable: '#FFC107',
			'Least Concern': '#4CAF50',
			Predator: '#ff6b00',
			'Large Mammal': '#2196F3',
			Antelope: '#4CAF50',
			'Small and Medium Mammal': '#9C27B0',
		};
		return colors[status] || '#757575';
	};

	// Handle animal selection
	const handleAnimalPress = (animal) => {
		setSelectedAnimal(animal);
		setShowAnimalModal(true);
	};

	// Close animal modal
	const closeAnimalModal = () => {
		setShowAnimalModal(false);
		setSelectedAnimal(null);
	};

	// Fetch animals from API
	useEffect(() => {
		const fetchAnimals = async () => {
			if (localStorage.getItem('bestiary')) {
				const bestiary = JSON.parse(localStorage.getItem('bestiary'));
				setAnimals(bestiary);
				setFilteredAnimals(bestiary);
				setLoading(false);
				return;
			}
			try {
				const data = await DiscoveryController.handleFetchBestiaryAnimals();

				if (data.success && data.result.data) {
					setAnimals(data.result.data);
					setFilteredAnimals(data.result.data);
					localStorage.setItem('bestiary', JSON.stringify(data.result.data));
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
			filtered = filtered.filter((animal) => animal.type === selectedType);
		}

		// Filter by search term
		if (searchTerm) {
			filtered = filtered.filter(
				(animal) =>
					animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					animal.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		setFilteredAnimals(filtered);
	}, [animals, selectedType, searchTerm]);

	// Animal Detail Modal Component
	const AnimalDetailModal = () => {
		if (!selectedAnimal) return null;

		return (
			<Modal show={showAnimalModal} onHide={closeAnimalModal} size="lg" centered className="animal-detail-modal">
				<Modal.Body className="modal-body-custom">
					<div className="modal-gradient">
						{/* Modal Header */}
						<div className="modal-header-custom">
							<button className="modal-close-button" onClick={closeAnimalModal}>
								<svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
									<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
								</svg>
							</button>
							<div className="modal-status-container">
								<div
									className="modal-status-dot"
									style={{ backgroundColor: getTypeColor(selectedAnimal.status || selectedAnimal.type) }}
								/>
								<svg width="20" height="20" fill="#4CAF50" viewBox="0 0 16 16">
									<path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
									<path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
								</svg>
							</div>
						</div>

						<div className="modal-content-custom">
							{/* Animal Image */}
							<div className="modal-image-container">
								<img
									src={selectedAnimal.image_url}
									alt={selectedAnimal.name}
									className="modal-image"
									onError={(e) => {
										e.target.src = '/placeholder-animal.jpg';
									}}
								/>
							</div>

							{/* Animal Info */}
							<div className="modal-info-container">
								<h2 className="modal-animal-name">{selectedAnimal.name}</h2>
								<p className="modal-scientific-name">
									{selectedAnimal.scientific_name || selectedAnimal.scientificName || 'Scientific name not available'}
								</p>

								<div className="modal-status-row">
									<div
										className="status-dot"
										style={{ backgroundColor: getTypeColor(selectedAnimal.status || selectedAnimal.type) }}
									/>
									<span className="modal-status-text">
										{selectedAnimal.status || selectedAnimal.type || 'Status not available'}
									</span>
								</div>

								{/* Description */}
								<div className="modal-section">
									<h3 className="modal-section-title">Description</h3>
									<p className="modal-description">{selectedAnimal.description || 'No description available.'}</p>
								</div>

								{/* Fun Facts */}
								{selectedAnimal.facts && selectedAnimal.facts.length > 0 && (
									<div className="modal-section">
										<h3 className="modal-section-title">Fun Facts</h3>
										{selectedAnimal.facts.map((fact, index) => (
											<div key={index} className="fact-row">
												<span className="fact-bullet">•</span>
												<span className="fact-text">{fact}</span>
											</div>
										))}
									</div>
								)}

								{/* Additional Info */}
								<div className="modal-section">
									<h3 className="modal-section-title">Details</h3>

									{selectedAnimal.habitat && (
										<div className="detail-row">
											<svg width="16" height="16" fill="#4CAF50" viewBox="0 0 16 16">
												<path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
											</svg>
											<span className="detail-label">Habitat:</span>
											<span className="detail-value">{selectedAnimal.habitat}</span>
										</div>
									)}

									{selectedAnimal.diet && (
										<div className="detail-row">
											<svg width="16" height="16" fill="#4CAF50" viewBox="0 0 16 16">
												<path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
											</svg>
											<span className="detail-label">Diet:</span>
											<span className="detail-value">{selectedAnimal.diet}</span>
										</div>
									)}

									{selectedAnimal.lifespan && (
										<div className="detail-row">
											<svg width="16" height="16" fill="#4CAF50" viewBox="0 0 16 16">
												<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
												<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
											</svg>
											<span className="detail-label">Lifespan:</span>
											<span className="detail-value">{selectedAnimal.lifespan}</span>
										</div>
									)}

									<div className="detail-row">
										<svg width="16" height="16" fill="#4CAF50" viewBox="0 0 16 16">
											<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
										</svg>
										<span className="detail-label">Type:</span>
										<span className="detail-value">{selectedAnimal.type}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		);
	};

	return (
		<div className="bestiary-component">
			{/* Header Section */}
			<div className="bestiary-header">
				<h2 className="bestiary-title">Bestiary</h2>
				<button className="achievements-button">Achievements</button>
			</div>

			{/* Search and Filter Controls */}
			<div className="bestiary-filters">
				{/* Search and Filter Row */}
				<div className="bestiary-controls">
					<div className="bestiary-search-container">
						<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
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
							<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
						</svg>
					</div>
				</div>

				{/* Filter Pills */}
				<div className="filter-pills-container">
					{getAnimalTypes().map((type) => (
						<button
							key={type}
							className={`filter-pill ${selectedType === type ? 'active' : ''}`}
							onClick={() => setSelectedType(type)}>
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
			{loading ? (
				<div className="beast-loader-wrapper">
					<div className="beast-loader"></div>
				</div>
			) : error ? (
				<div className="error-container">
					<Alert variant="danger">
						<Alert.Heading>Error Loading Bestiary</Alert.Heading>
						<p>{error}</p>
						<hr />
						<div className="d-flex justify-content-end">
							<Button variant="outline-danger" onClick={() => window.location.reload()}>
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
							: 'No animals available at the moment.'}
					</p>
				</div>
			) : (
				<div className="bestiary-cards-wrapper">
					<div className="row">
						{filteredAnimals.map((animal) => (
							<div key={animal.id}>
								<Card className="bestiary-card" onClick={() => handleAnimalPress(animal)}>
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
										<Badge className="type-badge">{animal.type}</Badge>
									</div>
									<Card.Body className="d-flex flex-column">
										<Card.Title className="beast-name">{animal.name}</Card.Title>
										<div className="status-indicator">
											<div className="status-dot" style={{ backgroundColor: getTypeColor(animal.type) }} />
										</div>
									</Card.Body>
								</Card>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Animal Detail Modal */}
			<AnimalDetailModal />
		</div>
	);
};

export default BestiaryComponent;
