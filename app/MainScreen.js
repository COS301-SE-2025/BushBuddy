import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const MainScreen = ({ route }) => {
  // Use the navigation hook instead of prop
  const navigation = useNavigation();
  
  // Safely access route params with default values if they don't exist
  const params = route?.params || {};
  const username = params.username || 'Jean Steyn';
  
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [cameraVisible, setCameraVisible] = useState(false);
  const [bestiaryFilter, setBestiaryFilter] = useState('All');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showAnimalModal, setShowAnimalModal] = useState(false);

  // Navigate to MapScreen
  const handleMapNavigation = () => {
    console.log('Navigating to MapScreen...');
    navigation.navigate('MapScreen');
    setActiveTab('map');
  };

  // Navigate to FeedScreen
  const handleFeedNavigation = () => {
    console.log('Navigating to FeedScreen...');
    navigation.navigate('FeedScreen');
    setActiveTab('feed');
  };

  // Navigate to ProfileScreen
  const handleProfileNavigation = () => {
    console.log('Navigating to ProfileScreen...');
    navigation.navigate('ProfileScreen');
    setActiveTab('profile');
  };

  // Navigate to CameraPage
  const handleCameraNavigation = () => {
    console.log('Navigating to CameraPage...');
    navigation.navigate('CameraPage');
    setActiveTab('camera');
  };

  // Handle camera action - modified to work without expo-camera
  // const handleCameraAction = () => {
  //   // For now, just show a placeholder screen that simulates the camera
  //   setCameraVisible(true);
  //   console.log('Camera would open here if expo-camera was installed');
  // };

  // Simulate taking a photo
  const takePicture = () => {
    Alert.alert(
      'Photo Captured',
      'Wildlife detection in progress... (This is a simulation, install expo-camera for full functionality)',
      [{ text: 'OK', onPress: () => setCameraVisible(false) }]
    );
  };

  // Exit camera mode
  const handleCloseCamera = () => {
    setCameraVisible(false);
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

  // Sample data for wildlife detection history
  const recentEntries = [
    { id: '1', title: 'Elephant Detection', date: '2025-05-19', type: 'elephant', location: 'Sector A4' },
    { id: '2', title: 'Lion Sighting', date: '2025-05-19', type: 'lion', location: 'Sector B2' },
    { id: '3', title: 'Rhino Tracking', date: '2025-05-18', type: 'rhino', location: 'Sector C7' },
  ];
  //json format that would be used to store the data
  /*
    id:
    name:
    scientificName:
    status:
    category:
    image:
    description:
    facts:
    habitat:
    diet:
    lifespan: 
    */
  // Just mock data for now such that filters look better
  // All the animals from the intial project proposal
  // Bestiary data
const bestiaryData = [
  // ANTELOPES
  {
    id: '17',
    name: 'Lion',  
    scientificName: 'Panthera leo',
    status: 'Vulnerable',
    category: 'Predator',
    image: require('../assets/Lion.jpg'),
    description: 'Apex predator and king of the African savanna, living in social groups called prides.',
    facts: [
      'Only cat species that lives in social groups',
      'Males can weigh up to 250 kg',
      'Roar can be heard up to 8 km away',
      'Females do most of the hunting',
      'Can sleep up to 20 hours per day'
    ],
    habitat: 'Savannas, grasslands, and open woodlands',
    diet: 'Carnivore - large mammals like buffalo, zebra, and antelope',
    lifespan: '10-14 years in the wild'
  },
  {
    id: '2',
    name: 'Greater Kudu',
    scientificName: 'Tragelaphus strepsiceros',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/GreaterKudu.jpg'),
    description: 'Large antelope with distinctive spiral horns and white body stripes.',
    facts: [
      'Males have magnificent spiral horns up to 1.8m long',
      'Excellent jumpers despite their size',
      'Live in small groups of 6-20 individuals',
      'Can go without water for extended periods',
      'Known for their distinctive white tail flash when fleeing'
    ],
    habitat: 'Dense bushland, rocky hills, and dry savannas',
    diet: 'Herbivore - leaves, shoots, fruits, and flowers',
    lifespan: '20-25 years in the wild'
  },
  {
    id: '12',
    name: 'Black Rhinoceros',
    scientificName: 'Diceros bicornis',
    status: 'Critically Endangered',
    category: 'Large Mammal',
    image: require('../assets/BlackRhino.jpg'),
    description: 'Critically endangered rhino species with a pointed lip for browsing.',
    facts: [
      'Also grey in color despite the name',
      'Pointed lip adapted for browsing leaves',
      'More aggressive than white rhinos',
      'Excellent hearing and sense of smell',
      'Can charge at speeds up to 55 km/h'
    ],
    habitat: 'Dense bushland, scrublands, and desert regions',
    diet: 'Herbivore - leaves, shoots, and branches',
    lifespan: '35-50 years in the wild'
  },
  {
    id: '4',
    name: 'Nyala',
    scientificName: 'Tragelaphus angasii',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/Nyala.jpg'),
    description: 'Medium-sized antelope with striking sexual dimorphism between males and females.',
    facts: [
      'Males are much larger and darker than females',
      'Only males have horns with white tips',
      'Live in small groups of 2-10 individuals',
      'Prefer areas near water sources',
      'Males develop a distinctive shaggy coat'
    ],
    habitat: 'Dense woodlands and thickets near water',
    diet: 'Herbivore - leaves, fruits, flowers, and grasses',
    lifespan: '16-20 years in the wild'
  },
  {
    id: '5',
    name: 'Bushbuck',
    scientificName: 'Tragelaphus scriptus',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/BushBuck.jpg'),
    description: 'Small to medium antelope known for its secretive nature and distinctive white markings.',
    facts: [
      'Solitary and highly territorial animals',
      'Males have short, straight horns with slight spiraling',
      'Excellent swimmers and climbers',
      'Active during dawn and dusk hours',
      'Known for their distinctive alarm bark'
    ],
    habitat: 'Dense woodlands, riverine forests, and thick bush',
    diet: 'Herbivore - leaves, shoots, fruits, and flowers',
    lifespan: '12-15 years in the wild'
  },
  {
    id: '18',
    name: 'Leopard',
    scientificName: 'Panthera pardus',
    status: 'Near Threatened',
    category: 'Predator',
    image: require('../assets/Leopard.jpg'),
    description: 'Solitary and adaptable big cat known for its strength and climbing ability.',
    facts: [
      'Can carry prey twice their body weight up trees',
      'Excellent climbers and swimmers',
      'Most adaptable of all big cats',
      'Can leap 20 feet horizontally',
      'Each leopard has unique rosette patterns'
    ],
    habitat: 'Diverse habitats from forests to deserts',
    diet: 'Carnivore - various mammals, birds, and reptiles',
    lifespan: '12-17 years in the wild'
  },
  {
    id: '7',
    name: 'Sable Antelope',
    scientificName: 'Hippotragus niger',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/SableAntelope.jpg'),
    description: 'Magnificent antelope with long, curved horns and striking black and white coloration.',
    facts: [
      'Both sexes have impressive curved horns',
      'Males turn jet black with age',
      'Extremely aggressive when threatened',
      'Live in herds of 10-30 individuals',
      'Known for their fierce fighting ability'
    ],
    habitat: 'Wooded savannas and grasslands',
    diet: 'Herbivore - primarily grasses',
    lifespan: '16-20 years in the wild'
  },
  {
    id: '8',
    name: 'Eland',
    scientificName: 'Taurotragus oryx',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/Eland.jpg'),
    description: 'The largest antelope in Africa, known for its impressive size and graceful movements.',
    facts: [
      'Can jump 8 feet high from a standing position',
      'Weighs up to 940 kg, making it the largest antelope',
      'Lives in herds of 25-60 individuals',
      'Can survive without water for long periods',
      'Both males and females have spiral horns'
    ],
    habitat: 'Savannas, grasslands, and semi-desert regions',
    diet: 'Herbivore - grasses, leaves, fruits, and bark',
    lifespan: '15-20 years in the wild'
  },

  // LARGE MAMMALS
  {
    id: '9',
    name: 'Giraffe',
    scientificName: 'Giraffa camelopardalis',
    status: 'Vulnerable',
    category: 'Large Mammal',
    image: require('../assets/Giraffe.jpg'),
    description: 'World\'s tallest mammal with distinctive long neck and unique spot patterns.',
    facts: [
      'Can reach heights of up to 18 feet',
      'Heart weighs 25 pounds to pump blood to brain',
      'Tongue is 18-20 inches long and dark blue',
      'Can run up to 35 mph despite their height',
      'Sleep only 30 minutes to 2 hours per day'
    ],
    habitat: 'Savannas, grasslands, and open woodlands',
    diet: 'Herbivore - primarily acacia leaves',
    lifespan: '20-25 years in the wild'
  },
  {
    id: '10',
    name: 'African Buffalo',
    scientificName: 'Syncerus caffer',
    status: 'Least Concern',
    category: 'Large Mammal',
    image: require('../assets/Bufalo.jpg'),
    description: 'African buffalo or Cape buffalo, one of the Big Five African game animals.',
    facts: [
      'Live in herds of 50-500 individuals',
      'Excellent memory and can hold grudges',
      'Can weigh up to 900 kg',
      'Known for their unpredictable temperament',
      'Both males and females have horns'
    ],
    habitat: 'Savannas, woodlands, and wetlands',
    diet: 'Herbivore - primarily grasses',
    lifespan: '15-25 years in the wild'
  },
  {
    id: '11',
    name: 'White Rhinoceros',
    scientificName: 'Ceratotherium simum',
    status: 'Near Threatened',
    category: 'Large Mammal',
    image: require('../assets/WhiteRhino.jpg'),
    description: 'Second largest land mammal with distinctive square-shaped lip for grazing.',
    facts: [
      'Actually grey in color, not white',
      'Can weigh up to 2,300 kg',
      'Horn made of keratin, same material as human hair',
      'Can run up to 50 km/h despite their size',
      'Square lip adapted for grazing'
    ],
    habitat: 'Grasslands, savannas, and shrublands',
    diet: 'Herbivore - grasses and low shrubs',
    lifespan: '40-50 years in the wild'
  },
  {
    id: '3',
    name: 'Lesser Kudu',
    scientificName: 'Tragelaphus imberbis',
    status: 'Near Threatened',
    category: 'Antelope',
    image: require('../assets/LesserKudu.jpg'),
    description: 'Smaller cousin of the Greater Kudu with more prominent white stripes.',
    facts: [
      'More secretive and elusive than Greater Kudu',
      'Males have shorter but equally impressive spiral horns',
      'Females are hornless with more prominent stripes',
      'Excellent at hiding in dense vegetation',
      'More dependent on water than Greater Kudu'
    ],
    habitat: 'Dense acacia bushland and dry thornbush',
    diet: 'Herbivore - leaves, shoots, fruits, and flowers',
    lifespan: '15-18 years in the wild'
  },
  {
    id: '13',
    name: 'Hippopotamus',
    scientificName: 'Hippopotamus amphibius',
    status: 'Vulnerable',
    category: 'Large Mammal',
    image: require('../assets/Hippo.jpg'),
    description: 'Large semi-aquatic mammal known as one of Africa\'s most dangerous animals.',
    facts: [
      'Spend up to 16 hours a day in water',
      'Can weigh up to 4,000 kg',
      'Can run 30 km/h on land despite their bulk',
      'Secrete pink "sweat" that acts as sunscreen',
      'Responsible for more human deaths than most large animals'
    ],
    habitat: 'Rivers, lakes, and wetlands',
    diet: 'Herbivore - grasses eaten primarily at night',
    lifespan: '40-50 years in the wild'
  },
  {
    id: '14',
    name: 'Plains Zebra',
    scientificName: 'Equus quagga',
    status: 'Near Threatened',
    category: 'Large Mammal',
    image: require('../assets/Zebra.jpg'),
    description: 'Most common zebra species with distinctive black and white stripes.',
    facts: [
      'Each zebra has a unique stripe pattern',
      'Live in family groups led by a stallion',
      'Can run up to 65 km/h',
      'Stripes may help confuse predators and flies',
      'Communicate through various vocalizations and body language'
    ],
    habitat: 'Grasslands, savannas, and woodlands',
    diet: 'Herbivore - primarily grasses',
    lifespan: '20-25 years in the wild'
  },
  {
    id: '15',
    name: 'Common Warthog',
    scientificName: 'Phacochoerus africanus',
    status: 'Least Concern',
    category: 'Large Mammal',
    image: require('../assets/Warthog.jpg'),
    description: 'Wild pig species known for their distinctive facial "warts" and tusks.',
    facts: [
      'Facial "warts" are actually protective fat deposits',
      'Can run up to 48 km/h',
      'Sleep in burrows for protection',
      'Both sexes have tusks, males\' are larger',
      'Known for backing into burrows to defend with tusks'
    ],
    habitat: 'Savannas, woodlands, and semi-desert regions',
    diet: 'Omnivore - roots, fruits, vegetables, and occasionally small animals',
    lifespan: '12-18 years in the wild'
  },
  {
    id: '16',
    name: 'Bushpig',
    scientificName: 'Potamochoerus larvatus',
    status: 'Least Concern',
    category: 'Large Mammal',
    image: require('../assets/Bushpig.jpg'),
    description: 'Forest-dwelling pig with reddish-brown coat and distinctive white facial markings.',
    facts: [
      'More colorful than warthogs with reddish coat',
      'Excellent swimmers and climbers',
      'Live in family groups called sounders',
      'Active primarily at night',
      'Have excellent hearing and sense of smell'
    ],
    habitat: 'Dense forests, woodlands, and riverine areas',
    diet: 'Omnivore - roots, fruits, crops, and small animals',
    lifespan: '15-20 years in the wild'
  },

  // PREDATORS
  {
    id: '1',
    name: 'Impala',
    scientificName: 'Aepyceros melampus',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/Impala.jpg'),
    description: 'Medium-sized antelope known for its incredible jumping ability and graceful movements.',
    facts: [
      'Can leap up to 10 feet high and 30 feet in length',
      'Lives in herds of 15-100 individuals',
      'Males have distinctive lyre-shaped horns',
      'Can reach speeds of 60 km/h',
      'Known for their synchronized leaping displays'
    ],
    habitat: 'Savannas, woodlands, and bushlands',
    diet: 'Herbivore - grasses, fruits, seeds, and leaves',
    lifespan: '12-15 years in the wild'
  },
  {
    id: '6',
    name: 'Waterbuck',
    scientificName: 'Kobus ellipsiprymnus',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/WaterBuck.jpg'),
    description: 'Large antelope always found near water sources with distinctive white ring marking.',
    facts: [
      'Never found more than 1km from water',
      'Males have long, curved horns',
      'Distinctive white ring around their rump',
      'Can weigh up to 300kg',
      'Have a strong, musky odor'
    ],
    habitat: 'Grasslands and woodlands near water sources',
    diet: 'Herbivore - grasses and occasionally browse',
    lifespan: '18-22 years in the wild'
  },
  {
    id: '19',
    name: 'Cheetah',
    scientificName: 'Acinonyx jubatus',
    status: 'Vulnerable',
    category: 'Predator',
    image: require('../assets/Cheetah.jpg'),
    description: 'World\'s fastest land animal, built for speed with distinctive black tear marks.',
    facts: [
      'Can reach speeds of 110 km/h in short bursts',
      'Cannot retract their claws like other cats',
      'Distinctive black "tear marks" reduce glare',
      'Cannot roar, but can purr like domestic cats',
      'Low genetic diversity makes them vulnerable'
    ],
    habitat: 'Open savannas, grasslands, and semi-desert areas',
    diet: 'Carnivore - small to medium antelopes',
    lifespan: '8-12 years in the wild'
  },
  {
    id: '20',
    name: 'Spotted Hyena',
    scientificName: 'Crocuta crocuta',
    status: 'Least Concern',
    category: 'Predator',
    image: require('../assets/SpottedHyena.jpg'),
    description: 'Powerful scavenger and hunter with incredibly strong jaws and complex social structure.',
    facts: [
      'Strongest bite force among African carnivores',
      'Live in matriarchal societies led by females',
      'Can digest bones with their powerful stomach acid',
      'Communicate through various vocalizations including "laughter"',
      'More closely related to cats than dogs'
    ],
    habitat: 'Savannas, grasslands, and woodland edges',
    diet: 'Carnivore - scavenging and hunting various mammals',
    lifespan: '20-25 years in the wild'
  },
  {
    id: '21',
    name: 'Brown Hyena',
    scientificName: 'Parahyaena brunnea',
    status: 'Near Threatened',
    category: 'Predator',
    image: require('../assets/BrownHyena.jpg'),
    description: 'Solitary scavenger with long, shaggy brown coat adapted to arid environments.',
    facts: [
      'More solitary than spotted hyenas',
      'Excellent scavengers with incredible endurance',
      'Can travel up to 50 km in one night foraging',
      'Have a distinctive long, shaggy coat',
      'Communicate through scent marking'
    ],
    habitat: 'Arid savannas, semi-deserts, and coastal areas',
    diet: 'Carnivore - primarily scavenging, some small prey',
    lifespan: '12-15 years in the wild'
  },
  {
    id: '22',
    name: 'African Wild Dog',
    scientificName: 'Lycaon pictus',
    status: 'Endangered',
    category: 'Predator',
    image: require('../assets/AfricanWildDog.jpg'),
    description: 'Highly social and efficient pack hunters with distinctive mottled coat patterns.',
    facts: [
      'Most successful hunters in Africa with 80% success rate',
      'Live in packs with complex social hierarchies',
      'Each individual has unique coat patterns',
      'Can run at sustained speeds of 60 km/h',
      'Communicate through various vocalizations and body language'
    ],
    habitat: 'Open savannas, grasslands, and semi-arid regions',
    diet: 'Carnivore - medium-sized antelopes and other mammals',
    lifespan: '10-12 years in the wild'
  },

  // SMALL AND MEDIUM MAMMALS
  {
    id: '23',
    name: 'Chacma Baboon',
    scientificName: 'Papio ursinus',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/ChacmaBaboon.jpg'),
    description: 'Largest baboon species with complex social structure and high intelligence.',
    facts: [
      'Live in troops of 20-150 individuals',
      'Complex social hierarchies with alpha males and females',
      'Excellent problem-solvers and tool users',
      'Can weigh up to 45 kg (males)',
      'Communicate through facial expressions and vocalizations'
    ],
    habitat: 'Savannas, woodlands, and rocky areas',
    diet: 'Omnivore - fruits, seeds, insects, and small animals',
    lifespan: '20-30 years in the wild'
  },
  {
    id: '24',
    name: 'Vervet Monkey',
    scientificName: 'Chlorocebus pygerythrus',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/VervetMonkey.jpg'),
    description: 'Small, highly social monkey known for their distinct alarm calls and blue coloration.',
    facts: [
      'Have specific alarm calls for different predators',
      'Males have distinctive blue and red coloration',
      'Live in troops of 10-50 individuals',
      'Excellent swimmers when necessary',
      'Show complex social behaviors and hierarchies'
    ],
    habitat: 'Savannas, woodlands, and riverine forests',
    diet: 'Omnivore - fruits, leaves, seeds, and insects',
    lifespan: '10-15 years in the wild'
  },
  {
    id: '25',
    name: 'Meerkat',
    scientificName: 'Suricata suricatta',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/Meerkat.jpg'),
    description: 'Small mongoose known for their upright posture and complex social sentinel system.',
    facts: [
      'Live in groups called mobs or gangs',
      'Take turns standing guard while others forage',
      'Have a complex system of alarm calls',
      'Can close their ears while digging',
      'Dark patches around eyes reduce glare'
    ],
    habitat: 'Open grasslands and semi-desert regions',
    diet: 'Omnivore - insects, small reptiles, and eggs',
    lifespan: '10-14 years in the wild'
  },
  {
    id: '26',
    name: 'Rock Hyrax',
    scientificName: 'Procavia capensis',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/RockHyrax.jpg'),
    description: 'Small mammal most closely related to elephants, living in rocky outcrops.',
    facts: [
      'Closest living relatives are elephants and manatees',
      'Live in colonies of 5-60 individuals',
      'Have specialized feet for gripping rocky surfaces',
      'Cannot regulate body temperature well',
      'Communicate through various calls and scent marking'
    ],
    habitat: 'Rocky outcrops, cliffs, and boulder formations',
    diet: 'Herbivore - leaves, fruits, and bark',
    lifespan: '9-14 years in the wild'
  },
  {
    id: '27',
    name: 'African Wild Cat',
    scientificName: 'Felis lybica',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/AfricanWildCat.jpg'),
    description: 'Wild ancestor of domestic cats, adapted to various African environments.',
    facts: [
      'Direct ancestor of domestic house cats',
      'Excellent hunters with keen senses',
      'Can survive in very arid conditions',
      'Primarily nocturnal and solitary',
      'Can interbreed with domestic cats'
    ],
    habitat: 'Various habitats from forests to semi-deserts',
    diet: 'Carnivore - small mammals, birds, and reptiles',
    lifespan: '12-15 years in the wild'
  },
  {
    id: '28',
    name: 'Caracal',
    scientificName: 'Caracal caracal',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/Caracal.jpg'),
    description: 'Medium-sized wild cat with distinctive tufted ears and incredible jumping ability.',
    facts: [
      'Can leap 12 feet high to catch birds in flight',
      'Distinctive black ear tufts help with hearing',
      'Excellent climbers and swimmers',
      'Can survive without water for long periods',
      'Known for their incredible speed and agility'
    ],
    habitat: 'Savannas, semi-deserts, and scrublands',
    diet: 'Carnivore - small mammals, birds, and reptiles',
    lifespan: '12-16 years in the wild'
  },
  {
    id: '29',
    name: 'Serval',
    scientificName: 'Leptailurus serval',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/Serval.jpg'),
    description: 'Long-legged wild cat with large ears, adapted for hunting in tall grasslands.',
    facts: [
      'Has the longest legs relative to body size of any cat',
      'Large ears help locate prey in tall grass',
      'Can jump 9 feet high from standing position',
      'Excellent at catching small mammals and birds',
      'Primarily active during dawn and dusk'
    ],
    habitat: 'Tall grasslands, wetlands, and reed beds',
    diet: 'Carnivore - small mammals, birds, and reptiles',
    lifespan: '12-20 years in the wild'
  },
  {
    id: '30',
    name: 'Honey Badger',
    scientificName: 'Mellivora capensis',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/HoneyBadger.jpg'),
    description: 'Fearless and tenacious carnivore known for its aggressive nature and thick skin.',
    facts: [
      'Extremely thick skin protects from bee stings and snake bites',
      'Known to attack animals much larger than themselves',
      'Excellent diggers with powerful claws',
      'Partially immune to snake venom',
      'Will steal honey from beehives, hence the name'
    ],
    habitat: 'Various habitats from forests to semi-deserts',
    diet: 'Omnivore - small mammals, reptiles, insects, and honey',
    lifespan: '20-24 years in the wild'
  },
  {
    id: '31',
    name: 'Aardvark',
    scientificName: 'Orycteropus afer',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/Aardvark.jpg'),
    description: 'Unique nocturnal mammal specialized for eating ants and termites.',
    facts: [
      'Can dig through termite mounds with powerful claws',
      'Long sticky tongue can extend 12 inches',
      'Excellent hearing and sense of smell',
      'Can close nostrils to keep out dirt while digging',
      'Primarily active at night'
    ],
    habitat: 'Savannas, grasslands, and woodlands',
    diet: 'Insectivore - primarily ants and termites',
    lifespan: '18-23 years in the wild'
  },
  {
    id: '32',
    name: 'Pangolin',
    scientificName: 'Smutsia temminckii',
    status: 'Vulnerable',
    category: 'Small and Medium Mammal',
    image: require('../assets/Pangolin.jpg'),
    description: 'Unique scaled mammal that rolls into a ball when threatened.',
    facts: [
      'Only mammal covered in scales made of keratin',
      'Can roll into a complete ball for protection',
      'Long sticky tongue for catching ants and termites',
      'Excellent diggers with powerful claws',
      'Most trafficked mammal in the world'
    ],
    habitat: 'Savannas, woodlands, and grasslands',
    diet: 'Insectivore - ants and termites exclusively',
    lifespan: '20+ years in the wild'
  },

  // ADDITIONAL ANTELOPES
  {
    id: '33',
    name: 'Blue Wildebeest',
    scientificName: 'Connochaetes taurinus',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/BlueWildebeest.jpg'),
    description: 'Large antelope famous for the Great Migration across East Africa.',
    facts: [
      'Participate in the largest land animal migration',
      'Live in herds that can number in hundreds of thousands',
      'Both sexes have curved horns',
      'Excellent runners, can reach 50 km/h',
      'Calves can run within minutes of birth'
    ],
    habitat: 'Open grasslands and savannas',
    diet: 'Herbivore - primarily short grasses',
    lifespan: '15-20 years in the wild'
  },
  {
    id: '34',
    name: 'Black Wildebeest',
    scientificName: 'Connochaetes gnou',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/BlackWildebeest.jpg'),
    description: 'Smaller wildebeest species with distinctive white tail and forward-curved horns.',
    facts: [
      'Smaller than blue wildebeest with distinctive white tail',
      'More territorial than their blue cousins',
      'Both sexes have forward-curving horns',
      'Endemic to southern Africa',
      'Nearly went extinct but recovered through conservation'
    ],
    habitat: 'High altitude grasslands and plains',
    diet: 'Herbivore - short grasses and herbs',
    lifespan: '15-20 years in the wild'
  },
  {
    id: '35',
    name: 'Red Hartebeest',
    scientificName: 'Alcelaphus buselaphus',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/RedHartebeest.jpg'),
    description: 'Fast antelope with distinctive heart-shaped horns and reddish-brown coat.',
    facts: [
      'Can run at speeds up to 70 km/h',
      'Both sexes have heart-shaped horns',
      'Live in herds of 20-300 individuals',
      'Excellent endurance runners',
      'Can survive in semi-arid conditions'
    ],
    habitat: 'Open grasslands and semi-arid savannas',
    diet: 'Herbivore - grasses and occasionally browse',
    lifespan: '15-19 years in the wild'
  },
  {
    id: '36',
    name: 'Blesbok',
    scientificName: 'Damaliscus pygargus phillipsi',
    status: 'Least Concern',
    category: 'Antelope',
    image: require('../assets/Blesbok.jpg'),
    description: 'Medium-sized antelope with distinctive white facial blaze and reddish-brown coat.',
    facts: [
      'Distinctive white blaze on face and white rump patch',
      'Both sexes have ringed horns',
      'Form large herds during winter months',
      'Endemic to South Africa',
      'Nearly extinct but saved through conservation efforts'
    ],
    habitat: 'Highveld grasslands and open plains',
    diet: 'Herbivore - short grasses and herbs',
    lifespan: '13-17 years in the wild'
  },

  // ADDITIONAL SMALL MAMMALS
  {
    id: '37',
    name: 'Bontebok',
    scientificName: 'Damaliscus pygargus pygargus',
    status: 'Vulnerable',
    category: 'Antelope',
    image: require('../assets/Bontebok.jpg'),
    description: 'Rare antelope subspecies with chocolate brown coat and distinctive white markings.',
    facts: [
      'Rarest antelope species in Africa',
      'Distinctive chocolate brown coat with white patches',
      'Both sexes have lyre-shaped horns',
      'Endemic to a small area in South Africa',
      'Population recovered from just 17 individuals'
    ],
    habitat: 'Coastal fynbos and renosterveld',
    diet: 'Herbivore - grasses and fynbos vegetation',
    lifespan: '12-16 years in the wild'
  },
  {
    id: '38',
    name: 'Steenbok',
    scientificName: 'Raphicerus campestris',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/Steenbok.jpg'),
    description: 'Small antelope with large ears and reddish-golden coat.',
    facts: [
      'One of the smallest African antelopes',
      'Only males have short, straight horns',
      'Solitary animals, rarely seen in pairs',
      'Can survive without drinking water',
      'Known for their large, prominent ears'
    ],
    habitat: 'Open grasslands, savannas, and semi-arid regions',
    diet: 'Herbivore - leaves, fruits, and flowers',
    lifespan: '7-12 years in the wild'
  },
  {
    id: '39',
    name: 'Duiker',
    scientificName: 'Sylvicapra grimmia',
    status: 'Least Concern',
    category: 'Small and Medium Mammal',
    image: require('../assets/Duiker.jpg'),
    description: 'Small forest antelope known for diving into thick cover when threatened.',
    facts: [
      'Name means "diver" in Afrikaans',
      'Only males have short, spike-like horns',
      'Excellent at hiding in dense vegetation',
      'Primarily active during dawn and dusk',
      'Can live in various habitat types'
    ],
    habitat: 'Forests, woodlands, and thick bush',
    diet: 'Herbivore - leaves, fruits, flowers, and bark',
    lifespan: '10-15 years in the wild'
  }
];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Endangered': return '#FF5722';
      case 'Near Threatened': return '#FF9800';
      case 'Vulnerable': return '#FFC107';
      case 'Least Concern': return '#4CAF50';
      default: return '#757575';
    }
  };

  const renderEntryItem = ({ item }) => (
    <TouchableOpacity style={styles.entryCard}>
      <View style={[styles.entryIconContainer, 
        item.type === 'elephant' ? {backgroundColor: '#4CAF50'} : 
        item.type === 'lion' ? {backgroundColor: '#FF9800'} : 
        {backgroundColor: '#2196F3'}
      ]}>
        <MaterialIcons 
          name={item.type === 'elephant' ? 'pets' : item.type === 'lion' ? 'warning' : 'track-changes'} 
          size={24} 
          color="white" 
        />
      </View>
      <View style={styles.entryDetails}>
        <Text style={styles.entryTitle}>{item.title}</Text>
        <Text style={styles.entrySubtitle}>{item.location}</Text>
        <Text style={styles.entryDate}>{item.date}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#777" />
    </TouchableOpacity>
  );



const renderBestiaryItem = ({ item }) => (
  <TouchableOpacity 
    style={styles.bestiaryCard}
    onPress={() => handleAnimalPress(item)}
  >
    <Image source={item.image} style={styles.bestiaryImage} />
    <View style={styles.bestiaryContent}>
      <Text style={styles.bestiaryName}>{item.name}</Text>
      <Text style={styles.bestiaryScientific}>{item.scientificName}</Text>
      <View style={styles.bestiaryStatusContainer}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
        <Text style={styles.bestiaryStatus}>{item.status}</Text>
      </View>
      <Text style={styles.bestiaryDescription} numberOfLines={2}>
        {item.description}
      </Text>
    </View>
    <MaterialIcons name="chevron-right" size={20} color="#777" />
  </TouchableOpacity>
);

// Animal Detail Modal Component
const AnimalDetailModal = () => {
  if (!selectedAnimal) return null;

  return (
    <Modal
      visible={showAnimalModal}
      animationType="slide"
      transparent={false}
      onRequestClose={closeAnimalModal}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#4c8c4a', '#1e3b1d']}
          style={styles.modalGradient}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={closeAnimalModal}
            >
              <MaterialIcons name="close" size={28} color="white" />
            </TouchableOpacity>
            <View style={styles.modalStatusContainer}>
              <View style={[styles.modalStatusDot, { backgroundColor: getStatusColor(selectedAnimal.status) }]} />
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
            </View>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Animal Image */}
            <View style={styles.modalImageContainer}>
              <Image source={selectedAnimal.image} style={styles.modalImage} />
            </View>

            {/* Animal Info */}
            <View style={styles.modalInfoContainer}>
              <Text style={styles.modalAnimalName}>{selectedAnimal.name}</Text>
              <Text style={styles.modalScientificName}>{selectedAnimal.scientificName}</Text>
              
              <View style={styles.modalStatusRow}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(selectedAnimal.status) }]} />
                <Text style={styles.modalStatusText}>{selectedAnimal.status}</Text>
              </View>

              {/* Description */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Description</Text>
                <Text style={styles.modalDescription}>{selectedAnimal.description}</Text>
              </View>

              {/* Fun Facts */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Fun Facts</Text>
                {selectedAnimal.facts.map((fact, index) => (
                  <View key={index} style={styles.factRow}>
                    <Text style={styles.factBullet}>•</Text>
                    <Text style={styles.factText}>{fact}</Text>
                  </View>
                ))}
              </View>

              {/* Additional Info */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Details</Text>
                
                <View style={styles.detailRow}>
                  <MaterialIcons name="home" size={16} color="#4CAF50" />
                  <Text style={styles.detailLabel}>Habitat:</Text>
                  <Text style={styles.detailValue}>{selectedAnimal.habitat}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MaterialIcons name="restaurant" size={16} color="#4CAF50" />
                  <Text style={styles.detailLabel}>Diet:</Text>
                  <Text style={styles.detailValue}>{selectedAnimal.diet}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MaterialIcons name="schedule" size={16} color="#4CAF50" />
                  <Text style={styles.detailLabel}>Lifespan:</Text>
                  <Text style={styles.detailValue}>{selectedAnimal.lifespan}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const categoryMap = {
  'Antelopes': 'Antelope',
  'Large Mammals': 'Large Mammal',
  'Predators': 'Predator',
  'Small and Medium Mammals': 'Small and Medium Mammal'
};

// Update your filteredBestiary calculation
const filteredBestiary = bestiaryFilter === 'All' 
  ? bestiaryData 
  : bestiaryData.filter(animal => animal.category === categoryMap[bestiaryFilter]);

// Keep your categories array as-is
const bestiaryCategories = ['All', 'Antelopes', 'Large Mammals', 'Predators', 'Small and Medium Mammals'];

  // If the camera is visible, show a simulated camera screen
  if (cameraVisible) {
    return (
      <View style={styles.cameraContainer}>
        <View style={styles.camera}>
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseCamera}
            >
              <MaterialIcons name="close" size={28} color="white" />
            </TouchableOpacity>
            
            <View style={styles.cameraButtonsRow}>
              <TouchableOpacity 
                style={styles.cameraButton}
              >
                <MaterialIcons name="flash-on" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cameraButton}
              >
                <MaterialIcons name="flip-camera-ios" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Otherwise, show the main app UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4c8c4a', '#1e3b1d']}
        style={styles.gradientContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('../assets/EpiUseLogo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Wildlife Detection</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={require('../assets/Jean-Steyn-ProfilePic.jpg')}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.usernameText}>{username}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#white" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search wildlife sightings..."
              placeholderTextColor="#white"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsCard}>
              <View style={styles.quickActionsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleCameraNavigation}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
                    <MaterialIcons name="camera-alt" size={24} color="white" />
                  </View>
                  <Text style={styles.actionText}>New Detection</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
                    <MaterialIcons name="history" size={24} color="white" />
                  </View>
                  <Text style={styles.actionText}>History</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleMapNavigation}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#2196F3' }]}>
                    <MaterialIcons name="map" size={24} color="white" />
                  </View>
                  <Text style={styles.actionText}>Map View</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <View style={[styles.actionIcon, { backgroundColor: '#9C27B0' }]}>
                    <MaterialIcons name="settings" size={24} color="white" />
                  </View>
                  <Text style={styles.actionText}>Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bestiary Section */}
          <View style={styles.section}>
            <View style={styles.bestiaryHeader}>
              <Text style={styles.sectionTitle}>Bestiary</Text>
              <TouchableOpacity style={styles.achievementsButton}>
                <Text style={styles.achievementsText}>Achievements</Text>
              </TouchableOpacity>
            </View>

            {/* Bestiary Search and Filter */}
            <View style={styles.bestiaryControls}>
              <View style={styles.bestiarySearchContainer}>
                <MaterialIcons name="search" size={16} color="white" />
                <TextInput
                  style={styles.bestiarySearchInput}
                  placeholder="Search"
                  placeholderTextColor="white"
                />
              </View>
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>All</Text>
                <MaterialIcons name="keyboard-arrow-down" size={16} color="#777" />
              </View>
            </View>

            {/* Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPills}>
              {bestiaryCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.filterPill,
                    bestiaryFilter === category && styles.activeFilterPill
                  ]}
                  onPress={() => setBestiaryFilter(category)}
                >
                  <Text style={[
                    styles.filterPillText,
                    bestiaryFilter === category && styles.activeFilterPillText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Bestiary Grid */}
            <View style={styles.bestiaryGrid}>
              {filteredBestiary.map((animal) => (
                <TouchableOpacity 
                  key={animal.id} 
                  style={styles.bestiaryGridItem}
                  onPress={() => handleAnimalPress(animal)}
                >
                  <Image source={animal.image} style={styles.bestiaryGridImage} />
                  <Text style={styles.bestiaryGridName}>{animal.name}</Text>
                  <View style={styles.bestiaryGridStatus}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(animal.status) }]} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Detections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Detections</Text>
            <FlatList
              data={recentEntries}
              renderItem={renderEntryItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>

          {/* Detection Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detection Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>12</Text>
                  <Text style={styles.summaryLabel}>Elephants</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>5</Text>
                  <Text style={styles.summaryLabel}>Lions</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>3</Text>
                  <Text style={styles.summaryLabel}>Rhinos</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={styles.viewMoreText}>View Detailed Report</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Conservation Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conservation Status</Text>
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <MaterialIcons name="warning" size={24} color="#FF9800" />
                <Text style={styles.statusText}>3 potential threats detected in Sector B2</Text>
              </View>
              <View style={styles.statusRow}>
                <MaterialIcons name="notifications" size={24} color="#4CAF50" />
                <Text style={styles.statusText}>New elephant herd movement patterns recorded</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]} 
            onPress={() => setActiveTab('home')}
          >
            <MaterialIcons name="home" size={24} color={activeTab === 'home' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'map' && styles.activeNavItem]} 
            onPress={handleMapNavigation}
          >
            <MaterialIcons name="map" size={24} color={activeTab === 'map' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'map' && styles.activeNavText]}>Map</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleCameraNavigation}
          >
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'reports' && styles.activeNavItem]} 
            onPress={handleFeedNavigation}
          >
            <MaterialIcons name="bar-chart" size={24} color={activeTab === 'reports' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'reports' && styles.activeNavText]}>Feed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]} 
            onPress={handleProfileNavigation}
          >
            <MaterialIcons name="person" size={24} color={activeTab === 'profile' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Animal Detail Modal */}
      <AnimalDetailModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3b1d',
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  usernameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quickActionsCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: '23%',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  // Bestiary Styles
  bestiaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  achievementsButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  achievementsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  bestiaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  bestiarySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    marginRight: 10,
  },
  bestiarySearchInput: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterLabel: {
    color: 'white',
    fontSize: 14,
    marginRight: 4,
  },
  filterPills: {
    marginBottom: 15,
  },
  filterPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterPill: {
    backgroundColor: '#ff6b00',
  },
  filterPillText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  activeFilterPillText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bestiaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bestiaryGridItem: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  bestiaryGridImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  bestiaryGridName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  bestiaryGridStatus: {
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bestiaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  bestiaryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  bestiaryContent: {
    flex: 1,
  },
  bestiaryName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bestiaryScientific: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  bestiaryStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bestiaryStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 6,
  },
  bestiaryDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  entryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  entryDetails: {
    flex: 1,
  },
  entryTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  entrySubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 2,
  },
  entryDate: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 3,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 5,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMoreText: {
    color: '#2196F3',
    fontSize: 14,
    marginRight: 5,
  },
  statusCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 2,
  },
  activeNavText: {
    color: 'white',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#1e3b1d',
  },
  modalGradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modalContent: {
    flex: 1,
  },
  modalImageContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.3,
    borderRadius: 15,
    alignSelf: 'center',
  },
  modalInfoContainer: {
    paddingHorizontal: 20,
  },
  modalAnimalName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalScientificName: {
    color: '#4CAF50',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  modalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  modalStatusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  modalSection: {
    marginBottom: 25,
  },
  modalSectionTitle: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  factRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  factBullet: {
    color: '#4CAF50',
    fontSize: 16,
  },
  factText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  detailLabel: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    width: 80,
  },
  detailValue: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    flex: 1,
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
  cameraButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});

export default MainScreen;