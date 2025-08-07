import requests
import os
import json

# Import Variables
# Sets number of images that will be downloaded total for each image directory per species
MAX_TRAINING_SPECIES = 1
MAX_VALIDATION_SPECIES = 1 
MAX_TEST_SPECIES = 1

MAX_IMAGES_PER_SPECIES = MAX_TRAINING_SPECIES + MAX_TEST_SPECIES + MAX_VALIDATION_SPECIES


NUMBER_OF_PAGES = 20
species_counter = {}
annotations = []

# Read JSONs filtered annotations
#file = "filteredAnnotations.json"
file = "filteredAnnotations_v2.json"

# Creates Necessary Directories
base_dirs = ["images/train", "images/validation", "images/test"]
os.makedirs("images", exist_ok=True)
for i in base_dirs:
    os.makedirs(i, exist_ok=True)


# Function taking the directory where the images will be stored as well as the observation currently being used
def storeAnimalDetails(directory_path, obs, common_name):
    taxon = obs.get("taxon", {})
    name = taxon.get("preferred_common_name", "Unknown").replace(' ', '_').replace("/", "_")
    photos = obs.get("photos", [])
    for i, photo in enumerate(photos):

        # Training images statement
        if species_counter.get(common_name,0) < MAX_TRAINING_SPECIES:
            directory_path = base_dirs[0]

        # If for validation images
        elif species_counter.get(common_name, 0) < (MAX_TRAINING_SPECIES + MAX_VALIDATION_SPECIES):
            directory_path = base_dirs[1]
        # Storing of Testing Images
        elif species_counter.get(common_name, 0) < MAX_IMAGES_PER_SPECIES:
            directory_path = base_dirs[2]
        elif species_counter.get(common_name, 0) >= MAX_IMAGES_PER_SPECIES:
            break

        photo_url = photo.get("url")
        if photo_url:
            wanted_url = photo_url.replace("square", "medium")
            
            try:
                image_data = requests.get(wanted_url).content

                # Counts the number of photos gathered per species for naming purposes
                image_index = species_counter.get(common_name, 0)
                os.makedirs(f"{directory_path}/{common_name}", exist_ok=True)
                filename = f"{directory_path}/{common_name}/{name}_{image_index}.jpg"
                with open(filename, "wb") as f:
                    f.write(image_data)

                species_counter[common_name] = species_counter.get(common_name, 0) + 1

                annotations.append({
                    "image": filename,
                    "label": common_name,
                    "iconic_taxa" : supercategory
                })

            except Exception as e:
                print(f"Failed to download {wanted_url}: {e}")




with open(file, "r") as f:
    id_mammal_list = json.load(f)

count = 0
for category in id_mammal_list:
    count += 1
    print(count)
    species_name = category.get("name", "Unknown")
    common_name = category.get("common_name", "Unknown")
    supercategory = category.get("supercategory", "Unknown")
    
    url = f"https://api.inaturalist.org/v1/observations"

    params = {
        "place_id": 6986, # id of south africa
        "iconic_taxa": "Mammalia",
        "taxon_name": species_name, #"Loxodonta africana",
        "project_id": "31428", #project id of biodiversity of south africa 
        "per_page": MAX_IMAGES_PER_SPECIES,
        "page": 1,
        "order_by": "observed_on",
        "photos": "true",
        "quality_grade": "research",
        "verifiable": "true"
    }
    response = requests.get(url, params=params)
    #print("Status code:", response.status_code)
    #print("Response:", response.text)

    data = response.json()
    results = data.get("results", [])

    for obs in results:
        # Required attributes
        taxon = obs.get("taxon", {})

        # Training images statement
        if species_counter.get(common_name,0) < MAX_TRAINING_SPECIES:
            storeAnimalDetails(base_dirs[0], obs, common_name)

        # If for validation images
        elif species_counter.get(common_name, 0) < (MAX_TRAINING_SPECIES + MAX_VALIDATION_SPECIES):
            storeAnimalDetails(base_dirs[1], obs, common_name)
        # Storing of Testing Images
        elif species_counter.get(common_name, 0) < MAX_IMAGES_PER_SPECIES:
            storeAnimalDetails(base_dirs[2], obs, common_name)
        # Limit Reach
        elif species_counter.get(common_name, 0) >= MAX_IMAGES_PER_SPECIES:
                break
        print(f"Found : {common_name}")
        

with open("annotations.json", "w") as f:
    json.dump(annotations, f, indent=4)

print("\n🎉 Done! Annotations written to annotations.json")



