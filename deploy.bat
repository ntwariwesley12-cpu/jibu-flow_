@echo off
echo.
echo === JIBU FLOW GITHUB DEPLOYMENT ===
echo.

echo Creating GitHub repository...
"C:\Program Files\GitHub CLI\gh.exe" repo create jibu-flow --public --description "Jibu Flow Water - Premium Drinking Water Delivery Website"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Failed to create repository automatically.
    echo Please go to https://github.com/new and create a repository named "jibu-flow"
    echo.
    echo After creating it, run this script again or run:
    echo   git remote add origin https://github.com/ntwariwesley12/jibu-flow.git
    echo   git push -u origin master
    pause
    exit /b 1
)

echo.
echo Adding remote and pushing code...
git remote add origin https://github.com/ntwariwesley12/jibu-flow.git
git push -u origin master

echo.
echo === DONE ===
echo Your code is now on GitHub!
echo.
echo Next steps:
echo 1. Go to https://github.com/ntwariwesley12/jibu-flow/settings/pages
echo 2. Set Source to "Deploy from a branch"
echo 3. Select branch "master" and folder "/ (root)"
echo 4. Click Save
echo.
echo Your site will be live at: https://ntwariwesley12.github.io/jibu-flow
echo.
pause
