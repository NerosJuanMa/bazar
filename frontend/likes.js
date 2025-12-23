const pageId = 'mi_pagina_unica';

fetch(`http://localhost:3000/api/likes/status?page_id=${pageId}`)
  .then(res => res.json())
  .then(data => {
    likeCount.textContent = data.total;
    if (data.liked) likeBtn.classList.add('liked');
  });

likeBtn.addEventListener('click', () => {
  fetch('http://localhost:3000/api/likes/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page_id: pageId })
  })
    .then(res => res.json())
    .then(data => {
      likeCount.textContent = data.total;
      likeBtn.classList.toggle('liked', data.liked);
    });
});
