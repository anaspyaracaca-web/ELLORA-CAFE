(() => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  const parallaxImages = document.querySelectorAll(".hero-image, .signature-image img, .experience-photo img");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updateScrollEffects = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
    if (!reduceMotion.matches) {
      parallaxImages.forEach((image) => {
        const bounds = image.getBoundingClientRect();
        const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
        image.style.translate = `0 ${((progress - 0.5) * 24).toFixed(1)}px`;
      });
    }
  };
  updateScrollEffects();
  window.addEventListener("scroll", updateScrollEffects, { passive: true });
  window.addEventListener("resize", updateScrollEffects);

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
    });
    navigation.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement && window.matchMedia("(max-width: 680px)").matches) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
      }
    });
    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 680px)").matches) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
      }
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const filterButtons = document.querySelectorAll(".filter-button");
  const menuItems = document.querySelectorAll(".menu-item[data-category]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      menuItems.forEach((item) => {
        item.hidden = filter !== "all" && item.dataset.category !== filter;
      });
    });
  });

  const moodCopy = {
    bright: "The Rosewater Cloud — a gentle floral note, plenty of sunshine.",
    slow: "A brown butter chai — warm spices and nowhere you need to be.",
    bold: "A double espresso — little, lovely, and ready for anything."
  };
  const moodResult = document.querySelector(".mood-result");
  document.querySelectorAll("[data-mood]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-mood]").forEach((item) => item.classList.toggle("is-selected", item === button));
      if (moodResult) moodResult.textContent = moodCopy[button.dataset.mood] || "A lovely cup is waiting for you.";
    });
  });

  const quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    const steps = [...quiz.querySelectorAll(".quiz-step")];
    const progress = [...document.querySelectorAll(".quiz-progress span")];
    const result = quiz.querySelector(".quiz-result");
    const answers = [];
    const drinks = {
      bright: ["Rosewater Cloud", "A silky iced latte with rosewater and cardamom cream. A little floral, never too sweet."],
      slow: ["Brown Butter Chai", "House-steeped black tea, toasted spice, and a little space to take your time."],
      bold: ["Double Espresso", "Two beautiful shots of our seasonal espresso. Short, assured, and full of character."],
      creamy: ["Honey Oat Flat White", "A smooth double espresso, steamed oat, and the gentlest local honey."],
      clean: ["Seasonal Filter", "A bright, carefully brewed coffee that lets every lovely note speak for itself."],
      rich: ["Cocoa Mocha", "A deep espresso paired with velvety chocolate for a richer little moment."],
      floral: ["Rosewater Cloud", "A silky iced latte with rosewater and cardamom cream. A little floral, never too sweet."],
      spiced: ["Brown Butter Chai", "House-steeped black tea, toasted spice, and a little space to take your time."],
      classic: ["Seasonal Flat White", "A beautifully balanced double espresso with silky textured milk."]
    };
    quiz.addEventListener("click", (event) => {
      const option = event.target.closest("[data-answer]");
      if (!option) return;
      answers.push(option.dataset.answer);
      const currentIndex = answers.length - 1;
      if (currentIndex < steps.length - 1) {
        steps[currentIndex].hidden = true;
        steps[currentIndex + 1].hidden = false;
        progress[currentIndex + 1]?.classList.add("is-current");
      } else {
        steps.forEach((step) => { step.hidden = true; });
        const match = [...answers].reverse().map((answer) => drinks[answer]).find(Boolean) || drinks.classic;
        result.querySelector(".quiz-result-name").textContent = match[0];
        result.querySelector(".quiz-result-copy").textContent = match[1];
        result.hidden = false;
      }
    });
    quiz.querySelector(".quiz-restart")?.addEventListener("click", () => {
      answers.length = 0;
      result.hidden = true;
      steps.forEach((step, index) => { step.hidden = index !== 0; });
      progress.forEach((item, index) => item.classList.toggle("is-current", index === 0));
    });
  }

  document.querySelectorAll(".demo-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = form.querySelector(".form-message");
      if (!(form instanceof HTMLFormElement) || !form.reportValidity() || !message) return;
      const type = form.dataset.form;
      const confirmation = type === "reservation"
        ? "Your request looks complete. This demo hasn’t sent or booked anything—please contact the café directly."
        : type === "contact"
          ? "Your note is ready. This demo hasn’t sent or stored your message."
          : "Thank you for joining us. This demo doesn’t save or send email addresses.";
      message.textContent = confirmation;
      message.setAttribute("role", "status");
    });
  });

  const lightbox = document.querySelector(".lightbox");
  if (lightbox instanceof HTMLDialogElement) {
    const lightboxImage = lightbox.querySelector("img");
    document.querySelectorAll("[data-lightbox]").forEach((tile) => {
      tile.addEventListener("click", () => {
        if (!lightboxImage) return;
        lightboxImage.src = tile.dataset.lightbox;
        lightboxImage.alt = tile.querySelector("img")?.alt || "Enlarged café photograph";
        lightbox.showModal();
      });
    });
    lightbox.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }

  const stampGrid = document.querySelector(".stamps");
  if (stampGrid) {
    const countLabel = document.querySelector(".stamp-count");
    const message = document.querySelector(".stamp-message");
    const storageKey = "ellora-demo-loyalty-stamps";
    let stamps = 0;
    try {
      const saved = window.localStorage.getItem(storageKey);
      stamps = saved === null ? 0 : Number(saved);
      if (!Number.isInteger(stamps) || stamps < 0 || stamps > 10) stamps = 0;
    } catch (error) {
      console.error("Could not read the demo loyalty card from local storage.", error);
    }

    const renderStamps = () => {
      stampGrid.replaceChildren();
      for (let index = 0; index < 10; index += 1) {
        const stamp = document.createElement("span");
        stamp.className = `stamp${index < stamps ? " is-filled" : ""}`;
        stamp.setAttribute("aria-hidden", "true");
        stamp.textContent = index < stamps ? "✳" : "·";
        stampGrid.append(stamp);
      }
      if (countLabel) countLabel.textContent = `${stamps} OF 10 CUPS`;
      if (message) message.textContent = stamps === 10
        ? "Ten lovely visits. Your next cup is on us (in this demo, at least)."
        : `${10 - stamps} ${10 - stamps === 1 ? "cup" : "cups"} until a little treat.`;
    };
    const saveStamps = () => {
      try {
        window.localStorage.setItem(storageKey, String(stamps));
      } catch (error) {
        console.error("Could not save the demo loyalty card to local storage.", error);
        if (message) message.textContent = "Your browser could not save this demo card; try enabling local storage.";
      }
    };
    document.querySelector(".stamp-add")?.addEventListener("click", () => {
      stamps = stamps >= 10 ? 0 : stamps + 1;
      saveStamps();
      renderStamps();
    });
    document.querySelector(".stamp-reset")?.addEventListener("click", () => {
      stamps = 0;
      saveStamps();
      renderStamps();
    });
    renderStamps();
  }
})();
