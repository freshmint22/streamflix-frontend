const fetch = require('node-fetch');
(async () => {
  try {
    const key = 'QueJZZES5pSYNEAEYHHCDEXzybLHlo7qjqHEKlBrFTmLx9gwfpkALdRe';
    const q = 'cinema';
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=5`;
    const res = await fetch(url, { headers: { Authorization: key } });
    if (!res.ok) {
      console.error('Pexels error', res.status, await res.text());
      process.exit(1);
    }
    const data = await res.json();
    const list = (data.videos || []).map((v) => ({
      id: v.id,
      url: v.video_files && v.video_files[0] ? v.video_files[0].link : null,
      duration: v.duration,
      image: v.image,
      user: v.user && v.user.name ? v.user.name : null,
    }));
    console.log(JSON.stringify(list, null, 2));
  } catch (e) {
    console.error('err', e.message);
    process.exit(1);
  }
})();
