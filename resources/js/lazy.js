document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('load-more-trigger');
    const container = document.getElementById('users-container');
    
    if (!trigger || !container) return;

    // On récupère les données envoyées par Edge
    let currentPage = parseInt(trigger.dataset.currentPage);
    const lastPage = parseInt(trigger.dataset.lastPage);
    let isLoading = false;

    const observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && !isLoading && currentPage < lastPage) {
            isLoading = true;
            currentPage++;

            // Afficher le spinner si tu en as un
            const spinner = trigger.querySelector('.spinner');
            if (spinner) spinner.style.display = 'block';

            const url = new URL(window.location.href);
            url.searchParams.set('page', currentPage);

            try {
                const response = await fetch(url, { 
                    headers: { 'X-Requested-With': 'XMLHttpRequest' } 
                });
                const html = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newCards = doc.querySelectorAll('.card-main-link');

                newCards.forEach(card => {
                    // On ajoute une petite animation d'entrée
                    card.style.opacity = '0';
                    container.appendChild(card);
                    // Force le repaint pour l'animation
                    setTimeout(() => card.style.opacity = '1', 10);
                });

            } catch (error) {
                console.error("Erreur Infinite Scroll:", error);
            } finally {
                isLoading = false;
                if (spinner) spinner.style.display = 'none';
            }
        }
    }, { threshold: 0.1 });

    observer.observe(trigger);
});