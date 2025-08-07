import requests
import json
import time

# Collect unique mammals
mammals = []
seen_scientific_names = set()
page = 1

while True:
    params = {
        "place_id": 6986,           # South Africa
        "taxon_id": 40151,          # Mammalia
        "iconic_taxa": "Mammalia",
        "quality_grade": "research",
        "per_page": 200,
        "page": page
    }
    resp = requests.get("https://api.inaturalist.org/v1/observations/species_counts", params=params)
    data = resp.json()

    if not data.get("results"):
        break

    for r in data["results"]:
        taxon = r.get("taxon", {})
        scientific_name = taxon.get("name")
        common_name = taxon.get("preferred_common_name")

        # Skip if already added
        if scientific_name and scientific_name not in seen_scientific_names:
            seen_scientific_names.add(scientific_name)
            mammals.append({
                "name": scientific_name,
                "common_name": common_name if common_name else ""
            })

    print(f"Fetched page {page}...")
    page += 1
    time.sleep(1)  # Be polite to the API

# Output result
print(json.dumps(mammals, indent=4, ensure_ascii=False))
print(f"Total unique mammal species in RSA: {len(mammals)}")
