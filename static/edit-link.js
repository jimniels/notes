// Add 'Edit' link to each note for my own personal use
// But only if the global var has been set
let edit = window.localStorage.getItem("edit") === "true";
const urlEdit = new URL(window.location).searchParams.get("edit");
if (urlEdit) {
  edit = urlEdit === "true";
  window.localStorage.setItem("edit", edit);
}
if (edit) {
  Array.from(document.querySelectorAll("article")).forEach((article) => {
    const id = article.getAttribute("id");

    // Create the link
    const editLink = document.createElement("a");
    editLink.href = "ia-writer://open?path=notes:" + id + ".md";
    editLink.textContent = "Edit";

    // Append " · Edit" to the footer paragraph
    const footerParagraph = article.querySelector("footer p");
    footerParagraph.appendChild(document.createTextNode("\u00A0·\u00A0 "));
    footerParagraph.appendChild(editLink);
  });
}
