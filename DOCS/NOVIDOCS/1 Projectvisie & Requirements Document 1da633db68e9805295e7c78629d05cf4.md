# 1. Projectvisie & Requirements Document

# 1. Inleiding & Visie

### 1.1. Uitleg [Gedichtgevel.nl](http://gedichtgevel.nl/)

[Gedichtgevel.nl](http://gedichtgevel.nl/) is een digitaal platform dat poëzie toegankelijker en interactiever maakt. Poëzie wordt vaak geassocieerd met boeken, maar dit platform stelt gebruikers in staat poëzie te ervaren, uit te spreken en te delen op nieuwe manieren. Het project biedt een alternatief voor fysieke gedichtprojecties door tekst en geluid te combineren, waardoor een vernieuwde poëziebeleving ontstaat. Gebruikers kunnen gedichten ontdekken, personaliseren (visueel stylen op gevelachtergronden), en hun eigen voordrachten opnemen en delen.

### 1.2. Doelgroep en Kernwaarde

- **Doelgroep:** Poëzie- en kunstliefhebbers die op zoek zijn naar inspiratie, een specifiek gedicht willen vinden, of hun waardering voor poëzie willen uiten en delen.
- **Kernwaarde:** Het platform combineert de visuele aantrekkingskracht van (digitaal) geprojecteerde poëzie met de kracht van het gesproken woord. Het stelt gebruikers in staat om poëzie niet alleen te lezen, maar actief te beleven, te personaliseren, voor te dragen en te delen.

### 1.3. Projectscope

- **Initiële Fase (Huidig Project):** Focus op de **frontend** ontwikkeling. Dit omvat de gebruikersinterface, interacties, en integratie met backend-services voor kernfunctionaliteiten.
- **Latere Fase:** Mogelijke uitbreiding naar een volledige fullstack-applicatie met een eigen, op maat gemaakte backend. De frontend wordt zo gestructureerd dat deze toekomstige uitbreiding mogelijk is (API-abstractielaag, token-authenticatie, onafhankelijke datamodellen).

## 2. Kernfunctionaliteiten

Gebaseerd op de use cases en functionele eisen, zijn de kernfunctionaliteiten van [gedichtgevel.nl](http://gedichtgevel.nl/):

1. **Gedichten Zoeken en Vinden:**
    - Zoeken op titel, auteur, of gecombineerde termen via de homepage.
    - Geavanceerd zoeken op de collectiepagina met criteria zoals taal, periode, thema, lengte.
    - Bekijken van zoekresultaten en gedichten in een modal of preview.
    - Vinden van inspiratie via uitgelichte gedichten ("Gedicht van de Maand").
    - (Zie UC 1, 2, 3, 4, 5, 11; FE-01, 02, 03, 04, 05, 07, 08, 17, 18, 29, 30, 31, 35)
2. **Audio-opnames Maken en Beluisteren:**
    - Audio opnemen van het declameren van een gedicht via de browser microfoon.
    - Opnames starten, stoppen, pauzeren, hervatten en annuleren.
    - Opgenomen audio afspelen, opnieuw opnemen en opslaan.
    - Optioneel: vooraf opgenomen audiobestanden uploaden.
    - Optioneel: audio-visualisaties tonen.
    - (Zie UC 6, 7; FE-05, 11, 16, 17, 20, 22, 40)
3. **Visuele Bewerking van Gedichten op Gevels:**
    - Een gedicht visueel stylen op een selecteerbare gevelachtergrond.
    - Aanpassen van lettertype, grootte, kleur, uitlijning en basiseffecten (schaduw).
    - Kiezen uit een collectie gevelafbeeldingen of optioneel eigen afbeeldingen uploaden.
    - Real-time preview van wijzigingen.
    - Styling opslaan.
    - Optioneel: canvas-specifieke contrastmodus, delen van gevels maskeren.
    - (Zie UC 8; FE-06, 12, 21, 27, 28, 36, 37, 41)
4. **Collecties Maken en Beheren:**
    - Persoonlijke collecties aanmaken voor eigen gestylede gedichten of opnames.
    - Collecties aanmaken met gedichten van verschillende bronnen (eigen, andere gebruikers, database).
    - Gedichten toevoegen aan en verwijderen uit collecties.
    - Volgorde van items binnen een collectie aanpassen.
    - Optioneel: persoonlijke notities toevoegen aan items in een collectie.
    - (Zie UC 9, 10; FE-13, 18, 23, 26)
5. **Delen van Creaties:**
    - Genereren van unieke, deelbare links naar openbare creaties (gestylede gedichten, opnames) of collecties.
    - Instellen van privacy (privé, link, openbaar).
    - Integratie met social media deelknoppen.
    - Optioneel: exporteren als afbeelding/PDF, delen met specifieke gebruikers.
    - (Zie SRD Sectie 10; FE-21, 32, 33, 34, 38)
6. **Authenticatie:**
    - Registreren en inloggen met e-mail/wachtwoord.
    - Optioneel: inloggen via externe providers (bv. Google).
    - (Zie UC 11; FE-04, 15, 20)

## 3. Gedetailleerde Eisen per Functionaliteit (MoSCoW)

Hieronder volgt een overzicht van de gedetailleerde functionele (FE) en niet-functionele (NFE) eisen, gegroepeerd per functionaliteit en geprioriteerd volgens de MoSCoW-methode. Deze zijn gebaseerd op de SRD en Eisen documenten.

*(Noot: De nummering (FE-xx, NFE-xx) verwijst naar de nummers in het 'Voorlopige Functionele en Niet functionele Eisen' document voor traceerbaarheid.)*

### 3.1. Zoeken & Vinden

**Must Have:**

- FE-01: Zoeken op titel.
- FE-02: Zoeken op auteur.
- FE-03: Zoeken op combinatie van zoektermen.
- FE-07: Duidelijke foutmeldingen bij lege/ongeldige zoekopdrachten.
- FE-08: Gedichten bekijken in modal venster.
- FE-09: Toegang tot mix van externe (PoetryDB) en eigen gedichten.
- FE-29: "Gedichten van de maand" tonen op homepage.
- FE-30: Gedetailleerde informatie tonen (titel, auteur, etc.).
- NFE-05: Melding bij geen zoekresultaten.
- NFE-11: Zoekresultaten binnen 2 seconden.

**Should Have:**

- FE-04: Geavanceerde zoekcriteria (taal, periode, thema, lengte).
- FE-05: Inspiratie via uitgelichte gedichten op homepage.
- FE-31: Zoekresultaten filteren bij veel resultaten.
- FE-35: Paginering bij veel zoekresultaten.
- Suggesties tonen bij geen resultaten of spelfouten (UC 1 Alt, UC 2 Alt, UC 3 Alt).
- Fuzzy matching/spellingscorrectie.

**Could Have:**

- FE-39: Zoeken op gebruikersnaam.
- FE-42: Zoekgeschiedenis bekijken en opslaan als "zoek-collectie".
- Intelligente auto-aanvulling.
- "Vibes-based Search".

### 3.2. Audio Opnemen & Beheren

**Must Have:**

- FE-05: Audio-opnames maken van declameren.
- FE-11: Opgenomen audio afspelen.
- Opslaan van opnames gekoppeld aan gedicht/gebruiker (UC 7).
- Toestemming vragen voor microfoongebruik (UC 6).
- Visuele indicator tijdens opname (UC 6).
- Opname starten/stoppen (UC 6).
- NFE-12: Audio direct starten na klikken op 'Afspelen'.

**Should Have:**

- FE-16: Opnames pauzeren en hervatten.
- FE-17: Opname verwijderen en opnieuw opnemen.
- FE-22: Uploaden van vooraf opgenomen audiobestanden (MP3, WAV).
- NFE-22: Tijdelijke lokale opslag (IndexedDB/Dexie.js) bij netwerkproblemen.

**Could Have:**

- FE-40: Audio-visualisaties tijdens opname/afspelen (bv. waveform).
- Basis audio-effecten (bv. reverb via Tone.js).
- Opname tips tonen.

**Won't Have (Initieel):**

- Speech-to-text functionaliteit.

### 3.3. Visuele Bewerking (Canvas)

**Must Have:**

- FE-06: Gedicht visueel stylen op gevelafbeelding.
- FE-12: Lettertype, kleur, grootte aanpassen.
- FE-21: Verschillende lettertypen, kleuren, groottes toepassen.
- FE-27: Selecteren uit collectie achtergrondafbeeldingen (eigen + Pexels API).
- Tekst positioneren op canvas.
- Basiseffecten (tekstschaduw).
- Gebruik van HTML Canvas (bv. via Konva.js).
- Opslaan van styling (UC 8).
- Real-time preview (UC 8).
- NFE-13: Visuele bewerkingen reageren direct.
- NFE-16: Tekstaanpassingen voelen (near) realtime.
- NFE-34: Gebruik van variabele fonts (~50 opties).

**Should Have:**

- FE-19: Volledig scherm preview voor opslaan.
- FE-21: Exporteren als afbeelding of PDF.
- FE-28: Wisselen tussen voorgedefinieerde stijlsets.
- Tekst bewerkbaar maken direct op canvas (Konva feature).
- Curated selectie van ~50 topkwaliteit gevels.

**Could Have:**

- FE-36: Canvas-specifieke contrastmodus ('Black and White').
- FE-37: Eigen achtergrondafbeeldingen uploaden (JPG, met limiet).
- FE-41: Delen van gevelafbeeldingen verwijderen/maskeren.
- Achtergrondafbeelding schalen/aanpassen binnen canvas.
- Cloud storage integratie voor eigen achtergronden.

**Won't Have (Initieel):**

- Geavanceerde image blending.
- Volledige implementatie alle assen Recursive font.

### 3.4. Collecties

**Must Have:**

- FE-13: Gedichten toevoegen aan persoonlijke collectie.
- Collecties aanmaken en een naam geven (UC 9).
- Items toevoegen aan collecties (UC 9, 10).
- Overzicht van eigen collecties tonen (UC 9).
- NFE-14: Aanmaken collectie < 500ms.
- NFE-21: Collecties niet verloren bij crashes, regelmatige backup.

**Should Have:**

- FE-18: Volgorde items in collectie aanpassen (drag & drop).
- FE-23: Persoonlijke notities toevoegen aan items in collectie.
- Collecties maken met items van anderen (UC 10).
- Checken of gedichten al in andere collecties zitten.

**Could Have:**

- Collectie reviews.
- Collectie thema's / ontwerpen (via JSONB).

**Won't Have (Initieel):**

- Collaboratieve collecties (meerdere editors).

### 3.5. Delen

**Must Have:**

- FE-32: Deelbare links genereren voor openbare creaties/collecties.
- FE-33: Privacyinstellingen per creatie/collectie (privé, link, openbaar).
- FE-34: Social media deelknoppen.

**Should Have:**

- FE-21: Exporteren als afbeelding/PDF (zie ook Canvas).
- Embeddable content (iframe code).

**Could Have:**

- FE-38: Delen met specifieke geregistreerde gebruikers.

### 3.6. Authenticatie & Gebruikersbeheer

**Must Have:**

- FE-04: Registreren en inloggen (e-mail/wachtwoord).
- NFE-05: Veilige authenticatie via Supabase Auth.
- NFE-24: Veilige authenticatie via Supabase Auth (duplicaat, ok).

**Should Have:**

- FE-20: Inloggen met externe providers (Google/social).

### 3.7. Algemeen & Niet-Functioneel

**Must Have:**

- FE-10: Navigeren tussen pagina's.
- NFE-01: Intuïtieve UI, duidelijke navigatie, visuele feedback.
- NFE-03: Geen dataverlies bij crashes, regelmatige backups.
- NFE-04: Browser support (laatste 2 versies Chrome, Firefox, Safari, Edge).
- NFE-05: Row Level Security (RLS) op data en storage.
- NFE-06: Responsive design (desktop/tablet focus, min 768px).
- NFE-07: Input validatie & sanitisatie (client & server).
- NFE-08: Duidelijke feedback bij succes/fout.
- NFE-10: Duidelijke indicatie van systeemstatus (laden, etc.).
- NFE-27: Bescherming persoonlijke gegevens (AVG/GDPR).
- NFE-29: HTTPS voor de gehele applicatie.
- NFE-30: Security headers (CSP, HSTS).
- NFE-31: Browser support (duplicaat, ok).
- NFE-32: Responsive design (duplicaat, ok).
- NFE-33: Progressive Enhancement (>93% support voor Must Haves).

**Should Have:**

- NFE-09: Toegankelijkheid (WCAG 2.1 AA, semantische HTML, ARIA, toetsenbordnavigatie).
- NFE-11: Gebruik performance patterns (bv. `useDeferredValue`).
- NFE-12: Analytics koppeling (privacy-vriendelijk).
- NFE-13: Consistente visuele stijl (kleur, typo, etc.).
- NFE-14: Gebruiksvriendelijke foutafhandeling (netwerk, API, etc.).
- NFE-15: Vloeiende animaties (60fps).
- NFE-09: Landingspagina animatie max 3s.

**Could Have:**

- NFE-15: Basiservaring voor alle browsers (Progressive Enhancement).
- NFE-16: Vereenvoudigde mobiele interface.
- NFE-17: Error tracking & logging (bv. Sentry).
- NFE-18: Meertalige UI (NL/EN prioriteit).
- NFE-19: Streven naar goede Lighthouse scores.
- NFE-20: Optimalisatie batterijverbruik mobiel.

## 4. Globale Technische Keuzes

### 4.1. Technologiestack

- **Frontend:**
    - Framework: React (v19) met TypeScript.
    - Styling: CSS Modules (of vergelijkbaar).
    - Build Tool: Vite.
    - Canvas: HTML Canvas API, waarschijnlijk via **Konva.js**.
    - Lokale Opslag: IndexedDB via **Dexie.js** (voor audio caching, voorkeuren).
    - Audio Opname: **MediaStream Recording API**.
    - Audio Visualisatie (Optioneel): **p5.js**.
    - Audio Effecten (Optioneel): **Tone.js**.
- **Backend (BaaS):**
    - Provider: **Supabase**.
    - Database: **PostgreSQL** (met JSON/JSONB voor flexibele data).
    - Authenticatie: **Supabase Auth**.
    - Bestandsopslag: **Supabase Storage** (voor audio, afbeeldingen).
- **Externe API's:**
    - Gedichten: **PoetryDB API**.
    - Achtergrondafbeeldingen (Optioneel): **Pexels API**.
    - Fonts: **Google Fonts API** (voor variabele fonts).
- **Documentatie:** Astro Starlight.

### 4.2. Onderbouwing (Kort)

- **React:** Populaire, component-gebaseerde library voor interactieve UIs. Goed ecosysteem.
- **Supabase:** Biedt een geïntegreerde backend-oplossing (Auth, DB, Storage) als service (BaaS), wat de ontwikkeltijd voor de initiële fase verkort. Gebruikt open-source standaarden (PostgreSQL). Biedt RLS voor beveiliging.
- **PostgreSQL met JSON/JSONB:** Combineert de kracht van relationele data met flexibiliteit voor semi-gestructureerde data zoals design instellingen.
- **Konva.js:** Populaire library voor het werken met HTML Canvas in een React-omgeving, vereenvoudigt complexe interacties.
- **Dexie.js:** Vereenvoudigt het werken met IndexedDB voor robuuste client-side opslag.
- **MediaStream Recording API:** Standaard browser API voor audio-opname.
- **PoetryDB API:** Open API met een grote collectie (Engelse) gedichten.