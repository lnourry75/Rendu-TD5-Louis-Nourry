const fs = require('fs');
const csv = require('csv-parser');

// Fonction pour générer une note aléatoire entre min et max
function generateRandomGrade(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fonction pour traiter le fichier CSV
function processCSVFile(filePath, minGrade, maxGrade) {
  const results = [];
  let sumGrades = 0;
  let countGrades = 0;

  fs.createReadStream(filePath)
    .pipe(csv({ separator: ';' })) // Indique le séparateur du CSV
    .on('data', (data) => {
      // Ajouter une note aléatoire à chaque ligne
      const randomGrade = generateRandomGrade(minGrade, maxGrade);
      data.Note = randomGrade.toString();

      results.push(data);

      // Calculer la somme des notes et le nombre de notes
      sumGrades += randomGrade;
      countGrades++;
    })
    .on('end', () => {
      // Calculer la moyenne des notes
      const averageGrade = countGrades > 0 ? (sumGrades / countGrades).toFixed(2) : 0;

      // Écriture des modifications dans le fichier d'origine
      const writableStream = fs.createWriteStream(filePath);

      results.forEach((row) => {
        const line = `${row.Student_pk};${row.Nom};${row.Prenom};${row.Note};${row.Commentaire || ''}\n`;
        writableStream.write(line);
      });

      // Ajouter la ligne de moyenne des notes à la fin du fichier
      const averageLine = `;;;;Moyenne des notes;${averageGrade}\n`;
      writableStream.write(averageLine);

      writableStream.end();
      console.log('Modifications enregistrées avec succès !');
    })
    .on('error', (error) => {
      console.error('Une erreur s\'est produite lors du traitement du fichier CSV :', error);
    });
}

// Exemple d'utilisation
const filePath = 'students.csv';
const minGrade = 10;
const maxGrade = 20;

processCSVFile(filePath, minGrade, maxGrade);
