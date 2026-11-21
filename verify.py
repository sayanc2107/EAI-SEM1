import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

with open('js/data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()

print(f"HTML lines: {len(html.splitlines())}")
print(f"app.js lines: {len(app_js.splitlines())}")
print(f"data.js lines: {len(data_js.splitlines())}")

# Find all inline event handlers in HTML
handlers = re.findall(r'on[a-z]+\s*=\s*["\']([a-zA-Z0-9_]+)\(', html)
missing = [h for h in set(handlers) if h not in app_js]
print(f"Unique handlers in HTML: {len(set(handlers))}")
print(f"Missing handlers in app.js: {missing}")

# Check IDs referenced in app.js with getElementById
ids_in_app = re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", app_js)
ids_in_html = re.findall(r'id=["\']([^"\']+)["\']', html)
set_html_ids = set(ids_in_html)
missing_ids = [i for i in set(ids_in_app) if i not in set_html_ids]
print(f"Unique getElementById in app.js: {len(set(ids_in_app))}")
print(f"Missing IDs from HTML: {missing_ids}")

# Check modals
modals = re.findall(r'id=["\']([a-zA-Z0-9_\-]+modal)["\']', html)
print(f"Modals found: {modals}")
