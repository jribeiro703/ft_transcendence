// // Routes
// const routes = {
// 	home: renderHomePage,
// 	user: renderUserPage,
// 	about: renderAboutPage,
// 	// Autres pages ici
//   };
  
//   // Fonction pour rendre la page
//   function renderPage(page) {
// 	switch (page) {
// 	  case 'home':
// 		renderHomePage();
// 		break;
// 	  case 'user':
// 		renderUserPage();
// 		break;
// 	  case 'about':
// 		renderAboutPage();
// 		break;
// 	  default:
// 		renderHomePage();  // Page par défaut
// 		break;
// 	}
//   }
  
//   // Fonction de rendu des pages
//   function renderHomePage() {
// 	document.getElementById('app').innerHTML = '<h1>Home</h1>';
//   }
  
//   function renderUserPage() {
// 	document.getElementById('app').innerHTML = '<h1>User</h1>';
//   }
  
//   function renderAboutPage() {
// 	document.getElementById('app').innerHTML = '<h1>About</h1>';
//   }
  
//   // Gérer l'historique
//   window.addEventListener('popstate', (event) => {
// 	if (event.state) {
// 	  renderPage(event.state.page);
// 	}
//   });
  
//   // Navigation
//   document.getElementById('homeLink').addEventListener('click', () => {
// 	history.pushState({ page: 'home' }, 'Home', '#home');
// 	renderPage('home');
//   });