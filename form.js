const form = document.getElementById('customerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const fatherNameInput = document.getElementById('fatherName');
    const ageInput = document.getElementById('age');
    const emailInput = document.getElementById('email');
    const mobileInput = document.getElementById('mobile');
    const addressInput = document.getElementById('address');
    const newBtn = document.getElementById('newBtn');
    const customerListDiv = document.getElementById('customerList');
    const statusMsg = document.getElementById('statusMsg');

    let currentCustomerKey = null;
    let entryCreated = false;
    let autoSaveTimer;

    function showAutoSaveMessage() {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        statusMsg.textContent = "All values are auto saved";
        setTimeout(() => {
          statusMsg.textContent = "";
        }, 2000);
      }, 2000);
    }

    function enableFormFields() {
      lastNameInput.disabled = false;
      fatherNameInput.disabled = false;
      ageInput.disabled = false;
      emailInput.disabled = false;
      mobileInput.disabled = false;
      addressInput.disabled = false;
    }

    function disableFormFields() {
      lastNameInput.disabled = true;
      fatherNameInput.disabled = true;
      ageInput.disabled = true;
      emailInput.disabled = true;
      mobileInput.disabled = true;
      addressInput.disabled = true;
    }

    function getCustomersFromStorage() {
      return JSON.parse(localStorage.getItem('customers')) || {};
    }

    function saveCustomersToStorage(customers) {
      localStorage.setItem('customers', JSON.stringify(customers));
    }

    function loadCustomerList() {
      const customers = getCustomersFromStorage();
      customerListDiv.innerHTML = '';

      const keys = Object.keys(customers);

      if (keys.length === 0) {
        customerListDiv.innerHTML = "<p>No data</p>";
        return;
      }

      keys.forEach(key => {
        const customer = customers[key];
        const div = document.createElement('div');
        div.className = 'customer-entry';

        const name = document.createElement('span');
        name.textContent = customer.firstName;

        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View';
        viewBtn.onclick = () => {
          loadCustomerData(key);
        };

        div.appendChild(name);
        div.appendChild(viewBtn);
        customerListDiv.appendChild(div);
      });
    }

    function loadCustomerData(key) {
      const customers = getCustomersFromStorage();
      const customer = customers[key];
      if (!customer) return;

      currentCustomerKey = key;
      entryCreated = true;

      firstNameInput.value = customer.firstName;
      lastNameInput.value = customer.lastName;
      fatherNameInput.value = customer.fatherName;
      ageInput.value = customer.age;
      emailInput.value = customer.email;
      mobileInput.value = customer.mobile;
      addressInput.value = customer.address;

      enableFormFields();
    }

    function updateCurrentCustomer() {
      if (!entryCreated || !currentCustomerKey) return;

      const updatedCustomer = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        fatherName: fatherNameInput.value.trim(),
        age: ageInput.value.trim(),
        email: emailInput.value.trim(),
        mobile: mobileInput.value.trim(),
        address: addressInput.value.trim()
      };

      const customers = getCustomersFromStorage();
      customers[currentCustomerKey] = updatedCustomer;
      saveCustomersToStorage(customers);
      loadCustomerList();
    }

    // First Name field: create entry only on first character
    firstNameInput.addEventListener('input', () => {
      const value = firstNameInput.value.trim();

      if (value.length === 1 && !entryCreated) {
        const customers = getCustomersFromStorage();
        customers[value] = {
          firstName: value,
          lastName: '',
          fatherName: '',
          age: '',
          email: '',
          mobile: '',
          address: ''
        };
        saveCustomersToStorage(customers);
        currentCustomerKey = value;
        entryCreated = true;
        enableFormFields();
        loadCustomerList();
      }

      if (entryCreated) {
        updateCurrentCustomer();
      }

      showAutoSaveMessage();
    });

    // All other fields auto-save
    [lastNameInput, fatherNameInput, ageInput, emailInput, mobileInput, addressInput].forEach(field => {
      field.addEventListener('input', () => {
        updateCurrentCustomer();
        showAutoSaveMessage();
      });
    });

    // New button resets everything
    newBtn.addEventListener('click', () => {
      form.reset();
      disableFormFields();
      currentCustomerKey = null;
      entryCreated = false;
      statusMsg.textContent = '';
    });

    // On page load
    loadCustomerList();