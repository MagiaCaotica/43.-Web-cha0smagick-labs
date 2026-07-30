const KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYTM5ZTEwMDMwMTgyYTFiYjk0NTY3NDQ2YWQ0YzFmOWNhM2ViOWYyOWExNDRiOTgyNGUyYzdmMWQzNTI1NDBjNGNiMTgxZmMzYzEyZDg1ZGYiLCJpYXQiOjE3ODUzNjg2NjguODE4ODgzLCJuYmYiOjE3ODUzNjg2NjguODE4ODg0LCJleHAiOjQ5NDEwNDIyNjguODEyMjQ1LCJzdWIiOiIyNTU4MzQxIiwic2NvcGVzIjpbXX0.EZJsuRbBPxtASDJJr59IJSTa5kAdycLcBMkbD7wlj6-yy_ow4TFSR4DUNRLZo1nm2N_LrfI8qrLdGExUYIXv1I3W_MTiqhCJxXI7r_B6YNqOnceXRuYvh1LBMhOCB8_pkZ9_9SCAesoRrGGZzb7_80Kvuwjp45nGaKODDjpl8MUSs-KzhvIv6Aw290O8IoH2yEYdt2BCfbKWYgZZOeAGsXaayhaQtSYMsZVza54J4tPIB8HGIQLVRmBsC3Ikog2TpkK8klhaWbFGgu3UzJlf47aD33THSo9eB2PHnzfUbHfK4PtgRzSevsUPrDKiWEv37HCf8vf-Q3kAWHjSw6V4njEhV-hljypn7dPr8l2nmyQrlEOBrI9klF5r-jRid4f5XlpT_5bm88QLC5xNJ_HnMoDXQnj0K2nVE24y7nlnMbqQ8o_yUZ_xPrOAkJwdUHJTbmJ1oz0_nlpUu5MUqvasQrc09oWO3UsDpc-ud1HtvzL18jw4OX1HGoBH4xdrpncy-d4im8o1pbKfwi-6iAB3SpOuOS4O8-HYbPXJ-vtn2pY8iPZ1VAOpar206wwx15shezNqtwMphjwZVfS-rhIMrb6puMD_egaVJeKoLjN65YYMc6thycJHTdmYl-dk7I_sLZMcAksa0WXwJAHyVTCCbXykTEkUmduPHXKDxtBUj3Q';
const BASE = 'https://connect.mailerlite.com/api';

async function api(path, method, body) {
  const opts = {
    method: method || 'GET',
    headers: { 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Accept': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  const text = await res.text();
  try { return { status: res.status, data: JSON.parse(text) }; } catch { return { status: res.status, data: text }; }
}

const HTML3 = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#1a1a2e;font-family:Arial,sans-serif"><table width="100%"><tr><td align="center"><table width="600" style="background:#16213e;border-radius:8px"><tr><td style="padding:30px;background:linear-gradient(135deg,#16213e,#0f3460)"><h1 style="color:#e94560;margin:0">Explore Our Android Apps</h1><p style="color:#ccc">11 Apps for the Modern Occult Practitioner</p></td></tr><tr><td style="padding:30px"><p style="color:#ddd">Hi {{name}},</p><p style="color:#ddd">We built 11 professional Android apps. Each is one-time purchase, no subscriptions.</p><div style="background:#0f3460;border-radius:8px;padding:20px;margin:20px 0"><h3 style="color:#e94560;margin-top:0">TOP APPS:</h3><p style="color:#ddd">🃏 Rider Waite Tarot Complete ($9.99)<br>ᚱ Norse Rune Oracle ($3.99)<br>🌀 PSI GYM ESP Trainer ($3.99)<br>🌙 Dream Machine ($3.99)<br>🔮 Astral Lab ($3.99)<br>📷 NOCTEM Paranormal Suite ($14.99)</p></div><p style="text-align:center;margin:25px 0"><a href="https://cha0smagicklabs.com" style="background:#e94560;color:#fff;padding:12px 30px;border-radius:5px;text-decoration:none;font-weight:bold">Explore All Apps</a></p><p style="color:#888;font-size:12px;text-align:center">4.7★ average from 128+ reviews</p></td></tr><tr><td style="padding:20px;background:#0f3460;text-align:center"><p style="color:#888;font-size:12px;margin:0">&copy; 2026 Cha0smagick Labs</p><p style="color:#888;font-size:12px"><a href="{{unsubscribe_url}}" style="color:#e94560">Unsubscribe</a></p></td></tr></table></td></tr></table></body></html>';

const HTML4 = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#1a1a2e;font-family:Arial,sans-serif"><table width="100%"><tr><td align="center"><table width="600" style="background:#16213e;border-radius:8px"><tr><td style="padding:30px;background:linear-gradient(135deg,#16213e,#0f3460)"><h1 style="color:#e94560;margin:0">Deepen Your Knowledge</h1><p style="color:#ccc">7 Esoteric Books to Deepen Your Practice</p></td></tr><tr><td style="padding:30px"><p style="color:#ddd">Hi {{name}},</p><p style="color:#ddd">Ready to go deeper? Our 7 esoteric books cover Chaos Magick to Goetic sorcery.</p><div style="background:#0f3460;border-radius:8px;padding:20px;margin:20px 0"><h3 style="color:#e94560;margin-top:0">FEATURED TITLES:</h3><p style="color:#ddd">📖 Codex Chaoticus ($4.99)<br>📖 Tarot Chaos ($9.99)<br>📖 Magical Servitors Manual ($4.99)<br>📖 Treatise of Chaos Hunter Runes ($4.99)<br>📖 Liber Lvpinux ($4.99)<br>📖 Ouija Cazadora ($4.99)<br>📖 Mind The Gap ($9.99)</p></div><div style="background:#e94560;border-radius:8px;padding:15px;margin:20px 0;text-align:center"><h3 style="color:#fff;margin:0">BEST DEAL: Complete Bundle $19.99</h3><p style="color:#fff;font-size:14px">All 7 books for 52% off!</p><a href="https://cha0smagicklabs.com" style="display:inline-block;background:#fff;color:#e94560;padding:10px 25px;border-radius:5px;text-decoration:none;font-weight:bold;margin-top:10px">Get the Bundle</a></div></td></tr><tr><td style="padding:20px;background:#0f3460;text-align:center"><p style="color:#888;font-size:12px;margin:0">&copy; 2026 Cha0smagick Labs</p><p style="color:#888;font-size:12px"><a href="{{unsubscribe_url}}" style="color:#e94560">Unsubscribe</a></p></td></tr></table></td></tr></table></body></html>';

const HTML5 = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#1a1a2e;font-family:Arial,sans-serif"><table width="100%"><tr><td align="center"><table width="600" style="background:#16213e;border-radius:8px"><tr><td style="padding:30px;background:linear-gradient(135deg,#16213e,#0f3460)"><h1 style="color:#e94560;margin:0">Join Our Community</h1><p style="color:#ccc">Connect with Fellow Practitioners</p></td></tr><tr><td style="padding:30px"><p style="color:#ddd">Hi {{name}},</p><p style="color:#ddd">The journey continues. Join hundreds of like-minded practitioners.</p><div style="background:#0f3460;border-radius:8px;padding:20px;margin:20px 0"><h3 style="color:#e94560;margin-top:0">JOIN US ON:</h3><p style="color:#ddd">💬 Telegram Channel: @cha0smagicklabs<br>💬 Telegram Group: Join for real-time chat<br>💬 Discord: Structured channels<br>🐦 X/Twitter: @Cha0smagickLABS<br>📌 Pinterest: Cha0smagick Labs</p></div><p style="text-align:center;margin:25px 0"><a href="https://t.me/cha0smagicklabs" style="background:#e94560;color:#fff;padding:12px 30px;border-radius:5px;text-decoration:none;font-weight:bold">Join Telegram Channel</a></p><p style="color:#ddd">Also explore 134+ free articles: <a href="https://cha0smagicklabs.com/blog/" style="color:#e94560">cha0smagicklabs.com/blog/</a></p></td></tr><tr><td style="padding:20px;background:#0f3460;text-align:center"><p style="color:#888;font-size:12px;margin:0">&copy; 2026 Cha0smagick Labs</p><p style="color:#888;font-size:12px"><a href="{{unsubscribe_url}}" style="color:#e94560">Unsubscribe</a></p></td></tr></table></td></tr></table></body></html>';

async function main() {
  const autoId = '194259024266397145';
  const email2StepId = '194372801506837558';
  
  // Step 1: Create Email 3, 4, 5
  const emails = [
    { name: 'Explore Our Android Apps', subject: '11 Android Apps for the Modern Occult Practitioner', html: HTML3 },
    { name: 'Deepen Your Knowledge Books', subject: '7 Esoteric Books to Deepen Your Practice', html: HTML4 },
    { name: 'Join Our Community', subject: 'You\'re Invited to Our Community!', html: HTML5 },
  ];
  
  let prevStepId = email2StepId;
  
  for (let i = 0; i < emails.length; i++) {
    const e = emails[i];
    console.log(`\n=== Creating ${e.name} ===`);
    let r = await api('/automations/' + autoId + '/steps', 'POST', {
      type: 'email',
      name: e.name,
      subject: e.subject,
      from: 'magiacaoticapractica@gmail.com',
      from_name: 'Cha0smagick LABS',
      reply_to: 'magiacaoticapractica@gmail.com',
      parent_id: prevStepId
    });
    
    if (r.status === 201) {
      const stepId = r.data.data.id;
      console.log('Created step:', stepId);
      
      // Update with name, subject and content
      console.log('Updating content...');
      let u = await api('/automations/' + autoId + '/steps/' + stepId, 'PUT', {
        data: {
          name: e.name,
          subject: e.subject,
          from: 'magiacaoticapractica@gmail.com',
          from_name: 'Cha0smagick LABS',
          reply_to: 'magiacaoticapractica@gmail.com',
          email: { content: e.html }
        }
      });
      console.log('Update:', u.status);
      if (u.status === 200) console.log('✅ ' + e.name + ' updated successfully');
      else console.log('❌', JSON.stringify(u.data).substring(0, 200));
      
      prevStepId = stepId;
    } else {
      console.log('❌ Failed to create:', JSON.stringify(r.data).substring(0, 200));
    }
  }
  
  console.log('\n=== All steps created! ===');
}

main().catch(console.error);
