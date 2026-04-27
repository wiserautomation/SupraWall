import os
import re

VS_DIR = "packages/dashboard/src/app/[lang]/vs"

def fix_file(filepath, slug):
    with open(filepath, 'r') as f:
        content = f.read()

    # Cleanup double definitions from previous run
    content = content.replace(
        '    const { lang } = (await params) as { lang: Locale };\n    const dictionary = await getDictionary(lang);\n' * 2,
        '    const { lang } = (await params) as { lang: Locale };\n    const dictionary = await getDictionary(lang);\n'
    )

    # Ensure all schemas have inLanguage
    # Find all objects with @type
    # If they don't have inLanguage: lang, add it.
    
    # Simple regex for schemas
    schema_patterns = [
        (r'("@type":\s*"WebPage",)', r'\1\n        "inLanguage": lang,'),
        (r'("@type":\s*"FAQPage",)', r'\1\n        "inLanguage": lang,'),
    ]
    
    for pattern, replacement in schema_patterns:
        # Only replace if inLanguage isn't already there in the next few lines
        # This is tricky with regex, but we can do a simplified version
        content = re.sub(pattern, replacement, content)
        # Fix duplicates if we added it twice
        content = content.replace('"inLanguage": lang,\n        "inLanguage": lang,', '"inLanguage": lang,')

    # Fix the duplicate lang/dictionary block if it's still there
    content = re.sub(
        r'(const \{ lang \} = \(await params\) as \{ lang: Locale \};\s*const dictionary = await getDictionary\(lang\);\s*){2,}',
        r'\1',
        content
    )

    with open(filepath, 'w') as f:
        f.write(content)

for dirname in os.listdir(VS_DIR):
    dirpath = os.path.join(VS_DIR, dirname)
    if os.path.isdir(dirpath):
        page_path = os.path.join(dirpath, "page.tsx")
        if os.path.exists(page_path):
            print(f"Cleaning up {page_path}...")
            fix_file(page_path, dirname)
