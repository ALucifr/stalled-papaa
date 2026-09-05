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
      role: "Game Architect",
      name: "Prajwal Tiwari",
      photo: "images/IMG_4715.webp",
      bio: "Supported the team with idea development, logic discussions, and visual asset creation. His contributions helped shape the game’s identity and added polish across the project.",
    },
    {
      role: "Game Logic Architect",
      name: "Aagaman Koirala",
      photo: "images/IMG_4722.webp",
      tightCrop: true,
      bio: "A key creative and technical contributor who worked closely on the game's fundamental logic and systems. He collaborated on ideas, discussed solutions, and helped shape the mechanics that define how the game works and feels.",
    },
    {
      role: "Team Connector",
      name: "Pratik Subedi",
      photo: "images/IMG_4725.webp",
      bio: "A consistent part of the journey who helped keep communication and collaboration flowing throughout the project. He contributed to maintaining team synergy, keeping everyone connected, and creating a positive environment where ideas could move forward together.",
    },
    {
      role: "Maze Designer",
      name: "Asbin Raj Phuyal",
      photo: "images/IMG_4716.webp",
      bio: "The creative mind behind the maze, transforming the game's concept into an environment for players to explore. He focused on the structure, layout, and flow of the maze, helping create an experience that feels engaging while fitting the game's overall atmosphere.",
    },
    {
      role: "Animation Crafter",
      name: "Anmol Basnet",
      photo: "images/IMG_4721.webp",
      bio: "Contributed to bringing the game's visual elements to life through sprite animations and related work. His attention to movement and visual details added personality and polish to the game's characters and interactive elements.",
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
    photoEl.classList.toggle("tight-crop", Boolean(member.tightCrop));
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
