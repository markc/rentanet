/**
 * RentaNet - Main JavaScript
 * Theme management, particles, navigation, and animations
 */

// ============================================
// SITE CONFIGURATION - Change these for different sites
// ============================================

const SITE_CONFIG = {
    themeStorageKey: "renta-theme",  // localStorage key for theme preference
    particleCount: 20,               // Number of floating particles
    scrollThreshold: 50              // Pixels scrolled before nav changes
};

// ============================================
// THEME MANAGEMENT
// ============================================

const themeToggle = document.getElementById("themeToggle");

function toggleTheme() {
    const current = document.documentElement.className;
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.className = next;
    localStorage.setItem(SITE_CONFIG.themeStorageKey, next);
}

// Theme toggle button
themeToggle.addEventListener("click", toggleTheme);

// Listen for system preference changes (only if user hasn't set a preference)
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(SITE_CONFIG.themeStorageKey)) {
        document.documentElement.className = e.matches ? "dark" : "light";
    }
});

// ============================================
// FLOATING PARTICLES
// ============================================

const particlesContainer = document.getElementById("particles");

if (particlesContainer) {
    for (let i = 0; i < SITE_CONFIG.particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 15 + "s";
        particle.style.animationDuration = (10 + Math.random() * 10) + "s";
        particlesContainer.appendChild(particle);
    }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.getElementById("navbar");

function handleScroll() {
    if (window.scrollY > SITE_CONFIG.scrollThreshold) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleScroll);

// ============================================
// SLIDING NAV INDICATOR
// ============================================

const navLinksContainer = document.querySelector(".nav-links");
const navIndicator = document.querySelector(".nav-indicator");
const navIndicatorInner = document.querySelector(".nav-indicator-inner");

if (navLinksContainer && navIndicator && navIndicatorInner) {
    const navItems = navLinksContainer.querySelectorAll("li:not(.nav-indicator)");
    let activeItem = null;

    // Detect active page and mark it
    const currentPath = window.location.pathname;
    navItems.forEach(item => {
        const anchor = item.querySelector("a");
        if (anchor) {
            const href = anchor.getAttribute("href");
            // Match exact path or index page
            if (href === currentPath ||
                (href === "/" && (currentPath === "/" || currentPath === "/index.html")) ||
                (href !== "/" && currentPath.startsWith(href))) {
                anchor.classList.add("active");
                activeItem = item;
            }
        }
    });

    function moveIndicator(item) {
        // Measure the anchor element which has the padding
        const anchor = item.querySelector("a");
        const target = anchor || item;
        const rect = target.getBoundingClientRect();
        const containerRect = navLinksContainer.getBoundingClientRect();

        navIndicatorInner.style.left = (rect.left - containerRect.left) + "px";
        navIndicatorInner.style.top = (rect.top - containerRect.top) + "px";
        navIndicatorInner.style.width = rect.width + "px";
        navIndicatorInner.style.height = rect.height + "px";
    }

    navItems.forEach(item => {
        item.addEventListener("mouseenter", () => moveIndicator(item));
    });

    // Initialize indicator position on active item, or first item as fallback
    if (activeItem) {
        moveIndicator(activeItem);
    } else if (navItems.length > 0) {
        moveIndicator(navItems[0]);
    }
}

// ============================================
// MOBILE MENU
// ============================================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Close menu when clicking a link
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

if (revealElements.length > 0) {
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Initial check
}

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================

const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// ============================================
// LUCIDE ICONS INITIALIZATION
// ============================================
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
