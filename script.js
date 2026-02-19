let isAnimated = false;
let hasImage = false;
let currentImg = null;

const container = document.querySelector(".container");
const rects = document.querySelectorAll(".rect");
const get_button = document.querySelector(".get_button");


document.addEventListener("mousemove", (e) => {
  if (isAnimated) return;

  const { innerWidth, innerHeight } = window;
  const x = (e.clientX - innerWidth / 2) / innerWidth;
  const y = (e.clientY - innerHeight / 2) / innerHeight;

  rects.forEach((rect, i) => {
    const depth = (i + 1) * 0.13;
    const rotationX = y * 15 * depth;
    const rotationY = x * -15 * depth;

    rect.style.transform = `
      translate(-50%, -50%)
      rotateX(${rotationX}deg)
      rotateY(${rotationY}deg)
      translateZ(${i * -80}px)
      scale(${1 - i * 0.04})
    `;
  });
});

get_button.addEventListener("click", async () => {
  if (isAnimated) return;
  isAnimated = true;

  if (hasImage && currentImg !== null) {
    currentImg.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: "translate(-50%, -50%) translateZ(-800px) scale(0.1", opacity: 0 }
      ],
    
      {
        duration: 660,
        easing: "ease-in",
        fill: "forwards"
      }
    );

    await new Promise(resolve => setTimeout(resolve, 800));
    currentImg.remove();
  }

  const img = document.createElement("img");
  img.crossOrigin = "anonymous";
  img.src = "https://cataas.com/cat?random=" + Date.now();
  img.style.position = "absolute";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";
  img.style.opacity = "0";
  img.style.maxWidth = "600px";
  img.style.boxShadow = "0 0 80px rgba(255,255,255,0.3)";
  img.style.transition = "opacity 1.2s ease";

  container.appendChild(img);
  currentImg = img;

  rects.forEach((rect, i) => {
    rect.animate(
      [
        {
          transform: `
            translate(-50%, -50%)
            translateZ(-2000px)
            scale(0.2)
          `,
          opacity: 0
        },
        {
          transform: `
            translate(-50%, -50%)
            translateZ(${i * -80}px)
            scale(${1 - i * 0.04})
          `,
          opacity: 1
        }
      ],
      {
        duration: 1200,
        delay: i * 65,
        easing: "cubic-bezier(.17,.84,.44,1)",
        fill: "forwards"
      }
    );
  });

  setTimeout(() => {
    img.style.opacity = "1";
    isAnimated = false;
  }, rects.length * 65 + 400);

  img.onload = () => {
    rects[0].style.width = img.clientWidth + "px";
    rects[0].style.height = img.clientHeight + "px";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const pixel = ctx.getImageData(centerX, centerY, 10, 10).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const color = `rgb(${r}, ${g}, ${b})`;

    rects.forEach((rect) => {
      rect.animate(
        [
          { opacity: 0 },
          { opacity: 0.7 }
        ],
        {
          duration: 500,
          easing: "ease-in-out",
          fill: "forwards"
        }
      );

      rect.style.border = `4px solid rgba(${r}, ${g}, ${b}, 0.411)`;
    });
  };


  if (!hasImage) {
    get_button.animate(
      [
        { transform: "translateY(0px)" },
        { transform: "translateY(80px)" }
      ],
      {
        duration: 600,
        fill: "forwards",
        easing: "ease-out"
      }
    );

    get_button.textContent = "Find other creature";
  }

  hasImage = true;
});
