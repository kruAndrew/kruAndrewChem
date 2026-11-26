/**
 * IB Chem Dive leaderboard: Google Apps Script for the "Chem Dive leaderboard scores" Sheet.
 *
 * SET UP (once, about 2 minutes)
 *  1. Open the Sheet, then Extensions > Apps Script.
 *  2. Delete what's in Code.gs, paste this whole file in, and click Save.
 *  3. Deploy > New deployment > gear icon > Web app.
 *       Execute as: Me
 *       Who has access: Anyone
 *     Click Deploy, then Authorize access and allow it.
 *  4. Copy the Web app URL (ends in /exec) into simulators/chem-dive-config.js on the hub.
 *
 * MODERATING
 *  - Every daily dive is one row on the "Scores" tab.
 *  - Type x in the "Hide" column to remove that dive from the leaderboard.
 *  - Type player in the "Hide" column of any one of a player's rows to hide that player
 *    completely (useful for a rude nickname).
 *
 * If you change this code later: Deploy > Manage deployments > pencil icon >
 * Version: New version > Deploy. The URL stays the same.
 */

const SHEET = 'Scores';
const TZ = 'Asia/Bangkok';
const HEAD = ['Time', 'Dive date', 'Level', 'Name', 'Player ID', 'Points', 'Depth (m)', 'Hide (x = dive, player = all)'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold');
    const first = ss.getSheets()[0];
    if (first.getName() !== SHEET && first.getLastRow() === 0) ss.deleteSheet(first);
  }
  return sh;
}

function setup() { sheet_(); }

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function cleanName_(s) {
  return String(s || '').replace(/[\u0000-\u001f<>"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
}

function day_(offset) {
  return Utilities.formatDate(new Date(Date.now() + offset * 864e5), TZ, 'yyyy-MM-dd');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const level = d.level === 'HL' ? 'HL' : d.level === 'SL' ? 'SL' : null;
    const name = cleanName_(d.name);
    const id = String(d.id || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 40);
    const pts = Number(d.points);
    const date = String(d.date || '');
    if (!level || name.length < 2 || id.length < 8) return out_({ ok: false, error: 'Missing name or level' });
    if (!(pts >= 0 && pts <= 700 && pts % 5 === 0)) return out_({ ok: false, error: 'Invalid score' });
    if ([day_(-1), day_(0), day_(1)].indexOf(date) < 0) return out_({ ok: false, error: "Only today's dive can be posted" });

    const sh = sheet_();
    const rows = sh.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][4]) === id && String(rows[i][1]) === date && rows[i][2] === level) {
        if (rows[i][3] !== name) sh.getRange(i + 1, 4).setValue(name); // name change
        return out_({ ok: true, duplicate: true });
      }
    }
    sh.appendRow([new Date(), "'" + date, level, name, id, pts, pts * 10, '']);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: 'Bad request' });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const level = p.level === 'HL' ? 'HL' : 'SL';
  const limit = Math.min(Number(p.limit) || 20, 50);
  const me = String(p.id || '');
  const rows = sheet_().getDataRange().getValues().slice(1);

  const banned = {};
  rows.forEach(r => { if (String(r[7]).trim().toLowerCase() === 'player') banned[r[4]] = true; });

  const best = {};
  rows.forEach(r => {
    const id = String(r[4]);
    if (r[2] !== level || banned[id] || String(r[7]).trim()) return;
    const pts = Number(r[5]) || 0, date = String(r[1]);
    const b = best[id] || (best[id] = { name: r[3], pts: -1, date: '', dives: 0, last: '' });
    b.dives++;
    if (date >= b.last) { b.last = date; b.name = r[3]; }
    if (pts > b.pts || (pts === b.pts && date < b.date)) { b.pts = pts; b.date = date; }
  });

  const list = Object.keys(best).map(id => Object.assign({ id: id }, best[id]))
    .sort((a, b) => b.pts - a.pts || (a.date < b.date ? -1 : 1));
  let rank = 0, prev = null;
  list.forEach((x, i) => { if (x.pts !== prev) { rank = i + 1; prev = x.pts; } x.rank = rank; });

  const view = x => ({ rank: x.rank, name: x.name, depth: x.pts * 10, date: x.date, dives: x.dives, me: x.id === me });
  const mine = list.find(x => x.id === me);
  return out_({ ok: true, level: level, players: list.length, top: list.slice(0, limit).map(view), me: mine ? view(mine) : null });
}
