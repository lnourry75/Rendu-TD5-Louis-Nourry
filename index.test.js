const fs = require('fs');
const getRandomMark = require('./index');

jest.mock('fs', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn()
}));

describe('getRandomMark', () => {
  beforeEach(() => {
    fs.readFile.mockClear();
    fs.writeFile.mockClear();
  });

  it('devrait ajouter des notes avec succès', () => {
    fs.readFile.mockImplementation((nomFichier, encodage, callback) => {
      const data = 'Colonne1;Colonne2;Colonne3;Note\nLigne1;Val1;Val2;Val3';
      callback(null, data);
    });

    getRandomMark('monFichier.csv', 0, 10);

    expect(fs.readFile).toHaveBeenCalledWith(
      'monFichier.csv',
      'utf8',
      expect.any(Function)
    );

    expect(fs.writeFile).toHaveBeenCalledWith(
      'monFichier.csv',
      expect.any(String),
      'utf8',
      expect.any(Function)
    );

    expect(fs.writeFile.mock.calls[0][1]).toContain('Moyenne');
  });

  it('devrait afficher une erreur lors de la lecture du fichier', () => {
    fs.readFile.mockImplementation((nomFichier, encodage, callback) => {
      const error = new Error('Erreur de lecture');
      callback(error);
    });

    console.error = jest.fn();

    getRandomMark('monFichier.csv', 0, 10);

    expect(console.error).toHaveBeenCalledWith(
      "Erreur lors de la lecture du fichier :",
      expect.any(Error)
    );

    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('devrait afficher une erreur lors de l\'écriture dans le fichier', () => {
    fs.readFile.mockImplementation((nomFichier, encodage, callback) => {
      const data = 'Colonne1;Colonne2;Colonne3;Note\nLigne1;Val1;Val2;Val3';
      callback(null, data);
    });

    fs.writeFile.mockImplementation((nomFichier, contenu, encodage, callback) => {
      const error = new Error('Erreur d\'écriture');
      callback(error);
    });

    console.error = jest.fn();

    getRandomMark('monFichier.csv', 0, 10);

    expect(console.error).toHaveBeenCalledWith(
      "Erreur lors de l'écriture du fichier :",
      expect.any(Error)
    );
  });
});
