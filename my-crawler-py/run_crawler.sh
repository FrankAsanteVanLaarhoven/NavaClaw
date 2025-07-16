#!/bin/bash

# Step 1: Validate Poetry Installation (required for modern Python projects)
if ! command -v poetry &> /dev/null
then
    echo "Poetry is not installed. Please install Poetry first." >&2
    exit 1
fi

# Step 2: Ensure proper project environment is active
cd "$(dirname "$0")"

# (Re)Install dependencies for reproducibility
poetry install

# Step 3: Guarantee Playwright browsers are set up (only needed once)
poetry run python -m playwright install --with-deps

# Step 4: Run the main crawler with integrated logging for professional, shareable output
poetry run python -m my_crawler_py.main

echo "Crawl complete. Quality log exported to crawl_report.json" 