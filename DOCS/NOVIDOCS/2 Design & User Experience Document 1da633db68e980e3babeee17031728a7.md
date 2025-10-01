# 2. Design & User Experience Document

## 1. Wireframes

*Noot: De volgende beschrijving is gebaseerd op de analyse van het Figma-ontwerp van de homepage zoals beschreven in "Ontwerp Notities [Claude.md](http://claude.md/)". Voor een volledig beeld van alle pagina's zijn de actuele Figma wireframes leidend.*

- [ ]  **Zorg voor consistente en duidelijke naamgeving van alle frames/pagina's in Figma.**

### 1.1. Belangrijkste Schermen & Navigatiestructuur (Homepage voorbeeld)

Het desktop ontwerp van de homepage (resolutie 1920x1080) is opgedeeld in logische secties:

1. **P0 - Hero Sectie:**
    - Dominante titel `GEDICHTGEVEL.NL`.
    - Achtergrondafbeelding (thematisch).
    - Knop "Skip Animatie" (impliceert een introductieanimatie).
2. **P1 - Navigatie & Welkom:**
    - **Hoofdnavigatiebalk:**
        - Logo.
        - Links: Huisgevel, Spreek & Schrijfgevel, Collectiegevel, Meer (dropdown).
        - Knop: Aanmelden/Registreren.
        - [ ]  *Duidelijke actieve status indicator toevoegen aan navigatie-items.*
    - **Welkomsttekst:** Krachtige heading ("Ervaar poëzie als nooit tevoren").
    - **Gedichtenshowcase:** Carrousel met voorbeelden van gedichten op gevels.
3. **P2 - Zoeken & USP's:**
    - **Zoekbalk:** Prominente zoekbalk met placeholder tekst.
    - **Filtersysteem:** Direct zichtbare filterknoppen (bv. Titel, Auteur).
        - [ ]  *Consistentie van filteropties met andere menu's verbeteren. Lay-out minder druk maken.*
    - **USP Kolommen:** Drie kolommen die kernfunctionaliteiten benadrukken (Ontdekken, Inspreken, Aanpassen).
4. **P3 - Top 3 Gedichten & Extra Navigatie:**
    - Showcase van "Top 3 Gedichten van de Maand".
    - Aanvullende informatie (bv. over de database).
    - Secundaire navigatie/links (bv. naar Docs).
5. **P4 - Footer:**
    - Standaard footer met copyright en compliance links.

### 1.2. Onderbouwing Ontwerpkeuzes (Homepage voorbeeld)

- **Donker Thema:** Creëert een artistieke, poëtische sfeer en verbetert de leesbaarheid van lichte tekst.
- **Architecturale Metafoor:** Termen als "Huisgevel", "Spreek & Schrijfgevel", "Collectiegevel" versterken het unieke concept van het platform.
    - [ ]  *Evalueer de intuïtiviteit van deze termen voor nieuwe gebruikers en voeg eventueel tooltips of korte uitleg toe.*
- **Visuele Hiërarchie:** Gebruik van verschillende lettergroottes, kleuren en witruimte om de aandacht te sturen naar belangrijke elementen zoals de zoekbalk, CTA's en uitgelichte gedichten.
- **Directe Toegang:** Kernfunctionaliteiten (zoeken, inspiratie opdoen) zijn direct vanaf de homepage toegankelijk.
- **Desktop-First:** Gekozen vanwege de complexiteit van de canvas- en audiofunctionaliteiten die profiteren van een groter schermoppervlak. Responsive design voor tablet en basisfunctionaliteit voor mobiel zijn wel vereist (zie NFE-06, NFE-32).

## 2. Stijlgids

### 2.1. Kleurenpalet

Gebaseerd op het "[Kleuren.md](http://kleuren.md/)" document.

- [ ]  **Definieer een consistent functioneel, abstract en basiskleurenpalet. Zorg voor voldoende contrast voor alle tekst- en UI-elementen volgens WCAG AA/AAA. Test het palet op verschillende vormen van kleurenblindheid.**

### **Primaire Kleuren (Voorbeelden uit Figma):**

| Rol | Hex/RGBA | Figma Variabele (Voorbeeld) |
| --- | --- | --- |
| Donkere Achtergrond | `#061D1E` | `fill_1A1CR8` |
| Semi-transp. Achtergrond | `rgba(1, 22, 14, 0.6)` | `fill_GFWBW5` |
| Lichte Tekst | `#EFEFEF` | `fill_25XR8S` |
| Off-white Tekst/Achtergrond | `#F9F4ED` | `fill_S50E82` / `fill_RMLBGX` |
| Accent (Koppen) | `#D09A47` | `fill_4MM9UK` |
| Accent (Belangrijk) | `#E3602B` | `fill_5FU8DB` |
| Accent (Knoppen) | `#C24919` | `fill_SSHIOA` |
| Navigatiebalk | `#943512` | `fill_4E84GJ` |
| Zoekknop | `#156064` | `fill_6X65P0` |
| Zwart (Knoppen) | `#000000` | `fill_4EA0ZT` |

**Secundaire Kleuren & Randen (Voorbeelden):**

- Lichtbruin (Baksteen): `#A99489` (`fill_JI296C`)
- Crème/Beige: `#FFF5E1` (`fill_G7PSKD`, `stroke_WZRGFL`)
- Donkergroene Rand: `#0F4648` (`stroke_H3JLSN`, `stroke_DC7LZK`)
- Grijze Divider: `#747990` (`stroke_8LIUTI`)

### 2.2. Typografie

- **Lettertypen (uit Figma analyse):** Work Sans, Bitter.
    - [ ]  Test deze lettertypen op leesbaarheid, vooral voor langere teksten en op verschillende apparaten. Overweeg een specifiek dyslexie-vriendelijk lettertype als optie (Could Have). Definieer fallback fonts.
- **Groottes & Gewichten:**
    - [ ]  Definieer een consistente typografische schaal (groottes, gewichten, regelhoogtes) voor headings (H1-H6), body tekst, knoppen, labels, etc. Zorg voor voldoende grootte (min. 16px voor body) en hiërarchie.
- **Variabele Fonts:** Gebruik van variabele fonts is een eis (NFE-34) voor de canvas-functionaliteit (~50 opties via Google Fonts of lokaal).

### 2.3. Componentenbibliotheek

**Voorlopige Componenten (Gebaseerd op analyse):**

1. **Knoppen:**
    - Primaire CTA (bv. oranje/rood `#C24919`).
    - Secundaire knop (bv. zwart `#000000`).
    - Zoekknop (bv. donkergroen `#156064`).
    - Filterknoppen.
    - Icon Knoppen (bv. voor afspelen, pauzeren, opnemen).
    - [ ]  Harmoniseer knopstijlen. Definieer states (default, hover, active, focus, disabled). Zorg voor voldoende grootte en padding.
2. **Invoervelden:**
    - Zoekbalk (met placeholder en filter-dropdown).
    - Registratie/Login velden (E-mail, Wachtwoord).
    - Tekstvelden voor collectienamen, beschrijvingen.
    - [ ]  Definieer states (default, focus, error, success). Zorg voor duidelijke labels en/of placeholders.
3. **Navigatie-elementen:**
    - Hoofdnavigatiebalk (desktop).
    - Dropdown menu ("Meer").
    - Footer navigatie.
    - Carrousel (voor gedichten).
    - Paginering (voor zoekresultaten).
    - Tabs (bv. "Spreek" / "Schrijf", "Inloggen" / "Registreren").
    - Modals (voor gedicht preview, login/registratie, etc.).
    - [ ]  Definieer responsive gedrag (bv. hamburger menu < 1024px). Zorg voor duidelijke actieve/focus states. Maak dropdown pijltjes groter.
4. **Specifieke Gedicht-gerelateerde Componenten:**
    - Gedicht Weergave (in carrousel, modal, collectie).
    - Canvas Editor Interface (met styling controls: font selectie, kleurkiezer, sliders, achtergrond selectie).
    - Audio Opname Interface (knoppen: start, stop, pauze, hervat; indicator: timer, visualisatie).
    - Collectie Item Kaart.

## 3. User Flows

Gebaseerd op de Use Case tabellen en Golden Paths.

### 3.1. Gedicht Zoeken & Vinden

1. **Direct Zoeken (Homepage - UC 1, 2, 3):**
    - Gebruiker landt op homepage -> Ziet zoekbalk (default: Titel filter) -> Optioneel: Wijzigt filter naar Auteur -> Voert zoekterm in -> Klikt 'Zoeken' -> Systeem toont resultaten in modal -> Gebruiker klikt op gedicht -> Navigeert naar Spreek & Schrijfgevel.
    - *Alternatieven:* Lege/ongeldige invoer (foutmelding), geen resultaten (melding, suggesties), veel resultaten (paginering, filters), spelfouten (suggesties), andere actie kiezen (Bekijken, Toevoegen aan Collectie).
2. **Geavanceerd Zoeken (Collectiepagina - UC 4):**
    - Gebruiker navigeert naar Collectiepagina -> Klikt 'Geavanceerd Zoeken' -> Vult meerdere criteria in (titel, auteur, taal, periode, thema, lengte) -> Klikt 'Zoeken' -> Systeem toont resultaten -> Gebruiker klikt op gedicht -> Preview modal opent -> Gebruiker klikt 'Bewerken' -> Navigeert naar Spreek & Schrijfgevel.
    - *Alternatieven:* Geen resultaten (criteria versoepelen), complexe zoekopdracht (meerdere auteurs), toegankelijkheidsopties in preview.
3. **Inspiratie Zoeken (Homepage - UC 5):**
    - Gebruiker landt op homepage -> Ziet "Gedichten van de Maand" -> Klikt op gedicht -> Modal opent -> Klikt 'Bewerken' -> Navigeert naar Spreek & Schrijfgevel.
    - *Alternatieven:* Alleen bekijken (sluit modal), direct toevoegen aan collectie (login check, selectie).

### 3.2. Gedicht Declammeren (Audio)

1. **Opnemen (Spreek & Schrijfgevel - UC 6):**
    - Gebruiker is op Spreek & Schrijfgevel -> Klikt 'Spreek' tab -> Ziet opname interface -> Klikt 'Start opname' -> Geeft microfoon toestemming -> Systeem start opname (indicator) -> Gebruiker declameert -> Klikt 'Stop opname'.
    - *Alternatieven:* Geen microfoon toestemming (melding, instructies), pauzeren/hervatten, opname annuleren.
2. **Beheren (Spreek & Schrijfgevel - UC 7):**
    - Systeem toont beheerinterface na opname -> Gebruiker klikt 'Afspelen' -> Luistert -> Is tevreden -> Klikt 'Opslaan' -> Voert optioneel titel in -> Systeem slaat op (bevestiging).
    - *Alternatieven:* Niet tevreden (klik 'Opnieuw opnemen'), direct delen na opslaan.

### 3.3. Gedicht Stylen (Visueel)

1. **Styling Toepassen (Spreek & Schrijfgevel - UC 8):**
    - Gebruiker is op Spreek & Schrijfgevel -> Klikt 'Schrijf' tab -> Ziet bewerkingspaneel -> Selecteert lettertype -> Past grootte aan -> Kiest achtergrond -> Past kleur/uitlijning aan -> Ziet real-time preview -> Is tevreden -> Klikt 'Opslaan' (bevestiging).
    - *Alternatieven:* Wijzigingen annuleren, eigen afbeelding uploaden als achtergrond, volledig scherm preview.

### 3.4. Collecties Beheren

1. **Eigen Collectie (Collectiepagina - UC 9):**
    - Gebruiker navigeert naar Collectiepagina -> Klikt 'Nieuwe Collectie' -> Voert naam/beschrijving in -> Klikt 'Aanmaken' -> Opent nieuwe collectie -> Klikt 'Gedichten toevoegen' -> Selecteert eigen bewerkte gedichten -> Klikt 'Toevoegen' -> Herschikt items (drag & drop).
    - *Alternatieven:* Naam al in gebruik (foutmelding), nog geen gedichten bewerkt (melding, doorverwijzing naar zoeken).
2. **Gedeelde Collectie (Collectiepagina - UC 10):**
    - Vergelijkbaar met UC 9, maar met optie 'Nieuwe Gedeelde Collectie' -> Kiest privacyinstellingen (privé, specifiek, openbaar) -> Zoekt/voegt gedichten toe van eigen, anderen, of database -> Kan notities toevoegen.
    - *Alternatieven:* Privacy/deelopties beheren, gericht zoeken (op gebruiker, trefwoord), toegankelijkheidsinstellingen per collectie toepassen.

### 3.5. Authenticatie

1. **Inloggen/Registreren (UC 11):**
    - Gebruiker klikt 'Inloggen/Registreren' -> Modal opent -> Kiest 'Inloggen' of 'Registreren' -> Vult gegevens in -> Klikt 'Inloggen'/'Account aanmaken' -> Systeem valideert/authenticeert -> Modal sluit, gebruiker ingelogd.
    - *Alternatieven:* Ongeldige inlog (foutmelding, wachtwoord vergeten), ongeldige registratie (foutmelding per veld), authenticatie via externe provider (Google).

### 3.6. Golden Paths

- Integreer de "Golden Paths" beschreven in `Use Case Tabellen Nieuw.docx` om de gebruikerservaring te verrijken. Focus op contextuele aanbevelingen, multimediale ervaringen, naadloze overgangen, intelligente ondersteuning, personalisatie en visuele/emotionele bevrediging.

## 4. Toegankelijkheidseisen (A11y)

Gebaseerd op SRD, Eisen en Figma analyse.

### 4.1. Richtlijnen & Naleving

- **WCAG:** Streven naar naleving van **WCAG 2.1 niveau AA** (NFE-09).
- **Semantiek:** Correct gebruik van semantische HTML-elementen (headings, lijsten, landmarks, etc.) voor structuur en screenreader compatibiliteit.
- **ARIA:** Correct gebruik van ARIA-attributen waar nodig om de toegankelijkheid van dynamische componenten (modals, carrousels, custom controls) te verbeteren.

### 4.2. Contrast & Kleur

- **Contrastratio's:** Voldoen aan WCAG AA contrastratio's (4.5:1 voor normale tekst, 3:1 voor grote tekst en UI-componenten).
    - [ ]  Controleer alle tekst/achtergrond combinaties, inclusief states (hover, focus). Let specifiek op lichtgroene tekst (#5F6477) en oranje koppen (#D09A47, #E3602B) op donkere achtergrond.
- **Kleurgebruik:** Gebruik kleur niet als *enige* manier om informatie over te brengen (bv. voor foutmeldingen of links).
- **Contrastmodus:**
    - Implementeer een optionele 'Accessibility Mode' voor de site UI met verbeterd contrast (Must Have - SRD 3).
    - Implementeer een 'Black and White' modus voor de canvas weergave (Must Have - SRD 3).

### 4.3. Ondersteunende Technologieën

- **Screenreaders:** Zorg voor compatibiliteit met populaire screenreaders (NVDA, JAWS, VoiceOver). Test de belangrijkste user flows met een screenreader.
    - Alle interactieve elementen moeten correct worden aangekondigd.
    - Afbeeldingen moeten beschrijvende alt-tekst hebben.
    - Canvas-inhoud moet een tekstueel alternatief hebben of via ARIA worden beschreven.
    - Audio-opname functionaliteit moet bruikbaar zijn met screenreaders (Must Have - SRD 3).
- **Tekstvergroting:** De layout moet bruikbaar blijven bij zoomen tot 200% zonder verlies van content of functionaliteit.
- **Besturingssysteem/Browser Voorkeuren:** Respecteer voorkeuren zoals `prefers-reduced-motion` (Should Have - SRD 3).

### 4.4. Toetsenbordnavigatie

- **Volledige Bedienbaarheid:** Alle interactieve elementen (links, knoppen, formuliervelden, custom controls) moeten volledig bedienbaar zijn via het toetsenbord (Must Have - SRD 3).
- **Logische Volgorde:** De tabvolgorde moet logisch en voorspelbaar zijn.
- **Zichtbare Focus:** Implementeer duidelijke en consistente focus-indicators voor alle focusseerbare elementen (Must Have - SRD 3).
    - [ ]  Definieer de stijl voor focus-states.
- **Geen Keyboard Traps:** Zorg ervoor dat de gebruiker niet vast komt te zitten in een bepaald deel van de interface.

### 4.5. Specifieke Elementen

- **Regelafstand:** Bied een optie om regelafstand te vergroten (Must Have - SRD 3).
- **Fonts:** Gebruik leesbare lettertypen. Overweeg een dyslexie-vriendelijk lettertype als optie (Could Have - SRD 3).
- **Canvas:** Bied een alternatieve, tekstgebaseerde weergave van gestylede gedichten (Should Have - SRD 3).
- **Audio/Video:** Zorg voor ondertiteling/transcripties voor audio-opnames (indien van toepassing).
- **Documentatie:** De documentatiesite (Astro Starlight) moet de ingebouwde accessibility features benutten (Must Have - SRD 3).
- [ ]  Definieer een gedetailleerde componentenbibliotheek in Figma en/of Storybook.
- [ ]  Voer accessibility audits uit tijdens de ontwikkeling met tools zoals Axe DevTools, WAVE, of Lighthouse. Overweeg gebruikerstesten met mensen met verschillende beperkingen (Could Have - SRD 3).
- [ ]  Zorg voor consistente en duidelijke naamgeving van alle frames/pagina's in Figma.