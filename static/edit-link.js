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

    // Add the link to the list
    const li = document.createElement("li");
    li.appendChild(editLink);
    article.querySelector("footer ul").appendChild(li);
  });
}
