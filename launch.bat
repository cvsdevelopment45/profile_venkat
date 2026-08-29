@echo off
echo ====================================================
echo Starting Venkat Portfolio Local Server on port 3000...
echo ====================================================
start "" http://localhost:3000
python -m http.server 3000
pause
