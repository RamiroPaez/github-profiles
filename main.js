const API_URL = 'https://api.github.com/users/'

const mainEl = document.querySelector('#main')
const formEl = document.querySelector('#form')
const searchEl = document.querySelector('#search')

async function getUser(username) {
  try {
    const response = await fetch(API_URL + username)

    if (response.status === 404) {
      createErrorCard('No profile with this username')
      return
    }

    if (response.ok) {
      const data = await response.json()
      createUserCard(data)
      getRepos(username)
    }
  } catch (err) {
    createErrorCard('Problem fetching user')
  }
}

async function getRepos(username) {
  try {
    const response = await fetch(`${API_URL + username}/repos?sort=created`)
    const data = await response.json()

    addReposToCard(data)
  } catch (err) {
    createErrorCard('Problem fetching repos')
  }
}

function createUserCard(user) {
  const userID = user.name || user.login
  const userBio = user.bio ? `<p>${user.bio}</p>` : ''
  const cardHTML = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
      </ul>
      <div id="repos"></div>
    </div>
  </div>
    `
  mainEl.innerHTML = cardHTML
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `

  mainEl.innerHTML = cardHTML
}

function addReposToCard(repos) {
  const reposEl = document.getElementById('repos')

  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement('a')
    repoEl.classList.add('repo')
    repoEl.href = repo.html_url
    repoEl.target = '_blank'
    repoEl.innerText = repo.name

    reposEl.appendChild(repoEl)
  })
}

formEl.addEventListener('submit', (e) => {
  e.preventDefault()

  const user = searchEl.value

  if (user) {
    getUser(user)

    searchEl.value = ''
  }
})
