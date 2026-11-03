// Ganti dengan API Key milikmu dari https://newsapi.org
const NEWS_API_KEY = '8ef6ef71b4ef49fc9d4b55721697c459'; 

let currentCategory = 'technology';

// Panggil fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  fetchNews(currentCategory);
});

function changeCategory(category, element) {
  // Update class active tombol
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  currentCategory = category;
  fetchNews(category);
}

async function fetchNews(category) {
  const container = document.getElementById('news-container');
  container.innerHTML = '<div class="loading">Memuat berita terbaru...</div>';

  try {
    if (category === 'anime') {
      // Menggunakan Jikan API untuk mengambil data anime populer/terbaru
      const response = await fetch('https://api.jikan.moe/v4/anime?q=anime&limit=25&order_by=popularity');
      const data = await response.json();
      displayAnimeNews(data.data);
    } else {
      // Menggunakan endpoint 'everything' dengan keyword bahasa Indonesia & Inggris agar tercampur luas
      const queryMap = {
        technology: 'teknologi OR gadget OR AI OR technology',
        sports: 'olahraga OR sepakbola OR badminton OR sports',
        entertainment: 'artis OR film OR musik OR entertainment',
        politics: 'politik OR pemilu OR pemerintah OR politics',
      };
      
      const q = queryMap[category] || category;
      // Mengambil jumlah maksimal per request (30 berita agar browser tidak berat/lag)
      const response = await fetch(`https://newsapi.org/v2/everything?q=${q}&pageSize=30&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data. Pastikan API Key sudah dimasukkan.');
      }
      
      const data = await response.json();
      displayNews(data.articles);
    }
  } catch (error) {
    container.innerHTML = `<div class="error">Terjadi kesalahan: ${error.message}</div>`;
  }
}

// Menampilkan berita umum (NewsAPI)
function displayNews(articles) {
  const container = document.getElementById('news-container');
  container.innerHTML = '';

  if (!articles || articles.length === 0) {
    container.innerHTML = '<div class="error">Tidak ada berita ditemukan.</div>';
    return;
  }

  articles.forEach(article => {
    if (!article.title || article.title === '[Removed]') return;

    const card = document.createElement('a');
    card.className = 'news-card';
    card.href = article.url; 
    card.target = '_blank';  
    card.rel = 'noopener noreferrer';

    const defaultImg = 'https://via.placeholder.com/400x200?text=No+Image';

    card.innerHTML = `
      <img class="news-image" src="${article.urlToImage || defaultImg}" alt="Gambar Berita" onerror="this.src='${defaultImg}'">
      <div class="news-content">
        <h2 class="news-title">${article.title}</h2>
        <p class="news-desc">${article.description || 'Klik untuk membaca artikel selengkapnya di situs asal.'}</p>
        <div class="news-meta">
          <span>${article.source.name || 'Sumber Terpercaya'}</span>
          <span>${new Date(article.publishedAt).toLocaleDateString('id-ID')}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Menampilkan berita/update anime (Jikan API)
function displayAnimeNews(animeList) {
  const container = document.getElementById('news-container');
  container.innerHTML = '';

  if (!animeList || animeList.length === 0) {
    container.innerHTML = '<div class="error">Tidak ada data anime ditemukan.</div>';
    return;
  }

  animeList.forEach(anime => {
    const card = document.createElement('a');
    card.className = 'news-card';
    card.href = anime.url; 
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    card.innerHTML = `
      <img class="news-image" src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
      <div class="news-content">
        <h2 class="news-title">${anime.title} (${anime.title_japanese || ''})</h2>
        <p class="news-desc">${anime.synopsis || 'Sinopsis tidak tersedia.'}</p>
        <div class="news-meta">
          <span>Skor: ${anime.score || 'N/A'} ⭐</span>
          <span>${anime.type || 'TV'}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}