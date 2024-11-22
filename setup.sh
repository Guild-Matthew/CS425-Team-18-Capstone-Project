# setup.sh

# Attempt to activate the virtual environment
if [ -f "myproject_env/Scripts/activate" ]; then
    # For Windows
    source myproject_env/Scripts/activate
elif [ -f "myproject_env/bin/activate" ]; then
    # For macOS/Linux
    source myproject_env/bin/activate
else
    echo "Virtual environment not found. Please ensure it exists in 'myproject_env'."
    exit 1
fi

echo "Installing requirements..."
pip install -r requirements.txt

echo "Setup complete!"
