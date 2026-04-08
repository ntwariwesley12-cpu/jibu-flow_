# Jibu Flow - Manual Deployment Script

This script will help you deploy your website to GitHub Pages.

## Steps to Complete:

### Step 1: Create a GitHub Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "jibu-flow-deploy")
4. Select scopes: check "repo" and "workflow"
5. Click "Generate token"
6. COPY the token (you won't see it again!)

### Step 2: Run this command with your token:
```bash
export GH_TOKEN="your_pasted_token_here"
cd "C:\Users\EliteBook\Desktop\jibu flow"
git init
git add .
git commit -m "Initial commit - Jibu Flow Water"
git remote add origin https://github.com/YOUR_USERNAME/jibu-flow.git
git push -u origin master
```

### Step 3: Enable GitHub Pages
1. Go to: https://github.com/YOUR_USERNAME/jibu-flow/settings/pages
2. Under "Source", select "Deploy from a branch"
3. Select branch "master" and folder "/ (root)"
4. Click Save

### Step 4: Your website will be live at:
https://YOUR_USERNAME.github.io/jibu-flow

---

Alternatively, you can manually upload your files to GitHub:
1. Go to https://github.com and create a new repository named "jibu-flow"
2. Upload all files from your project folder
3. Enable GitHub Pages in settings
