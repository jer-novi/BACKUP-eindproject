# Agent Steering voor Kiro Code

## 🎯 Doel van dit document

Dit document voorkomt dat er incorrecte PIXI.js properties worden toegepast door AI agents die werken aan deze codebase.

## ⚠️ KRITIEKE PIXI.js REGELS

### **TEKST PROPERTIES**

#### ✅ **CORRECTE Text Properties (PIXI.Text)**
```javascript
// Deze properties werken WEL met PIXI.Text
const pixiText = new PIXI.Text(content, {
  // Style properties (via PIXI.TextStyle)
  fontSize: 16,
  fontFamily: "Arial",
  fill: "#ffffff",
  fontWeight: "bold",
  fontStyle: "italic",
  letterSpacing: 2,
  lineHeight: 20,
  align: "center",

  // Advanced style properties
  resolution: 2.0,
  antialias: true,
  roundPixels: false
});

// Display object properties (direct op Text object)
pixiText.x = 100;
pixiText.y = 50;
pixiText.anchor.set(0.5, 0.5);
pixiText.scale.set(1.2, 1.2);
pixiText.rotation = 0.1;
pixiText.alpha = 0.8;
pixiText.visible = true;
```

#### ❌ **INCORRECTE Properties (NOOIT GEBRUIKEN)**
```javascript
// Deze properties bestaan NIET op PIXI.Text
pixiText.textAlign = "center";        // ❌ FOUT! Gebruik align in style
pixiText.color = "#ff0000";           // ❌ FOUT! Gebruik fill in style
pixiText.font = "Arial";              // ❌ FOUT! Gebruik fontFamily in style
pixiText.size = 16;                   // ❌ FOUT! Gebruik fontSize in style
pixiText.weight = "bold";             // ❌ FOUT! Gebruik fontWeight in style

// Texture properties (alleen voor Sprite/Texture)
pixiText.texture = someTexture;       // ❌ FOUT! Text heeft geen texture property
pixiText.tint = 0xff0000;            // ❌ FOUT! Gebruik fill in style voor kleur
```

### **@pixi/react COMPONENT PATTERNS**

#### ✅ **CORRECTE @pixi/react Usage**
```jsx
// Extend components eerst
import { extend } from '@pixi/react';
import { Text, Container, Sprite } from 'pixi.js';
extend({ Text, Container, Sprite });

// Dan gebruik in JSX (lowercase names!)
<pixiText
  text="Hello World"
  style={{
    fontSize: 16,
    fill: "#ffffff"
  }}
  x={100}
  y={50}
  anchor={{ x: 0.5, y: 0.5 }}
/>
```

#### ❌ **INCORRECTE @pixi/react Patterns**
```jsx
// Uppercase component names (werkt niet)
<Text />                    // ❌ FOUT! Gebruik pixiText
<Container />               // ❌ FOUT! Gebruik pixiContainer
<Sprite />                  // ❌ FOUT! Gebruik pixiSprite

// Direct PIXI properties op JSX (werkt niet)
<pixiText
  fontSize={16}             // ❌ FOUT! Moet in style object
  color="#ffffff"           // ❌ FOUT! Gebruik fill in style
/>
```

## 🏗️ ARCHITECTUUR REGELS

### **HOOK PATTERNS**

#### ✅ **Correcte Hook Implementatie**
```javascript
// Custom hooks voor canvas state
const useTextStyles = () => {
  const [fontSize, setFontSize] = useState(16);
  const [fillColor, setFillColor] = useState("#ffffff");

  const textStyle = useMemo(() => ({
    fontSize,
    fill: fillColor,
    fontFamily: "Cormorant Garamond"
  }), [fontSize, fillColor]);

  return { textStyle, setFontSize, setFillColor };
};
```

#### ❌ **Incorrecte Hook Patterns**
```javascript
// State direct op PIXI objecten (werkt niet goed)
const [pixiText, setPixiText] = useState(new PIXI.Text());  // ❌ Problematisch

// Refs voor niet-persistent objecten
const textRef = useRef(new PIXI.Text());                    // ❌ Kan memory leaks veroorzaken
```

### **STATE MANAGEMENT**

#### ✅ **Correcte State Patterns**
```javascript
// State voor style properties
const [textStyles, setTextStyles] = useState({
  fontSize: 16,
  fill: "#ffffff",
  fontFamily: "Arial"
});

// Per-line overrides
const [lineOverrides, setLineOverrides] = useState({
  "0": { fill: "#ff0000" },
  "2": { fontSize: 20 }
});
```

#### ❌ **Incorrecte State Patterns**
```javascript
// PIXI objecten in state (performance issues)
const [pixiObjects, setPixiObjects] = useState([]);       // ❌ FOUT!

// Direct mutation van PIXI properties
pixiText.style.fontSize = 20;                             // ❌ Gebruik setState
```

## 🎨 STYLING GUIDELINES

### **TEKST OPTIMALISATIE**

#### ✅ **Simpele Optimalisatie (GEBRUIK DIT)**
```javascript
// Alleen resolution verhogen voor scherpere tekst
const optimizedStyle = {
  ...baseStyle,
  resolution: textOptimizationEnabled ? 2.0 : 1.0,
  antialias: true,
  roundPixels: false
};

// AUTOMATISCHE AANPASSINGEN bij toggle:
// Normal → Optimized: fontSize 16→12, lineHeight 1.4→2.5
// Optimized → Normal: fontSize 12→16, lineHeight 2.5→1.4
// Slider ranges worden ook aangepast!
// Spacing tussen titel/auteur automatisch proportioneel aangepast
```

#### ❌ **Over-gecompliceerde Optimalisatie (NIET DOEN)**
```javascript
// Complexe caching systemen (te veel overhead)
class TextCache { /* complex LRU cache */ }              // ❌ Te complex
class PerformanceMonitor { /* complex monitoring */ }    // ❌ Overkill
```

### **COMPONENT STRUCTUUR**

#### ✅ **Correcte Component Hiërarchie**
```jsx
<pixiContainer>
  <pixiText text="Title" style={titleStyle} />
  <pixiText text="Content" style={contentStyle} />
</pixiContainer>
```

#### ❌ **Incorrecte Nesting**
```jsx
<pixiText>
  <pixiText />  {/* ❌ Text kan geen children hebben */}
</pixiText>
```

## 🔧 DEBUG & TROUBLESHOOTING

### **VEELGEMAAKTE FOUTEN**

1. **Property niet gevonden errors:**
   - Controleer of property in `style` object hoort
   - Gebruik lowercase component names (`pixiText` niet `Text`)

2. **Tekst wordt niet geupdate:**
   - Zorg dat `text` prop verandert
   - Check of `style` object nieuw is (useMemo)

3. **Performance problemen:**
   - Gebruik simpele optimalisatie (resolution)
   - Vermijd complexe caching voor kleine use cases

## 📝 CHECKLIST VOOR AGENTS

Voordat je PIXI.js code schrijft, check:

- [ ] Gebruik je `pixiText` (niet `Text`) in JSX?
- [ ] Staan alle styling properties in het `style` object?
- [ ] Gebruik je geen `texture`, `tint`, of `textAlign` properties?
- [ ] Heb je `extend()` aangeroepen voor alle PIXI componenten?
- [ ] Is je state management simpel en performance-vriendelijk?
- [ ] Gebruik je de simpele optimalisatie methode (niet complexe caching)?

## 🚀 BEST PRACTICES

1. **Keep it Simple:** Gebruik alleen de optimalisaties die je echt nodig hebt
2. **State First:** Sla styling properties op in React state, niet direct op PIXI objecten
3. **Performance:** Monitor geheugengebruik, maar overbouw niet
4. **Debugging:** Log style objects, niet PIXI objecten
5. **Testing:** Test op verschillende schermresoluties

Dit document voorkomt veel voorkomende fouten en houdt de codebase clean en maintainable!