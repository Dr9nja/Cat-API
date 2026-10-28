
let isAnimated = false;
let hasImage = false;
let currentImg = null;

const container = document.querySelector(".container");
const rects = document.querySelectorAll(".rect");
const get_button = document.querySelector(".get_button");

const list_of_words = ["Meaw","Maw","Mow","Pan","Spork","Knife","Cucumber","Fatty","Chubby","Dog","Cat","Car","Water","Apple","Pear",
    "Milk","Fish",":3",">:3",":D",":)","Fruity"
];
const list_of_button_words = ["Find other car","FIND MORE CATS","Find Meow","Find Maw","Find Cattt","Find other creature","More cretures!!",
  "Find cutie cat","Meaw find car"
]



document.addEventListener("mousemove", (e) => {
  if (!isAnimated)
  {
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
  }
});

get_button.addEventListener("click", async () => {
  if (isAnimated) return;
  isAnimated = true;

  const randomText_Button = list_of_button_words[Math.floor(Math.random() * list_of_button_words.length)];
  get_button.textContent = randomText_Button;

  const fall_degree = Math.floor(Math.random() * 101)

  if (hasImage && currentImg !== null) {
    currentImg.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: "translate(-50%, -50%) translateZ(-800px) scale(0.01) rotate(35deg)", opacity: .05 }
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
  const randomText = list_of_words[Math.floor(Math.random() * list_of_words.length)];
  img.src = `https://cataas.com/cat/says/${encodeURIComponent(randomText)}?fontSize=65&fontColor=white&random=${Date.now()}`;
  img.style.position = "absolute";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";
  img.style.opacity = "0";
  img.style.maxWidth = "9999px";
  img.style.maxHeight = "9999px";
  img.style.transition = "opacity 1.2s ease";
  img.style.boxShadow = `0 0 0px rgba(255,255,255, 0.5)`;

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

    const UpX = canvas.width / 1.5;
    const DownY = canvas.height / 1.5;

    const pixel = ctx.getImageData(UpX, DownY, 100, 100).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    //const color = `rgb(${r}, ${g}, ${b})`;

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
      const lower_opacity = (r && g && b) < 125
      let final_opacity = 0.411;
      let color_adds = 0;
      if (lower_opacity){
        final_opacity * 1.7
        color_adds = 60
      };
      rect.style.border = `4px solid rgba(${r+color_adds}, ${g+color_adds}, ${b+color_adds}, ${final_opacity})`;
      img.style.boxShadow = `0 0 80px 100px rgba(${r+color_adds}, ${g+color_adds}, ${b+color_adds}, 0.3)`;
    });
    rects[0].style.border = `7px solid rgba(${r+color_adds}, ${g+color_adds}, ${b+color_adds}, 0.9)`;
  };


  if (!hasImage) {
    get_button.animate(
      [
        { transform: "translateY(0px)" },
        { transform: "translateY(450px)" }
      ],
      {
        duration: 900,
        fill: "forwards",
        easing: "ease-out"
      }
    );
  }

  hasImage = true;
});


