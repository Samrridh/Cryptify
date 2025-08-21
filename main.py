import os
import getpass
from tkinter import Tk, filedialog

EXTS = {".jpg", ".png"}

def xor1(data: bytes, password: str) -> bytes:
    pw = password.encode()
    return bytes([b ^ pw[i % len(pw)] for i, b in enumerate(data)])

def process_file(path, password):
    with open(path, "rb") as f:
        data = f.read()
    new_data = xor1(data, password)
    with open(path, "wb") as f:
        f.write(new_data)

def choose_folder():
    root = Tk()
    root.withdraw()  
    folder = filedialog.askdirectory(title="Pick a folder")
    root.destroy()
    return folder

def main():
    print("=== Image Encrypt/Decrypt ===")
    print("1) Encrypt all images")
    print("2) Decrypt all images")
    choice = input("Enter choice: ").strip()
    if choice not in {"1", "2"}:
        print("Invalid choice")
        return

    password = getpass.getpass("Enter password: ")
    if not password:
        print("Password cannot be empty")
        return

    folder = choose_folder()
    if not folder:
        print("No folder selected")
        return

    files = [os.path.join(folder, f) for f in os.listdir(folder)
             if os.path.splitext(f)[1].lower() in EXTS]

    if not files:
        print("No images found in folder")
        return

    for i, f in enumerate(files, 1):
        process_file(f, password)
        print(f"[{i}/{len(files)}] Processed: {f}")

    print("Done!")

if __name__ == "__main__":
    main()
