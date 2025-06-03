/**
 * Section animation handler
 * Adds animation to sections with the section--animate class
 * Uses Intersection Observer API for performance
 */

function initSectionAnimations() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll('.section--animate').forEach(section => {
      section.classList.add('is-visible');
    });
    return;
  }

  const options = {
    root: null, // Use viewport as root
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the section is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once the animation is applied, we can stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Observe all sections with the animate class
  document.querySelectorAll('.section--animate').forEach(section => {
    observer.observe(section);
  });
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initSectionAnimations);

// Re-initialize when content might be dynamically added
document.addEventListener('astro:page-load', initSectionAnimations);
