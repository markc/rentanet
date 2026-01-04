        // Theme management
        const themeToggle = document.getElementById("themeToggle");

        function initTheme() {
            const stored = localStorage.getItem("renta-theme");
            if (stored) {
                document.documentElement.className = stored;
            } else {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                document.documentElement.className = prefersDark ? "dark" : "light";
            }
        }

        function toggleTheme() {
            const current = document.documentElement.className;
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.className = next;
            localStorage.setItem("renta-theme", next);
        }

        // Initialize theme before render
        initTheme();

        // Theme toggle button
        themeToggle.addEventListener("click", toggleTheme);

        // Listen for system preference changes
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            if (!localStorage.getItem("renta-theme")) {
                document.documentElement.className = e.matches ? "dark" : "light";
            }
        });

        // Create floating particles
        const particlesContainer = document.getElementById("particles");
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.style.left = Math.random() * 100 + "%";
            particle.style.animationDelay = Math.random() * 15 + "s";
            particle.style.animationDuration = (10 + Math.random() * 10) + "s";
            particlesContainer.appendChild(particle);
        }

        // Navbar scroll effect
        window.addEventListener("scroll", () => {
            const nav = document.getElementById("navbar");
            if (window.scrollY > 50) {
                nav.classList.add("scrolled");
            } else {
                nav.classList.remove("scrolled");
            }
        });

        // Mobile menu toggle
        const menuToggle = document.querySelector(".menu-toggle");
        const navLinks = document.querySelector(".nav-links");

        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        // Close menu when clicking a link
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });

        // Scroll reveal animation
        const revealElements = document.querySelectorAll(".reveal");
        const revealOnScroll = () => {
            revealElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (elementTop < windowHeight - 100) {
                    el.classList.add("active");
                }
            });
        };
        window.addEventListener("scroll", revealOnScroll);
        revealOnScroll(); // Initial check
