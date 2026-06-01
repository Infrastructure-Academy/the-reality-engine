"""Extract hardcoded English strings from TSX pages that need i18n."""
import re, os

ALREADY_DONE = {'Home.tsx', 'MobileExplorer.tsx', 'ComponentShowcase.tsx'}
pages_dir = 'client/src/pages'

for fname in sorted(os.listdir(pages_dir)):
    if not fname.endswith('.tsx') or fname in ALREADY_DONE:
        continue
    path = os.path.join(pages_dir, fname)
    with open(path) as f:
        content = f.read()
    
    # Find strings in JSX: >text< patterns (between tags)
    jsx_texts = re.findall(r'>([A-Z][A-Za-z0-9 \-\u2014&;,.:!?\x27]+)<', content)
    
    all_texts = set(jsx_texts)
    # Filter out very short or likely code
    all_texts = {t.strip() for t in all_texts if len(t.strip()) > 3}
    
    if all_texts:
        print(f'\n=== {fname} ({len(all_texts)} strings) ===')
        for t in sorted(all_texts)[:15]:
            print(f'  "{t}"')
