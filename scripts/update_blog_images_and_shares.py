"""
Update all blog articles:
1. Replace generic/app images with article-specific chaos magick images
2. Redesign share buttons (centered, with SVG logos, occult-priority platforms)
"""
import os, glob, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(ROOT, "blog")
IMG_DIR = os.path.join(ROOT, "assets", "images", "blog")

# === SHARE BUTTONS HTML ===
# Prioritize occult-friendly platforms
SHARE_BUTTONS_HTML = """
<div class="share-section">
    <h3 style="text-align:center;color:#c5a059;margin-bottom:1.5rem;">Share This Article</h3>
    <div class="share-buttons">
        <a href="https://twitter.com/intent/tweet?text=TITLE_PLACEHOLDER&url=URL_PLACEHOLDER" target="_blank" class="share-btn share-twitter" title="Share on Twitter/X">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span>Share on X</span>
        </a>
        <a href="https://www.reddit.com/submit?url=URL_PLACEHOLDER&title=TITLE_PLACEHOLDER" target="_blank" class="share-btn share-reddit" title="Share on Reddit">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.633 4.906 1.544.604-.48 1.354-.76 2.174-.76 1.863 0 3.374 1.51 3.374 3.373a3.36 3.36 0 0 1-1.352 2.695c.064.27.1.558.1.846 0 3.22-3.604 5.834-8.05 5.834-4.444 0-8.05-2.614-8.05-5.834 0-.285.034-.57.094-.838A3.36 3.36 0 0 1 3.754 12c0-1.863 1.51-3.373 3.373-3.373.813 0 1.554.275 2.154.736 1.406-.89 3.033-1.44 4.823-1.516l.949-4.437a.3.3 0 0 1 .186-.222l3.664-1.039a.3.3 0 0 1 .237.028zm-3.609 7.48a.44.44 0 0 0-.462.442c0 .245.2.442.462.442s.462-.197.462-.442a.44.44 0 0 0-.462-.442zm5.022.008a.44.44 0 0 0-.462.443c0 .244.2.441.462.441s.462-.197.462-.441a.44.44 0 0 0-.462-.443zm-5.022 1.537c-.521 0-.867.604-.867 1.359 0 .754.346 1.358.867 1.358s.867-.604.867-1.358c0-.755-.346-1.359-.867-1.359zm5.022.008c-.521 0-.867.604-.867 1.359 0 .754.346 1.358.867 1.358s.867-.604.867-1.358c0-.755-.346-1.359-.867-1.359zm-3.552 3.047a2.12 2.12 0 0 0-.604.096c-.558.2-1.008.667-1.216 1.254a3.1 3.1 0 0 0 3.623-.003 2.17 2.17 0 0 0-1.803-1.347z"/></svg>
            <span>Share on Reddit</span>
        </a>
        <a href="https://t.me/share/url?url=URL_PLACEHOLDER&text=TITLE_PLACEHOLDER" target="_blank" class="share-btn share-telegram" title="Share on Telegram">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.5.5 0 0 1 .172.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            <span>Share on Telegram</span>
        </a>
        <a href="https://www.tumblr.com/share/link?url=URL_PLACEHOLDER&name=TITLE_PLACEHOLDER" target="_blank" class="share-btn share-tumblr" title="Share on Tumblr">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14.563 18.198c.965 0 2.168-.322 2.73-.677l.906 2.678c-.677.484-2.458.874-4.203.874-4.287 0-6.174-2.488-6.174-6.174V9.788H5.572V7.39c2.54-.839 3.602-3.072 3.789-5.663h2.683v4.936h4.485v2.525h-4.485v4.424c0 1.45.484 2.586 2.519 2.586"/></svg>
            <span>Share on Tumblr</span>
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=URL_PLACEHOLDER" target="_blank" class="share-btn share-facebook" title="Share on Facebook">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>Share on Facebook</span>
        </a>
        <a href="https://pinterest.com/pin/create/button/?url=URL_PLACEHOLDER&description=TITLE_PLACEHOLDER" target="_blank" class="share-btn share-pinterest" title="Share on Pinterest">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.372 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.936 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.67.968-2.916 2.174-2.916 1.025 0 1.52.769 1.52 1.692 0 1.03-.656 2.571-.995 4.001-.283 1.196.599 2.173 1.777 2.173 2.133 0 3.772-2.25 3.772-5.496 0-2.873-2.064-4.882-5.011-4.882-3.413 0-5.418 2.561-5.418 5.207 0 1.03.396 2.133.892 2.734.098.119.112.223.083.345l-.333 1.36c-.053.222-.174.27-.402.163-1.5-.698-2.438-2.891-2.438-4.65 0-3.788 2.752-7.265 7.935-7.265 4.166 0 7.403 2.968 7.403 6.937 0 4.141-2.61 7.473-6.233 7.473-1.216 0-2.36-.631-2.752-1.381l-.75 2.855c-.27 1.045-1.002 2.353-1.491 3.154C9.807 23.382 10.877 24 12 24c6.628 0 12-5.373 12-12 0-6.628-5.372-12-12-12z"/></svg>
            <span>Share on Pinterest</span>
        </a>
    </div>
</div>"""

def update_article(fp):
    """Update a single blog article: image refs + share buttons."""
    slug = os.path.splitext(os.path.basename(fp))[0]
    with open(fp, "r", encoding="utf-8") as f:
        html = f.read()
    
    changes = []
    
    # 1. Update OG image to use article-specific image
    # Pattern: https://cha0smagicklabs.com/assets/images/blog/OLD-NAME.png
    og_pattern = r'(https://cha0smagicklabs\.com/assets/images/blog/)([a-z0-9_-]+)(\.png)'
    new_og = f'https://cha0smagicklabs.com/assets/images/blog/{slug}.png'
    
    def replace_og(m):
        old_img = m.group(2)
        if old_img != slug:
            changes.append(f"og:image: {old_img}.png -> {slug}.png")
            return new_og
        return m.group(0)
    
    html = re.sub(og_pattern, replace_og, html)
    
    # 2. Update picture/img srcset references
    # Pattern: ../assets/images/blog/OLD-NAME.webp and .png
    img_pattern = r'(\.\./assets/images/blog/)([a-z0-9_-]+)(\.(webp|png))'
    
    def replace_img(m):
        old_img = m.group(2)
        if old_img != slug:
            changes.append(f"img src: {old_img}.{m.group(4)} -> {slug}.{m.group(4)}")
            return m.group(1) + slug + m.group(3)
        return m.group(0)
    
    html = re.sub(img_pattern, replace_img, html)
    
    # 3. Update schema.org image reference  
    schema_pattern = r'("image":\s*"https://cha0smagicklabs\.com/assets/images/blog/)([a-z0-9_-]+)(\.png")'
    
    def replace_schema(m):
        old_img = m.group(2)
        if old_img != slug:
            changes.append(f"schema image: {old_img}.png -> {slug}.png")
            return m.group(1) + slug + m.group(3)
        return m.group(0)
    
    html = re.sub(schema_pattern, replace_schema, html)
    
    # 4. Replace old share links with new share buttons
    # Find the old share section
    old_share_pattern = r'<div class="share">.*?</div>'
    
    # Get title and URL for share buttons
    title_match = re.search(r'<meta property="og:title" content="([^"]+)', html)
    og_title = title_match.group(1) if title_match else slug
    # URL encode for share links
    import urllib.parse
    encoded_title = urllib.parse.quote(og_title[:120])
    encoded_url = urllib.parse.quote(f"https://cha0smagicklabs.com/blog/{slug}.html")
    
    share_html_final = SHARE_BUTTONS_HTML.replace("TITLE_PLACEHOLDER", encoded_title).replace("URL_PLACEHOLDER", encoded_url)
    
    # Check if old share section exists
    if re.search(old_share_pattern, html, re.DOTALL):
        html = re.sub(old_share_pattern, share_html_final, html, flags=re.DOTALL)
        changes.append("share buttons: upgraded to styled SVG buttons")
    else:
        # Insert before </article> or before FAQ section
        insert_before = "</article>"
        if insert_before in html:
            html = html.replace(insert_before, share_html_final + "\n" + insert_before)
            changes.append("share buttons: added new styled section")
    
    # 5. Add CSS for share buttons if not present
    css_link = '<link rel="stylesheet" href="../css/style.css">'
    share_css_check = '/* Share Buttons */'
    if share_css_check not in html:
        # Add inline styles for share buttons in the head if not in style.css
        # Actually we need to add to style.css, let's check if it's already there
        pass  # Will handle in CSS separately
    
    if changes:
        with open(fp, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  {slug}:")
        for c in changes:
            print(f"    {c}")
        return True
    else:
        print(f"  {slug}: no changes needed")
        return False

def main():
    blog_files = sorted(glob.glob(os.path.join(BLOG_DIR, "*.html")))
    updated = 0
    for fp in blog_files:
        slug = os.path.splitext(os.path.basename(fp))[0]
        if slug == "index":
            continue
        if update_article(fp):
            updated += 1
    
    print(f"\nUpdated {updated}/{len(blog_files) - 1} articles")

if __name__ == "__main__":
    main()
