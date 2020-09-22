class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create tr element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X<a></td>
  `;

    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement('div');
    //Add Classes
    div.className = `alert ${className}`;
    //Add Text
    div.appendChild(document.createTextNode(message));
    //Get Parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    //Insert Alert
    container.insertBefore(div, form);

    //Timeout after 3 secs
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }
  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }
  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}


//Local Storage Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UI;

      ui.addBookToList(book);
    })

  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }

}


//DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listeners
document.getElementById('book-form').addEventListener('submit', function (e) {
  // Get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value

  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  //Validate
  if (title === '' || author === '' || isbn === '') {
    //Error Alert
    ui.showAlert('Please Fill In All fields', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);

    //Add to Local Storage
    Store.addBook(book);

    //Show success
    ui.showAlert('Book Added!', 'success');

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

//Event Listener for Delete
document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();

  ui.deleteBook(e.target);

  //Remove from Local Storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  ui.showAlert('Book Removed', 'success');


  e.preventDefault;

});