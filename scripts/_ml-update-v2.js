const KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYTM5ZTEwMDMwMTgyYTFiYjk0NTY3NDQ2YWQ0YzFmOWNhM2ViOWYyOWExNDRiOTgyNGUyYzdmMWQzNTI1NDBjNGNiMTgxZmMzYzEyZDg1ZGYiLCJpYXQiOjE3ODUzNjg2NjguODE4ODgzLCJuYmYiOjE3ODUzNjg2NjguODE4ODg0LCJleHAiOjQ5NDEwNDIyNjguODEyMjQ1LCJzdWIiOiIyNTU4MzQxIiwic2NvcGVzIjpbXX0.EZJsuRbBPxtASDJJr59IJSTa5kAdycLcBMkbD7wlj6-yy_ow4TFSR4DUNRLZo1nm2N_LrfI8qrLdGExUYIXv1I3W_MTiqhCJxXI7r_B6YNqOnceXRuYvh1LBMhOCB8_pkZ9_9SCAesoRrGGZzb7_80Kvuwjp45nGaKODDjpl8MUSs-KzhvIv6Aw290O8IoH2yEYdt2BCfbKWYgZZOeAGsXaayhaQtSYMsZVza54J4tPIB8HGIQLVRmBsC3Ikog2TpkK8klhaWbFGgu3UzJlf47aD33THSo9eB2PHnzfUbHfK4PtgRzSevsUPrDKiWEv37HCf8vf-Q3kAWHjSw6V4njEhV-hljypn7dPr8l2nmyQrlEOBrI9klF5r-jRid4f5XlpT_5bm88QLC5xNJ_HnMoDXQnj0K2nVE24y7nlnMbqQ8o_yUZ_xPrOAkJwdUHJTbmJ1oz0_nlpUu5MUqvasQrc09oWO3UsDpc-ud1HtvzL18jw4OX1HGoBH4xdrpncy-d4im8o1pbKfwi-6iAB3SpOuOS4O8-HYbPXJ-vtn2pY8iPZ1VAOpar206wwx15shezNqtwMphjwZVfS-rhIMrb6puMD_egaVJeKoLjN65YYMc6thycJHTdmYl-dk7I_sLZMcAksa0WXwJAHyVTCCbXykTEkUmduPHXKDxtBUj3Q';
const BASE = 'https://connect.mailerlite.com/api';

async function api(path, method, body) {
  const opts = {
    method: method || 'GET',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  try { return { status: res.status, data: JSON.parse(text) }; } catch { return { status: res.status, data: text }; }
}

const HTML2 = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background-color:#1a1a2e;font-family:Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color:#16213e;border-radius:8px;overflow:hidden"><tr><td style="padding:30px;background:linear-gradient(135deg,#16213e,#0f3460)"><h1 style="color:#e94560;margin:0;font-size:24px">Welcome to Cha0smagick Labs!</h1><p style="color:#ccc;margin-top:10px">Free Tools to Enhance Your Magickal Practice</p></td></tr><tr><td style="padding:30px;background-color:#1a1a2e"><p style="color:#ddd;line-height:1.6">Hi {{name}},</p><p style="color:#ddd;line-height:1.6">We are excited to help you deepen your practice with our collection of <strong style="color:#e94560">free tools</strong>.</p><div style="background-color:#0f3460;border-radius:8px;padding:20px;margin:20px 0"><h3 style="color:#e94560;margin-top:0">FREE TOOLS YOU CAN USE TODAY:</h3><p style="color:#ddd">🌀 Chaos Sigil Generator<br>🔮 I Ching Oracle<br>🌙 Lunar Phase Calculator<br>🕯️ Candle Color Calculator<br>📜 Spell Builder<br>✨ Pendulum Oracle</p></div><p style="text-align:center;margin:25px 0"><a href="https://cha0smagicklabs.com/tools/" style="background-color:#e94560;color:#fff;padding:12px 30px;border-radius:5px;text-decoration:none;font-weight:bold">Explore Free Tools &rarr;</a></p></td></tr><tr><td style="padding:20px;background-color:#0f3460;text-align:center"><p style="color:#888;font-size:12px;margin:0">&copy; 2026 Cha0smagick Labs</p><p style="color:#888;font-size:12px"><a href="{{unsubscribe_url}}" style="color:#e94560">Unsubscribe</a></p></td></tr></table></td></tr></table></body></html>';

async function main() {
  const autoId = '194259024266397145';
  const stepId = '194372801506837558';
  
  console.log('=== Update Email 2 (with data wrapper) ===');
  let r = await api(`/automations/${autoId}/steps/${stepId}`, 'PUT', {
    data: {
      name: 'Discover Our Free Tools',
      subject: 'Free Tools to Enhance Your Magickal Practice',
      from: 'magiacaoticapractica@gmail.com',
      from_name: 'Cha0smagick LABS',
      reply_to: 'magiacaoticapractica@gmail.com',
      email: { content: HTML2 }
    }
  });
  console.log('Status:', r.status);
  console.log('Response:', JSON.stringify(r.data).substring(0, 800));
  
  console.log('\n=== Update Email 2 (no data wrapper, but with reply_to and correct field names) ===');
  r = await api(`/automations/${autoId}/steps/${stepId}`, 'PUT', {
    name: 'Discover Our Free Tools',
    subject: 'Free Tools to Enhance Your Magickal Practice',
    from: 'magiacaoticapractica@gmail.com',
    from_name: 'Cha0smagick LABS',
    reply_to: 'magiacaoticapractica@gmail.com',
    email: { content: HTML2 }
  });
  console.log('Status:', r.status);
  console.log('Response:', JSON.stringify(r.data).substring(0, 800));
}

main().catch(console.error);
