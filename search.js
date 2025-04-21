// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initSearchFunctionality();
});

function initSearchFunctionality() {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchButton || !searchResults) return;

  // Sample movie and match data (would be replaced with API calls)
  const content = [
      { id: 1, title: 'The Last Journey', type: 'movie', category: 'adventure' },
      { id: 2, title: 'Dark Waters', type: 'movie', category: 'thriller' },
      { id: 3, title: 'Cosmic Dreams', type: 'movie', category: 'sci-fi' },
      { id: 4, title: 'Lost City', type: 'movie', category: 'action' },
      { id: 5, title: 'Champions League: Barcelona vs Bayern', type: 'match', category: 'soccer' },
      { id: 6, title: 'NBA Finals: Lakers vs Celtics', type: 'match', category: 'basketball' },
      { id: 7, title: 'UFC 305: Main Card', type: 'match', category: 'mma' },
      { id: 8, title: 'Shadows of Time', type: 'movie', category: 'drama' },
      { id: 9, title: 'Midnight Hunter', type: 'movie', category: 'horror' },
      { id: 10, title: 'Formula 1: Monaco Grand Prix', type: 'match', category: 'racing' }
  ];

  // Search input event listener (for real-time search)
  searchInput.addEventListener('input', debounce(function() {
      performSearch();
  }, 300));

  // Search button click event
  searchButton.addEventListener('click', function() {
      performSearch();
  });

  // Search input enter key press
  searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
          performSearch();
      }
  });

  // Hide search results when clicking outside
  document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-bar')) {
          searchResults.style.display = 'none';
      }
  });

  // Perform search and display results
  function performSearch() {
      const query = searchInput.value.toLowerCase().trim();

      // Clear previous results
      searchResults.innerHTML = '';

      if (query.length < 2) {
          searchResults.style.display = 'none';
          return;
      }

      // Filter content based on query
      const results = content.filter(item => {
          return item.title.toLowerCase().includes(query) ||
                 item.category.toLowerCase().includes(query) ||
                 item.type.toLowerCase().includes(query);
      });

      // Display results
      if (results.length > 0) {
          results.forEach(item => {
              const resultItem = document.createElement('div');
              resultItem.classList.add('search-result-item');

              // Create result content
              resultItem.innerHTML = `
                  <div class="result-title">${highlightMatch(item.title, query)}</div>
                  <div class="result-meta">
                      <span class="result-type">${item.type === 'movie' ? 'Movie' : 'Live Sport'}</span>
                      <span class="result-category">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                  </div>
              `;

              // Add click event to navigate to content
              resultItem.addEventListener('click', function() {
                  if (item.type === 'movie') {
                      window.location.href = `movie.html?id=${item.id}`;
                  } else {
                      window.location.href = `match.html?id=${item.id}`;
                  }
              });

              searchResults.appendChild(resultItem);
          });

          // Add styling to search results
          const style = document.createElement('style');
          style.textContent = `
              .search-result-item {
                  padding: 10px 15px;
                  border-bottom: 1px solid #333;
                  cursor: pointer;
              }

              .search-result-item:hover {
                  background-color: #333;
              }

              .result-title {
                  font-weight: 500;
                  margin-bottom: 5px;
              }

              .result-meta {
                  display: flex;
                  font-size: 0.8rem;
                  color: #aaa;
              }

              .result-type {
                  margin-right: 10px;
              }

              .highlighted {
                  color: #e50914;
                  font-weight: 600;
              }
          `;

          if (!document.querySelector('style[data-search-styles]')) {
              style.setAttribute('data-search-styles', true);
              document.head.appendChild(style);
          }

          searchResults.style.display = 'block';
      } else {
          // No results found
          const noResults = document.createElement('div');
          noResults.classList.add('search-result-item');
          noResults.textContent = 'No results found';
          searchResults.appendChild(noResults);
          searchResults.style.display = 'block';
      }
  }

  // Highlight matching text in search results
  function highlightMatch(text, query) {
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<span class="highlighted">$1</span>');
  }

  // Debounce function to limit how often a function is called
  function debounce(func, delay) {
      let timeout;
      return function() {
          const context = this;
          const args = arguments;

          clearTimeout(timeout);
          timeout = setTimeout(function() {
              func.apply(context, args);
          }, delay);
      };
  }
}

// Function to handle search from URL parameters (for search results page)
function handleUrlSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');

  if (query) {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
          searchInput.value = query;
          // Trigger search if on search results page
          const searchResultsPage = document.getElementById('search-results-page');
          if (searchResultsPage) {
              // Implementation for the search results page would go here
              displaySearchResults(query);
          }
      }
  }
}

// Display search results on a dedicated results page
function displaySearchResults(query) {
  // This would typically make an API call to get results
  // For now, we'll use the sample data

  const resultsContainer = document.getElementById('search-results-page');
  if (!resultsContainer) return;

  // Sample implementation with dummy data
  // In a real application, this would fetch data from a backend

  // Update the page title with the search query
  const searchTitle = document.querySelector('.search-title');
  if (searchTitle) {
      searchTitle.textContent = `Search results for: "${query}"`;
  }

  // Further implementation would depend on the search page structure
}

// Run URL search handling on page load
window.addEventListener('load', handleUrlSearch);