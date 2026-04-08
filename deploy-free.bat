@echo off
echo ========================================
echo    JIBU FLOW WATER - FREE DEPLOYMENT
echo ========================================
echo.
echo This script will help you deploy your website for FREE!
echo.
echo STEP 1: Create a GitHub account (if you don't have one)
echo        Go to: https://github.com
echo.
echo STEP 2: Create a new repository
echo        Name it: jibu-flow-water
echo        Make it public
echo.
echo STEP 3: Push your code to GitHub
echo.
pause

echo Pushing to GitHub...
git remote add origin https://github.com/YOUR_USERNAME/jibu-flow-water.git
git branch -M main
git push -u origin main

echo.
echo ========================================
echo    SUCCESS! Your code is on GitHub
echo ========================================
echo.
echo STEP 4: Deploy to Vercel (FREE)
echo        Go to: https://vercel.com
echo        Sign up with GitHub
echo        Click "New Project"
echo        Import your "jibu-flow-water" repository
echo        Deploy!
echo.
echo STEP 5: Your site will be live at:
echo        https://jibu-flow-water.vercel.app
echo.
echo STEP 6: Get a FREE domain
echo        Go to: https://www.freenom.com
echo        Register: jibuflowwater.tk (FREE!)
echo.
pause