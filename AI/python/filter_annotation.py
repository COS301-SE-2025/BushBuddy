import json


FILE = "val.json"

with open(FILE, "r") as f:
    data = json.load(f)


categories = data.get("categories", [])

# print(categories)

required_list = []

# retrieve only specified animals
for category in categories:
    if category.get("class") == "Mammalia":
        required_list.append(category)


with open("filteredAnnotations.json", "w") as f:
    f.write(json.dumps(required_list, indent=4))
