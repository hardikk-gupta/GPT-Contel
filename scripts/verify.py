#!/usr/bin/env python3
"""Fail if the mirrored source or an original dependency/media file was changed."""
from pathlib import Path
import hashlib, json
from localize import localize
root = Path(__file__).resolve().parents[1]
manifest = json.loads((root/'reference/manifest.json').read_text())
source = (root/'reference/site.html').read_bytes()
assert hashlib.sha256(source).hexdigest() == manifest['source_sha256'], 'Captured source checksum changed'
assert (root/'index.html').read_text() == localize(source.decode(), manifest), 'Application HTML/CSS/JS differs from the original beyond the documented URL/Cloudflare adaptations'
for resource in manifest['resources']:
    path = Path(resource['path'])
    if path.name in ('fonts-0.css', 'fonts-1.css'):
        original_css = (root/'reference'/path.name).read_bytes()
        assert hashlib.sha256(original_css).hexdigest() == resource['upstream_sha256'], 'Original font stylesheet checksum changed: '+path.name
    data = (root/path).read_bytes()
    assert hashlib.sha256(data).hexdigest() == resource['sha256'], 'Resource checksum changed: '+resource['path']
print('PASS: complete application source matches the original with only documented transport adaptations')
print('PASS: '+str(len(manifest['resources']))+' script, font, stylesheet, and media checksums match')
