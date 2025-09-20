// This script manages the portfolio's dynamic features, including the loading screen,
// a stat counter animation, theme toggling, a "show more" skills section,
// and a testimonials carousel with a modal for full text.

// --- 1. LOADER & INITIAL ANIMATIONS ---
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  // Fade out loader after a short delay for a better user experience
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 2000); // Reduced from 10s to 2s

  // Start counters after the loader is gone
  const counters = document.querySelectorAll(".stat-number");
  if (counters.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute("data-target"));
            animateCounter(entry.target, target);
            observer.unobserve(entry.target); // Animate the counter only once
          }
        });
      },
      { threshold: 0.5 } // Trigger when at least 50% of the element is visible
    );

    counters.forEach((counter) => observer.observe(counter));
  }
});

// --- 2. STATS COUNTER ANIMATION ---
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16); // Calculate increment for a smooth 60fps animation

  const update = () => {
    start += increment;
    if (start >= target) {
      element.textContent = formatShortNumber(target) + "+";
    } else {
      element.textContent = formatShortNumber(Math.floor(start));
      requestAnimationFrame(update);
    }
  };
  update();
}

// Function to format large numbers for display (e.g., 800000 -> 800k)
function formatShortNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + "k"; // Use 0 decimal places for thousands
  } else {
    return num.toString();
  }
}

// --- 3. THEME (DARK/LIGHT MODE) TOGGLE ---
const themeToggleBtn = document.getElementById("mode-toggle");
const icon = document.getElementById("mode-icon");
const currentTheme = localStorage.getItem("theme");

// Apply saved theme on load
if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
  icon.textContent = "🌙";
} else {
  document.body.classList.remove("dark-mode");
  icon.textContent = "☀️";
}

// Toggle theme on click
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  let theme = "light";
  if (document.body.classList.contains("dark-mode")) {
    theme = "dark";
    icon.textContent = "🌙";
  } else {
    icon.textContent = "☀️";
  }
  localStorage.setItem("theme", theme);
});

// --- 4. "SHOW MORE" SKILLS TOGGLE ---
const wrapper = document.querySelector(".minor-skills-wrapper");
const showMoreBtn = document.querySelector(".show-more-btn");
let isExpanded = false;

showMoreBtn.addEventListener("click", () => {
  wrapper.classList.toggle("expanded");
  isExpanded = !isExpanded;
  showMoreBtn.textContent = isExpanded ? "Show Less" : "Show More";
});

// --- 5. TESTIMONIALS CAROUSEL & MODAL ---
document.addEventListener("DOMContentLoaded", () => {
  // Testimonial Data (using David's name)
  const testimonials = [
    {
      quote:
        "Working with Dawood has been an excellent experience. He has a real talent for simplifying complex DevOps processes into clear, actionable steps that everyone can follow. His expertise in cloud and DevOps has often been my go-to resource, and what sets him apart is his patience and willingness to share knowledge. Dawood not only solves problems but also helps elevate the entire team’s skills.",
      author: "Umair Amjad",
      title: "Position: Software Engineer at TechCreator",
      date: "Date: November 26, 2024",
    },
    {
      quote:
        "Dawood’s approach to building and maintaining reliable systems impressed us from the very beginning. He implemented a robust monitoring and alerting setup that gave us full visibility into our applications, resulting in improved performance and stability. Beyond his technical depth, he communicates clearly and works well with others, which makes collaboration easy. Dawood is a true professional we’d be more than happy to work with again.",
      author: "Zaheer Abbas",
      title: "Position: Web Developer (Self-Employed)",
      date: "Date: February 02, 2025",
    },
    {
      quote:
        "Dawood consistently delivers beyond expectations and has been a key asset to our projects. He automated our deployment pipelines, reducing release times from hours to just minutes, which had a huge impact on productivity. What stands out is his calmness under pressure and ability to collaborate seamlessly across teams. Dawood combines technical excellence with professionalism, making him a truly reliable and standout DevOps engineer.",
      author: "Hamdan Ahmad",
      title: "Position: Project Manager at TechCreator",
      date: "Date: December 30, 2024",
    },
  ];

  // Carousel Logic
  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  if (slider && slides.length > 0 && prevBtn && nextBtn) {
    let currentIndex = 0;
    const slideCount = slides.length;

    const updateCarousel = () => {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slideCount;
      updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      updateCarousel();
    });

    // Modal Logic
    const modal = document.getElementById("testimonial-modal");
    const modalText = document.getElementById("modal-text");
    const modalAuthorInfo = document.getElementById("modal-author-info");
    const closeModalBtn = document.getElementById("modal-close-btn");

    const openModal = (testimonialId) => {
      const testimonial = testimonials[testimonialId];
      if (testimonial) {
        modalText.textContent = `"${testimonial.quote}"`;
        modalAuthorInfo.innerHTML = `
                  Author: ${testimonial.author}<br>
                  ${testimonial.title}<br>
                  ${testimonial.date}
              `;
        modal.style.display = "block";
      }
    };

    const closeModal = () => {
      modal.style.display = "none";
    };

    // Open modal on slide click
    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        const testimonialId = slide.getAttribute("data-testimonial-id");
        openModal(testimonialId);
      });
    });

    // Close modal on button click
    closeModalBtn.addEventListener("click", closeModal);

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    // Close modal when pressing the Escape key
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  }
});
