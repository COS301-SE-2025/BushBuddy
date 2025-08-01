# iNaturalist Data Extraction Script for African Wildlife
import os
import json
import shutil
import tarfile
import requests
from collections import defaultdict
from tqdm import tqdm
import pandas as pd

class INaturalistDataExtractor:
    def __init__(self):
        self.target_species = [
            # Antelopes
            'Impala', 'Greater Kudu', 'Lesser Kudu', 'Nyala', 'Bushbuck', 'Waterbuck', 
            'Sable Antelope', 'Eland', 'Blue Wildebeest', 'Black Wildebeest', 
            'Red Hartebeest', 'Blesbok', 'Bontebok', 'Duiker', 'Steenbok',
            
            # Large Mammals
            'Giraffe', 'African Buffalo', 'White Rhinoceros', 'Black Rhinoceros', 
            'Hippopotamus', 'Plains Zebra', 'Common Warthog', 'Bushpig',
            
            # Predators
            'Lion', 'Leopard', 'Cheetah', 'Spotted Hyena', 'Brown Hyena', 'African Wild Dog',
            
            # Small and Medium Mammals
            'Chacma Baboon', 'Vervet Monkey', 'Meerkat', 'Rock Hyrax', 'African Wild Cat',
            'Caracal', 'Serval', 'Honey Badger', 'Aardvark', 'Pangolin'
        ]
        
        # Alternative names that might appear in iNaturalist
        self.species_aliases = {
            'Impala': ['Aepyceros melampus'],
            'Greater Kudu': ['Tragelaphus strepsiceros'],
            'Lesser Kudu': ['Tragelaphus imberbis'],
            'Nyala': ['Tragelaphus angasii'],
            'Bushbuck': ['Tragelaphus scriptus', 'Tragelaphus sylvaticus'],
            'Waterbuck': ['Kobus ellipsiprymnus'],
            'Sable Antelope': ['Hippotragus niger'],
            'Eland': ['Taurotragus oryx', 'Common Eland'],
            'Blue Wildebeest': ['Connochaetes taurinus'],
            'Black Wildebeest': ['Connochaetes gnou'],
            'Red Hartebeest': ['Alcelaphus buselaphus'],
            'Blesbok': ['Damaliscus pygargus phillipsi'],
            'Bontebok': ['Damaliscus pygargus'],
            'Duiker': ['Sylvicapra grimmia', 'Common Duiker'],
            'Steenbok': ['Raphicerus campestris'],
            
            'Giraffe': ['Giraffa camelopardalis', 'Giraffa giraffa'],
            'African Buffalo': ['Syncerus caffer', 'Cape Buffalo'],
            'White Rhinoceros': ['Ceratotherium simum'],
            'Black Rhinoceros': ['Diceros bicornis'],
            'Hippopotamus': ['Hippopotamus amphibius'],
            'Plains Zebra': ['Equus quagga', 'Common Zebra'],
            'Common Warthog': ['Phacochoerus africanus'],
            'Bushpig': ['Potamochoerus larvatus'],
            
            'Lion': ['Panthera leo'],
            'Leopard': ['Panthera pardus'],
            'Cheetah': ['Acinonyx jubatus'],
            'Spotted Hyena': ['Crocuta crocuta'],
            'Brown Hyena': ['Hyaena brunnea'],
            'African Wild Dog': ['Lycaon pictus', 'African Painted Dog'],
            
            'Chacma Baboon': ['Papio ursinus'],
            'Vervet Monkey': ['Chlorocebus pygerythrus'],
            'Meerkat': ['Suricata suricatta'],
            'Rock Hyrax': ['Procavia capensis'],
            'African Wild Cat': ['Felis lybica'],
            'Caracal': ['Caracal caracal'],
            'Serval': ['Leptailurus serval'],
            'Honey Badger': ['Mellivora capensis'],
            'Aardvark': ['Orycteropus afer'],
            'Pangolin': ['Smutsia temminckii', 'Ground Pangolin']
        }
    
    def download_inat_annotations(self, download_dir='inat_data'):
        """Download iNaturalist 2021 annotations"""
        os.makedirs(download_dir, exist_ok=True)
        
        annotation_urls = {
            'train': 'https://ml-inat-competition-datasets.s3.amazonaws.com/2021/train.json.tar.gz',
            'val': 'https://ml-inat-competition-datasets.s3.amazonaws.com/2021/val.json.tar.gz'
        }
        
        for split, url in annotation_urls.items():
            filename = f'{split}.json.tar.gz'
            filepath = os.path.join(download_dir, filename)
            
            if not os.path.exists(filepath):
                print(f"Downloading {split} annotations...")
                response = requests.get(url, stream=True)
                total_size = int(response.headers.get('content-length', 0))
                
                with open(filepath, 'wb') as f, tqdm(
                    desc=filename,
                    total=total_size,
                    unit='B',
                    unit_scale=True,
                    unit_divisor=1024,
                ) as pbar:
                    for chunk in response.iter_content(chunk_size=8192):
                        size = f.write(chunk)
                        pbar.update(size)
                
                # Extract the tar.gz file
                with tarfile.open(filepath, 'r:gz') as tar:
                    tar.extractall(download_dir)
                
                print(f"Downloaded and extracted {filename}")
            else:
                print(f"{filename} already exists")
        
        return download_dir
    
    def find_matching_species(self, categories):
        """Find categories that match our target species"""
        matching_categories = {}
        species_counts = defaultdict(int)
        
        for category in categories:
            category_name = category['name'].lower()
            category_id = category['id']
            
            # Check direct matches
            for target_species in self.target_species:
                if target_species.lower() in category_name:
                    matching_categories[category_id] = target_species
                    species_counts[target_species] += 1
                    break
            
            # Check aliases
            if category_id not in matching_categories:
                for target_species, aliases in self.species_aliases.items():
                    for alias in aliases:
                        if alias.lower() in category_name:
                            matching_categories[category_id] = target_species
                            species_counts[target_species] += 1
                            break
                    if category_id in matching_categories:
                        break
        
        print(f"Found {len(matching_categories)} matching categories for {len(species_counts)} species")
        print("\nSpecies found in dataset:")
        for species, count in sorted(species_counts.items()):
            print(f"  {species}: {count} categories")
        
        return matching_categories, species_counts
    
    def create_balanced_dataset(self, annotations, images, matching_categories, 
                              output_dir, max_images_per_species=1000):
        """Create a balanced dataset with the extracted species"""
        
        # Group images by species
        species_images = defaultdict(list)
        
        print("Grouping images by species...")
        image_lookup = {img['id']: img for img in images}
        
        for ann in tqdm(annotations):
            if ann['category_id'] in matching_categories:
                species = matching_categories[ann['category_id']]
                image_info = image_lookup[ann['image_id']]
                species_images[species].append(image_info)
        
        # Create balanced splits
        splits = {'train': 0.7, 'validation': 0.2, 'test': 0.1}
        
        for species, images_list in species_images.items():
            if len(images_list) == 0:
                continue
                
            # Limit images per species
            if len(images_list) > max_images_per_species:
                images_list = images_list[:max_images_per_species]
            
            # Create splits
            n_images = len(images_list)
            n_train = int(n_images * splits['train'])
            n_val = int(n_images * splits['validation'])
            
            train_images = images_list[:n_train]
            val_images = images_list[n_train:n_train + n_val]
            test_images = images_list[n_train + n_val:]
            
            # Create directories and save image info
            for split_name, split_images in [('train', train_images), 
                                           ('validation', val_images), 
                                           ('test', test_images)]:
                if len(split_images) > 0:
                    species_dir = os.path.join(output_dir, split_name, species.replace(' ', '_'))
                    os.makedirs(species_dir, exist_ok=True)
                    
                    # Save image file paths for later downloading
                    image_list_file = os.path.join(species_dir, 'image_list.txt')
                    with open(image_list_file, 'w') as f:
                        for img in split_images:
                            f.write(f"{img['file_name']}\n")
            
            print(f"{species}: {len(train_images)} train, {len(val_images)} val, {len(test_images)} test")
        
        return species_images
    
    def download_images_from_urls(self, species_images, base_url, output_dir):
        """Download actual images from iNaturalist"""
        print("Downloading images...")
        
        for species, images_list in species_images.items():
            species_dir = species.replace(' ', '_')
            
            for split in ['train', 'validation', 'test']:
                split_dir = os.path.join(output_dir, split, species_dir)
                image_list_file = os.path.join(split_dir, 'image_list.txt')
                
                if os.path.exists(image_list_file):
                    with open(image_list_file, 'r') as f:
                        image_files = [line.strip() for line in f.readlines()]
                    
                    print(f"Downloading {len(image_files)} images for {species} ({split})")
                    
                    for img_file in tqdm(image_files, desc=f"{species} {split}"):
                        img_url = f"{base_url}/{img_file}"
                        img_path = os.path.join(split_dir, img_file)
                        
                        if not os.path.exists(img_path):
                            try:
                                response = requests.get(img_url, timeout=30)
                                if response.status_code == 200:
                                    with open(img_path, 'wb') as f:
                                        f.write(response.content)
                            except Exception as e:
                                print(f"Failed to download {img_file}: {e}")
    
    def process_inat_dataset(self, inat_dir, output_dir, max_images_per_species=1000):
        """Main function to process iNaturalist dataset"""
        
        print("Processing iNaturalist dataset for African Wildlife...")
        
        # Load train annotations
        train_json_path = os.path.join(inat_dir, 'train.json')
        if not os.path.exists(train_json_path):
            print(f"Train annotations not found at {train_json_path}")
            return
        
        with open(train_json_path, 'r') as f:
            train_data = json.load(f)
        
        print(f"Loaded {len(train_data['annotations'])} training annotations")
        print(f"Found {len(train_data['categories'])} categories")
        print(f"Found {len(train_data['images'])} images")
        
        # Find matching species
        matching_categories, species_counts = self.find_matching_species(train_data['categories'])
        
        if not matching_categories:
            print("No matching species found in the dataset!")
            return
        
        # Create balanced dataset
        os.makedirs(output_dir, exist_ok=True)
        species_images = self.create_balanced_dataset(
            train_data['annotations'], 
            train_data['images'], 
            matching_categories, 
            output_dir, 
            max_images_per_species
        )
        
        # Save dataset summary
        summary = {
            'total_species': len(species_images),
            'species_details': {}
        }
        
        for species, images_list in species_images.items():
            summary['species_details'][species] = len(images_list)
        
        summary_path = os.path.join(output_dir, 'dataset_summary.json')
        with open(summary_path, 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\nDataset created successfully!")
        print(f"Output directory: {output_dir}")
        print(f"Total species: {len(species_images)}")
        print(f"Summary saved to: {summary_path}")
        
        return species_images

# Alternative: Use existing curated datasets
def download_african_wildlife_from_other_sources():
    """
    Alternative approach: Download from other sources like Kaggle or create a custom dataset
    """
    
    sources = {
        'kaggle_datasets': [
            'african-wildlife-dataset',
            'animals-10',
            'animal-image-dataset-90-different-animals'
        ],
        'custom_search': [
            'Google Images API',
            'Flickr API', 
            'iStock/Shutterstock (with license)',
            'Wikipedia Commons'
        ]
    }
    
    print("Alternative data sources for African Wildlife:")
    print("\n1. Kaggle Datasets:")
    for dataset in sources['kaggle_datasets']:
        print(f"   - {dataset}")
    
    print("\n2. Custom Image Collection:")
    for source in sources['custom_search']:
        print(f"   - {source}")
    
    print("\n3. Pre-trained Model Fine-tuning:")
    print("   - Use a pre-trained animal classifier")
    print("   - Fine-tune on your specific 37 species")
    print("   - Requires fewer images (100-500 per species)")

# Quick start script for immediate training
def create_sample_dataset_structure(output_dir='african_wildlife_sample'):
    """Create a sample dataset structure for immediate testing"""
    
    target_species = [
        'Impala', 'Greater_Kudu', 'Nyala', 'Bushbuck', 'Waterbuck',
        'Giraffe', 'African_Buffalo', 'Hippopotamus', 'Plains_Zebra',
        'Lion', 'Leopard', 'Cheetah', 'African_Wild_Dog',
        'Chacma_Baboon', 'Vervet_Monkey', 'Meerkat', 'Caracal'
    ]
    
    splits = ['train', 'validation', 'test']
    
    for split in splits:
        for species in target_species:
            species_dir = os.path.join(output_dir, split, species)
            os.makedirs(species_dir, exist_ok=True)
            
            # Create a placeholder file
            placeholder_file = os.path.join(species_dir, 'README.txt')
            with open(placeholder_file, 'w') as f:
                f.write(f"Place {species} images for {split} split in this directory.\n")
                f.write(f"Recommended: 100-500 images for training, 20-50 for validation, 10-30 for test.\n")
    
    print(f"Sample dataset structure created at: {output_dir}")
    print("Now you can:")
    print("1. Add images to each species folder")
    print("2. Run the training script")
    print("3. Start with fewer species and expand gradually")

# Main execution
def main():
    extractor = INaturalistDataExtractor()
    
    print("African Wildlife AI Dataset Preparation")
    print("=====================================")
    print(f"Target species: {len(extractor.target_species)}")
    
    choice = input("\nChoose an option:\n1. Download from iNaturalist (requires large download)\n2. Create sample structure for manual data collection\n3. Show alternative data sources\nEnter (1/2/3): ")
    
    if choice == '1':
        # Download and process iNaturalist data
        inat_dir = extractor.download_inat_annotations()
        output_dir = 'african_wildlife_dataset'
        
        species_images = extractor.process_inat_dataset(
            inat_dir, 
            output_dir, 
            max_images_per_species=800
        )
        
        print("\nNext steps:")
        print("1. Review the extracted dataset")
        print("2. Run the training script")
        print("3. Fine-tune hyperparameters based on results")
        
    elif choice == '2':
        # Create sample structure
        output_dir = input("Enter output directory name (default: african_wildlife_sample): ").strip()
        if not output_dir:
            output_dir = 'african_wildlife_sample'
        
        create_sample_dataset_structure(output_dir)
        
        print("\nNext steps:")
        print("1. Collect images for each species")
        print("2. Organize them in the created folder structure")
        print("3. Run the training script")
        
    elif choice == '3':
        # Show alternatives
        download_african_wildlife_from_other_sources()
        
    else:
        print("Invalid choice!")

if __name__ == "__main__":
    main()