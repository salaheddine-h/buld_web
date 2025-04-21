// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize header scroll behavior
  initHeaderScroll();

  // Initialize content sliders
  initContentSliders();

  // Initialize video player modals if they exist
  initVideoPlayers();

  // Initialize mobile menu toggle
  initMobileMenu();
});

// Header appearance changes on scroll
function initHeaderScroll() {
  const header = document.querySelector('.main-header');

  window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
          header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
          header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
      } else {
          header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      }
  });
}

// Handle horizontal scroll for content sliders
function initContentSliders() {
  const sliders = document.querySelectorAll('.content-slider');

  sliders.forEach(slider => {
      // Add mouse wheel scrolling for desktop
      slider.addEventListener('wheel', function(e) {
          if (e.deltaY !== 0) {
              e.preventDefault();
              slider.scrollLeft += e.deltaY;
          }
      });

      // Add touch scrolling for mobile
      let isDown = false;
      let startX;
      let scrollLeft;

      slider.addEventListener('mousedown', (e) => {
          isDown = true;
          slider.style.cursor = 'grabbing';
          startX = e.pageX - slider.offsetLeft;
          scrollLeft = slider.scrollLeft;
      });

      slider.addEventListener('mouseleave', () => {
          isDown = false;
          slider.style.cursor = 'grab';
      });

      slider.addEventListener('mouseup', () => {
          isDown = false;
          slider.style.cursor = 'grab';
      });

      slider.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - slider.offsetLeft;
          const walk = (x - startX) * 2; // Scroll speed multiplier
          slider.scrollLeft = scrollLeft - walk;
      });
  });
}

// Initialize video players
function initVideoPlayers() {
  // Check if we're on a page with video players
  const videoPlayers = document.querySelectorAll('.video-player');
  if (videoPlayers.length === 0) return;

  videoPlayers.forEach(player => {
      const video = player.querySelector('video');
      const playButton = player.querySelector('.play-button');
      const volumeControl = player.querySelector('.volume-control');
      const fullscreenButton = player.querySelector('.fullscreen-button');
      const progressBar = player.querySelector('.progress-bar');
      const currentTime = player.querySelector('.current-time');
      const duration = player.querySelector('.duration');

      if (!video) return;

      // Play/Pause functionality
      playButton?.addEventListener('click', function() {
          if (video.paused) {
              video.play();
              playButton.innerHTML = '<i class="fas fa-pause"></i>';
          } else {
              video.pause();
              playButton.innerHTML = '<i class="fas fa-play"></i>';
          }
      });

      // Volume control
      volumeControl?.addEventListener('input', function() {
          video.volume = volumeControl.value;
      });

      // Fullscreen toggle
      fullscreenButton?.addEventListener('click', function() {
          if (video.requestFullscreen) {
              video.requestFullscreen();
          } else if (video.webkitRequestFullscreen) {
              video.webkitRequestFullscreen();
          } else if (video.msRequestFullscreen) {
              video.msRequestFullscreen();
          }
      });

      // Update progress bar
      video.addEventListener('timeupdate', function() {
          const percent = (video.currentTime / video.duration) * 100;
          if (progressBar) progressBar.style.width = percent + '%';

          // Update time display
          if (currentTime) {
              const mins = Math.floor(video.currentTime / 60);
              const secs = Math.floor(video.currentTime % 60);
              currentTime.textContent = `${mins}:${secs < 10 ? '0' + secs : secs}`;
          }
      });

      // Set duration display
      video.addEventListener('loadedmetadata', function() {
          if (duration) {
              const mins = Math.floor(video.duration / 60);
              const secs = Math.floor(video.duration % 60);
              duration.textContent = `${mins}:${secs < 10 ? '0' + secs : secs}`;
          }
      });
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.createElement('div');
  menuToggle.classList.add('menu-toggle');
  menuToggle.innerHTML = '<span></span><span></span><span></span>';

  const header = document.querySelector('.main-header .container');
  const nav = document.querySelector('.main-nav');

  // Only add mobile menu if not already present and if nav exists
  if (!document.querySelector('.menu-toggle') && nav) {
      header.insertBefore(menuToggle, nav);

      menuToggle.addEventListener('click', function() {
          nav.classList.toggle('active');
          menuToggle.classList.toggle('active');
          document.body.classList.toggle('menu-open');
      });

      // Add CSS for mobile menu
      const style = document.createElement('style');
      style.textContent = `
          @media (max-width: 768px) {
              .main-nav {
                  display: none;
              }

              .main-nav.active {
                  display: block;
                  position: absolute;
                  top: 100%;
                  left: 0;
                  width: 100%;
                  background-color: #0f0f0f;
                  padding: 20px;
                  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
              }

              .main-nav.active ul {
                  flex-direction: column;
                  align-items: center;
              }

              .main-nav.active li {
                  margin: 10px 0;
              }

              .menu-toggle {
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  width: 30px;
                  height: 21px;
                  cursor: pointer;
              }

              .menu-toggle span {
                  display: block;
                  height: 3px;
                  width: 100%;
                  background-color: white;
                  transition: all 0.3s ease;
              }

              .menu-toggle.active span:nth-child(1) {
                  transform: translateY(9px) rotate(45deg);
              }

              .menu-toggle.active span:nth-child(2) {
                  opacity: 0;
              }

              .menu-toggle.active span:nth-child(3) {
                  transform: translateY(-9px) rotate(-45deg);
              }

              body.menu-open {
                  overflow: hidden;
              }
          }
      `;
      document.head.appendChild(style);
  }
}

// Function to animate elements on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementPosition < windowHeight - 100) {
          element.classList.add('animated');
      }
  });
}

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);

// Initialize animations on page load
window.addEventListener('load', animateOnScroll);

window.addEventListener('look_at_me', animateOnScroll);