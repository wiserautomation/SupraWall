import os
import re

base_dir = "/Users/alejandropeghin/Desktop/AntiG/SW-Private/SupraWall/packages/dashboard/src/app/[lang]/learn"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if FAQPage is already there
    if 'FAQPage' in content or 'faqSchema' in content:
        return

    # Extract title and description to build relevant FAQs
    title_match = re.search(r'title:\s*[`"]([^`"]+)[`"]', content)
    desc_match = re.search(r'description:\s*[`"]([^`"]+)[`"]', content)
    
    title = title_match.group(1).replace('| SupraWall', '').replace('SupraWall', '').strip() if title_match else "AI Agent Security"
    desc = desc_match.group(1).strip() if desc_match else "Comprehensive guide on securing autonomous AI agents."

    # Create the FAQ Schema string
    faq_schema = f"""
    const faqSchema = {{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "inLanguage": lang,
        "mainEntity": [
            {{
                "@type": "Question",
                "name": "What is {title}?",
                "acceptedAnswer": {{
                    "@type": "Answer",
                    "text": "{desc}"
                }}
            }},
            {{
                "@type": "Question",
                "name": "Why is {title} important for AI agents?",
                "acceptedAnswer": {{
                    "@type": "Answer",
                    "text": "Autonomous AI agents require specialized runtime guardrails to prevent prompt injection, unauthorized tool execution, and budget overruns. Understanding this is critical for secure deployment."
                }}
            }},
            {{
                "@type": "Question",
                "name": "Does SupraWall support {title} compliance?",
                "acceptedAnswer": {{
                    "@type": "Answer",
                    "text": "Yes. SupraWall provides the deterministic SDK-level middleware required to enforce security policies and generate audit logs for {title} requirements."
                }}
            }}
        ]
    }};
"""

    # Inject faqSchema before return (
    # We look for the last return ( inside the component.
    # A safe bet is finding "return (" and inserting the schema before it.
    
    parts = content.split("return (")
    if len(parts) < 2:
        return # Couldn't find return (
        
    # Assume the last "return (" is the component's return
    before_return = "return (".join(parts[:-1])
    after_return = parts[-1]
    
    new_content = before_return + faq_schema + "    return (" + after_return
    
    # Inject script tag
    # Find the first > after return (
    # e.g., <div className="...">
    
    div_match = re.search(r'(<div[^>]+>)', after_return)
    if div_match:
        div_tag = div_match.group(1)
        script_tag = f'\n            <script type="application/ld+json" dangerouslySetInnerHTML={{{{ __html: JSON.stringify(faqSchema) }}}} />'
        
        new_after_return = after_return.replace(div_tag, div_tag + script_tag, 1)
        new_content = before_return + faq_schema + "    return (" + new_after_return
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"Could not inject script tag in {filepath}")


for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file == 'page.tsx':
            filepath = os.path.join(root, file)
            process_file(filepath)

print("FAQ Schema injection complete.")
