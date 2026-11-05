#!/usr/bin/env python3
"""Serve the built Biltoo website on localhost and open it in a browser."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path, help="built website directory")
    parser.add_argument("--port", type=int, default=0, help="local port (default: auto-select)")
    parser.add_argument("--no-browser", action="store_true", help="serve without opening a browser")
    args = parser.parse_args()

    directory = args.directory.resolve(strict=True)
    if not directory.is_dir() or not (directory / "index.html").is_file():
        parser.error(f"not a built website: {directory}")
    if not 0 <= args.port <= 65535:
        parser.error("--port must be between 0 and 65535")

    handler = partial(SimpleHTTPRequestHandler, directory=str(directory))
    with ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
        url = f"http://127.0.0.1:{server.server_port}/"
        print(f"Biltoo website: {url}", flush=True)
        print("Press Ctrl+C to stop.", flush=True)
        if not args.no_browser and not webbrowser.open(url, new=2):
            print("No browser could be opened automatically; use the URL above.", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping Biltoo website.", flush=True)


if __name__ == "__main__":
    main()
