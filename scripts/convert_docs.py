"""Utility per convertire DOCX e PDF in Markdown.

Dipendenze consigliate:
- mammoth>=1.5.0 per conversione DOCX -> Markdown
- PyMuPDF>=1.24 per estrarre testo/immagini dai PDF

Uso:
    python scripts/convert_docs.py --src docs --dest docs_md
"""

from __future__ import annotations

import argparse
import importlib
import importlib.util
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable, List, Sequence, Tuple, cast

import fitz  # PyMuPDF

_mammoth_spec = importlib.util.find_spec("mammoth")
mammoth: Any
if _mammoth_spec:
    mammoth = importlib.import_module("mammoth")
else:  # pragma: no cover - fallback se il pacchetto manca
    mammoth = None


@dataclass
class ConversionStats:
    processed: List[Path]
    skipped: List[Tuple[Path, str]]
    failed: List[Tuple[Path, str]]

    def __init__(self) -> None:
        self.processed = []
        self.skipped = []
        self.failed = []

    def summary(self) -> str:
        lines = [
            f"Converted: {len(self.processed)}",
            f"Skipped:   {len(self.skipped)}",
            f"Failed:    {len(self.failed)}",
        ]
        details: List[str] = []
        if self.skipped:
            details.append("\nSkipped files:")
            details.extend(f"  - {src}: {reason}" for src, reason in self.skipped)
        if self.failed:
            details.append("\nFailed files:")
            details.extend(f"  - {src}: {reason}" for src, reason in self.failed)
        return "\n".join(lines + details)


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Converte ricorsivamente DOCX/PDF in Markdown",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--src", default="docs", help="Cartella sorgente da scansionare")
    parser.add_argument("--dest", default="docs_md", help="Cartella di output per i .md")
    parser.add_argument(
        "--media",
        default="docs_md/media",
        help="Cartella condivisa per salvare eventuali risorse (solo docx, beta)",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Sovrascrive i .md se già esistono",
    )
    return parser.parse_args(argv)


def ensure_dependencies() -> None:
    if mammoth is None:
        raise RuntimeError(
            "Il pacchetto 'mammoth' è richiesto per convertire i file DOCX. "
            "Installa con 'pip install mammoth'."
        )


def convert_docx(src: Path, dest: Path) -> str:
    ensure_dependencies()
    with src.open("rb") as docx_file:
        mm = cast(Any, mammoth)
        result = mm.convert_to_markdown(docx_file)
    markdown = result.value
    messages = "\n".join(f"  - {msg}" for msg in result.messages)
    dest.write_text(markdown, encoding="utf-8")
    return messages


def convert_pdf(src: Path, dest: Path, media_root: Path) -> None:
    """Converte un PDF sfruttando l'estrattore Markdown di PyMuPDF."""

    markdown_pages: List[str] = []
    with fitz.open(src) as pdf:
        writer_factory = getattr(fitz, "ImageWriter", None)
        writer = writer_factory(str(media_root)) if writer_factory else None
        for page_index in range(pdf.page_count):
            page = pdf.load_page(page_index)
            try:
                if writer is not None:
                    page_text = page.get_text("markdown", imagewriter=writer)
                else:
                    page_text = page.get_text("markdown")
            except (AssertionError, RuntimeError):
                page_text = page.get_text("text")
            page_md = str(page_text).strip()
            page_no = page_index + 1
            if not page_md:
                continue
            header = f"<!-- Page {page_no}: {src.name} -->"
            markdown_pages.append(f"{header}\n\n{page_md}")

    markdown = "\n\n---\n\n".join(markdown_pages) or "*(Nessun testo estratto)*"
    dest.write_text(markdown, encoding="utf-8")


def main(argv: Iterable[str] | None = None) -> int:
    arg_list: Sequence[str] | None = list(argv) if argv is not None else None
    args = parse_args(arg_list or sys.argv[1:])
    src_root = Path(args.src)
    dest_root = Path(args.dest)
    media_root = Path(args.media)

    if not src_root.exists():
        print(f"Sorgente assente: {src_root}", file=sys.stderr)
        return 1

    dest_root.mkdir(parents=True, exist_ok=True)
    media_root.mkdir(parents=True, exist_ok=True)

    stats = ConversionStats()
    for src in sorted(src_root.rglob("*")):
        if not src.is_file():
            continue
        if src.suffix.lower() not in {".docx", ".pdf"}:
            continue

        relative = src.relative_to(src_root)
        dest = dest_root / relative.with_suffix(".md")
        dest.parent.mkdir(parents=True, exist_ok=True)

        if dest.exists() and not args.overwrite:
            stats.skipped.append((src, "Output esiste già"))
            continue

        try:
            if src.suffix.lower() == ".docx":
                extra = convert_docx(src, dest)
                if extra:
                    print(f"[DOCX] Avvertimenti per {src}:\n{extra}")
            else:
                convert_pdf(src, dest, media_root)
            stats.processed.append(src)
        except Exception as exc:  # pragma: no cover - conversion errors
            stats.failed.append((src, str(exc)))

    print(stats.summary())
    if stats.failed:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
