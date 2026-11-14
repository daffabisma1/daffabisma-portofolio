
/* =====================================================
   DAFFA BISMA ANGGANA — PORTFOLIO INTERACTIONS
===================================================== */

/* RESET PAGE POSITION ON REFRESH */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

window.addEventListener("pageshow", () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializeHeader();
  initializeProjectList();
  initializeRevealAnimation();
  initializeActiveNavigation();
  initializeGlobe();

  // NEW: Experience section
  initializeExperienceLedger();
  initializePigmentEffect();
});


/* =====================================================
   NAVIGATION
===================================================== */

function initializeNavigation() {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = navMenu?.querySelectorAll("a");

  if (!menuToggle || !navMenu) return;

  function closeMenu() {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");

    menuToggle.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

  navLinks?.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
}


/* =====================================================
   HEADER SCROLL
===================================================== */

function initializeHeader() {
  const header = document.getElementById("siteHeader");

  if (!header) return;

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 35);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });
}


/* =====================================================
   PROJECT LIST
===================================================== */

function initializeProjectList() {
  const projectList = document.getElementById("projectList");
  const showButton = document.getElementById("showProjects");
  const countLabel = document.getElementById("projectCount");
  const shownLabel = document.getElementById("projectShown");

  if (!projectList || !showButton) return;

  const hiddenProjects = projectList.querySelectorAll(
    ".project-card.is-hidden"
  );

  const visibleProjects = () =>
    projectList.querySelectorAll(
      ".project-card:not(.is-hidden)"
    ).length;

  const totalProjects = projectList.querySelectorAll(
    ".project-card"
  ).length;

  function updateProjectCount() {
    const shown = visibleProjects();

    if (countLabel) {
      countLabel.textContent =
        `SHOWING ${shown} OF ${totalProjects} PROJECTS`;
    }

    if (shownLabel) {
      shownLabel.textContent = String(shown).padStart(2, "0");
    }
  }

  updateProjectCount();

  showButton.addEventListener("click", () => {
    const isExpanded =
      showButton.getAttribute("aria-expanded") === "true";

    const nextState = !isExpanded;

    hiddenProjects.forEach(project => {
      project.classList.toggle("is-hidden", !nextState);
    });

    showButton.setAttribute(
      "aria-expanded",
      String(nextState)
    );

    const label = showButton.querySelector("span:first-child");
    const symbol = showButton.querySelector("span:last-child");

    if (label) {
      label.textContent = nextState
        ? "Show fewer projects"
        : "View all projects";
    }

    if (symbol) {
      symbol.textContent = nextState ? "−" : "＋";
    }

    updateProjectCount();

    if (!nextState) {
      document.getElementById("projects")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}


/* =====================================================
   SCROLL REVEAL
===================================================== */

function initializeRevealAnimation() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => {
      element.classList.add("visible");
    });
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    elements.forEach(element => {
      element.classList.add("visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  elements.forEach(element => {
    observer.observe(element);
  });
}


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

function initializeActiveNavigation() {
  const sections = document.querySelectorAll(
    "#about, #projects, #expertise, #career"
  );

  const links = document.querySelectorAll(".nav-menu a");

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const currentId = entry.target.id;

        links.forEach(link => {
          const isActive =
            link.getAttribute("href") === `#${currentId}`;

          link.classList.toggle("active", isActive);
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px"
    }
  );

  sections.forEach(section => {
    observer.observe(section);
  });
}


/* =====================================================
   EXPERIENCE LEDGER — ACCORDION
===================================================== */

function initializeExperienceLedger() {
  const rows = document.querySelectorAll(".ledger-row");

  if (!rows.length) return;

  function closeRow(row) {
    const trigger = row.querySelector(".ledger-trigger");
    const detail = row.querySelector(".ledger-detail");
    const toggle = row.querySelector(".ledger-toggle");

    row.classList.remove("is-open");

    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }

    if (detail) {
      detail.hidden = true;
    }

    if (toggle) {
      toggle.textContent = "＋";
    }
  }

  function openRow(row) {
    const trigger = row.querySelector(".ledger-trigger");
    const detail = row.querySelector(".ledger-detail");
    const toggle = row.querySelector(".ledger-toggle");

    row.classList.add("is-open");

    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
    }

    if (detail) {
      detail.hidden = false;
    }

    if (toggle) {
      toggle.textContent = "−";
    }
  }

  rows.forEach(row => {
    const trigger = row.querySelector(".ledger-trigger");
    const detail = row.querySelector(".ledger-detail");

    if (!trigger || !detail) return;

    // Synchronize initial HTML state.
    const initiallyOpen =
      row.classList.contains("is-open") &&
      trigger.getAttribute("aria-expanded") === "true";

    if (initiallyOpen) {
      openRow(row);
    } else {
      closeRow(row);
    }

    trigger.addEventListener("click", () => {
      const isOpen = row.classList.contains("is-open");

      // Close every other experience.
      rows.forEach(otherRow => {
        if (otherRow !== row) {
          closeRow(otherRow);
        }
      });

      // Toggle the selected experience.
      if (isOpen) {
        closeRow(row);
      } else {
        openRow(row);
      }
    });
  });
}


/* =====================================================
   EXPERIENCE LEDGER — PIGMENT CURSOR EFFECT
===================================================== */

function initializePigmentEffect() {
  const rows = document.querySelectorAll(".ledger-row");

  if (!rows.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  // Disable the effect on touch devices or reduced motion.
  if (reducedMotion || !finePointer) return;

  rows.forEach(row => {
    const canvas = row.querySelector(".ledger-pigment");

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    let pointerX = -1000;
    let pointerY = -1000;

    let targetX = -1000;
    let targetY = -1000;

    let isInside = false;
    let animationFrame = null;

    function resizeCanvas() {
      const rect = row.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );
    }

    function drawPigment() {
      animationFrame = null;

      context.save();

      // Gradually fade previous pigment.
      context.globalCompositeOperation = "destination-out";
      context.fillStyle = "rgba(0, 0, 0, 0.075)";
      context.fillRect(0, 0, width, height);

      context.globalCompositeOperation = "source-over";

      if (isInside) {
        // Smooth cursor movement.
        pointerX += (targetX - pointerX) * 0.16;
        pointerY += (targetY - pointerY) * 0.16;

        const radius = Math.min(
          190,
          Math.max(100, width * 0.18)
        );

        const gradient = context.createRadialGradient(
          pointerX,
          pointerY,
          0,
          pointerX,
          pointerY,
          radius
        );

        gradient.addColorStop(
          0,
          "rgba(145, 201, 229, 0.17)"
        );

        gradient.addColorStop(
          0.35,
          "rgba(95, 164, 195, 0.10)"
        );

        gradient.addColorStop(
          0.7,
          "rgba(75, 130, 160, 0.045)"
        );

        gradient.addColorStop(
          1,
          "rgba(75, 130, 160, 0)"
        );

        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);

        // Soft secondary pigment bloom.
        const bloom = context.createRadialGradient(
          pointerX + 35,
          pointerY + 12,
          0,
          pointerX + 35,
          pointerY + 12,
          radius * 0.55
        );

        bloom.addColorStop(
          0,
          "rgba(197, 232, 246, 0.07)"
        );

        bloom.addColorStop(
          1,
          "rgba(197, 232, 246, 0)"
        );

        context.fillStyle = bloom;
        context.fillRect(0, 0, width, height);
      }

      context.restore();

      if (isInside) {
        animationFrame = requestAnimationFrame(drawPigment);
      }
    }

    function requestDraw() {
      if (animationFrame !== null) return;

      animationFrame = requestAnimationFrame(drawPigment);
    }

    row.addEventListener("pointerenter", event => {
      isInside = true;

      const rect = row.getBoundingClientRect();

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;

      pointerX = targetX;
      pointerY = targetY;

      requestDraw();
    });

    row.addEventListener("pointermove", event => {
      if (!isInside) return;

      const rect = row.getBoundingClientRect();

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;

      requestDraw();
    });

    row.addEventListener("pointerleave", () => {
      isInside = false;

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      // Fade out the remaining pigment.
      let fadeFrames = 0;

      function fadeOut() {
        context.save();

        context.globalCompositeOperation = "destination-out";
        context.fillStyle = "rgba(0, 0, 0, 0.12)";
        context.fillRect(0, 0, width, height);

        context.restore();

        fadeFrames++;

        if (fadeFrames < 12) {
          animationFrame = requestAnimationFrame(fadeOut);
        } else {
          animationFrame = null;
        }
      }

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(fadeOut);
    });

    resizeCanvas();

    // Resize canvas when the row dimensions change.
    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });

      resizeObserver.observe(row);
    }
  });
}


/* =====================================================
   INTERACTIVE GLOBE
===================================================== */

function initializeGlobe() {
  const canvas = document.getElementById("earthCanvas");
  const loading = document.getElementById("globeLoading");
  const errorMessage = document.getElementById("globeError");

  if (!canvas || !window.d3) {
    if (loading) loading.hidden = true;
    if (errorMessage) errorMessage.hidden = false;
    return;
  }

  const context = canvas.getContext("2d");

  if (!context) {
    if (loading) loading.hidden = true;
    if (errorMessage) errorMessage.hidden = false;
    return;
  }

  const landDataUrl =
    "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json";

  let landData = null;
  let projection;
  let path;

  let width = 0;
  let height = 0;

  let pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  let rotation = [-105, -15, 0];
  let scaleFactor = 1;

  let isDragging = false;
  let previousPointer = null;
  let animationFrame = null;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const baseRotationSpeed = 0.12;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();

    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);

    pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    projection = d3.geoOrthographic()
      .translate([width / 2, height / 2])
      .scale(Math.min(width, height) * 0.39 * scaleFactor)
      .clipAngle(90)
      .precision(0.5)
      .rotate(rotation);

    path = d3.geoPath(projection, context);

    drawGlobe();
  }

  function drawGlobe() {
    if (!projection || !path) return;

    context.clearRect(0, 0, width, height);

    const sphere = { type: "Sphere" };

    // Outer globe shadow.
    context.save();
    context.beginPath();
    path(sphere);
    context.shadowColor = "rgba(91, 176, 220, .32)";
    context.shadowBlur = 35;
    context.fillStyle = "#132b3a";
    context.fill();
    context.restore();

    // Solid ocean surface.
    context.beginPath();
    path(sphere);
    context.fillStyle = "#18394c";
    context.fill();

    // Ocean edge.
    context.beginPath();
    path(sphere);
    context.strokeStyle = "rgba(160, 215, 242, .8)";
    context.lineWidth = 1.15;
    context.stroke();

    if (landData) {
      // Land surface.
      context.beginPath();
      path(landData);
      context.fillStyle = "#a5d9ed";
      context.fill();

      context.strokeStyle = "rgba(216, 240, 250, .45)";
      context.lineWidth = 0.45;
      context.stroke();
    }

    // Geographic graticule.
    context.beginPath();
    path(d3.geoGraticule10());
    context.strokeStyle = "rgba(190, 225, 241, .16)";
    context.lineWidth = 0.55;
    context.stroke();

    // Globe outline.
    context.beginPath();
    path(sphere);
    context.strokeStyle = "rgba(201, 233, 248, .7)";
    context.lineWidth = 1;
    context.stroke();

    // Small location marker.
    const marker = projection([107.6, -6.9]);

    if (
      marker &&
      Number.isFinite(marker[0]) &&
      Number.isFinite(marker[1])
    ) {
      context.beginPath();
      context.arc(marker[0], marker[1], 3.5, 0, Math.PI * 2);
      context.fillStyle = "#ffffff";
      context.fill();

      context.beginPath();
      context.arc(marker[0], marker[1], 8, 0, Math.PI * 2);
      context.strokeStyle = "rgba(255,255,255,.55)";
      context.lineWidth = 1;
      context.stroke();
    }
  }

  function animate() {
    if (!isDragging && !reducedMotion) {
      rotation[0] += baseRotationSpeed;

      projection.rotate(rotation);

      drawGlobe();
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function getPointerPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return [
      event.clientX - rect.left,
      event.clientY - rect.top
    ];
  }

  canvas.addEventListener("pointerdown", event => {
    isDragging = true;
    previousPointer = getPointerPosition(event);

    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", event => {
    if (!isDragging || !previousPointer) return;

    const current = getPointerPosition(event);

    const dx = current[0] - previousPointer[0];
    const dy = current[1] - previousPointer[1];

    rotation[0] += dx * 0.35;
    rotation[1] -= dy * 0.35;

    rotation[1] = Math.max(
      -85,
      Math.min(85, rotation[1])
    );

    previousPointer = current;

    projection.rotate(rotation);

    drawGlobe();
  });

  function stopDragging() {
    isDragging = false;
    previousPointer = null;
  }

  canvas.addEventListener("pointerup", stopDragging);
  canvas.addEventListener("pointercancel", stopDragging);
  canvas.addEventListener("lostpointercapture", stopDragging);

  canvas.addEventListener("wheel", event => {
    event.preventDefault();

    scaleFactor -= event.deltaY * 0.0006;

    scaleFactor = Math.max(
      0.8,
      Math.min(1.35, scaleFactor)
    );

    projection.scale(
      Math.min(width, height) * 0.39 * scaleFactor
    );

    drawGlobe();
  }, {
    passive: false
  });

  const resizeObserver = new ResizeObserver(resizeCanvas);

  resizeObserver.observe(canvas.parentElement);

  resizeCanvas();

  d3.json(landDataUrl)
    .then(data => {
      landData = data;

      if (loading) loading.hidden = true;

      drawGlobe();

      if (!reducedMotion) {
        animate();
      }
    })
    .catch(error => {
      console.error("Globe data could not be loaded:", error);

      if (loading) loading.hidden = true;
      if (errorMessage) errorMessage.hidden = false;

      // Keep the ocean sphere visible even if land data fails.
      drawGlobe();
    });

  window.addEventListener("beforeunload", () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    resizeObserver.disconnect();
  });
}
