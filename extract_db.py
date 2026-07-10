import fitz, os, glob

pdfs = glob.glob("book/*Dumbbell*.pdf")
if not pdfs:
    print("PDF not found")
    exit(1)
pdf_path = pdfs[0]
print("Found:", pdf_path)

out_dir = "exercises/dumbbell"
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")
seen = set()
for pno in range(len(doc)):
    page = doc[pno]
    imgs = page.get_images()
    if imgs:
        for i, img in enumerate(imgs):
            xref = img[0]
            if xref in seen:
                continue
            info = doc.extract_image(xref)
            w, h = info["width"], info["height"]
            if w >= 150 and h >= 100:
                seen.add(xref)
                fname = f"p{pno+1:03d}_img{i+1}.{info['ext']}"
                fpath = os.path.join(out_dir, fname)
                with open(fpath, "wb") as f:
                    f.write(info["image"])
                print(f"  Saved {fname}: {w}x{h}")

print(f"Done. {len(seen)} unique images extracted.")
