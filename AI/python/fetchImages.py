import requests
import json
import os

# API endpoint
url = "https://api.inaturalist.org/v1/observations"

# Target large mammals with their taxon IDs (approximate values, verify via iNaturalist)
target_species = [
    {"name": "Elephant", "taxon_id": 148866}
]

# Base parameters
base_params = {
    "iconic_taxa": "Mammalia",
    "per_page": 200,  # Max per page
    "order_by": "created_at",
    "order": "desc",
    "lat": -30.5595,  # Center of South Africa
    "lng": 22.9375,
    "radius": 10000
}

os.makedirs("AI/python/mammal_images", exist_ok=True)

# Fetch and download 50 images per species with error handling
for species in target_species:
    params = base_params.copy()
    params["taxon_id"] = species["taxon_id"]
    image_urls = []
    downloaded_count = 0
    page = 1

    print(f"Starting download for {species['name']}")
    while downloaded_count < 50 and page <= 5:  # Limit to 5 pages
        params["page"] = page
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code != 200:
                print(f"Error for {species['name']}, page {page}: Status {response.status_code} - {response.text}")
                if response.status_code == 429:  # Rate limit
                    print("Rate limit hit, waiting 60 seconds...")
                    time.sleep(60)
                    continue
                break
            data = response.json()
            if not data.get("results"):
                print(f"No more results for {species['name']}, page {page}")
                break
            for observation in data.get("results", []):
                if downloaded_count >= 50:
                    break
                for photo in observation.get("photos", []):
                    if downloaded_count >= 50:
                        break
                    image_url = photo["url"].replace("square", "original")
                    image_urls.append(image_url)
                    filename = f"AI/python/mammal_images/{species['name'].lower().replace(' ', '_')}_{downloaded_count}.jpg"
                    try:
                        img_response = requests.get(image_url, stream=True, timeout=10)
                        if img_response.status_code == 200:
                            with open(filename, "wb") as f:
                                f.write(img_response.content)
                            downloaded_count += 1
                            print(f"Downloaded {filename}")
                        else:
                            print(f"Failed to download {image_url}: Status {img_response.status_code}")
                    except Exception as e:
                        print(f"Error downloading {image_url}: {e}")
            page += 1
        except requests.RequestException as e:
            print(f"Request failed for {species['name']}, page {page}: {e}")
            break

    with open(f"AI/python/{species['name'].lower().replace(' ', '_')}_image_urls.txt", "w") as f:
        for url in image_urls[:50]:
            f.write(url + "\n")

    print(f"Downloaded {downloaded_count} images for {species['name']}")

print("Image download complete.")