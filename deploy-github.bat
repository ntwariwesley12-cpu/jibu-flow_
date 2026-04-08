@echo off
echo Opening GitHub authentication...
echo.
echo Please follow these steps:
echo 1. A browser window will open
echo 2. Enter the code shown in the terminal
echo 3. Authorize the device
echo.
echo Once done, come back here and press Enter to continue...
echo.

cmd /c "C:\Program Files\GitHub CLI\gh.exe" auth login

echo.
echo Checking authentication...
cmd /c "C:\Program Files\GitHub CLI\gh.exe" auth status

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Creating GitHub repository...
    cmd /c "C:\Program Files\GitHub CLI\gh.exe" repo create jibu-flow --public --source=. --description "Jibu Flow Water - Premium Drinking Water Delivery Website"
    
    echo.
    echo Pushing code to GitHub...
    git push -u origin master
    
    echo.
    echo ========================================
    echo Deployment setup complete!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Go to https://github.com and find the jibu-flow repository
    echo 2. Go to Settings -^> Pages
    echo 3. Set Source to "Deploy from a branch"
    echo 4. Select branch "master" and folder "/ (root)"
    echo 5. Click Save
    echo.
    echo Your site will be live at: https://yourusername.github.io/jibu-flow
) else (
    echo.
    echo Authentication failed. Please try again.
)

echo.
pause
