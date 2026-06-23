import os
files = [f for f in os.listdir('.') if f.endswith('.html')]
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace desktop RTL button
    old_rtl = '<button class="btn btn-sm btn-brand-outline py-1 px-3 d-none d-sm-inline-block rtl-toggle-btn">RTL</button>'
    new_rtl = '<button class="toggle-icon-btn d-none d-sm-inline-flex rtl-toggle-btn" style="font-size: 13px; font-weight: 600;">RTL</button>'
    content = content.replace(old_rtl, new_rtl)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done matching RTL sizes!')
