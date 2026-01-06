# Quick Start Guide - APK Distribution System

## System Status: ✅ READY

All components are installed and configured:
- ✅ apks.json (configuration file)
- ✅ add-apk.sh (management script - executable)
- ✅ script.js (dynamic download handler)
- ✅ jq installed (v1.6)

## How to Use

### Step 1: Add Your First Custom APK

```bash
cd /home/scatiux/Projs/LitePro/Emerald
./add-apk.sh /path/to/your-custom.apk "Custom Build Name"
```

**Example:**
```bash
./add-apk.sh ~/Downloads/my-custom-app.apk "John's Custom Build"
```

**Expected Output:**
```
📦 Copying APK to Emerald directory...
🔑 Generating unique code...
📝 Updating apks.json...

✅ APK added successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 File:        my-custom-app.apk
📏 Size:        10.5 MB
🏷️  Name:        John's Custom Build
🔑 Code:        ABC12  ← Your unique code
📅 Added:       2025-01-05T22:00:00Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Share link: https://liteinx.github.io/LitePro/Emerald/?r=ABC12

💡 Tip: Commit and push changes to GitHub to deploy
```

### Step 2: Share the Link

Send the generated link to the person who should download the APK:
```
https://liteinx.github.io/LitePro/Emerald/?r=ABC12
```

### Step 3: Deploy (if using GitHub Pages)

```bash
cd /home/scatiux/Projs/LitePro
git add Emerald/apks.json Emerald/my-custom-app.apk
git commit -m "Add custom APK build"
git push
```

## How It Works

### For Users with Code (`?r=ABC12`)

1. They visit: `https://site.com/Emerald/?r=ABC12`
2. Page title changes to your custom app name
3. Tagline shows: "Custom Build • Code: ABC12"
4. Download button downloads the specific APK
5. Status message shows: "✓ Download started: John's Custom Build (Code: ABC12)"

### For Users without Code

1. They visit: `https://site.com/Emerald/`
2. Downloads default APK (Emerald_1767507934.apk)

### For Invalid Codes

1. They visit: `https://site.com/Emerald/?r=INVALID`
2. Warning shows: "⚠️ Invalid code. Using default version."
3. Downloads default APK

## Testing Locally

To test the system locally:

1. **Add a test APK:**
   ```bash
   cd /home/scatiux/Projs/LitePro/Emerald
   ./add-apk.sh /path/to/test.apk "Test Build"
   ```

2. **Open in browser with code:**
   ```
   file:///home/scatiux/Projs/LitePro/Emerald/index.html?r=YOUR_CODE
   ```

3. **Test scenarios:**
   - Valid code → Should download test.apk
   - No code → Should download Emerald_1767507934.apk
   - Invalid code → Should show warning and download default

## File Structure After Adding APK

```
Emerald/
├── apks.json              ← Updated with new code
├── add-apk.sh             ← Script to add APKs
├── index.html             ← Showcase page
├── script.js              ← Handles URL parsing & downloads
├── style.css              ← Styling
├── README.md              ← This file
├── Emerald_1767507934.apk ← Default APK
└── my-custom-app.apk      ← Your custom APK (newly added)
```

## Code Generation

- **Format:** 5 characters (A-Z, 2-9)
- **No confusing chars:** Excludes I, O, 0, 1
- **Combinations:** 777,600,000 unique codes possible
- **Collision handling:** Script automatically retries if code exists

## Browser Console

Open browser console (F12) to see:
- Which APK is being loaded
- Download events
- Any errors

**Example logs:**
```
Loading custom APK: John's Custom Build (code: ABC12)
Download initiated: my-custom-app.apk | Code: ABC12
```

## Next Steps

1. **Test locally** with the current setup
2. **Add your first custom APK** using the script
3. **Deploy to GitHub** by committing and pushing
4. **Share your link** with users!

---

**Need help?** Check README.md for detailed documentation.
