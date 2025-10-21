# 📝 Notizen-System für Reveal.js Präsentationen

## Übersicht

Das Notizen-System ermöglicht es, während einer Präsentation interaktive Notizen zu erstellen, die automatisch mit den jeweiligen Folien verknüpft werden. Die Notizen werden lokal im Browser gespeichert und bleiben über Sessions hinweg erhalten.

## Features

### ✨ Hauptfunktionen

- **Text-Notizen**: Positionierbare Textfelder mit Drag & Drop
- **Zeichnungen**: Freihand-Zeichnungen mit Stift/Maus/Touch
- **Slide-spezifisch**: Notizen werden automatisch der aktuellen Folie zugeordnet
- **Persistenz**: Alle Notizen werden in localStorage gespeichert
- **Export**: Notizen als JSON-Datei exportieren
- **Responsive**: Funktioniert auf Desktop, Tablet und Smartphone

### 🎨 Zeichnen-Modus

- **6 Farben**: Gelb, Blau, Grün, Rot, Lila, Weiß (Monokai-Palette)
- **3 Strichstärken**: Dünn (2px), Mittel (3px), Dick (5px)
- **Radiergummi**: Zeichnungen löschen
- **Stift-Unterstützung**: Optimiert für Stylus/Tablet-Eingabe

### 📄 Text-Modus

- **Positionierbar**: Notizen per Drag & Drop verschieben
- **Bearbeitbar**: Direktes Editieren der Inhalte
- **Löschbar**: Einzelne Notizen entfernen
- **Auto-Speichern**: Änderungen werden automatisch gespeichert

## Bedienung

### Tastaturkürzel

| Taste | Funktion |
|-------|----------|
| `N` | Notizen-Overlay öffnen/schließen |
| `T` | Text-Modus aktivieren |
| `D` | Zeichnen-Modus aktivieren |
| `E` | Radiergummi aktivieren |
| `+` / `=` | Hintergrund undurchsichtiger machen |
| `-` / `_` | Hintergrund transparenter machen |
| `Ctrl` + `Mausrad` | Transparenz ändern |
| `Esc` | Notizen-Overlay schließen |

### UI-Elemente

#### Toggle-Button (unten rechts)
- **Klick**: Notizen-Overlay öffnen/schließen
- **Badge**: Grüner Punkt zeigt an, dass Notizen auf der aktuellen Folie existieren

#### Toolbar (oben)

**Modi:**
- 📝 Text-Modus
- ✏️ Zeichnen-Modus

**Zeichnen-Tools:**
- 🎨 Farbauswahl (6 Farben)
- 📏 Strichstärke (3 Größen)
- 🧹 Radiergummi

**Aktionen:**
- 🗑️ Alles löschen (aktuelle Folie)
- � Importieren (Notizen aus JSON-Datei)
- �💾 Exportieren (alle Notizen als JSON)

**Transparenz:**
- 🙈 Transparenter (mehr Durchsicht)
- **95%** Anzeige (10% - 100%)
- 👁️ Undurchsichtiger (weniger Durchsicht)

**Schließen:**
- ❌ Overlay schließen

### Workflow

1. **Notizen-Modus öffnen**: Klick auf Button (unten rechts) oder Taste `N`
2. **Modus wählen**: Text (`T`) oder Zeichnen (`D`)
3. **Transparenz anpassen** (optional):
   - **Tasten**: `+` für undurchsichtiger, `-` für transparenter
   - **Mausrad**: `Ctrl` + Scrollen
   - **Touch**: Pinch-Geste (Zoom-In/Out)
   - **Buttons**: 🙈 / 👁️ in Toolbar
4. **Notizen erstellen**:
   - **Text**: Auf freie Stelle der Folie klicken → Notiz erscheint dort → Text eingeben
   - **Zeichnen**: Mit Maus/Stift auf Canvas zeichnen
5. **Notizen bearbeiten**:
   - **Text bearbeiten**: In Notiz klicken und Text editieren
   - **Text verschieben**: An Kopfzeile (≡ Verschieben) ziehen → Cursor wird zur Hand
   - **Text löschen**: ❌-Button rechts oben in Notiz klicken
6. **Speichern**: Automatisch beim Schließen oder Folienwechsel
7. **Schließen**: Taste `Esc` oder Klick auf ❌-Button

## Technische Details

### Datenstruktur

```json
{
  "presentation": "/path/to/presentation",
  "version": "1.0",
  "notes": {
    "slide-id-1": {
      "text": [
        {
          "content": "Meine Notiz",
          "x": 100,
          "y": 200,
          "id": "note-123456"
        }
      ],
      "drawings": ["data:image/png;base64,..."],
      "timestamp": "2025-10-21T10:30:00Z"
    }
  }
}
```

### Speicherung

- **Methode**: `localStorage` (Browser-lokal)
- **Key**: `presentation-notes`
- **Format**: JSON
- **Kapazität**: ~5-10 MB (browserspezifisch)

### Slide-ID-Zuordnung

Notizen werden über die Slide-ID der Reveal.js-Folie zugeordnet:

```html
<!-- .slide:id="my-slide-id" -->
```

Falls keine ID definiert ist, wird automatisch `slide-{h}-{v}` verwendet (z.B. `slide-2-0`).

## Export & Import

### Export

1. Notizen-Overlay öffnen
2. Klick auf 💾-Button (Download-Icon)
3. JSON-Datei wird heruntergeladen: `presentation-notes-YYYY-MM-DD.json`
4. Bestätigungs-Notification erscheint

### Import

1. Notizen-Overlay öffnen
2. Klick auf 📥-Button (Upload-Icon)
3. JSON-Datei auswählen
4. Importierte Notizen werden zu bestehenden Notizen hinzugefügt
5. Bei Konflikten (gleiche Slide-ID) werden importierte Notizen bevorzugt

**Merge-Strategie:**
- Wenn bereits Notizen existieren → Dialog erscheint
- **OK** = Importierte Notizen werden hinzugefügt (Merge)
- **Abbrechen** = Import wird abgebrochen
- Keine bestehenden Notizen → Direkter Import

### Programmatischer Import

```javascript
// JSON-Datei als String
const jsonData = /* ... JSON string ... */;

// Importieren
const success = window.notesManager.importNotes(jsonData);
if (success) {
  console.log('Import erfolgreich!');
}
```

## Styling & Anpassung

### CSS-Variablen

Die Farben können in `css/notes-system.css` angepasst werden:

```css
/* Hauptfarben */
--notes-primary: #61AFEF;      /* Blau */
--notes-background: #1a2340;   /* Dunkelblau */
--notes-text: #9efcff;         /* Cyan */
--notes-yellow: #E5C07B;       /* Gelb */
```

### Integration in Custom Themes

Falls Sie ein eigenes Reveal.js-Theme verwenden, stellen Sie sicher:

1. `css/notes-system.css` ist eingebunden
2. `resources/js/notes-system.js` ist eingebunden
3. Font Awesome Icons sind verfügbar

## Kompatibilität

### Browser
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Opera

### Eingabegeräte
- ✅ Maus
- ✅ Touchscreen
- ✅ Stylus/Pen (z.B. Apple Pencil, Surface Pen)

## Bekannte Einschränkungen

- **localStorage-Limit**: Bei sehr vielen/großen Zeichnungen kann das Browser-Limit erreicht werden
- **Keine Cloud-Sync**: Notizen sind lokal pro Browser/Gerät gespeichert
- **Canvas-Qualität**: Bei sehr hohen Auflösungen kann die Performance leiden

## Troubleshooting

### Notizen werden nicht gespeichert

- **Prüfen**: Ist localStorage im Browser aktiviert?
- **Lösung**: Browser-Einstellungen → Cookies/localStorage erlauben

### Toggle-Button wird nicht angezeigt

- **Prüfen**: Ist `css/notes-system.css` geladen?
- **Lösung**: Browser-Konsole auf CSS-Fehler prüfen

### Zeichnungen verschwinden beim Resize

- **Ursache**: Canvas wird beim Resize neu gezeichnet
- **Lösung**: Automatisch implementiert – Canvas-Inhalt wird gesichert

### Notizen auf falscher Folie

- **Ursache**: Folie hat keine eindeutige ID
- **Lösung**: Slide-ID in Markdown definieren:
  ```markdown
  <!-- .slide:id="eindeutige-id" -->
  ```

## Datenschutz

- **Lokal**: Alle Daten bleiben im Browser
- **Keine Übertragung**: Keine Server-Kommunikation
- **Löschung**: Browser-Cache löschen entfernt alle Notizen
- **Export empfohlen**: Regelmäßig Notizen exportieren für Backup

## Erweiterungsmöglichkeiten

Mögliche zukünftige Features:

- 📱 **Cloud-Sync**: Optional über Firebase/Supabase
- 🔍 **Suche**: Notizen durchsuchen
- 🏷️ **Tags**: Notizen kategorisieren
- 📊 **Statistik**: Übersicht über alle Notizen
- 🖼️ **Bild-Upload**: Bilder als Notizen einfügen
- 🎙️ **Audio-Notizen**: Sprachaufnahmen
- 📤 **PDF-Export**: Notizen als PDF mit Folien exportieren

## Beispiel-Workflow: Vorlesung

1. **Vorbereitung**: Präsentation öffnen
2. **Während der Vorlesung**:
   - Wichtige Punkte als Text-Notizen festhalten
   - Diagramme mit Zeichnungen ergänzen
   - Folienwechsel → Notizen werden automatisch gespeichert
3. **Nach der Vorlesung**:
   - Notizen als JSON exportieren
   - Optional: Screenshots von Folien mit Notizen
4. **Nächste Session**: 
   - Präsentation öffnen → Notizen sind automatisch wieder da
   - Badge zeigt an, auf welchen Folien Notizen existieren

## Import-Test

Im Repository befindet sich eine Test-Datei zum Ausprobieren der Import-Funktion:

**Datei**: `test-notes-import.json`

**Test-Schritte**:
1. Demo öffnen: `notes-demo.html`
2. Notizen-Overlay öffnen (Taste `N`)
3. Upload-Button klicken (📥)
4. Datei `test-notes-import.json` auswählen
5. Bestätigung abwarten
6. Zu verschiedenen Folien navigieren → Importierte Notizen erscheinen!

**Test-Notizen enthalten**:
- Slide 1: 2 Willkommens-Notizen
- Slide 2: 1 Zeichen-Hinweis
- Slide 5: 1 Pythagoras-Beispiel mit Rechnung

## Support & Entwicklung

- **Version**: 1.0
- **Entwickelt für**: ODEA E-Learning Platform
- **Lizenz**: Projektspezifisch

---

**Viel Erfolg mit dem Notizen-System! 🚀**
