const dataContainer = document.getElementById('data')

document.getElementById('userId').addEventListener('focus', () => {
  dataContainer.textContent = ""
})

document.getElementById('user-id-form').addEventListener('submit', (e) => {
  e.preventDefault();

  // Ton code

  //Récupérer l'id de l'utilisateur dans le formulaire
  const form = e.currentTarget;
  const formData = new FormData(form);
  const formId = formData.get('userId')

  //Vérifier que celui-ci existe, sinon afficher une erreur
  if (!formId) {
    dataContainer.textContent = "pas de user id détecté"
    return
  }


  //Faire une requête fetch pour récupérer les informations de l'utilisateur
  setTimeout(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${formId}`)
      .then((response) => {
        if (!response.ok) throw new Error('user non trouvé')
        return response.json()
      })
      .then(response => {
        // Si l'utilisateur existe, afficher les informations dans le DOM

        dataContainer.textContent = ""
    
        const nameDiv = document.createElement('div')
        nameDiv.classList.add('item')
        nameDiv.textContent = `Name: ${response.name}`
        dataContainer.appendChild(nameDiv)


        const emailDiv = document.createElement('div')
        emailDiv.classList.add('item')
        emailDiv.textContent = `Email: ${response.email}`
        dataContainer.appendChild(emailDiv)

        const phoneDiv = document.createElement('div')
        phoneDiv.classList.add('item')
        phoneDiv.textContent = `Phone: ${response.phone}`
        dataContainer.appendChild(phoneDiv)

      })
      // Si l'utilisateur n'existe pas, afficher une erreur dans le DOM
      .catch(err => {
        dataContainer.textContent = `${err.message}`
      })
  }, 300)

  // Afficher un message Loading... pendant le chargement de la requête
  dataContainer.textContent = "loading..."
}); 