let starBtns = document.querySelectorAll('.star-btn');
let selectedStars = 0;
const errorToast = document.querySelector('.toast.toast-error');

document
  .querySelector('.btn.btn-clear.float-right')
  .addEventListener('click', () => {
    errorToast.classList.add('hidden');
  });

document.querySelector('#post-btn').addEventListener('click', () => {
  if (selectedStars === 0) {
    errorToast.classList.remove('hidden');
    return;
  }

  const commentTextArea = document.querySelector('#comments');

  const comment = commentTextArea.value;

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

  commentTextArea.value = '';

  fetch('/review', options).then((res) => {
    if (res.status === 200) location.reload();
  });
});

starBtns.forEach((star) => {
  star.addEventListener('click', (e) => {
    for (const star of starBtns) {
      star.classList.add('unselected-star');
      star.classList.remove('selected-star');
    }
    const starNumber = e.target.id.split('-')[2];
    for (let i = 0; i < starNumber; i++) {
      starBtns[i].classList.remove('unselected-star');
      starBtns[i].classList.add('selected-star');
    }

    selectedStars = parseInt(starNumber);
  });
});
