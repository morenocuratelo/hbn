import docx2txt, sys, pathlib
from pdfminer.high_level import extract_text

def convert_docx(src, dest):
    text = docx2txt.process(src)
    dest.write_text(text, encoding="utf-8")

def convert_pdf(src, dest):
    text = extract_text(src)
    dest.write_text(text, encoding="utf-8")

def main():
    root = pathlib.Path("docs")
    out = pathlib.Path("docs_text")
    out.mkdir(exist_ok=True)
    for src in root.glob("**/*"):
        if src.suffix.lower() == ".docx":
            convert_docx(src, out / (src.stem + ".txt"))
        elif src.suffix.lower() == ".pdf":
            convert_pdf(src, out / (src.stem + ".txt"))

if __name__ == "__main__":
    main()