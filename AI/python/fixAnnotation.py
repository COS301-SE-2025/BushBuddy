import json

input_file = output_file = "val.json"


with open(input_file, 'r') as inFile:
    data = json.load(inFile)

with open(output_file, 'w') as outFile:
    json.dump(data, outFile, indent=4)

print("Done")