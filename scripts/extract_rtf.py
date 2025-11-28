#!/usr/bin/env python3
"""Extract plain text and a simple markdown from an RTF file.

Usage: python scripts/extract_rtf.py --in docs/Multiple Questions.rtf --out docs/Multiple Questions.md
"""
import argparse
from pathlib import Path

try:
    from striprtf.striprtf import rtf_to_text
except Exception:
    rtf_to_text = None


def extract(in_path: Path, out_md: Path, out_txt: Path):
    data = in_path.read_bytes()
    text = None
    if rtf_to_text:
        try:
            text = rtf_to_text(data.decode('latin-1'))
        except Exception:
            # fallback: try utf-8 decode
            try:
                text = rtf_to_text(data.decode('utf-8', errors='replace'))
            except Exception:
                text = None

    if text is None:
        # naive fallback: strip common RTF braces and control words
        txt = data.decode('latin-1', errors='replace')
        import re
        # remove RTF control words and groups
        txt = re.sub(r'\\[a-zA-Z]+[0-9]*', ' ', txt)
        txt = re.sub(r'[{}\\]', ' ', txt)
        text = txt

    # normalize newlines
    text = '\n'.join([line.strip() for line in text.splitlines() if line.strip()])

    # write outputs
    out_txt.write_text(text, encoding='utf-8')

    # basic markdown: convert double newlines into paragraphs
    md_lines = []
    for line in text.splitlines():
        md_lines.append(line)
    md_content = '\n\n'.join(md_lines)
    out_md.write_text(md_content, encoding='utf-8')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--in', dest='infile', required=True)
    parser.add_argument('--out-md', dest='outmd', required=False)
    parser.add_argument('--out-txt', dest='outtxt', required=False)
    args = parser.parse_args()

    in_path = Path(args.infile)
    if not in_path.exists():
        raise SystemExit(f"Input file not found: {in_path}")

    out_md = Path(args.outmd) if args.outmd else in_path.with_suffix('.md')
    out_txt = Path(args.outtxt) if args.outtxt else in_path.with_suffix('.txt')

    # backup original (safe copy)
    backup = in_path.with_suffix(in_path.suffix + '.bak')
    if not backup.exists():
        in_path.replace(backup)
        # restore from backup to keep original filename
        backup.replace(in_path)

    extract(in_path, out_md, out_txt)
    print(f"Extracted to: {out_md} and {out_txt}")


if __name__ == '__main__':
    main()
