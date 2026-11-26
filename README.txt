DP CHEMISTRY HUB: HOW TO PUT IT ONLINE AND EDIT IT

What's in this folder
  index.html     the hub (all six tabs). All content is in the "EDIT HERE" block near the bottom.
  simulators/    the simulators. They run from these files and don't need Claude.
  simulators/lib three.js, used by the Ideal Gas Box (bundled so it works offline too).

Put it online free with GitHub Pages
  1. Make a free account at github.com and create a new repository, e.g. "chemistry-hub".
  2. Click "Add file > Upload files" and drag in EVERYTHING from this folder (keep the
     simulators folder as a folder).
  3. Go to Settings > Pages. Under "Source" choose "Deploy from a branch", pick "main", Save.
  4. After a minute or two your site is at https://YOUR-USERNAME.github.io/chemistry-hub/

Edit it later
  On GitHub, open index.html, click the pencil icon, change the text, and click "Commit changes".
  The live site updates within a minute or so. To try changes first, open index.html on your
  own computer by double-clicking it.

Google Drive links (slides, question packs, notes)
  Students can only open these if each file or folder is shared with them. The simplest setting
  is "Anyone at UWC Thailand with the link can view". Share the SL, HL and Mock exams folders
  once and every file inside follows.

Le Chatelier simulator
  simulators/lechatelier.html is a "coming soon" placeholder. Replace it with your own
  lechatelier.html file and keep the same name.

IB Chem Dive (simulators/chem-dive.html)
  A daily answer game: seven prompts a day, the same for everyone, picked automatically from the
  date. Scores are saved in each student's own browser. To add or change prompts, rarity zones or
  feedback on wrong answers, edit the list called P near the top of the script in that file.

Teacher tools (teachers/)
  teachers/                   a small staff page, not linked from the student hub.
  teachers/ia-feedback/       Chemistry IA Feedback: upload a student's IA PDF and get feedback
                              for each criterion, an estimated mark /24 and highlighted passages.
  Address: https://YOUR-USERNAME.github.io/REPO-NAME/teachers/ia-feedback/
  Marking: each teacher pastes their own Anthropic API key (console.anthropic.com) under
  "One-click marking setup". The key stays in that browser and is sent only to Anthropic.
  Without a key, use "Mark in a Claude chat instead" (copy the prompt, paste Claude's reply back).
  GitHub Pages can't password-protect a page: the teachers/ area is unlisted and hidden from
  search engines, but anyone with the address can open it. It holds no key and no student data.
