function renderHistory(items) {
  const list = document.getElementById("history");
  list.innerHTML = "";

  items.forEach((text, index) => {
    const li = document.createElement("li");

    // Text span (click → copy only text)
    const span = document.createElement("span");
    span.textContent = text;
    span.style.cursor = "pointer";
    span.onclick = () => {
      navigator.clipboard.writeText(span.textContent);
    };

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "x";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = () => {
      // Remove this item from storage
      chrome.storage.local.get(["clipboardHistory"], (data) => {
        let history = data.clipboardHistory || [];
        history.splice(index, 1); // remove the clicked one
        chrome.storage.local.set({ clipboardHistory: history }, () => {
          renderHistory(history); // re-render updated list
        });
      });
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}


async function saveClipboard() {
  let text = null;
  try {
    text = await navigator.clipboard.readText();
  } catch (err) {
    console.error("Clipboard read failed:", err);
  }

  if (!text) return;

  chrome.storage.local.get(["clipboardHistory"], (data) => {
    let history = data.clipboardHistory || [];

    if (!history.includes(text)) {
      history.unshift(text);
    }
    history = history.slice(0, 10);

    chrome.storage.local.set({ clipboardHistory: history }, () => {
      renderHistory(history);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // عرض التاريخ القديم عند فتح popup
  chrome.storage.local.get(["clipboardHistory"], (data) => {
    renderHistory(data.clipboardHistory || []);
  });

  // زر الحفظ
  document
    .getElementById("saveClipboard")
    .addEventListener("click", saveClipboard);
});
