# Watch Together (w2g) - Testing Guide

## Quick Start

1. **Open the site**: Navigate to the w2g directory in your browser or open `index.html` directly
2. **Test download**: Click the download button to test the default APK download
3. **Test codes**: Use `?r=CODE` parameter to test specific APK downloads
4. **Test languages**: Click language buttons to test translations
5. **Test responsiveness**: Resize browser window to test responsive design

## Testing Checklist

### Core Functionality
- [ ] Default APK download works
- [ ] Custom code downloads work (e.g., `?r=UQLLP`)
- [ ] Invalid codes fall back to default APK
- [ ] apks.json loads correctly
- [ ] Download status messages appear

### Multi-Language Support
- [ ] All 8 languages load correctly
- [ ] Language auto-detection works
- [ ] Language switcher buttons work
- [ ] Arabic (AR) RTL layout works
- [ ] All text is translated

### UI/UX
- [ ] Animated background displays
- [ ] Hero section animations work
- [ ] Feature cards have hover effects
- [ ] Scroll progress indicator works
- [ ] Stats counter animation works
- [ ] Download buttons have proper states

### Responsive Design
- [ ] Mobile view (< 768px) works
- [ ] Tablet view (768px - 1024px) works
- [ ] Desktop view (> 1024px) works
- [ ] Touch interactions work on mobile

### Keyboard Shortcuts
- [ ] `D` key triggers download
- [ ] `S` key scrolls to features
- [ ] `H` key scrolls to hero

## Manual Testing

### Test APK Distribution

1. **Add a test APK**:
   ```bash
   ./add-apk.sh /path/to/test.apk "Test Build"
   ```

2. **Verify the APK was added**:
   - Check that the APK file exists in the w2g directory
   - Check that apks.json was updated with the new code
   - Note the generated shareable URL

3. **Test the shareable URL**:
   - Open the URL in a browser: `?r=GENERATED_CODE`
   - Verify the correct APK downloads
   - Check browser console for download logs

### Test Language Switching

1. Open the site in a browser
2. Click each language button in the top-right corner
3. Verify:
   - All text updates to the selected language
   - Page title changes
   - Arabic view shows RTL layout
   - Language button is marked as active

### Test Download Functionality

1. **Default Download**:
   - Open `index.html` (no URL parameters)
   - Click the main download button
   - Verify download starts
   - Check download status message

2. **Code-Based Download**:
   - Open `index.html?r=VALID_CODE`
   - Click download button
   - Verify correct APK downloads

3. **Invalid Code**:
   - Open `index.html?r=INVALID`
   - Verify fallback to default APK

## Browser Testing

Test in the following browsers:

- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)
- Mobile browsers (Android Chrome, iOS Safari)

## Automated Testing

While there's no automated test suite, you can verify the setup by:

1. **Validate JSON**:
   ```bash
   jq . apks.json
   ```

2. **Check file permissions**:
   ```bash
   ls -la add-apk.sh
   ```

3. **Verify APK files exist**:
   ```bash
   ls -la *.apk
   ```

## Common Issues

### Download Doesn't Start

**Symptoms**: Click download button, nothing happens

**Solutions**:
1. Check browser console for errors
2. Verify apks.json exists and is valid JSON
3. Check that the APK file exists in the w2g directory
4. Verify file permissions on APK files

### Wrong APK Downloads

**Symptoms**: Different APK downloads than expected

**Solutions**:
1. Verify the code in URL matches code in apks.json
2. Clear browser cache
3. Check apks.json for duplicate codes

### Language Not Loading

**Symptoms**: Clicking language button doesn't change text

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify languages.js file exists
3. Check that language code exists in translations

### Script Fails

**Symptoms**: add-apk.sh script shows errors

**Solutions**:
1. Verify jq is installed: `jq --version`
2. Check script permissions: `chmod +x add-apk.sh`
3. Verify apks.json is writable

## Performance Testing

1. **Page Load Time**: Should load in under 2 seconds on typical connection
2. **Animation Smoothness**: Should maintain 60 FPS on most devices
3. **Download Speed**: Should start download within 1 second of click

## Accessibility Testing

1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Screen Reader**: Proper ARIA labels and semantic HTML
3. **Color Contrast**: Meet WCAG AA standards
4. **Text Scaling**: Page scales correctly up to 200%

## Security Testing

1. **Input Validation**: Test with invalid URL parameters
2. **XSS Prevention**: Verify no script injection possible
3. **File Access**: Ensure only APK files in directory are accessible
4. **Code Generation**: Verify no ambiguous characters in codes

## Deployment Testing

After deploying to GitHub Pages:

1. **Access Site**: Verify site loads at deployed URL
2. **Test Downloads**: Verify APK downloads work from deployed URL
3. **Test All Codes**: Test multiple share codes
4. **Test Languages**: Verify all languages work
5. **Check Mobile**: Test on mobile devices

## Reporting Issues

When reporting issues, include:

1. Browser name and version
2. Operating system
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (if any)
6. Screenshot (if applicable)
