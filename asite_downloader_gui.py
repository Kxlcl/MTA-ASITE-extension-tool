"""
AZURE FILE DOWNLOADER - GUI VERSION
Simple tkinter GUI wrapper for the Azure blob downloader
"""

import tkinter as tk
from tkinter import filedialog, scrolledtext, messagebox
import threading
import os
import csv
from azure.identity import InteractiveBrowserCredential
from azure.storage.blob import BlobServiceClient

# Configuration
STORAGE = "asitemta"
CONTAINER = "asite-mta-data"

class AzureDownloaderGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("MTA ASITE File Downloader")
        self.root.geometry("700x600")
        self.root.resizable(True, True)

        # Variables
        self.csv_file_path = tk.StringVar()
        self.folder_name = tk.StringVar()
        self.is_running = False

        # Create UI
        self.create_widgets()

    def create_widgets(self):
        # Header
        header = tk.Label(
            self.root,
            text="MTA ASITE File Downloader",
            font=("Arial", 16, "bold"),
            pady=10
        )
        header.pack()

        # Folder Name Input
        folder_frame = tk.Frame(self.root, padx=10, pady=5)
        folder_frame.pack(fill=tk.X)

        tk.Label(folder_frame, text="Folder Name:", width=15, anchor='w').pack(side=tk.LEFT)
        folder_entry = tk.Entry(folder_frame, textvariable=self.folder_name, width=50)
        folder_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)

        # CSV File Selection
        csv_frame = tk.Frame(self.root, padx=10, pady=5)
        csv_frame.pack(fill=tk.X)

        tk.Label(csv_frame, text="CSV File:", width=15, anchor='w').pack(side=tk.LEFT)
        csv_entry = tk.Entry(csv_frame, textvariable=self.csv_file_path, width=40, state='readonly')
        csv_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)

        browse_btn = tk.Button(csv_frame, text="Browse...", command=self.browse_csv)
        browse_btn.pack(side=tk.LEFT, padx=5)

        # Download Button
        btn_frame = tk.Frame(self.root, pady=10)
        btn_frame.pack()

        self.download_btn = tk.Button(
            btn_frame,
            text="Start Download",
            command=self.start_download,
            bg="#4CAF50",
            fg="white",
            font=("Arial", 12, "bold"),
            padx=20,
            pady=10
        )
        self.download_btn.pack()

        # Log Area
        log_frame = tk.Frame(self.root, padx=10, pady=5)
        log_frame.pack(fill=tk.BOTH, expand=True)

        tk.Label(log_frame, text="Log:", anchor='w').pack(fill=tk.X)

        self.log_text = scrolledtext.ScrolledText(
            log_frame,
            wrap=tk.WORD,
            width=80,
            height=20,
            font=("Courier", 10)
        )
        self.log_text.pack(fill=tk.BOTH, expand=True)

        # Status Bar
        self.status_bar = tk.Label(
            self.root,
            text="Ready",
            bd=1,
            relief=tk.SUNKEN,
            anchor=tk.W,
            padx=5
        )
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)

    def browse_csv(self):
        filename = filedialog.askopenfilename(
            title="Select CSV file",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )
        if filename:
            self.csv_file_path.set(filename)
            self.log(f"Selected CSV: {os.path.basename(filename)}")

    def log(self, message, tag=None):
        self.log_text.insert(tk.END, message + "\n")
        self.log_text.see(tk.END)
        self.root.update_idletasks()

    def update_status(self, message):
        self.status_bar.config(text=message)
        self.root.update_idletasks()

    def start_download(self):
        if self.is_running:
            messagebox.showwarning("Warning", "Download already in progress!")
            return

        # Validate inputs
        if not self.folder_name.get().strip():
            messagebox.showerror("Error", "Please enter a folder name")
            return

        if not self.csv_file_path.get():
            messagebox.showerror("Error", "Please select a CSV file")
            return

        # Clear log
        self.log_text.delete(1.0, tk.END)

        # Disable button
        self.download_btn.config(state=tk.DISABLED, text="Downloading...")
        self.is_running = True

        # Run download in separate thread
        thread = threading.Thread(target=self.run_download, daemon=True)
        thread.start()

    def run_download(self):
        try:
            folder = self.folder_name.get().strip().rstrip('/')
            csv_file = self.csv_file_path.get()

            self.log("=" * 70)
            self.log("STARTING DOWNLOAD PROCESS")
            self.log("=" * 70)
            self.update_status("Reading CSV file...")

            # Read CSV
            file_numbers = self.read_csv(csv_file)
            if not file_numbers:
                self.log("ERROR: No valid numbers found in CSV")
                return

            self.log(f"Found {len(file_numbers)} file numbers in CSV")

            # Create download folder
            desktop = os.path.join(os.path.expanduser("~"), "Downloads")
            download_folder = os.path.join(desktop, f"{folder}ASITEFiles")
            os.makedirs(download_folder, exist_ok=True)
            self.log(f"Download folder: {download_folder}")

            # Connect to Azure
            self.update_status("Connecting to Azure...")
            self.log("\nConnecting to Azure (browser login will open)...")

            credential = InteractiveBrowserCredential()
            client = BlobServiceClient(
                account_url=f"https://{STORAGE}.blob.core.windows.net",
                credential=credential
            )
            container = client.get_container_client(CONTAINER)
            self.log("Connected to Azure successfully!")

            # Download files
            self.update_status("Downloading files...")
            self.log("\nSearching and downloading files...")
            self.log("-" * 50)

            found_count = 0
            downloaded_count = 0
            extensions = ['.jpg', '.jpeg', '.png', '.pdf', '.txt', '.csv', '.xlsx', '.docx']

            for idx, number in enumerate(file_numbers, 1):
                self.update_status(f"Processing {idx}/{len(file_numbers)}: {number}")
                file_found = False

                for ext in extensions:
                    file_path = f"{folder}/{number}{ext}"
                    try:
                        blob_client = container.get_blob_client(file_path)
                        blob_client.get_blob_properties()

                        self.log(f"✅ Found: {file_path}")
                        file_found = True
                        found_count += 1

                        # Download
                        save_path = os.path.join(download_folder, f"{number}{ext}")
                        with open(save_path, "wb") as f:
                            download_stream = blob_client.download_blob()
                            f.write(download_stream.readall())

                        downloaded_count += 1
                        self.log(f"   ⬇️  Downloaded")
                        break
                    except:
                        continue

                if not file_found:
                    self.log(f"❌ Not found: {number}")

            # Summary
            self.log("\n" + "=" * 70)
            self.log("DOWNLOAD COMPLETE")
            self.log("=" * 70)
            self.log(f"Files searched: {len(file_numbers)}")
            self.log(f"Files found: {found_count}")
            self.log(f"Files downloaded: {downloaded_count}")
            self.log(f"Location: {download_folder}")

            self.update_status(f"Complete! Downloaded {downloaded_count} files")

            # Show completion message
            self.root.after(0, lambda: messagebox.showinfo(
                "Success",
                f"Download complete!\n\n"
                f"Files downloaded: {downloaded_count}\n"
                f"Location: {download_folder}"
            ))

        except Exception as e:
            error_msg = f"ERROR: {str(e)}"
            self.log("\n" + error_msg)
            self.update_status("Error occurred")
            self.root.after(0, lambda: messagebox.showerror("Error", error_msg))

        finally:
            self.is_running = False
            self.root.after(0, lambda: self.download_btn.config(
                state=tk.NORMAL,
                text="Start Download"
            ))

    def read_csv(self, csv_file):
        """Read and parse CSV file, returning list of file numbers"""
        file_numbers = []

        try:
            with open(csv_file, 'r', newline='') as f:
                reader = csv.reader(f)
                rows = list(reader)

                # Skip header if exists
                if rows and rows[0][0].lower() in ['number', 'numbers', 'file', 'files']:
                    rows = rows[1:]

                for row in rows:
                    if row and row[0].strip():
                        number = row[0].strip()
                        # Zero-pad if purely numeric
                        if number.isdigit():
                            number = number.zfill(4)
                        file_numbers.append(number)

        except Exception as e:
            self.log(f"Error reading CSV: {str(e)}")

        return file_numbers


def main():
    root = tk.Tk()
    app = AzureDownloaderGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
