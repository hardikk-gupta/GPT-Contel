"""Only the transport adaptations needed to run the captured site on another origin."""
import re

def localize(source, manifest):
    html = re.sub(r'<script>\(function\(\)\{function c\(\).*?__CF\$cv\$params.*?</script>', '', source, flags=re.S)
    for url, path in manifest['scripts'].items():
        html = html.replace('src="'+url+'"', 'src="'+path+'"')
    for unavailable in manifest['unavailable_scripts']:
        html = re.sub(r'<script src="'+re.escape(unavailable['url'])+r'"></script>', '', html)
    for url, path in manifest['styles'].items():
        html = html.replace(url, path)
    literals = sorted(set(re.findall(r'''["']([^"'\n]+\.(?:png|jpg|jpeg|webp|gif|mp4|mp3|wav|svg|pdf)(?:\?[^"']*)?)["']''', source, re.I)), key=len, reverse=True)
    for literal in literals:
        if not literal.startswith(('data:', 'https:', 'http:')):
            for delimiter in ('"', "'"):
                html = html.replace(delimiter+literal+delimiter, delimiter+('./assets/' if literal.startswith('./') else 'assets/')+literal.removeprefix('./')+delimiter)
    html = re.sub(r'\s*<link rel="preconnect" href="https://fonts\.(?:googleapis|gstatic)\.com"[^>]*>', '', html)
    return html
