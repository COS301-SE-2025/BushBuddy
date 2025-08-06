import requests
import os
import json




MAX_TRAINING_SPECIES = 20
MAX_VALIDATION_SPECIES = 10 
MAX_TEST_SPECIES = 20

MAX_IMAGES_PER_SPECIES = MAX_TRAINING_SPECIES + MAX_TEST_SPECIES + MAX_VALIDATION_SPECIES

NUMBER_OF_PAGES = 20
species_counter = {}
annotations = []


# Creates Necessary Directories
base_dirs = ["images/train", "images/validation", "images/test"]
os.makedirs("images", exist_ok=True)
for i in base_dirs:
    os.makedirs(i, exist_ok=True)



# Read JSONs filtered annotations
#file = "filteredAnnotations.json"
file = "filteredAnnotations_v2.json"

with open(file, "r") as f:
    id_mammal_list = json.load(f)

for category in id_mammal_list:
    species_name = category.get("name", "Unknown")
    common_name = category.get("common_name", "Unknown")
    
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
    print("Status code:", response.status_code)
    print("Response:", response.text)

    data = response.json()
    results = data.get("results", [])



def animalRetriever(directory, results):
    for obs in results:
        # Required attributes
        taxon = obs.get("taxon", {})
        name = taxon.get("preferred_common_name", "Unknown").replace(' ', '_').replace("/", "_")
        photos = obs.get("photos", [])
        #photos = obs.get("default_photo", [])


        if species_counter.get(name, 0) >= MAX_IMAGES_PER_SPECIES:
                continue
        print(f"Found : {name}")
        

        for i, photo in enumerate(photos):

            if species_counter.get(name, 0) >= MAX_IMAGES_PER_SPECIES:
                break

            photo_url = photo.get("url")
            if photo_url:
                wanted_url = photo_url.replace("square", "medium")
                
                try:
                    image_data = requests.get(wanted_url).content

                    # Counts the number of photos gathered per species for naming purposes
                    image_index = species_counter.get(name, 0)
                    filename = f"images/path/{name}/{name}_{image_index}.jpg"
                    with open(filename, "wb") as f:
                        f.write(image_data)

                    species_counter[name] = species_counter.get(name, 0) + 1

                    annotations.append({
                        "image": filename,
                        "label": name
                    })

                except Exception as e:
                    print(f"Failed to download {wanted_url}: {e}")

with open("annotations.json", "w") as f:
    json.dump(annotations, f, indent=2)

print("\n🎉 Done! Annotations written to annotations.json")