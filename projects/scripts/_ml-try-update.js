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

async function main() {
  // Try different endpoints to update email content
  const emailId = '194372861197026593';
  
  console.log('=== Try 1: PUT /email/{id} ===');
  let r = await api(`/email/${emailId}`, 'PUT', {
    name: 'Discover Our Free Tools',
    subject: 'Free Tools to Enhance Your Magickal Practice',
    content: '<h1>Test content</h1>'
  });
  console.log(r.status, JSON.stringify(r.data).substring(0, 300));
  
  console.log('\n=== Try 2: PUT /emails/{id} ===');
  r = await api(`/emails/${emailId}`, 'PUT', {
    name: 'Discover Our Free Tools',
    subject: 'Free Tools to Enhance Your Magickal Practice',
    content: '<h1>Test content</h1>'
  });
  console.log(r.status, JSON.stringify(r.data).substring(0, 300));
  
  console.log('\n=== Try 3: GET /campaigns with filter ===');
  r = await api('/campaigns?filter[status]=draft&limit=50');
  console.log(r.status);
  if (r.status === 200) {
    for (const c of r.data.data || []) {
      console.log(`Campaign ${c.id}: ${c.name} (${c.type}) status=${c.status}`);
      if (c.emails) {
        for (const e of c.emails) {
          console.log(`  Email ${e.id}: ${e.name}`);
        }
      }
    }
  }
}

main().catch(console.error);
