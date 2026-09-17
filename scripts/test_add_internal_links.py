"""Tests for scripts/add_internal_links.py (plan task 0.2.4).

Covers: module constants (APPS/BOOKS/TOOLS), find_relevant_links keyword
matching, build_internal_links_section rendering, and process_article
insertion behavior.
"""

import add_internal_links as ail


# ---------------------------------------------------------------------------
# Helpers (inline: conftest patches ail.BLOG_DIR to an isolated temp dir)
# ---------------------------------------------------------------------------

def write_article(slug, title, body):
    """Write a minimal article HTML file into the isolated BLOG_DIR."""
    path = ail.BLOG_DIR / f"{slug}.html"
    html = (
        "<!DOCTYPE html>\n"
        "<html>\n"
        "<head><title>{title}</title></head>\n"
        "<body>\n"
        "<article>\n"
        "<h1>{title}</h1>\n"
        "<p>{body}</p>\n"
        "<h2>References</h2>\n"
        "</article>\n"
        "</body>\n"
        "</html>\n"
    ).format(title=title, body=body)
    path.write_text(html, encoding="utf-8")
    return path


# Text guaranteed to match NO keyword (avoids the 'test' -> zener-test trap).
NOMATCH = "Zzz qqq wxyz"


class TestModuleConstants:
    def test_apps_has_12_entries(self):
        assert len(ail.APPS) == 12

    def test_books_has_7_entries(self):
        assert len(ail.BOOKS) == 7

    def test_tools_has_10_entries(self):
        assert len(ail.TOOLS) == 10

    def test_expected_keys(self):
        assert "psi-gym" in ail.APPS
        assert "unofficial-rider-waite-tarot" in ail.APPS
        assert "noctem-tools" in ail.APPS
        assert "tarot-chaos-pdf" in ail.BOOKS
        assert "mind-the-gap-pdf" in ail.BOOKS
        assert "zener-test" in ail.TOOLS
        assert "tarot-reader" in ail.TOOLS


class TestFindRelevantLinks:
    def test_tarot_matches_one_per_group(self):
        apps, books, tools = ail.find_relevant_links("tarot", "Sample Piece")
        assert apps == [("unofficial-rider-waite-tarot", "Rider-Waite Tarot")]
        assert books == [("tarot-chaos-pdf", "Tarot Chaos")]
        assert tools == [("tarot-reader", "Tarot Reader")]

    def test_rune_matches_one_per_group(self):
        apps, books, tools = ail.find_relevant_links("rune", "Sample Piece")
        assert ("norse-rune-oracle", "Norse Rune Oracle") in apps
        assert ("tratado-runas-cazadoras-caos-pdf", "Tratado de Runas Cazadoras del Caos") in books
        assert ("rune-caster", "Rune Caster") in tools

    def test_paranormal_matches_two_apps_no_tools(self):
        apps, books, tools = ail.find_relevant_links("paranormal", "Sample Piece")
        assert ("eerieroads", "Eerie Roads") in apps
        assert ("noctem-tools", "NOCTEM") in apps
        assert books == [("mind-the-gap-pdf", "Mind the Gap")]
        assert tools == []

    def test_nomatch_returns_empty_tuples(self):
        apps, books, tools = ail.find_relevant_links(NOMATCH, NOMATCH)
        assert apps == []
        assert books == []
        assert tools == []

    def test_title_counts_toward_matching(self):
        # 'esp' only in the title -> psi-gym (apps) + zener-test (tools) match.
        apps, books, tools = ail.find_relevant_links(NOMATCH, "esp")
        assert ("psi-gym", "PSI GYM") in apps
        assert ("zener-test", "Zener ESP Test") in tools


class TestBuildInternalLinksSection:
    def test_empty_returns_empty_string(self):
        assert ail.build_internal_links_section([], [], []) == ""

    def test_section_contains_headers_labels_and_hrefs(self):
        html = ail.build_internal_links_section(
            [("unofficial-rider-waite-tarot", "Rider-Waite Tarot")],
            [("tarot-chaos-pdf", "Tarot Chaos")],
            [("tarot-reader", "Tarot Reader")],
        )
        assert '<section class="internal-links"' in html
        assert "Related Resources" in html
        assert "Apps:" in html
        assert "Books:" in html
        assert "Free Tools:" in html
        assert "../apps/" in html
        assert "unofficial-rider-waite-tarot" in html
        assert "../books/" in html
        assert "tarot-chaos-pdf" in html
        assert "../tools/" in html
        assert "tarot-reader" in html

    def test_caps_links_at_three_per_group(self):
        # 5 books match -> section must render only 3 book links.
        apps, books, tools = ail.find_relevant_links(
            "sigil chaos magick grimoire codex spare servitor tarot", "Sample Piece"
        )
        assert len(books) == 5
        html = ail.build_internal_links_section(apps, books, tools)
        assert html.count("../books/") == 3


class TestProcessArticle:
    def test_inserts_before_references(self):
        path = write_article("ref-article", "Sample Piece", "Exploring tarot and card reading")
        assert ail.process_article(path) is True
        content = path.read_text(encoding="utf-8")
        assert '<section class="internal-links"' in content
        # Section must sit before the References heading.
        assert content.index('<section class="internal-links"') < content.index("<h2>References</h2>")

    def test_inserts_before_closing_article_when_no_references(self):
        path = ail.BLOG_DIR / "norefs.html"
        html = (
            "<!DOCTYPE html>\n<html>\n<head><title>Sample Piece</title></head>\n"
            "<body>\n<article>\n<h1>Sample Piece</h1>\n<p>Exploring tarot and runes</p>\n"
            "</article>\n</body>\n</html>\n"
        )
        path.write_text(html, encoding="utf-8")
        assert ail.process_article(path) is True
        content = path.read_text(encoding="utf-8")
        assert '<section class="internal-links"' in content
        assert content.index('<section class="internal-links"') < content.index("</article>")

    def test_no_matches_returns_false_and_leaves_file_untouched(self):
        path = write_article("nomatch-article", "Sample Piece", NOMATCH)
        before = path.read_text(encoding="utf-8")
        assert ail.process_article(path) is False
        assert path.read_text(encoding="utf-8") == before
        assert '<section class="internal-links"' not in before
