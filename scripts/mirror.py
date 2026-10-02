#!/usr/bin/env python3
"""Materialize the owner's captured page with verified, same-origin dependencies."""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, quote
import base64, hashlib, json, re, subprocess
from localize import localize

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'reference/site.html'
ORIGIN = 'https://bajkamalsingh.me/'
USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'
records = []

def download(url, output, integrity=None):
    output.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['curl', '--fail', '--silent', '--show-error', '--location', '--retry', '2', '--max-time', '90', '--user-agent', USER_AGENT, url, '--output', str(output)], check=True)
    data = output.read_bytes()
    if integrity:
        algorithm, expected = integrity.split('-', 1)
        actual = base64.b64encode(hashlib.new(algorithm, data).digest()).decode()
        if actual != expected:
            output.unlink()
            raise ValueError('Subresource integrity mismatch: ' + url)
    records.append({'url': url, 'path': output.relative_to(ROOT).as_posix(), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), **({'integrity': integrity} if integrity else {})})
    return data

class Resources(HTMLParser):
    def __init__(self):
        super().__init__(); self.scripts = []; self.styles = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'script' and a.get('src'): self.scripts.append(a)
        if tag == 'link' and a.get('rel') == 'stylesheet': self.styles.append(a['href'])

source = SOURCE.read_text()
resources = Resources(); resources.feed(source)
# This is Cloudflare's per-request anti-bot transport code, not an application effect.
challenge = r'<script>\(function\(\)\{function c\(\).*?__CF\$cv\$params.*?</script>'
html = re.sub(challenge, '', source, flags=re.S)
script_map = {}
unavailable_scripts = []
for item in resources.scripts:
    url = item['src']
    if url == 'https://cdn.jsdelivr.net/npm/lucide@0.435.0/dist/umd/lucide.min.js':
        # This version does not exist in the npm registry; the live page guards its use.
        html = re.sub(r'<script src="'+re.escape(url)+r'"></script>', '', html)
        unavailable_scripts.append({'url':url, 'status':404, 'reason':'Upstream references an unpublished Lucide version; preserve the live page’s absent icon library.'})
        continue
    name = urlsplit(url).path.rsplit('/', 1)[-1] or 'tailwind.js'
    if url == 'https://cdn.tailwindcss.com': name = 'tailwind.js'
    download(urljoin(ORIGIN, url), ROOT/'public/vendor'/name, item.get('integrity'))
    script_map[url] = '/vendor/' + name
    html = html.replace('src="' + url + '"', 'src="' + script_map[url] + '"')
    print('Script:', name, flush=True)

style_map = {}
for i, url in enumerate(resources.styles):
    css_path = ROOT/'public/vendor'/('fonts-'+str(i)+'.css')
    css = download(url, css_path).decode()
    (ROOT/'reference'/('fonts-'+str(i)+'.css')).write_text(css)
    font_urls = sorted(set(re.findall(r'url\([\"\x27]?([^\)\"\x27]+)[\"\x27]?\)', css)))
    for j, font_url in enumerate(font_urls):
        suffix = Path(urlsplit(font_url).path).suffix or '.woff2'
        output = ROOT/'public/vendor/fonts'/('family-'+str(i)+'-'+str(j)+suffix)
        download(urljoin(url, font_url), output)
        css = css.replace(font_url, '/vendor/fonts/' + output.name)
    css_path.write_text(css)
    style_map[url] = '/vendor/' + css_path.name
    html = html.replace(url, style_map[url])
    print('Stylesheet:', css_path.name, 'fonts:', len(font_urls), flush=True)

literals = sorted(set(re.findall(r'''["']([^"'\n]+\.(?:png|jpg|jpeg|webp|gif|mp4|mp3|wav|svg|pdf)(?:\?[^"']*)?)["']''', source, re.I)))
files = sorted(set(x.removeprefix('./') for x in literals if not x.startswith(('data:', 'https:', 'http:'))))
def get_media(name):
    url = urljoin(ORIGIN, quote(name))
    output = ROOT/'public/assets'/name
    download(url, output)
    print('Media:', name, output.stat().st_size, flush=True)
    return name
with ThreadPoolExecutor(max_workers=5) as pool: list(pool.map(get_media, files))
for literal in sorted(literals, key=len, reverse=True):
    if not literal.startswith(('data:', 'https:', 'http:')):
        # Replace only quoted file literals, preserving the actual application logic.
        for delimiter in ('"', "'"):
            html = html.replace(delimiter+literal+delimiter, delimiter+('./assets/' if literal.startswith('./') else 'assets/')+literal.removeprefix('./')+delimiter)
# CSS background URLs also use the original asset names.
for name in files:
    html = html.replace('url("./'+name+'")', 'url("./assets/'+name+'")')
    html = html.replace("url('./"+name+"')", "url('./assets/"+name+"')")
# Font preconnects are unnecessary because all font requests are now same-origin.
html = re.sub(r'\s*<link rel="preconnect" href="https://fonts\.(?:googleapis|gstatic)\.com"[^>]*>', '', html)
(ROOT/'index.html').write_text(html)
for record in records:
    record['upstream_sha256'] = record['sha256']
    record['sha256'] = hashlib.sha256((ROOT/record['path']).read_bytes()).hexdigest()
manifest = {'unavailable_scripts':unavailable_scripts, 'source_url': ORIGIN, 'source_sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(), 'scripts':script_map, 'styles':style_map, 'media_count':len(files), 'resources':sorted(records, key=lambda x:x['path']), 'adaptations':['Same-origin asset, font, and script URLs', 'Removed Cloudflare per-request anti-bot iframe injection', 'Removed remote font preconnects', 'Omitted the upstream 404 Lucide script without substituting a version']}
assert html == localize(source, manifest), 'Localization drifted from the documented transport-only changes'
(ROOT/'reference/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Generated index.html; media files:', len(files))
