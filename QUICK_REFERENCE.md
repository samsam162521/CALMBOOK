# CalmBook - Quick Reference Guide

## 🎨 Theme Colors

### Primary Palette
```
Indigo:  #6366f1  ████████
Purple:  #a855f7  ████████
Dark:    #4f46e5  ████████
```

### Status Colors
```
Success: #10b981  ████████  (Green)
Warning: #F59E0B  ████████  (Amber)
Danger:  #ef4444  ████████  (Red)
Info:    #6366f1  ████████  (Indigo)
```

## 🌓 Dark Mode Toggle

### Landing Page (index.html)
**Location:** Bottom-right corner (floating button)
**Icon:** 🌙 Moon (light mode) → ☀️ Sun (dark mode)
**Style:** Circular glass button with shadow

### All Dashboards
**Location:** Top-right header
**Icon:** 🌙 dark_mode → ☀️ light_mode (Material Icons)
**Style:** Header icon button

## 📄 Page Structure

```
CalmBook/
│
├── index.html                    ← Landing Page (NEW: Dark Mode Toggle)
│   └── Theme: Indigo/Purple ✅
│   └── Dark Mode: ✅ NEW
│
├── Login/login.html              ← Authentication
│   └── Theme: Indigo/Purple ✅
│   └── Dark Mode: ❌ (Not needed)
│
├── StudentDashboard/index.html   ← Student Interface
│   └── Theme: Indigo/Purple ✅
│   └── Dark Mode: ✅
│
├── adminDashboard/index.html     ← Counselor Interface
│   └── Theme: Indigo/Purple ✅
│   └── Dark Mode: ✅
│
└── headDashboard/index.html      ← Admin Interface
    └── Theme: Indigo/Purple ✅ UPDATED
    └── Dark Mode: ✅
    └── Branding: "CalmBook" ✅ UPDATED
```

## 🎯 What Changed?

### ✅ Landing Page (index.html)
- Added floating dark mode toggle button
- Added dark mode CSS variables
- Added theme switching JavaScript
- Theme persists across sessions

### ✅ Head Dashboard (headDashboard/index.html)
- Changed from Emerald Green → Indigo/Purple
- Changed from "IT Book" → "CalmBook"
- Updated all color references
- Updated gradients
- Updated dark mode colors

### ✅ Other Dashboards
- Already had correct theme
- No changes needed

## 🚀 How to Use Dark Mode

### On Landing Page:
1. Look for floating button (bottom-right)
2. Click the moon/sun icon
3. Theme switches instantly
4. Preference is saved automatically

### On Dashboards:
1. Look for theme icon (top-right header)
2. Click the dark_mode/light_mode icon
3. Theme switches instantly
4. Preference is saved automatically

## 🎨 Design System

### Spacing
```
Small:  8px
Medium: 16px
Large:  24px
XLarge: 32px
```

### Border Radius
```
Small:  6px
Medium: 12px
Large:  20px
XLarge: 32px
Round:  50%
```

### Shadows
```
Small:  0 2px 8px rgba(0,0,0,0.1)
Medium: 0 8px 20px rgba(0,0,0,0.15)
Large:  0 25px 50px rgba(0,0,0,0.25)
```

### Transitions
```
Fast:   150ms
Normal: 300ms
Slow:   500ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

## 📱 Responsive Breakpoints

```
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

## 🔧 Quick Fixes

### If dark mode doesn't work:
1. Clear browser cache (Ctrl+Shift+R)
2. Check localStorage is enabled
3. Try different browser

### If colors look wrong:
1. Hard refresh (Ctrl+Shift+R)
2. Check CSS variables are loaded
3. Verify no browser extensions interfering

### If theme doesn't persist:
1. Check localStorage permissions
2. Try incognito mode
3. Clear cookies and retry

## 💡 Tips

1. **Dark Mode:** Best for low-light environments
2. **Light Mode:** Best for bright environments
3. **Theme Toggle:** Available on all pages
4. **Persistence:** Your choice is remembered
5. **Performance:** No impact on speed

## 🎯 Testing Checklist

- [ ] Landing page loads correctly
- [ ] Dark mode toggle appears (bottom-right)
- [ ] Clicking toggle switches theme
- [ ] Theme persists after refresh
- [ ] All dashboards have correct colors
- [ ] Head dashboard shows "CalmBook"
- [ ] All buttons use Indigo/Purple
- [ ] Dark mode works on all pages
- [ ] Mobile responsive works
- [ ] No console errors

## 📞 Common Questions

**Q: Where is the dark mode button on landing page?**
A: Bottom-right corner, floating circular button

**Q: Why did Head Dashboard change?**
A: To match the unified CalmBook theme (Indigo/Purple)

**Q: Can I change the theme colors?**
A: Yes, edit CSS variables in each file

**Q: Does dark mode work offline?**
A: Yes, preference is saved locally

**Q: Will my theme choice sync across devices?**
A: No, it's saved per browser/device

---

**Quick Start:**
1. Open index.html
2. Click moon icon (bottom-right)
3. Enjoy dark mode! 🌙

**Need Help?**
Check THEME_UPDATE_SUMMARY.md for detailed information.
