import requests
import os
import json

url = "https://api.inaturalist.org/v1/observations"

MAX_IMAGES_PER_SPECIES = 20
NUMBER_OF_PAGES = 20
species_counter = {}
annotations = []



"""
Want the following returned
- possibly 100 images of combined species images
- Sounds
"""

params = {
    "taxon_id": 40151, # Mammal ID
    "place_id": 113055, # RSA ID
    "per_page": 50,
    "page": 50,
    "order_by": "observed_on",
    "photos": "true",
    #"sounds": "true",
    "quality_grade": "research"
}

os.makedirs("images", exist_ok=True)


response = requests.get(url, params=params)
print("Status code:", response.status_code)
print("Response:", response.text)

data = response.json()
results = data.get("results", [])




for obs in results:
    # Required attributes
    taxon = obs.get("taxon", {})
    name = taxon.get("preferred_common_name", "Unknown").replace(' ', '_')
    photos = obs.get("photos", [])


    if species_counter.get(name, 0) >= MAX_IMAGES_PER_SPECIES:
            continue
    print(f"Found : {name}")
    

    for i, photo in enumerate(photos):

        if species_counter.get(name, 0) >= MAX_IMAGES_PER_SPECIES:
            break

        photo_url = photo.get("url")
        if photo_url:
            wantedPhotoDimensionType = "medium"
            wanted_url = photo_url.replace("square", wantedPhotoDimensionType)
            
            try:
                image_data = requests.get(wanted_url).content

                # Counts the number of photos gathered per species for naming purposes
                image_index = species_counter.get(name, 0)
                filename = f"images/{name}_{image_index}.jpg"
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