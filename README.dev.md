# Possible Future URLs

notes.jim-nielsen.com/about/
notes.jim-nielsen.com/subscribe/

NOTES
notes.jim-nielsen.com/n/:id/
notes.jim-nielsen.com/:id/
notes.jim-nielsen.com/by/id/:id/ /by/datetime/2025-07-27T2250/

COLLECTIONS
notes.jim-nielsen.com/by/ - list of top tags, links, years, etc.

notes.jim-nielsen.com/by/tag/
notes.jim-nielsen.com/by/tag/:id
notes.jim-nielsen.com/by/link/
notes.jim-nielsen.com/by/link/:id
notes.jim-nielsen.com/by/year/
notes.jim-nielsen.com/by/year/:id

notes.jim-nielsen.com/tagged-as/:id/ /tagged-as/video
notes.jim-nielsen.com/linked-from/:id/ /linked-from/chriscoyier.com
notes.jim-nielsen.com/published-in/2025/ /published-in/2025

routes/
index.jse
index.html
$year.$slug.index.html.jse

favicon.ico
search/
index.html.jse
custom-element.js
$year/
$slug/
index.html.jse
custom-element.js

// $year.$slug.index.html.jse
// $year/$slug/index.html.jse

---

(site) => {
return = templates/Page.js({
title: '',
head: ``,
children: \_template
})
}/return

---

// Page tempaltes

routes/tags/index.jse.html
routes/tags/index.css
Page({
site,
page: {
title: 'Tags',
path: '/tags/',
head: `<style>${routes/tags/index.css}</style>`,
children: \_template
}
})
