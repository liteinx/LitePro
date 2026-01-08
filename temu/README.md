# Temu New Year Sale - APK Distribution System

## 🎉 Overview

A festive New Year themed landing page for Temu with a custom APK distribution system. Share unique download links with friends to give them custom Temu APK builds!

## 🎁 Features

- **New Year Countdown Timer** - Counts down to end of 2025
- **Festive Design** - Red, gold, and celebratory theme
- **Fireworks Animation** - Subtle particle effects
- **Deal Cards** - Showcases hot New Year deals
- **APK Distribution** - Share custom APKs via unique codes
- **Mobile Responsive** - Works on all devices

## 📁 Files

- **index.html** - Main landing page
- **style.css** - New Year themed styling
- **script.js** - Countdown + APK distribution logic
- **apks.json** - APK configuration file
- **add-apk.sh** - Script to add new APKs
- **README.md** - This file

## 🚀 How to Use

### Adding a Custom APK

1. **Make sure jq is installed:**
   ```bash
   sudo apt-get install jq  # Ubuntu/Debian
   brew install jq          # macOS
   ```

2. **Run the add-apk.sh script:**
   ```bash
   cd /home/scatiux/Projs/LitePro/temu
   ./add-apk.sh /path/to/temu-app.apk "Friend's Custom Build"
   ```

3. **Example output:**
   ```
   ✅ APK added successfully!

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📦 File:        temu-custom.apk
   📏 Size:        45.2 MB
   🏷️  Name:        Friend's Custom Build
   🔑 Code:        ABC12
   📅 Added:       2025-01-06T00:00:00Z
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   🔗 Share link: https://liteinx.github.io/LitePro/temu/?r=ABC12
   ```

### Sharing Links

- **With custom code:** `https://site.com/temu/?r=ABC12` → Downloads custom APK
- **Without code:** `https://site.com/temu/` → Downloads default APK
- **Invalid code:** Falls back to default APK

## 🎨 Theme

### Colors
- **Primary:** Red (#ff4757)
- **Secondary:** Orange (#ffa502)
- **Gold:** (#ffb142)
- **Accent:** Gold (#ffd700)

### Design Elements
- Gradient backgrounds with floating orbs
- Glassmorphism cards
- Animated badge with wiggle effect
- Countdown timer
- Deal cards with discount badges
- Fireworks particle effects

## 📊 How It Works

### For You (Adding APKs)
```bash
./add-apk.sh ~/Downloads/custom-temu.apk "John's Build"
# Generates: Code J4K9M
# Share: https://site.com/temu/?r=J4K9M
```

### For Users (Downloading)
1. They click your link with code
2. Page loads with Temu branding (always looks same)
3. They click "Download App"
4. Correct APK downloads based on their code

## 🛠️ Deployment

1. Add your APK using the script
2. Commit to git:
   ```bash
   git add temu/apks.json temu/custom.apk
   git commit -m "Add custom Temu APK"
   git push
   ```
3. GitHub Pages auto-deploys
4. Share the link!

## 🎯 Example Use Cases

1. **Referral Links:** Give each person a unique APK with referral bonuses
2. **Custom Builds:** Distribute modified/branded versions
3. **A/B Testing:** Different APK versions for different users
4. **Regional Versions:** Share region-specific Temu builds

## 🔧 Configuration

### apks.json Structure
```json
{
  "default": "Temu_NewYear.apk",
  "apps": {
    "ABC12": {
      "filename": "custom-temu.apk",
      "name": "Custom Build",
      "added": "2025-01-06T00:00:00Z",
      "downloads": 0
    }
  }
}
```

## 📱 Page Features

1. **Hero Section**
   - New Year Sale badge
   - TEMU logo with year
   - Countdown timer
   - Download button
   - Stats (500M+ downloads, etc.)

2. **Deals Section**
   - Electronics, Fashion, Home & Garden, Beauty
   - Discount badges
   - Sale prices

3. **Features Section**
   - Why Choose Temu
   - 6 feature cards

4. **How It Works**
   - 3-step guide
   - Install tips

5. **CTA Section**
   - Final call to action
   - Large download button

## 🐛 Troubleshooting

**Script fails:**
```bash
sudo apt-get install jq
```

**Download not working:**
- Check APK file exists in temu/ directory
- Verify apks.json has correct entry
- Open browser console (F12) for errors

**Countdown wrong date:**
Edit script.js line 12:
```javascript
COUNTDOWN_DATE: new Date('YOUR DATE HERE').getTime()
```

## 🎄 Customization

### Change Countdown Date
Edit `script.js`:
```javascript
COUNTDOWN_DATE: new Date('January 1, 2026 00:00:00').getTime()
```

### Change Colors
Edit `style.css`:
```css
:root {
    --primary: #ff4757;  /* Main red */
    --secondary: #ffa502; /* Orange */
    --gold: #ffb142;      /* Gold */
}
```

### Change Default APK
Edit `apks.json`:
```json
{
  "default": "Your-Default.apk",
  ...
}
```

## 📈 Code Features

- **5-character codes** (A-Z, 2-9)
- **60^5 = 777M combinations**
- **No confusing chars** (no I, O, 0, 1)
- **Collision detection**
- **Auto-retry on duplicate**

## 🎊 Enjoy!

Share the Temu app with friends using unique download links! 🎉

---

**Need help?** Check the main Emerald README.md for detailed system documentation.
