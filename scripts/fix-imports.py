"""Fix broken multi-line imports where useT was inserted incorrectly."""
import os

broken_files = [
    "client/src/pages/AppraisalQuestionnaire.tsx",
    "client/src/pages/ChallengeLanding.tsx",
    "client/src/pages/IGOUmbrella.tsx",
    "client/src/pages/Journey.tsx",
]

for fpath in broken_files:
    with open(fpath) as f:
        lines = f.readlines()
    
    # Find the misplaced useT line (it's between "import {" and the actual imports)
    new_lines = []
    useT_line = None
    skip_next = False
    
    for i, line in enumerate(lines):
        if line.strip() == 'import { useT } from "@/contexts/LanguageContext";':
            # Check if previous line is "import {"
            if i > 0 and new_lines and new_lines[-1].strip() == "import {":
                useT_line = line
                continue  # Skip this line - we'll add it elsewhere
        new_lines.append(line)
    
    # Now find the right place to insert useT (after the last import block)
    if useT_line:
        # Find last line that ends an import (contains "from" and ";")
        insert_pos = 0
        for i, line in enumerate(new_lines):
            if ('from "' in line or "from '" in line) and line.strip().endswith(";"):
                insert_pos = i + 1
            elif line.strip().startswith("} from "):
                insert_pos = i + 1
        
        # Check if useT already exists elsewhere in the file
        has_useT = any('import { useT }' in l for l in new_lines)
        if not has_useT:
            new_lines.insert(insert_pos, useT_line)
    
    with open(fpath, 'w') as f:
        f.writelines(new_lines)
    print(f"Fixed: {fpath}")
