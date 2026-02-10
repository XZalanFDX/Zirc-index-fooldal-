const moditext = document.getElementById("moditext");
const texts = ["Üdvözöllek Zircen!", "Zirc – a Bakony szívében", "Köszöntjük Zircről", "Fedezze fel Zircet", "Jó, hogy itt van", "Üdvözlet Zircről", "Zirc város hivatalos oldala"];

if ( moditext ) {
	moditext.textContent = texts[Math.floor(Math.random() * texts.length)];
}


fetch("newsdata.json")
	.then(res => {
    if (!res.ok) {
      throw new Error("Nem sikerült betölteni a JSON fájlt");
    }
    return res.json();
  })
  .then(data => {
    const main_container = document.getElementById("news");

    data.hirek.forEach(hir => {
      const div = document.createElement("div");
      div.classList.add("tourismcard");

      const divider = document.createElement("div");
      divider.classList.add("divider");

      const content = document.createElement("div");
      content.classList.add("content");

      const section = document.createElement("div");
      section.classList.add("section");

      const button_container = document.createElement("div");
      button_container.classList.add("button-container");

      const button = document.createElement("button");
      button.textContent = "Tovább";
      button.classList.add("readmore");

      const h2 = document.createElement("h2");
      h2.textContent = hir.cim;

      const p = document.createElement("p");
      p.textContent = hir.szoveg;

      const img = document.createElement("img");
      img.src = hir.kep;
      img.alt = hir.cim;

      content.append(h2, p, button_container);

      button_container.appendChild(button);

      section.append(img, content);

      div.append(divider, section);
      main_container.appendChild(div);
    });
  })
  .catch(err => console.error(err));

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector('.carousel-track');
  const leftBtn = document.querySelector('.arrow.left');
  const rightBtn = document.querySelector('.arrow.right');
  let images = Array.from(track.children);
  let index = 0;
  let isAnimating = false;

  function getVisible() {
    const w = window.innerWidth;
    if (w <= 767) return 1;        
    if (w <= 1024) return 2;       
    return 3;                       
  }

  let visible = getVisible();

  function cloneImages() {
    track.querySelectorAll('.clone').forEach(c => c.remove());
    images = Array.from(track.children).filter(img => !img.classList.contains('clone'));
    images.slice(0, visible).forEach(img => {
      const clone = img.cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    });
  }

  function update(animated = true) {
    const gap = 10;
    const slideWidth = track.children[0].offsetWidth + gap;
    track.style.transition = animated ? 'transform 0.4s ease' : 'none';
    track.style.transform = `translateX(${-index * slideWidth}px)`;
  }

  function next() {
    if (isAnimating) return;
    isAnimating = true;
    index++;
    update();

    track.addEventListener('transitionend', function reset() {
      if (index >= images.length) {
        index = 0;
        update(false);
      }
      isAnimating = false;
      track.removeEventListener('transitionend', reset);
    });
  }

  function prev() {
    if (isAnimating) return;
    isAnimating = true;

    if (index === 0) {
      index = images.length;
      update(false);
      setTimeout(() => {
        index--;
        update();
      }, 20);
    } else {
      index--;
      update();
    }

    track.addEventListener('transitionend', function endPrev() {
      isAnimating = false;
      track.removeEventListener('transitionend', endPrev);
    });
  }

  rightBtn.addEventListener('click', next);
  leftBtn.addEventListener('click', prev);

  window.addEventListener('resize', () => {
    visible = getVisible();
    cloneImages();
    update(false);
  });

  cloneImages();
  update();
});