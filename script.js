const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const navLinks = document.querySelectorAll(".nav-links a");
const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (!href) return;

  const isCurrentPage =
    href === currentPage ||
    (currentPage === "" && href === "index.html") ||
    (currentPage === "index.html" && href === "#home");

  link.classList.toggle("active", isCurrentPage);
});

const letterEls = document.querySelectorAll(".papaa-letter");
const storyCard = document.getElementById("active-member-story");

if (letterEls.length && storyCard) {
  const memberData = [
    {
      role: "Creative thinker",
      name: "Prajwal Tiwari",
      photo: "images/IMG_4715.webp",
      bio: "A thoughtful builder who brings structure, creativity, and steady direction to the team’s ideas.",
    },
    {
      role: "Vision setter",
      name: "Aagaman Koirala",
      photo: "images/IMG_4722.webp",
      bio: "A calm problem-solver who adds balance, momentum, and fresh ideas to every challenge we face.",
    },
    {
      role: "Maze designer",
      name: "Pratik Subedi",
      photo: "images/IMG_4725.webp",
      bio: "A creative thinker with a sharp eye for detail and a strong drive to turn concepts into meaningful work.",
    },
    {
      role: "Momentum builder",
      name: "Asbin Raj Phuyal",
      photo: "images/IMG_4716.webp",
      bio: "Someone who keeps the team inspired, focused, and driven by the process of building something bigger than ourselves.",
    },
    {
      role: "Team energizer",
      name: "Anmol Basnet",
      photo: "images/IMG_4721.webp",
      bio: "A dedicated contributor who keeps the team moving with energy, teamwork, and a strong sense of purpose.",
    },
  ];

  let activeIndex = 0;
  let wheelLocked = false;
  let revealTimer = null;
  const storyStage = document.querySelector(".letter-reveal");
  const roleEl = storyCard.querySelector(".member-role");
  const nameEl = storyCard.querySelector("h3");
  const bioEl = storyCard.querySelector("p");
  const photoEl = storyCard.querySelector(".story-photo");
  const lastIndex = memberData.length - 1;

  const lockPageScroll = () => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };

  const unlockPageScroll = () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };

  const updateStoryCard = (index) => {
    const member = memberData[index];
    if (!member) return;

    roleEl.textContent = member.role;
    nameEl.textContent = member.name;
    bioEl.textContent = member.bio;
    photoEl.src = member.photo;
    photoEl.alt = member.name;
  };

  const activateLetter = (index, direction = 1) => {
    if (storyStage) {
      storyStage.style.setProperty("--slide-dir", direction > 0 ? "1" : "-1");
    }

    letterEls.forEach((letter, i) => {
      const active = i === index;
      letter.classList.remove("is-active");
      letter.style.opacity = active ? "1" : "0.25";
      letter.style.transform = active
        ? "translateX(-10px) scale(1.18)"
        : "translateX(0) scale(0.85)";

      if (active) {
        window.requestAnimationFrame(() => {
          letter.classList.add("is-active");
        });
      }
    });
  };

  const revealIndex = (index) => {
    const clampedIndex = Math.min(
      memberData.length - 1,
      Math.max(0, index)
    );

    if (clampedIndex === activeIndex) {
      return;
    }

    lockPageScroll();
    const direction = clampedIndex > activeIndex ? 1 : -1;
    activeIndex = clampedIndex;
    activateLetter(activeIndex, direction);

    if (revealTimer) {
      window.clearTimeout(revealTimer);
    }

    revealTimer = window.setTimeout(() => {
      updateStoryCard(activeIndex);
      storyCard.classList.remove("active");
      void storyCard.offsetWidth;
      storyCard.classList.add("active");

      if (activeIndex === lastIndex) {
        unlockPageScroll();
      }
    }, 430);
  };

  const syncToTopBoundary = () => {
    if (window.scrollY <= 0 && activeIndex !== 0) {
      activeIndex = 0;
      updateStoryCard(0);
      activateLetter(0, -1);
      unlockPageScroll();
    }
  };

  window.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) < 1 || wheelLocked) return;

      if (event.deltaY < 0) {
        unlockPageScroll();
        if (window.scrollY <= 0) {
          syncToTopBoundary();
        }
        return;
      }

      const nextIndex = activeIndex + 1;

      if (nextIndex > lastIndex) {
        unlockPageScroll();
        wheelLocked = false;
        return;
      }

      event.preventDefault();
      wheelLocked = true;
      lockPageScroll();
      revealIndex(nextIndex);

      window.setTimeout(() => {
        wheelLocked = false;
      }, 420);
    },
    { passive: false }
  );

  window.addEventListener("scroll", () => {
    if (window.scrollY <= 0 && activeIndex !== 0 && !wheelLocked) {
      syncToTopBoundary();
    }
  }, { passive: true });

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "PageDown") {
      revealIndex(activeIndex + 1);
    }

    if (event.key === "ArrowUp" || event.key === "PageUp") {
      revealIndex(activeIndex - 1);
    }
  });

  unlockPageScroll();
  updateStoryCard(0);
  activateLetter(0, 1);
}
