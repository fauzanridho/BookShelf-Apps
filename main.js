const storageKey = "STORAGE_KEY";
const InputBook = document.getElementById("inputBook");
const SearchBook = document.getElementById("searchBook");

function CheckForStorage() {
  return typeof Storage !== "undefined";
}

InputBook.addEventListener("submit", function (event) {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const idTemp = document.getElementById("inputBookTitle").name;
  if (idTemp !== "") {
    const bookData = GetBookList();
    for (let i = 0; i < bookData; i++) {
      if (bookData[i].id == idTemp) {
        bookData[i].title = title;
        bookData[i].author = author;
        bookData[i].year = year;
        bookData[i].isComplete = isComplete;
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(bookData));
    ResetAllForm();
    RenderBookList(bookData);
    return;
  }
  const id =
    JSON.parse(localStorage.getItem(storageKey)) === null
      ? 0 + Date.now()
      : JSON.parse(localStorage.getItem(storageKey)).length + Date.now();
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };
  PutBookList(newBook);
  const bookData = GetBookList();
  RenderBookList(bookData);
});

function PutBookList(data) {
  if (CheckForStorage()) {
    let bookData = [];
    if (localStorage.getItem(storageKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }
    bookData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function RenderBookList(bookData) {
  if (bookData === null) {
    return;
  }
  const containerComplete = document.getElementById("completeBookshelfList");
  const containerIncomplete = document.getElementById(
    "incompleteBookshelfList"
  );

  containerComplete.innerHTML = "";
  containerIncomplete.innerHTML = "";

  for (let book of bookData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;
    // create isi item
    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + year + "</p>";

    //container action item
    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    //green button
    const greenButton = CreateGreenButton(book, function (event) {
      isCompleteBookHandler(event.target.parentElement.parentElement);

      const bookData = GetBookList();
      ResetAllForm();
      RenderBookList(bookData);
    });
    //red button
    const redButton = CreateRedButton(function (event) {
      DeleteAnItem(event.target.parentElement.parentElement);

      const bookData = GetBookList();
      ResetAllForm();
      RenderBookList(bookData);
    });
    containerActionItem.append(greenButton, redButton);
    bookItem.append(containerActionItem);

    //incomplete Book
    if (isComplete == false) {
      containerIncomplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", function (event) {
        UpdateAnItem(event.target.parentElement);
      });
      continue;
    }
    //complete Book
    containerComplete.append(bookItem);
    bookItem.childNodes[0].addEventListener("click", function (event) {
      UpdateAnItem(event.target.parentElement);
    });
  }
}
function CreateGreenButton(book, eventListener) {
  const isCompleted = book.isComplete ? "belum selesai" : "selesai";
  const greenButton = document.createElement("button");
  greenButton.classList.add("green");
  greenButton.innerText = isCompleted + " di Baca";
  greenButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return greenButton;
}
function CreateRedButton(eventListener) {
  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return redButton;
}

function isCompleteBookHandler(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let i = 0; i < bookData.length; i++) {
    if (
      bookData[i].title === title &&
      bookData[i].id == titleNameAttribut
    ) {
      bookData[i].isComplete = !bookData[i].isComplete;
      break;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function SearchBookList(title) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const bookList = [];

  for (let i = 0; i < bookData.length; i++) {
    const tempTitle = bookData[i].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (
      bookData[i].title.includes(title) ||
      tempTitle.includes(tempTitleTarget)
    ) {
      bookList.push(bookData[i]);
    }
  }
  return bookList;
}

function GreenButtonHandler(parentElement) {
  let book = isCompleteBookHandler(parentElement);
  book.isComplete = !book.isComplete;
}

function GetBookList() {
  if (CheckForStorage) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
  return [];
}

function DeleteAnItem(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let i = 0; i < bookData.length; i++) {
    if (bookData[i].id == titleNameAttribut) {
      bookData.splice(i, 1);
      break;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function UpdateAnItem(itemElement) {
  if (
    itemElement.id === "incompleteBookshelfList" ||
    itemElement.id === "completeBookshelfList"
  ) {
    return;
  }

  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(
    9,
    itemElement.childNodes[1].innerText.length
  );
  const getYear = itemElement.childNodes[2].innerText.slice(
    7,
    itemElement.childNodes[2].innerText.length
  );
  const year = parseInt(getYear);

  const isComplete =
    itemElement.childNodes[3].childNodes[0].innerText.length ===
    "Selesai di baca".length
      ? false
      : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("inputBookTitle").value = title;
  document.getElementById("inputBookTitle").name = id;
  document.getElementById("inputBookAuthor").value = author;
  document.getElementById("inputBookYear").value = year;
  document.getElementById("inputBookIsComplete").checked = isComplete;

  for (let i = 0; i < bookData.length; i++) {
    if (bookData[i].id == id) {
      bookData[i].id = id;
      bookData[i].title = title;
      bookData[i].author = author;
      bookData[i].year = year;
      bookData[i].isComplete = isComplete;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

SearchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    RenderBookList(bookData);
    return;
  }
  const bookList = SearchBookList(title);
  RenderBookList(bookList);
});

function ResetAllForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;

  document.getElementById("searchBookTitle").value = "";
}

window.addEventListener("load", function () {
  if (CheckForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      const bookData = GetBookList();
      RenderBookList(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
