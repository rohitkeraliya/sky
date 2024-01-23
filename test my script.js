 document.addEventListener('DOMContentLoaded', function () {
            const itemsPerPage = 5;
            let currentPage = 1;
            let totalItems = 0;
            let isLoading = false;
            let videos = [];

           
            const loadingElement = document.getElementById('loading');
            const searchInput = document.getElementById('searchInput');
            const suggestionsList = document.getElementById('suggestions');
            const clearButton = document.getElementById('clearButton');
            const closeButton = document.getElementById('closeButton');
           const allButton = document.getElementById('allButton');
           const rohitButton = document.getElementById('rohitButton');

            let sheetData = []; // Store the fetched Google Sheets data
          
          
            allButton.addEventListener('click', function () {
       showLoading();
      fetchAndDisplayData('https://docs.google.com/spreadsheets/d/1JPptsNfP9Qw0ndxXq8DVd8LW6mCQm_aiO98iVNvs53M/gviz/tq?tqx=out:csv&sheet=Sheet1&tq=SELECT *');
    });

    rohitButton.addEventListener('click', function () {
       showLoading();
      fetchAndDisplayData("https://docs.google.com/spreadsheets/d/1JPptsNfP9Qw0ndxXq8DVd8LW6mCQm_aiO98iVNvs53M/gviz/tq?tqx=out:csv&sheet=Sheet1&tq=SELECT * WHERE B = 'rohit'");
    });


   
            // Fetch suggestions when the page loads
            fetchSheetData();

            searchInput.addEventListener('focus', function () {
                // Show suggestions only when the search input is focused and has at least one character
                if (searchInput.value.trim().length >= 1) {
                    updateSuggestions(searchInput.value.trim().toLowerCase());
                }
            });

            searchInput.addEventListener('input', function () {
                // Update suggestions dynamically as the user types
                updateSuggestions(searchInput.value.trim().toLowerCase());
            });

            closeButton.addEventListener('click', function () {
                // Hide suggestions when the "Close" button is clicked
                suggestionsList.style.display = 'none';
               searchInput.blur();
            });

            clearButton.addEventListener('click', function () {
                // Clear the search input
                searchInput.value = '';
                suggestionsList.style.display = 'none';
             
            });

            function showLoading() {
                isLoading = true;
                loadingElement.style.display = 'flex';
                setTimeout(function () {
                    hideLoading();
                }, 1000);
            }

            function hideLoading() {
                isLoading = false;
                loadingElement.style.display = 'none';
                
              
            }

            function fetchSheetData() {
                const sheetUrl = 'https://docs.google.com/spreadsheets/d/1ljFYrBKFviYTJ66P_WJ4z3SSDFZRqMDd5QwRX77fnBs/gviz/tq?tqx=out:csv&sheet=Sheet1&tq=SELECT *';

                // Make an asynchronous request to the Google Sheets URL
                fetch(sheetUrl)
                    .then(response => response.text())
                    .then(csvData => {
                        sheetData = csvData.trim().split('\n').map(row => row.replace(/"/g, '').trim());
                    })
                    .catch(error => console.error('Error fetching sheet data:', error));
            }

            function updateSuggestions(inputValue) {
                if (inputValue === '') {
                    // If the search box is empty, hide the suggestions list
                    suggestionsList.style.display = 'none';
                    return;
                }

                const filteredSuggestions = sheetData
                    .flatMap(row => row.split(',')) // Split each row into individual names
                    .map(name => name.trim())
                    .filter(name => name.toLowerCase().includes(inputValue));

                // Clear existing suggestions
                suggestionsList.innerHTML = '';

                // Display filtered suggestions
                filteredSuggestions.forEach(suggestion => {
                    const li = document.createElement('li');
                    li.textContent = suggestion;
                    li.addEventListener('click', function () {
                       searchInput.value = suggestion;
                        // You can perform further actions here based on the selected suggestion
                        alert(`Selected suggestion: ${suggestion}`);
                        showLoading();
                        fetchAndDisplayData(`https://docs.google.com/spreadsheets/d/1JPptsNfP9Qw0ndxXq8DVd8LW6mCQm_aiO98iVNvs53M/gviz/tq?tqx=out:csv&sheet=Sheet1&tq=SELECT * WHERE B = '${suggestion}'`);
                        // Hide suggestions after clicking on a suggestion
                        suggestionsList.style.display = 'none';
                    });
                    suggestionsList.appendChild(li);
                });

                // Show or hide suggestions list based on the presence of filtered suggestions
                suggestionsList.style.display = filteredSuggestions.length > 0 ? 'block' : 'none';
            }
    
    
    
    
      function fetchAndDisplayData(url) {
        fetch(url)
          .then(response => response.text())
          .then(data => {
            const rows = data.split('\n').map(row => row.split(','));
            const filterButtonsContainer = document.querySelector('#buttonContainer');
            const mediaContainer = document.querySelector('#mediaContainer');
            const categories = new Set();
            const videos = [];

            rows.forEach(item => {
              const [id, name, price, urls, description, type, category] = item.map(value => value.replace(/(^"|"$)/g, ''));
              categories.add(category.trim().toLowerCase());
            });

            totalItems = rows.length - 1; // Exclude header row

            displayPage(itemsPerPage * (currentPage - 1), itemsPerPage * currentPage);

            const totalPages = Math.ceil(totalItems / itemsPerPage);

            createPaginationButtons(totalPages);

            function displayPage(startIndex, endIndex) {
              const itemsToDisplay = rows.slice(startIndex, endIndex);

              mediaContainer.innerHTML = ''; // Clear existing content

              itemsToDisplay.forEach(item => {
                const [id, name, price, urls, description, type, category] = item.map(value => value.replace(/(^"|"$)/g, ''));
                const mediaItem = document.createElement('div');
                mediaItem.classList.add('media-item');
                mediaItem.classList.add(category.trim().toLowerCase());
                mediaContainer.appendChild(mediaItem);

                if (type.trim().toLowerCase() === 'img') {
                  const urlsArray = urls.split('+');
                  const vrMediaGallery = document.createElement('div');
                  vrMediaGallery.classList.add('vrmedia-gallery');

                  const ulEcommerceGallery = document.createElement('ul');
                  ulEcommerceGallery.classList.add('ecommerce-gallery');
                  ulEcommerceGallery.style.listStyle = 'none';
                  urlsArray.forEach(url => {
                    const li = document.createElement('li');
                    li.dataset.fancybox = 'gallery';
                    li.dataset.src = url.trim();
                    li.dataset.thumb = url.trim();
                    li.innerHTML = `<img src="${url.trim()}" alt="${name}">`;
                    ulEcommerceGallery.appendChild(li);
                  });

                  vrMediaGallery.appendChild(ulEcommerceGallery);
                  mediaItem.appendChild(vrMediaGallery);

                  const details = document.createElement('div');
                  details.classList.add('details');
                  details.innerHTML = `
                    <p class="name"><strong>${name}</strong></p>
                    <p>Description:<br>${description}</p>
                    <p>Price: ${price}</p>
                    <button class="buy-btn" onclick="showId('${id}')">Buy Now</button>
                  `;
                  mediaItem.appendChild(details);
                } else if (type.trim().toLowerCase() === 'video') {
                  const video = document.createElement('video');
                  video.src = urls;
                  video.controls = true;
                  video.loop = true;

                  videos.push(video);
                  const details = document.createElement('div');
                  details.classList.add('details');
                  details.innerHTML = `
                    <p class="name"><strong>${name}</strong></p>
                    <p>Description: ${description}</p>
                    <p>Price: ${price}</p>
                    <button class="buy-btn" onclick="showId('${id}')">Buy Now</button>
                  `;
                  mediaItem.appendChild(video);
                  mediaItem.appendChild(details);

                  video.addEventListener('play', function () {
                    videos.forEach(vid => {
                      if (vid !== video) {
                        vid.pause();
                      }
                    });
                  });

                  window.addEventListener('scroll', function () {
                    const rect = video.getBoundingClientRect();
                    const isOnScreen = (rect.top >= 0) && (rect.bottom <= window.innerHeight);
                    const isPlaying = !video.paused && !video.ended && video.currentTime > 0;

                    if (isOnScreen && !isPlaying) {
                     video.pause();
                    } else if (!isOnScreen && isPlaying) {
                      video.pause();
                    }
                  });
                }
              });

              allButton.addEventListener('click', function () {
                filterItems('.all');
                document.querySelectorAll('.button').forEach(btn => {
                  btn.style.backgroundColor = '#3498db';
                  btn.style.color = 'white';
                });
                this.style.backgroundColor = 'green';
                this.style.color = 'black';
                pauseAllVideos();
              });

             jQuery(document).ready(function(){
jQuery(".ecommerce-gallery").lightSlider({
gallery:true,item:1,loop:false,thumbItem:5,thumbMargin:15,});
});
            }

            function createPaginationButtons(totalPages) {
              const paginationContainer = document.querySelector('#paginationContainer');

              paginationContainer.innerHTML = ''; // Clear existing content

              // Add "Previous" button
              const prevButton = createButton('...Previous Page', 'pagination-button');
              prevButton.addEventListener('click', function () {
                if (currentPage > 1) {
                  currentPage--;
                  displayPage(itemsPerPage * (currentPage - 1), itemsPerPage * currentPage);
                  updatePaginationButtons(totalPages);
                }
              });
              paginationContainer.appendChild(prevButton);

              // Create number buttons with horizontal scroll
              const numbersContainer = document.createElement('div');
              numbersContainer.classList.add('pagination-numbers-container');

              for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.classList.add('pagination-number-button');
                if (i === currentPage) {
                  button.classList.add('active');
                }
                numbersContainer.appendChild(button);

                button.addEventListener('click', function () {
                  currentPage = i;
                  displayPage(itemsPerPage * (currentPage - 1), itemsPerPage * currentPage);
                  updatePaginationButtons(totalPages);
                });
              }

              paginationContainer.appendChild(numbersContainer);

              // Add "Next" button
              const nextButton = createButton('Next Page...', 'pagination-button');

              nextButton.addEventListener('click', function () {
                if (currentPage < totalPages) {
                  currentPage++;
                  displayPage(itemsPerPage * (currentPage - 1), itemsPerPage * currentPage);
                  updatePaginationButtons(totalPages);
                }
              });
              paginationContainer.appendChild(nextButton);
            }

            function createButton(text, className) {
              const button = document.createElement('button');
              button.textContent = text;
              button.classList.add(className);
              return button;
            }

            function updatePaginationButtons(totalPages) {
              document.querySelectorAll('.pagination-number-button').forEach(btn => {
                btn.classList.remove('active');
                if (parseInt(btn.textContent) === currentPage) {
                  btn.classList.add('active');
                }
              });

              // Scroll to the top of the page
              window.scrollTo({
                top: 0,
                behavior: 'auto'
              });
            }

            function pauseAllVideos() {
              videos.forEach(video => {
                video.pause();
              });
            }
          })
          .catch(error => console.error('Error fetching data:', error));
      }

      // Call the fetchAndDisplayData function with the initial URL
      fetchAndDisplayData('https://docs.google.com/spreadsheets/d/1JPptsNfP9Qw0ndxXq8DVd8LW6mCQm_aiO98iVNvs53M/gviz/tq?tqx=out:csv&sheet=Sheet1&tq=SELECT *');
    });

    function showId(id) {
      
        window.location.href = 'okokok.html?data=' + encodeURIComponent(id);
      
     
    }