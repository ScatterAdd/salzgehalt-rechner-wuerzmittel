// Datenstruktur für die Einträge
let eintraege = [];
let aktuellAusgewaehlt = null;

// Hilfsfunktion: Salzmenge berechnen
function berechneSalz(salzgehalt, menge) {
    const salzmenge = (parseFloat(salzgehalt) / 100) * parseFloat(menge);
    // 6 Nachkommastellen, ohne zu runden (abschneiden)
    let salzmengeStr = salzmenge.toString();
    if (salzmengeStr.includes('.')) {
        salzmengeStr = salzmengeStr.substring(0, salzmengeStr.indexOf('.') + 7);
    }
    return salzmengeStr;
}

// Eintrag hinzufügen
function eintragHinzufuegen(name, portionsgroesse, salzgehalt, menge) {
    const salzmenge = berechneSalz(salzgehalt, menge);
    eintraege.push({ name, portionsgroesse, salzgehalt, menge, salzmenge });
    aktuellAusgewaehlt = null;
    aktualisiereListe();
}

// Eintrag aktualisieren
function eintragAktualisieren(index, name, portionsgroesse, salzgehalt, menge) {
    if (index === null || index < 0 || index >= eintraege.length) return;
    const salzmenge = berechneSalz(salzgehalt, menge);
    eintraege[index] = { name, portionsgroesse, salzgehalt, menge, salzmenge };
    aktuellAusgewaehlt = null;
    aktualisiereListe();
}

// Eintrag löschen
function eintragLoeschen(index) {
    if (index === null || index < 0 || index >= eintraege.length) return;
    eintraege.splice(index, 1);
    aktuellAusgewaehlt = null;
    aktualisiereListe();
}

// Felder leeren (muss mit HTML-IDs verknüpft werden)
function clearEingaben() {
    document.getElementById('name').value = '';
    document.getElementById('portionsgroesse').value = '';
    document.getElementById('salzgehalt').value = '';
    document.getElementById('menge').value = '';
    aktuellAusgewaehlt = null;
}

// Liste im UI aktualisieren
function aktualisiereListe() {
    const liste = document.getElementById('sossenListe');
    liste.innerHTML = '';
    eintraege.forEach((eintrag, idx) => {
        const li = document.createElement('li');
        li.textContent = `${eintrag.name} | ${eintrag.portionsgroesse} g/ml | ${eintrag.salzgehalt} g/100ml | ${eintrag.menge} ml | ${eintrag.salzmenge} g Salz`;
        li.onclick = () => eintragAuswaehlen(idx);
        liste.appendChild(li);
    });
}

// Eintrag auswählen
function eintragAuswaehlen(index) {
    const eintrag = eintraege[index];
    document.getElementById('name').value = eintrag.name;
    document.getElementById('portionsgroesse').value = eintrag.portionsgroesse;
    document.getElementById('salzgehalt').value = eintrag.salzgehalt;
    document.getElementById('menge').value = eintrag.menge;
    aktuellAusgewaehlt = index;
}

// CSV Export
function exportiereCSV() {
    let csv = 'Name;Portionsgröße (g/ml);Salzgehalt (g/100ml);Menge (g/ml);Berechnete Salzmenge (g)\n';
    eintraege.forEach(e => {
        csv += `${e.name};${e.portionsgroesse};${e.salzgehalt};${e.menge};${e.salzmenge}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wuerzsaucen-salzgehalt.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// CSV Import
function importiereCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        eintraege = [];
        for (let i = 1; i < lines.length; i++) { // Header überspringen
            const row = lines[i].split(';');
            if (row.length >= 5) {
                eintraege.push({
                    name: row[0],
                    portionsgroesse: row[1],
                    salzgehalt: row[2],
                    menge: row[3],
                    salzmenge: row[4]
                });
            }
        }
        aktuellAusgewaehlt = null;
        aktualisiereListe();
    };
    reader.readAsText(file);
}

// Ergebnis-Anzeige aktualisieren
function zeigeErgebnis(text) {
    document.getElementById('ergebnis').textContent = text;
}

// ...weitere Logik für Buttons und Event-Handler kann im HTML eingebunden werden...
