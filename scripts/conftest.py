"""Shared pytest fixtures for the site generator scripts.

The generator scripts derive ``ROOT`` and ``BLOG_DIR`` from their own
module location (``Path(__file__).resolve().parent.parent``). These
fixtures monkeypatch those module-level constants so tests can run
against an isolated temporary tree without touching the real ``blog/``,
``books/`` or ``tools/`` directories.
"""

from __future__ import annotations

import importlib
import shutil
from pathlib import Path

import pytest

TARGET_MODULES = ("generate_blog", "add_internal_links", "add_structured_data")


def _ensure_importable() -> None:
    """Make sure the ``scripts`` package is importable when pytest is
    invoked from the project root.

    Pytest only inserts the rootdir of the test file into ``sys.path``
    when no ``__init__.py`` is present (rootdir-based collection). Tests
    placed inside ``scripts/`` therefore need the project root on the
    path to resolve ``import generate_blog`` etc.
    """
    root = Path(__file__).resolve().parent.parent
    if str(root) not in __import__("sys").path:
        __import__("sys").path.insert(0, str(root))


_ensure_importable()


@pytest.fixture(scope="session", autouse=True)
def isolated_output_dirs(tmp_path_factory: pytest.TempPathFactory) -> dict[str, Path]:
    """Redirect every generator script's output directories into a
    unique temporary tree and restore nothing (session ends when the
    process exits).

    Monkeypatch is session-scoped and applied eagerly so that *any*
    module-level ``Path(ROOT) / "..."`` computed at import time in the
    target modules already points at the temporary tree.
    """
    root = tmp_path_factory.mktemp("site-root")
    dirs = {
        "root": root,
        "blog": root / "blog",
        "books": root / "books",
        "tools": root / "tools",
    }
    for d in dirs.values():
        d.mkdir(parents=True, exist_ok=True)

    for name in TARGET_MODULES:
        module = importlib.import_module(name)
        module.ROOT = root
        if hasattr(module, "BLOG_DIR"):
            module.BLOG_DIR = dirs["blog"]
        # INDEX/SITEMAP are module-level constants computed from the ORIGINAL
        # ROOT at import time; without this override the tests would write to
        # the real repo's blog/index.html and sitemap.xml.
        if hasattr(module, "INDEX"):
            module.INDEX = dirs["blog"] / "index.html"
        if hasattr(module, "SITEMAP"):
            module.SITEMAP = root / "sitemap.xml"
        # TEMPLATE intentionally NOT overridden: it is an input artifact
        # (the real template must exist for build_article to read).

    return dirs


@pytest.fixture
def make_article(isolated_output_dirs: dict[str, Path]) -> callable:
    """Factory that writes a minimal HTML article into the temporary
    ``blog/`` tree.

    Returns a ``(path, soup_fragment)``-agnostic helper: the caller
    receives the ``Path`` of the created file.
    """

    def _make(slug: str, *, title: str = "Test Article", body: str = "<p>Content</p>") -> Path:
        blog = isolated_output_dirs["blog"]
        path = blog / f"{slug}.html"
        html = (
            "<!DOCTYPE html>\n"
            '<html lang="en">\n'
            "<head>\n"
            '  <meta charset="utf-8">\n'
            f"  <title>{title}</title>\n"
            "  <link rel=\"canonical\" href=\"https://cha0smagicklabs.com/blog/"
            f"{slug}.html\">\n"
            "  <meta name='twitter:card' content='summary_large_image'>\n"
            "  <meta name='twitter:site' content='@Cha0smagickLABS'>\n"
            "  <meta property='og:title' content='" + title + "'>\n"
            "  <script type='application/ld+json'>\n"
            "    {\"@context\": \"https://schema.org\", \"@type\": \"Article\"}\n"
            "  </script>\n"
            "</head>\n<body>\n"
            f"<article><h1>{title}</h1>{body}</article>\n"
            "</body>\n</html>\n"
        )
        path.write_text(html, encoding="utf-8")
        return path

    return _make


@pytest.fixture
def make_book(isolated_output_dirs: dict[str, Path]) -> callable:
    """Factory that writes a minimal book/product page into the
    temporary ``books/`` tree (used by ``add_structured_data``)."""

    def _make(slug: str, *, title: str = "Test Book") -> Path:
        books = isolated_output_dirs["books"]
        path = books / f"{slug}.html"
        path.write_text(
            "<!DOCTYPE html>\n"
            '<html lang="en">\n'
            "<head>\n"
            '  <meta charset="utf-8">\n'
            f"  <title>{title}</title>\n"
            "  <meta property='og:title' content='" + title + "'>\n"
            "</head>\n<body>\n"
            "<h1>Test Book</h1>\n"
            "</body>\n</html>\n",
            encoding="utf-8",
        )
        return path

    return _make


@pytest.fixture
def cleanup_blog(isolated_output_dirs: dict[str, Path]) -> callable:
    """Scoped cleanup helper: removes every ``*.html`` file written by
    the current test into the temporary ``blog/`` tree."""

    def _cleanup() -> None:
        blog = isolated_output_dirs["blog"]
        if blog.exists():
            for f in blog.glob("*.html"):
                f.unlink(missing_ok=True)

    return _cleanup


@pytest.fixture(scope="session", autouse=True)
def _teardown_temp_dirs(isolated_output_dirs: dict[str, Path]) -> Iterator[None]:
    """Session-scoped finalizer that removes the temporary tree after
    the last test exits (best-effort; failure is non-fatal)."""
    yield
    root = isolated_output_dirs["blog"].parent
    shutil.rmtree(root, ignore_errors=True)