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

const addEntry = async (date, content) => {
  const entrydate = new Date(date).toLocaleDateString('fr-CA').slice(0, 10);
  const today = new Date().toLocaleDateString('fr-CA').slice(0, 10);

  const fileName = date === 'today' ? `${today}.txt` : `${entrydate}.txt`

  const filePath = path.join(journalDir, fileName)
  // 
  try {
    await fs.readFile(filePath, 'utf8')
    await fs.appendFile(filePath, `\n${content}`)
  } catch {
    await fs.writeFile(filePath, content)
  }
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

const isDeleting = async () => {
  const answer = await prompt("Voulez-vous supprimer le fichier ? Y/N \n")
  if (answer === "Y") {
    return true;
  }
  if (answer === "N") {
    return false;
  }
  console.log("saisie invalide");
  isDeleting()
}


const deleteEntry = async (fileName) => {
  const filePath = path.join(journalDir, fileName)
  try {
    await fs.readFile(filePath, 'utf-8')
    const deleteFile = await isDeleting()
    if (deleteFile) {
      await fs.unlink(filePath)
      console.log("fichier supprimé");
    } else {
      console.log("suppression annulée");
    }
  } catch {
    console.log("le fichier n'existe pas");
  }

}

const openEntry = async (date) => {
  //vérifier si fichier existe
  const pathFile = path.join(journalDir, `${date}.txt`)
  try {
    await fs.access(pathFile)
    const content = await fs.readFile(pathFile, "utf-8")
    console.log(`contenu du fichier ${date}.txt: 

${content}`);
  } catch {
    return console.log(`le fichier ${date}.txt n'existe pas`);
  }
}

const searchentry = async (searchFile) => {
  let textToSearch = searchFile

  while (!textToSearch) {
    textToSearch = await prompt(`Quel fichier voulez-vous rechercher? 
`)
  }

  //récupérer la liste des fichiers 
  try {
    const files = await fs.readdir(journalDir)
    let matches = []
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(journalDir, file)
        const content = await fs.readFile(filePath, "utf-8")
        if (content.includes(textToSearch)) {
          matches.push(file)
        }
      })
    )

    if (matches.length === 0) {
      return console.log(`aucune entrée ne comprend le texte ${textToSearch}`);
    } else {
      return console.log(`
résultat recherche: 

${matches.join('\n')}`);
    }

  } catch {
    return console.log("une erreur est survenue lors de la récupération des fichiers");
  }
}

const main = async () => {
  await ensureJournalDirExists()
  const args = process.argv.slice(2);
  switch (args[0]) {
    case "add":
      await addEntry(args[1], args.slice(2).join(" "));
      break;
    case "delete":
      await deleteEntry(args[1]);
      break;
    case "list":
      await listEntries();
      break;
    case "open":
      await openEntry(args[1]);
      break;
    case "search":
      await searchentry(args[1]);
      break;
    default:
      console.log(`
Usage:
- Pour lister les entrées : node journal.js list
- Pour ajouter une entrée : node journal.js add <date> <content>
- Pour supprimer une entrée une entrée : node journal.js delete <fileName>
- Pour rechercher une entrée : node journal.js search <query>
- pour ouvrir une entrée: node script.js open <date>
`);
  }
}

main()
