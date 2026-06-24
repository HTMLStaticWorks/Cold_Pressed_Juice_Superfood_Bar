import os

file_path = 'c:/Users/prasa/OneDrive/Desktop/SF/june website 2026/Cold_Pressed_Juice_Superfood_Bar/menu.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add text-nowrap to the Quick View buttons
content = content.replace(
    'class="btn btn-brand-outline py-2 px-3" data-bs-toggle="modal" data-bs-target="#quickview-modal"',
    'class="btn btn-brand-outline py-2 px-3 text-nowrap" data-bs-toggle="modal" data-bs-target="#quickview-modal"'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Quick View buttons in menu.html")
