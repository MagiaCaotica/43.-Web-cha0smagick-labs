"""Tests for scripts/add_structured_data.py (plan task 0.2.5).

Covers: module constants (SITE/PUBLISHER/BOOKS), add_product_schema_to_book
(idempotent Product JSON-LD injection), and add_breadcrumb_to_blog
(idempotent BreadcrumbList injection).
"""

import add_structured_data as asd


# ---------------------------------------------------------------------------
# Helpers (functions take filepath: Path directly -> use pytest tmp_path)
# ---------------------------------------------------------------------------

def write_book(tmp_path, slug, with_script=False):
    """Write a minimal book page HTML file."""
    path = tmp_path / f"{slug}.html"
    script = (
        '<script type="application/ld+json">'
        '{"@context": "https://schema.org", "@type": "Article"}'
        "</script>"
    ) if with_script else ""
    html = (
        "<!DOCTYPE html>\n"
        "<html>\n"
        "<head><title>{slug}</title>{script}</head>\n"
        "<body><article><h1>Book</h1></article></body>\n"
        "</html>\n"
    ).format(script=script, slug=slug)
    path.write_text(html, encoding="utf-8")
    return path


def write_blog_article(tmp_path, slug):
    """Write a minimal blog article HTML file."""
    path = tmp_path / f"{slug}.html"
    html = (
        "<!DOCTYPE html>\n"
        "<html>\n"
        "<head><title>{slug}</title></head>\n"
        "<body><article><h1>Post</h1></article></body>\n"
        "</html>\n"
    ).format(slug=slug)
    path.write_text(html, encoding="utf-8")
    return path


class TestModuleConstants:
    def test_site_and_publisher(self):
        assert asd.SITE == "https://cha0smagicklabs.com"
        assert asd.PUBLISHER == "Cha0smagick Labs"

    def test_books_has_7_entries(self):
        assert len(asd.BOOKS) == 7

    def test_book_slugs(self):
        expected = {
            "manual-activacion-servidores-magicos-pdf.html",
            "tratado-runas-cazadoras-caos-pdf.html",
            "ouija-cazadora-pdf.html",
            "liber-lvpinux-pdf.html",
            "codex-chaoticus-pdf.html",
            "tarot-chaos-pdf.html",
            "mind-the-gap-pdf.html",
        }
        assert set(asd.BOOKS.keys()) == expected

    def test_all_books_reference_hotmart_checkout(self):
        for book in asd.BOOKS.values():
            assert book["url"] == "https://pay.hotmart.com/D104270399P?checkoutMode=2"

    def test_spot_check_prices(self):
        assert asd.BOOKS["codex-chaoticus-pdf.html"]["price"] == "19.99"
        assert asd.BOOKS["tarot-chaos-pdf.html"]["price"] == "12.99"
        assert asd.BOOKS["mind-the-gap-pdf.html"]["price"] == "9.99"


class TestProductSchema:
    def test_adds_product_schema_once(self, tmp_path):
        path = write_book(tmp_path, "codex-chaoticus-pdf", with_script=True)
        assert asd.add_product_schema_to_book(path, asd.BOOKS["codex-chaoticus-pdf.html"]) is True
        content = path.read_text(encoding="utf-8")
        assert '"@type":"Product"' in content
        assert "books/codex-chaoticus-pdf.html#product" in content
        assert "Cha0smagick Labs" in content
        assert "19.99" in content

    def test_idempotent_second_call_returns_false(self, tmp_path):
        path = write_book(tmp_path, "tarot-chaos-pdf", with_script=True)
        asd.add_product_schema_to_book(path, asd.BOOKS["tarot-chaos-pdf.html"])
        assert asd.add_product_schema_to_book(path, asd.BOOKS["tarot-chaos-pdf.html"]) is False
        content = path.read_text(encoding="utf-8")
        assert content.count('"@type":"Product"') == 1

    def test_no_head_returns_false(self, tmp_path):
        path = tmp_path / "nohead.html"
        path.write_text("<html><body><p>no head</p></body></html>", encoding="utf-8")
        assert asd.add_product_schema_to_book(path, asd.BOOKS["codex-chaoticus-pdf.html"]) is False

    def test_without_script_returns_false_no_insertion_point(self, tmp_path):
        # Real contract: injection REQUIRES an existing </script> before </head>;
        # pages without a script block have no insertion point.
        path = write_book(tmp_path, "manual-activacion-servidores-magicos-pdf")
        assert asd.add_product_schema_to_book(
            path, asd.BOOKS["manual-activacion-servidores-magicos-pdf.html"]
        ) is False
        content = path.read_text(encoding="utf-8")
        assert '"@type":"Product"' not in content

    def test_with_existing_script_inserts_after_it(self, tmp_path):
        path = write_book(tmp_path, "liber-lvpinux-pdf", with_script=True)
        assert asd.add_product_schema_to_book(path, asd.BOOKS["liber-lvpinux-pdf.html"]) is True
        content = path.read_text(encoding="utf-8")
        assert '"@type":"Product"' in content
        # Product schema must live inside the LAST script block on the page.
        assert content.index('"@type":"Product"') > content.rindex("<script")


class TestBreadcrumb:
    def test_adds_breadcrumb_once(self, tmp_path):
        path = write_blog_article(tmp_path, "tarot-guide")
        assert asd.add_breadcrumb_to_blog(path) is True
        content = path.read_text(encoding="utf-8")
        assert "BreadcrumbList" in content
        assert "/blog/tarot-guide.html#breadcrumb" in content

    def test_breadcrumb_idempotent(self, tmp_path):
        path = write_blog_article(tmp_path, "rune-magic")
        asd.add_breadcrumb_to_blog(path)
        assert asd.add_breadcrumb_to_blog(path) is False
        content = path.read_text(encoding="utf-8")
        assert content.count("BreadcrumbList") == 1

    def test_breadcrumb_no_head_returns_false(self, tmp_path):
        path = tmp_path / "nohead.html"
        path.write_text("<html><body><p>x</p></body></html>", encoding="utf-8")
        assert asd.add_breadcrumb_to_blog(path) is False
