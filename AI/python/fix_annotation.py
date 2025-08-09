import json

INPUT_FILE = OUTPUT_FILE = "projectMammals.json"


with open(INPUT_FILE, "r", encoding="utf-8") as inFile:
    data = json.load(inFile)

with open(OUTPUT_FILE, "w", encoding="utf-8") as outFile:
    json.dump(data, outFile, indent=4)

print("Done")
