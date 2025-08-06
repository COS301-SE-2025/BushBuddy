import requests
import json

# Still in the works

mammal_ids = []
page = 1

while True:
    params = {
        "place_id": 6986,      # South Africa
        "taxon_id": 40151,     # Mammalia
        "rank": "species",
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
        mammal_ids.append({
            "taxon_id": taxon.get("id"),
            "scientific_name": taxon.get("name"),
            "common_name": taxon.get("preferred_common_name")
        })

    page += 1

print(json.dumps(mammal_ids, indent=4))

print(f"Total mammal species in RSA: {len(mammal_ids)}")
