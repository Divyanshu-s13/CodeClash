# Page Transition - Steel Door Animation

A cinematic page transition component with futuristic sliding steel doors, perfect for login-to-dashboard routing.

## Features
- 🚪 Heavy industrial steel doors sliding from left/right
- ✨ Brushed metal texture with glowing orange edge highlights
- 🎨 Split logo animation across both doors
- 💫 Dramatic center seam fog glow on pause
- ⚡ Smooth easing: ease-in (closing) → ease-out (opening)
- 🎬 Total duration: 1.45 seconds (600ms close + 250ms pause + 600ms open)

## Usage

### Basic Implementation (Already Integrated in Landing.js)

The transition triggers automatically when you login or signup:

```jsx
// In your component
const [isTransitioning, setIsTransitioning] = useState(false);

// Trigger on successful auth
const handleLogin = async () => {
  // ... auth logic ...
  setIsTransitioning(true);
  setTimeout(() => {
    window.location.href = '/dashboard';
  }, 1450);
};

// Wrap your page content
return (
  <PageTransition isTransitioning={isTransitioning}>
    <div className="your-page">
      {/* content */}
    </div>
  </PageTransition>
);
```

### Manual Trigger

```jsx
import PageTransition from '../components/PageTransition';

function MyComponent() {
  const [showTransition, setShowTransition] = useState(false);
  
  const navigateWithAnimation = (path) => {
    setShowTransition(true);
    setTimeout(() => {
      window.location.href = path;
    }, 1450);
  };
  
  return (
    <PageTransition isTransitioning={showTransition}>
      <button onClick={() => navigateWithAnimation('/dashboard')}>
        Enter Dashboard
      </button>
    </PageTransition>
  );
}
```

## Timing Breakdown

| Phase | Duration | Easing | Description |
|-------|----------|--------|-------------|
| Closing | 0-600ms | cubic-bezier(0.65, 0, 0.35, 1) | Doors slide in from edges |
| Logo Fade In | 200-600ms | ease-out | Logo appears split across doors |
| Pause | 600-850ms | - | Dramatic moment at center |
| Seam Glow | 600-850ms | ease-in-out | Fog glow pulses at seam |
| Opening | 850-1450ms | cubic-bezier(0.65, 0, 0.35, 1) | Doors slide out to edges |
| Logo Fade Out | 850-1150ms | ease-in | Logo fades as doors open |

## Customization

### Change Door Color
Edit `PageTransition.css`:
```css
.steel-door {
  background: linear-gradient(135deg, #your-color-1, #your-color-2, #your-color-3);
}
```

### Adjust Speed
Change duration in `PageTransition.js`:
```js
// Faster (1.2s total)
const closedTimer = setTimeout(() => setPhase('closed'), 500);
const openingTimer = setTimeout(() => setPhase('opening'), 700);
const completeTimer = setTimeout(() => setPhase('complete'), 1200);

// Slower (1.8s total)
const closedTimer = setTimeout(() => setPhase('closed'), 700);
const openingTimer = setTimeout(() => setPhase('opening'), 1000);
const completeTimer = setTimeout(() => setPhase('complete'), 1800);
```

### Change Edge Glow Color
```css
.door-edge-glow {
  background: linear-gradient(180deg, 
    rgba(0, 255, 255, 0.8) 0%,  /* Change these RGB values */
    rgba(0, 200, 255, 0.6) 50%,
    rgba(0, 255, 255, 0.8) 100%
  );
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
}
```

## Performance Notes
- Uses `will-change: transform` for GPU acceleration
- Hardware-accelerated with `backface-visibility` and `perspective`
- Optimized for 60fps on modern browsers
- Mobile-responsive with reduced logo sizes

## Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- Mobile: ✅ Optimized

## Files Created
- `/client/src/components/PageTransition.js` - React component
- `/client/src/components/PageTransition.css` - Animation styles
- `/client/src/components/TRANSITION_README.md` - This file

## Testing
1. Login or signup from the landing page
2. Watch the steel doors close with split logo
3. Brief pause with glowing seam
4. Doors open to reveal dashboard

Enjoy your cinematic transitions! 🎬
