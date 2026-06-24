import os
import glob
import re

html_files = glob.glob('c:/Users/prasa/OneDrive/Desktop/SF/june website 2026/Cold_Pressed_Juice_Superfood_Bar/*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the footer section
    footer_start = content.find('<footer class="footer-custom">')
    if footer_start == -1:
        continue
        
    footer_end = content.find('</footer>', footer_start)
    if footer_end == -1:
        continue

    footer_content = content[footer_start:footer_end]
    
    # Replace col-lg-4 with col-xl-4
    footer_content = footer_content.replace('col-lg-4 col-md-6', 'col-xl-4 col-lg-6 col-md-6')
    # Replace col-lg-2 with col-xl-2
    footer_content = footer_content.replace('col-lg-2 col-md-6 col-6', 'col-xl-2 col-lg-6 col-md-6 col-6')

    # Reconstruct content
    content = content[:footer_start] + footer_content + content[footer_end:]

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed {len(html_files)} files.")
