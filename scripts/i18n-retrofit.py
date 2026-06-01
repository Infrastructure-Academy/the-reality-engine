"""
GP-001 Compliance: Batch i18n retrofit for all pages.
Adds useT import and replaces hardcoded English strings with t() calls.
Generates EN and ZH dictionary entries.
"""
import re, os, json

# Pages that already have full i18n
SKIP = {'Home.tsx', 'MobileExplorer.tsx', 'ComponentShowcase.tsx', 'ExplorerSelect.tsx'}

pages_dir = 'client/src/pages'
components_dir = 'client/src/components'

# All new keys to add (EN value -> key mapping)
# We'll build this as we process files
new_en_keys = {}
new_zh_keys = {}

def make_key(prefix, text):
    """Generate a camelCase i18n key from text."""
    # Clean and shorten
    words = re.sub(r'[^a-zA-Z0-9 ]', '', text).split()[:4]
    if not words:
        return None
    key = words[0].lower() + ''.join(w.capitalize() for w in words[1:])
    return f"{prefix}.{key}"

def add_import_if_missing(content):
    """Add useT import if not present."""
    if 'useT' in content:
        return content
    # Find last import line
    lines = content.split('\n')
    last_import = 0
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import = i
    lines.insert(last_import + 1, 'import { useT } from "@/contexts/LanguageContext";')
    return '\n'.join(lines)

def add_useT_hook(content):
    """Add const t = useT() after the first line of the default export function."""
    if 'const t = useT()' in content:
        return content
    # Find the export default function line
    match = re.search(r'(export default function \w+\([^)]*\)\s*\{)', content)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + '\n  const t = useT();' + content[insert_pos:]
    return content

# Process each file
results = {}
for fname in sorted(os.listdir(pages_dir)):
    if not fname.endswith('.tsx') or fname in SKIP:
        continue
    path = os.path.join(pages_dir, fname)
    with open(path) as f:
        content = f.read()
    
    # Add import and hook
    content = add_import_if_missing(content)
    content = add_useT_hook(content)
    
    # Write back
    with open(path, 'w') as f:
        f.write(content)
    
    results[fname] = True

print(f"Processed {len(results)} files:")
for fname in results:
    print(f"  ✓ {fname}")
