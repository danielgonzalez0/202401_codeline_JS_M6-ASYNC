// Commence par importer les modules nécessaires
import fs from 'fs/promises';
import path from 'path';

// Importe ce fichier pour utiliser la fonction prompt
import { prompt } from './helper.js';
import { throws } from 'assert';

// 🦁 Déclare `journalDir` en utilisant `path.join`
const journalDir = path.join(process.cwd(), "journal");
// 💡 `process.cwd()` retourne le chemin du dossier courant
// 💡 Tu veux joindre le chemin du dossier courant avec journal

// 🦁 Crée une fonction ensureJournalDirExists qui essaie d'accéder au dossier journal
// 💡 Utilise `fs.access` pour vérifier si le dossier existe
// 🦁 Si ce n'est pas le cas, il crée le dossier (utilise try/catch pour gérer l'erreur)

const ensureJournalDirExists = async () => {
  try {
    await fs.access(journalDir, fs.constants.F_OK)
  } catch (err) {
    await fs.mkdir(journalDir)
  }
}

// 🦁 Crée une fonction listEntries qui liste les fichiers du dossier journal
// 💡 Utilise `fs.readdir` pour lister les fichiers

const listEntries = async () => {
  try {
    const files = await fs.readdir(journalDir)
    console.log(`Contenu du journal: 
${files.join('\n')}`);

  } catch (err) {
    console.error(err.message);
  }
}


// 🦁 Crée une fonction addEntry qui prend en paramètre une date et un contenu
// 👉 Si la date est 'today', on utilise la date du jour
// 🦁 Utilise `path.join` pour créer le chemin du fichier grâce à la date
// 🦁 Récupère le contenu du fichier s'il existe et remplace le paramètre contenu par le contenu existant + le nouveau
// 💡 Utilise try/catch pour gérer l'erreur si le fichier n'existe pas
// 🦁 Utilise `fs.writeFile` pour écrire le contenu dans le fichier

const dateFormat = (date) => {
  const annee = date.getFullYear();
  const mois = (date.getMonth() + 1).toString().padStart(2, '0');
  const jour = date.getDate().toString().padStart(2, '0');
  return `${annee}-${mois}-${jour}`;
}

const addEntry = (date, content)=>{
  const entrydate = new Date(date).toLocaleDateString('fr-CA').slice(0, 10);
  const today = new Date().toLocaleDateString('fr-CA').slice(0, 10);
console.log(today);
console.log(entrydate);
console.log(today === entrydate);
}

// 🦁 Crée une fonction main qui appelle `ensureJournalDirExists`
// 🦁 Récupère les arguments de la ligne de commande avec `process.argv.slice(2)`
// 🦁 Utilise un switch pour appeler la bonne fonction en fonction du premier argument
// 🦁 En fonction du paramètre, appelle addEntry ou listEntries

// 💡 Si aucun cas ne correspond, tu peux afficher ce log :
/*
console.log(`
Usage:
- Pour lister les entrées : node journal.js list
- Pour ajouter une entrée : node journal.js add <date> <content>
`);
*/

const main = async () => {
  await ensureJournalDirExists()
  await listEntries()
  addEntry("2024/01/02")
}

main()
