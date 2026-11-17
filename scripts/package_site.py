"""Create the downloadable site archive, excluding archives and local tooling."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
output = root / "downloads" / "observatorios-uruguay.zip"
output.parent.mkdir(exist_ok=True)
paths = [root / "index.html", root / "README.md", root / ".nojekyll"]
for folder in ("data", "site", "scripts", ".github", "assets"):
    paths.extend(p for p in (root / folder).rglob("*") if p.is_file() and "__pycache__" not in p.parts)
with ZipFile(output, "w", compression=ZIP_DEFLATED) as archive:
    for file in paths:
        if file.exists():
            archive.write(file, file.relative_to(root).as_posix())
print(f"ZIP generado: {output.name}")
