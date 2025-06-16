import os

def scan_deep_files(base_dir):
    result = []
    for root, dirs, files in os.walk(base_dir):
        rel_root = os.path.relpath(root, base_dir)
        if rel_root != ".":
            for file in files:
                rel_path = os.path.join(rel_root, file)
                result.append(rel_path)
    return result


types = {}
base_directory = os.path.dirname(os.path.abspath(__file__))
files = scan_deep_files(base_directory)
for f in files:
    s = f.split("\\")
    if s[0] not in types:
      types[s[0]] = []
    types[s[0]].append(".".join(("/".join(s[1:])).split(".")[:-1]))



with open(base_directory + "/paths.js", "w", encoding="utf-8") as f:
  for t in types:
    f.write("let " + t + "Paths = [\n")
    for n in types[t]:
      f.write("\"" + n + "\",\n")
    f.write("];\n")
        