# 🎵 Spotify Liked Songs Automator 🎵

Ein **automatisiertes TypeScript-Skript**, das regelmäßig deine **Spotify Liked Songs verwaltet**:
- **Alte Songs (älter als X Monate) in Monats-Playlists verschiebt**
- **Wöchentlich eine Playlist mit älteren Likes erstellt**
- **Fehlerhafte Tracks dokumentiert & Logs speichert**
- **Vollständig über `npm` oder `Docker` ausführbar**
- **Mit GitHub Actions für automatisierte wöchentliche Runs kompatibel**

---

## **📌 Installation**
### **1️⃣ Projekt klonen**

```sh
git clone https://github.com/dein-repo/spotify-liked-songs-automator.git
cd spotify-liked-songs-automator
```

### **2️⃣ Abhängigkeiten installieren**

```sh
npm install
```

### **3️⃣ .env Datei erstellen**
> Erstelle eine .env Datei und füge deine Spotify API Credentials ein:

```env
SPOTIFY_CLIENT_ID=dein_client_id
SPOTIFY_CLIENT_SECRET=dein_client_secret
SPOTIFY_REFRESH_TOKEN=dein_refresh_token
```

> Diese Daten bekommst du im Spotify Developer Dashboard.

### **4️⃣ ts-app-config.json konfigurieren**
> Erstelle oder bearbeite die Datei ts-app-config.json für individuelle Einstellungen:

```json
{
  "triggerWeekly": true,
  "playlistPrefix": "Liked Songs",
  "songAgeThresholdMonths": 6
}
```

#### **Erklärung:**

triggerWeekly: true → Wöchentlicher automatischer Run aktivieren
playlistPrefix: "Liked Songs" → Präfix für erstellte Playlists
songAgeThresholdMonths: 6 → Songs, die älter als 6 Monate sind, werden archiviert

## **📌 Nutzung**
### **1️⃣ Manuell manageOldLikedSongs ausführen**

```sh
npm run manage-old-songs
```

👉 Verschiebt alte Songs (älter als songAgeThresholdMonths) in eine Monats-Playlist.

### **2️⃣ Wöchentliche Analyse & Playlist-Erstellung**

```sh
npm run start
```

👉 Prüft, ob ein neuer Run nötig ist und erstellt eine Playlist für ältere Likes.

## **📌 Docker Nutzung**
> Falls du das Skript mit Docker ausführen möchtest:

### **1️⃣ Image bauen**

```sh
docker build -t spotify-automation .
```

### **2️⃣ Container starten**

```sh
docker run --env-file .env spotify-automation
```

## **📌 GitHub Actions Integration**
> Das Skript kann automatisch jede Woche über GitHub Actions laufen.

```bash
📂 .github/workflows/weekly-spotify-automation.yml
```

---

```yaml
name: Weekly Spotify Automation

on:
  schedule:
    - cron: '0 0 * * 0'  # Jeden Sonntag um Mitternacht
  workflow_dispatch:

jobs:
  run-spotify-automation:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Build & Run Script
        run: |
          npm install
          npm run start
        env:
          SPOTIFY_CLIENT_ID: ${{ secrets.SPOTIFY_CLIENT_ID }}
          SPOTIFY_CLIENT_SECRET: ${{ secrets.SPOTIFY_CLIENT_SECRET }}
          SPOTIFY_REFRESH_TOKEN: ${{ secrets.SPOTIFY_REFRESH_TOKEN }}

      - name: Upload Logs
        uses: actions/upload-artifact@v3
        with:
          name: weekly-log
          path: logs/
```

### **🔹 Automatisierung**
- Läuft jeden Sonntag um Mitternacht
- Verwendet GitHub Secrets für Spotify-API-Daten
- Speichert die Logs als Artefakt in GitHub

## **📌 Logs & Fehleranalyse**
> Jeder wöchentliche Lauf wird in einer Log-Datei gespeichert: 📂 logs/weekly-log_Tag_Monat_Jahr.json

### **📌 Beispiel für logs/weekly-log_22_Januar_2025.json**

```json
{
  "executedAt": "2025-01-22T00:00:00.000Z",
  "finishedAt": "2025-01-22T00:02:30.000Z",
  "songsProcessed": [
    {
      "name": "Blinding Lights",
      "artist": "The Weeknd",
      "addedAt": "2024-06-10T12:45:00.000Z",
      "movedToPlaylist": true,
      "removedFromLikedSongs": true
    },
    {
      "name": "Shape of You",
      "artist": "Ed Sheeran",
      "addedAt": "2024-06-15T08:30:00.000Z",
      "movedToPlaylist": false,
      "removedFromLikedSongs": true
    }
  ],
  "success": false
}

```
### **Erklärung:**

- **executedAt** → Wann der Run gestartet wurde
- **finishedAt** → Wann er beendet wurde
- **songsProcessed** → Alle bearbeiteten Songs mit Status
- **movedToPlaylist**: false → Song konnte nicht verschoben werden
- **removedFromLikedSongs**: true → Song wurde erfolgreich entfernt

---

### **🔍 Logs anzeigen**

```sh
ls logs/
cat logs/weekly-log_22_Januar_2025.json
```

## **📌 Projektstruktur**

```plaintext
.
├── src/
│   ├── index.ts                     # Haupt-Skript für wöchentliche Analyse
│   ├── utils/
│   │   ├── spotifyApi.ts             # Verbindung zur Spotify API
│   │   ├── playlistUtils.ts          # Playlist-Management Funktionen
│   │   ├── config.ts                 # Laden von Config-Dateien
│   │   ├── logger.ts                 # Log-Funktionalität
│   │   ├── logChecker.ts             # Prüft den letzten Run & Fehlerstatus
│   │   ├── manageSongs.ts            # Separates Skript für `manageOldLikedSongs`
│   │   ├── globalVariables.ts        # Deutsche Monatsnamen & Log-Verzeichnis
├── logs/                             # Gespeicherte Log-Dateien
├── ts-app-config.json                # Konfigurationseinstellungen
├── .env                              # Spotify API Credentials (nicht pushen!)
├── .github/workflows/                 # GitHub Actions Automatisierung
│   ├── weekly-spotify-automation.yml
├── package.json                       # Abhängigkeiten & npm Scripts
├── Dockerfile                         # Docker-Konfiguration
├── README.md                          # Diese Dokumentation
```

---

### **✅ Was ist enthalten?**
✅ **Detaillierte Installation & Nutzung**  
✅ **Erklärung der Logs & Fehleranalyse**  
✅ **Docker- und GitHub Actions-Unterstützung**  
✅ **Projektstruktur für Entwickler**  
