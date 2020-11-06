let starBtns = document.querySelectorAll('.star-btn');
let selectedStars = 0;

document.querySelector('#post-btn').addEventListener('click', () => {
  const comment = document.querySelector('#comments').value;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      comment,
      rating: selectedStars,
      service: document.querySelector('h1').textContent // We should probably do it better, but it works
    })
  };

  fetch('/review', options)
    .then((res) => res.text())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
});

starBtns.forEach((star) => {
  star.addEventListener('click', (e) => {
    for (const star of starBtns) {
      star.classList.add('unselected-star');
      star.classList.remove('selected-star');
    }
    const starNumber = e.target.id.split('-')[2];
    for (let i = 0; i < starNumber; i++) {
      starBtns[i].classList.toggle('unselected-star');
      starBtns[i].classList.toggle('selected-star');
    }

    selectedStars = parseInt(starNumber);
  });
});
