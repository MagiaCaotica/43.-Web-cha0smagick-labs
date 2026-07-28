async (page) => {
  // Try to call Pinterest's internal API to publish the draft pin
  const result = await page.evaluate(async () => {
    // First, get the CSRF token from cookies or meta
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    };
    
    const csrfToken = getCookie('csrftoken') || getCookie('XSRF-TOKEN');
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    const csrf = csrfMeta ? csrfMeta.getAttribute('content') : csrfToken;
    
    // Try to get the board ID for "Chaos Magick" via API
    try {
      const boardResp = await fetch('https://www.pinterest.com/resource/BoardsResource/get/?source_url=/magiacaoticamagiadelcaosprctic/&data=' + 
        encodeURIComponent(JSON.stringify({options: {username: 'magiacaoticamagiadelcaosprctic', field_set_key: 'profile_grid_item', is_own_profile: true}, context: {}})), 
        {credentials: 'include', headers: {'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json'}});
      
      const boardData = await boardResp.text();
      return { boardData: boardData.substring(0, 1000), csrf: csrf, cookies: document.cookie.substring(0, 200) };
    } catch (e) {
      return { error: e.message, csrf: csrf };
    }
  });
  
  return result;
}
