import os, re
files = [f for f in os.listdir('.') if f.endswith('.html')]
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix duplicate class bug
    content = content.replace('class="nav-link nav-link-custom" class="nav-link nav-link-custom active"', 'class="nav-link nav-link-custom active"')
    
    # Clean up dropdown active state for non-index pages
    if file != 'index.html':
        content = content.replace('class="dropdown-item py-2 px-3 text-brand-primary"', 'class="dropdown-item py-2 px-3"')
        content = content.replace('class="dropdown-item py-2 px-3  text-brand-primary"', 'class="dropdown-item py-2 px-3"')
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
