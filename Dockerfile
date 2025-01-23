# Basis-Image mit Node.js
FROM node:18

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere nur die package.json und package-lock.json, um Layer-Caching zu optimieren
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere den Rest des Codes
COPY . .

# Setze die Umgebungsvariablen für die Laufzeit
ENV NODE_ENV=production

# TypeScript kompilieren
RUN npm run build

# Expose Port
# EXPOSE ____

# Standardbefehl zum Starten des Scripts
CMD ["node", "dist/index.js"]
