const apiURL = "http://localhost:3000/contacts"; // Use your own API
const contactList = document.getElementById('contactList');
const form = document.getElementById('contactForm');
const searchBox = document.getElementById('searchBox');

async function loadContacts(filter = '') {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();

    const filtered = data.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      contact.phone.includes(filter)
    );

    contactList.innerHTML = '';
    filtered.forEach(contact => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${contact.name} - ${contact.phone}</span>
        <button onclick="editContact(${contact.id}, '${contact.name}', '${contact.phone}')">✏️ Edit</button>
        <button onclick="deleteContact(${contact.id})">🗑️ Delete</button>
      `;
      contactList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading contacts:", err);
  }
}

// Save or update contact
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('contactId').value;
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;

  const contact = { name, phone };

  try {
    if (id) {
      // Update contact
      await fetch(`${apiURL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
    } else {
      // Add new contact
      await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
    }

    form.reset();
    loadContacts();
  } catch (err) {
    console.error("Error saving contact:", err);
  }
});

// Delete contact
async function deleteContact(id) {
  try {
    await fetch(`${apiURL}/${id}`, { method: 'DELETE' });
    loadContacts();
  } catch (err) {
    console.error("Error deleting contact:", err);
  }
}

// Edit contact
function editContact(id, name, phone) {
  document.getElementById('contactId').value = id;
  document.getElementById('name').value = name;
  document.getElementById('phone').value = phone;
}

// Search contacts
searchBox.addEventListener('input', (e) => {
  loadContacts(e.target.value);
});

// Initial Load
loadContacts();
