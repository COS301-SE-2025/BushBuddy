import requests
import os
import json
from tqdm import tqdm

# Define your target species and their respective scientific names
# This is a good practice for more robust API calls
target_species = {
    'African Buffalo': 'Syncerus caffer',
    'Blue Wildebeest': 'Connochaetes taurinus',
    'Bontebok': 'Damaliscus pygargus',
    'Bushbuck': 'Tragelaphus scriptus',
    'Chacma Baboon': 'Papio ursinus',
    'Cheetah': 'Acinonyx jubatus',
    'Common Warthog': 'Phacochoerus africanus',
    'Duiker': 'Sylvicapra grimmia',
    'Eland': 'Taurotragus oryx',
    'Giraffe': 'Giraffa camelopardalis',
    'Greater Kudu': 'Tragelaphus strepsiceros',
    'Hippopotamus': 'Hippopotamus amphibius',
    'Impala': 'Aepyceros melampus',
    'Leopard': 'Panthera pardus',
    'Lion': 'Panthera leo',
    'Nyala': 'Tragelaphus angasii',
    'Plains Zebra': 'Equus quagga',
    'Red Hartebeest': 'Alcelaphus buselaphus',
    'Rock Hyrax': 'Procavia capensis',
    'Spotted Hyena': 'Crocuta crocuta',
    'Steenbok': 'Raphicerus campestris',
    'Vervet Monkey': 'Chlorocebus pygerythrus',
    'Waterbuck': 'Kobus ellipsiprymnus',
    'White Rhinoceros': 'Ceratotherium simum'
    # Add the rest later. JUst want to test the code with a few species first
}

# Parameters for your dataset
MAX_IMAGES_PER_SPECIES = 100 
# Split ratio: 70% train, 20% validation, 10% test
TRAIN_SPLIT = 0.7
VALIDATION_SPLIT = 0.2
TEST_SPLIT = 0.1

output_base_dir = "african_wildlife_dataset"

# Create Necessary Directories
for split in ['train', 'validation', 'test']:
    os.makedirs(os.path.join(output_base_dir, split), exist_ok=True)

for common_name, scientific_name in target_species.items():
    images_downloaded = 0
    page = 1
    
    # Create species-specific folders
    species_dir_name = common_name.replace(' ', '_')
    
    print(f"Starting download for {common_name} ({scientific_name})...")
    
    while images_downloaded < MAX_IMAGES_PER_SPECIES:
        url = f"https://api.inaturalist.org/v1/observations"
        params = {
            "taxon_name": scientific_name,
            "place_id": 6986, # South Africa
            "photos": "true",
            "licensed": "true",
            "per_page": 200, # Request a larger number of results per page
            "page": page,
            "order_by": "votes",
            "order": "desc"
        }
        
        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if not data['results']:
                print(f"No more images found for {common_name}.")
                break
                
            for obs in data['results']:
                for photo in obs.get('photos', []):
                    if images_downloaded >= MAX_IMAGES_PER_SPECIES:
                        break
                        
                    image_url = photo['url'].replace('square', 'medium')
                    image_id = photo['id']
                    
                    # Determine split
                    if images_downloaded < MAX_IMAGES_PER_SPECIES * TRAIN_SPLIT:
                        split_dir = 'train'
                    elif images_downloaded < MAX_IMAGES_PER_SPECIES * (TRAIN_SPLIT + VALIDATION_SPLIT):
                        split_dir = 'validation'
                    else:
                        split_dir = 'test'
                    
                    # Create species folder within the split directory
                    save_dir = os.path.join(output_base_dir, split_dir, species_dir_name)
                    os.makedirs(save_dir, exist_ok=True)
                    
                    file_path = os.path.join(save_dir, f"{image_id}.jpg")
                    
                    if not os.path.exists(file_path):
                        try:
                            img_data = requests.get(image_url, timeout=15).content
                            with open(file_path, 'wb') as handler:
                                handler.write(img_data)
                            images_downloaded += 1
                        except requests.exceptions.RequestException as e:
                            # A single image download fails, just skip to the next one
                            continue
            
            if images_downloaded >= MAX_IMAGES_PER_SPECIES:
                break
                
            page += 1

        except requests.exceptions.RequestException as e:
            print(f"An error occurred while fetching data for {common_name}: {e}")
            break

    print(f"Downloaded {images_downloaded} images for {common_name}.")
    
print("\n🎉 All downloads complete!")