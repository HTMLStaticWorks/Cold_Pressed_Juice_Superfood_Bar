import os, re

def get_block(text, start_tag, end_tag):
    start = text.find(start_tag)
    if start == -1: return None
    end = text.find(end_tag, start)
    if end == -1: return None
    return text[start:end+len(end_tag)]

with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

header_block = get_block(idx_content, '<header>', '</header>')

# Find offcanvas block more safely
offcanvas_start = '<div class="offcanvas-custom d-lg-none" id="offcanvas-menu">'
o_start_idx = idx_content.find(offcanvas_start)
if o_start_idx != -1:
    # Find the closing tag of this div. We can cheat by looking for the next <!-- Cart Drawer
    o_end_idx = idx_content.find('<!-- Cart Drawer', o_start_idx)
    if o_end_idx != -1:
        # Backtrack to the </div> before it
        o_end_idx = idx_content.rfind('</div>', o_start_idx, o_end_idx) + 6
        offcanvas_block = idx_content[o_start_idx:o_end_idx]
    else:
        offcanvas_block = None
else:
    offcanvas_block = None

footer_block = get_block(idx_content, '<footer class="footer-custom">', '</footer>')

files = [f for f in os.listdir('.') if f.endswith('.html') and f not in ('index.html', 'coming-soon.html')]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace header
    old_header = get_block(content, '<header>', '</header>')
    if old_header and header_block:
        new_header = header_block
        # Strip active classes from nav links and dropdown items
        new_header = re.sub(r'(class="[^"]*dropdown-item[^"]*)"', lambda m: m.group(1).replace(' active', '').replace(' text-brand-primary', '') + '"', new_header)
        new_header = re.sub(r'(class="[^"]*nav-link-custom[^"]*)"', lambda m: m.group(1).replace(' active', '') + '"', new_header)
        new_header = new_header.replace('  ', ' ')
        
        if file == 'home-2.html':
            new_header = re.sub(r'(class="[^"]*dropdown-toggle[^"]*)"', r'\1 active"', new_header)
            new_header = re.sub(r'(class="[^"]*dropdown-item[^"]*)"\s*href="home-2.html"', r'\1 active text-brand-primary" href="home-2.html"', new_header)
        else:
            new_header = re.sub(rf'(class="[^"]*nav-link-custom[^"]*)"\s*href="{file}"', r'\1 active" href="' + file + '"', new_header)
            
        content = content.replace(old_header, new_header)
        
    # Replace offcanvas
    old_offcanvas_start = content.find(offcanvas_start)
    if old_offcanvas_start != -1 and offcanvas_block:
        old_o_end_idx = content.find('<!-- Cart Drawer', old_offcanvas_start)
        if old_o_end_idx != -1:
            old_o_end_idx = content.rfind('</div>', old_offcanvas_start, old_o_end_idx) + 6
            old_offcanvas = content[old_offcanvas_start:old_o_end_idx]
            
            new_offcanvas = offcanvas_block
            new_offcanvas = re.sub(r'(class="[^"]*dropdown-item[^"]*)"', lambda m: m.group(1).replace(' active', '').replace(' text-brand-primary', '') + '"', new_offcanvas)
            new_offcanvas = re.sub(r'(class="[^"]*nav-link-custom[^"]*)"', lambda m: m.group(1).replace(' active', '') + '"', new_offcanvas)
            new_offcanvas = new_offcanvas.replace('  ', ' ')
            
            if file == 'home-2.html':
                new_offcanvas = re.sub(r'(class="[^"]*dropdown-toggle[^"]*)"', r'\1 active"', new_offcanvas)
                new_offcanvas = re.sub(r'(class="[^"]*dropdown-item[^"]*)"\s*href="home-2.html"', r'\1 active text-brand-primary" href="home-2.html"', new_offcanvas)
            else:
                new_offcanvas = re.sub(rf'(class="[^"]*nav-link-custom[^"]*)"\s*href="{file}"', r'\1 active" href="' + file + '"', new_offcanvas)
                
            content = content.replace(old_offcanvas, new_offcanvas)
            
    # Replace footer
    old_footer = get_block(content, '<footer class="footer-custom">', '</footer>')
    if old_footer and footer_block:
        content = content.replace(old_footer, footer_block)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
