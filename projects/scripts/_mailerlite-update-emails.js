/**
 * Update MailerLite EMAIL 2 content via API
 * Token saved to .env after this run
 */
const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYTM5ZTEwMDMwMTgyYTFiYjk0NTY3NDQ2YWQ0YzFmOWNhM2ViOWYyOWExNDRiOTgyNGUyYzdmMWQzNTI1NDBjNGNiMTgxZmMzYzEyZDg1ZGYiLCJpYXQiOjE3ODUzNjg2NjguODE4ODgzLCJuYmYiOjE3ODUzNjg2NjguODE4ODg0LCJleHAiOjQ5NDEwNDIyNjguODEyMjQ1LCJzdWIiOiIyNTU4MzQxIiwic2NvcGVzIjpbXX0.EZJsuRbBPxtASDJJr59IJSTa5kAdycLcBMkbD7wlj6-yy_ow4TFSR4DUNRLZo1nm2N_LrfI8qrLdGExUYIXv1I3W_MTiqhCJxXI7r_B6YNqOnceXRuYvh1LBMhOCB8_pkZ9_9SCAesoRrGGZzb7_80Kvuwjp45nGaKODDjpl8MUSs-KzhvIv6Aw290O8IoH2yEYdt2BCfbKWYgZZOeAGsXaayhaQtSYMsZVza54J4tPIB8HGIQLVRmBsC3Ikog2TpkK8klhaWbFGgu3UzJlf47aD33THSo9eB2PHnzfUbHfK4PtgRzSevsUPrDKiWEv37HCf8vf-Q3kAWHjSw6V4njEhV-hljypn7dPr8l2nmyQrlEOBrI9klF5r-jRid4f5XlpT_5bm88QLC5xNJ_HnMoDXQnj0K2nVE24y7nlnMbqQ8o_yUZ_xPrOAkJwdUHJTbmJ1oz0_nlpUu5MUqvasQrc09oWO3UsDpc-ud1HtvzL18jw4OX1HGoBH4xdrpncy-d4im8o1pbKfwi-6iAB3SpOuOS4O8-HYbPXJ-vtn2pY8iPZ1VAOpar206wwx15shezNqtwMphjwZVfS-rhIMrb6puMD_egaVJeKoLjN65YYMc6thycJHTdmYl-dk7I_sLZMcAksa0WXwJAHyVTCCbXykTEkUmduPHXKDxtBUj3Q';

const BASE = 'https://connect.mailerlite.com/api';

async function api(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  // First, let's see what the email 2 looks like - it's campaign ID 194372861197026593
  console.log('=== Checking Email 2 campaign ===');
  const r1 = await api('/campaigns/194372861197026593');
  console.log('Status:', r1.status);
  console.log('Response:', JSON.stringify(r1.data).substring(0, 500));
  
  // Try to find the email in automation
  console.log('\n=== Checking automation workflows ===');
  const r2 = await api('/automation');
  console.log('Status:', r2.status);
  console.log('Response:', JSON.stringify(r2.data).substring(0, 1000));
}

main().catch(console.error);
