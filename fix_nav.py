import os
import glob

html_files = glob.glob('c:/Users/prasa/OneDrive/Desktop/SF/june website 2026/Cold_Pressed_Juice_Superfood_Bar/*.html')

for file in html_files:
    if 'login.html' in file or 'register.html' in file:
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Only replace inside the <header> and mobile offcanvas sections to be safe!
    
    # 1. Expand lg to xl
    content = content.replace('navbar-expand-lg', 'navbar-expand-xl')
    
    # 2. Desktop Menu
    content = content.replace('d-none d-lg-flex justify-content-center', 'd-none d-xl-flex justify-content-center')
    
    # 3. Header Actions (icons)
    content = content.replace('d-none d-lg-inline-flex', 'd-none d-xl-inline-flex')
    
    # 4. Hamburger button and offcanvas container
    # <button class="hamburger-custom d-lg-none"
    content = content.replace('hamburger-custom d-lg-none', 'hamburger-custom d-xl-none')
    # <div class="offcanvas-custom d-lg-none"
    content = content.replace('offcanvas-custom d-lg-none', 'offcanvas-custom d-xl-none')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed {len(html_files)} files.")
