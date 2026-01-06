# Emerald APK Distribution System

## Overview

This system allows you to distribute multiple APK files through unique shareable codes. Each APK gets a 5-character code, and users can download specific versions by visiting URLs like `?r=CODE`.

## Files

- **apks.json** - Configuration file mapping codes to APK files
- **add-apk.sh** - Bash script to add new APKs and generate codes
- **index.html** - Main showcase page with dynamic download functionality
- **script.js** - JavaScript that handles URL parameter parsing and downloads

## Usage

### Adding a New APK

1. **Make sure jq is installed:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install jq

   # macOS
   brew install jq
   ```

2. **Run the add-apk.sh script:**
   ```bash
   ./add-apk.sh /path/to/your/app.apk "App Name"
   ```

3. **Example output:**
   ```
   ✅ APK added successfully!

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📦 File:        my-custom-app.apk
   📏 Size:        10.5 MB
   🏷️  Name:        Custom Build for John
   🔑 Code:        J4K9M
   📅 Added:       2025-01-05T12:30:00Z
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   🔗 Share link: https://liteinx.github.io/LitePro/Emerald/?r=J4K9M

   💡 Tip: Commit and push changes to GitHub to deploy
   ```

### Sharing Links

- **Custom APK:** Share the link with code: `https://site.com/Emerald/?r=J4K9M`
- **Default APK:** Share without code: `https://site.com/Emerald/`

### User Experience

1. **With valid code (`?r=J4K9M`)**
   - Page loads with custom app name
   - Tagline shows: "Custom Build • Code: J4K9M"
   - Download button downloads the specific APK

2. **With invalid code (`?r=INVALID`)**
   - Warning message shows
   - Downloads default APK instead

3. **Without code**
   - Downloads default APK

## Configuration File (apks.json)

```json
{
  "default": "Emerald_1767507934.apk",
  "apps": {
    "J4K9M": {
      "filename": "custom-app.apk",
      "name": "Custom Build for John",
      "added": "2025-01-05T12:30:00Z",
      "downloads": 0
    }
  }
}
```

## Deployment

1. Add your APK using the script
2. Commit and push to GitHub:
   ```bash
   git add Emerald/apks.json Emerald/*.apk
   git commit -m "Add new custom APK"
   git push
   ```

3. Share the generated link!

## Features

- ✅ Unique 5-character codes (A-Z, 2-9)
- ✅ No confusing characters (no I, O, 0, 1)
- ✅ Fallback to default APK
- ✅ Custom app names display
- ✅ Download logging (console)
- ✅ Error handling

## Code Format

- 5 characters long
- Uppercase letters A-Z (excluding I, O)
- Numbers 2-9 (excluding 0, 1)
- Total combinations: 60^5 = 777,600,000 unique codes

## Troubleshooting

**Script fails with "jq not found":**
```bash
sudo apt-get install jq  # Ubuntu/Debian
brew install jq          # macOS
```

**Download doesn't work:**
- Check that the APK file exists in the Emerald directory
- Verify apks.json has the correct entry
- Check browser console for errors

**Invalid code shows warning:**
- This is normal behavior
- System automatically falls back to default APK
- Check the code in apks.json

## Examples

```bash
# Add a custom build
./add-apk.sh ~/Downloads/custom-v1.apk "John's Custom Build"

# Add a beta version
./add-apk.sh ~/Downloads/beta-v2.apk "Beta Release v2.0"

# Add with simple name
./add-apk.sh ~/Downloads/app.apk "Test App"
```

## Future Enhancements

Potential features for Phase 2:
- [ ] Web-based admin dashboard
- [ ] Download statistics
- [ ] QR code generation
- [ ] Expiry dates for codes
- [ ] Password protection
- [ ] Real-time download tracking
