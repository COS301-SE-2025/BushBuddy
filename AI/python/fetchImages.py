import requests
import os

url = "https://api.inaturalist.org/v1/observations"

params = {
    "taxon_id": 40151, # Mammal ID
    "place_id": 113055, # RSA ID
    "per_page": 20,
    "page": 1,
    "order_by": "observed_on",
    "photos": "true"
}


response = requests.get(url, params=params)
print("Status code:", response.status_code)
print("Response:", response.text)

data = response.json()

os.makedirs("images", exist_ok=True)

for obs in data.get("results", []):
    taxon = obs.get("taxon", {})
    name = taxon.get("preferred_common_name", "Unknown").replace(' ', '_')
    photos = obs.get("photos", [])

    print(f"Found : {name}")

    for i, photo in enumerate(photos):
        photo_url = photo.get("url")
        if photo_url:
            photoDimensionType = "original"
            wanted_url = photo_url.replace("square", photoDimensionType)
            image_data = requests.get(wanted_url).content
            filename = f"images/{name}_{obs['id']}_{i}.jpg"
            with open(filename, "wb") as f:
                f.write(image_data)