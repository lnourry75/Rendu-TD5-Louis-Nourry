const fs = require('fs');

function updateCSVFileWithRandomScores(filename, minScore, maxScore) {
  // Lecture du fichier CSV
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier :', err);
      return;
    }

    // Conversion du contenu CSV en tableau de lignes
    const lines = data.split('\n');

    // Variables pour calculer la somme des notes et le nombre d'étudiants
    let sum = 0;
    let count = 0;

    // Parcours des lignes du CSV
    for (let i = 1; i < lines.length; i++) {
      // Extraction des colonnes
      const columns = lines[i].split(';');

      // Vérification du nombre de colonnes
      if (columns.length === 5) {
        // Génération d'une note aléatoire entre minScore et maxScore
        const randomScore = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;

        // Ajout de la note aléatoire dans la colonne "Note"
        columns[3] = randomScore.toString();

        // Mise à jour de la ligne dans le tableau de lignes
        lines[i] = columns.join(';');

        // Ajout de la note à la somme
        sum += randomScore;
        count++;
      }
    }

    // Calcul de la moyenne des notes
    const average = count > 0 ? sum / count : 0;

    // Ajout de la ligne de moyenne à la fin du tableau de lignes
    lines.push(`;Moyenne;;${average};`);

    // Conversion du tableau de lignes en chaîne de caractères CSV
    const updatedData = lines.join('\n');

    // Écriture des données mises à jour dans le fichier CSV
    fs.writeFile(filename, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier :', err);
        return;
      }
      console.log('Le fichier a été mis à jour avec succès.');
    });
  });
}

// Exemple d'utilisation de la fonction
const filename = 'students.csv';
const minScore = 0;
const maxScore = 20;

updateCSVFileWithRandomScores(filename, minScore, maxScore);
