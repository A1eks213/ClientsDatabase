document.addEventListener('DOMContentLoaded', function () {
  // основные элементы
  const container = document.getElementById('container');
  const btnAddClient = document.getElementById('btnAddClient');
  const table = document.getElementById('table');
  const tbody = document.getElementById('tbody');
  const newClientDiv = document.getElementById('newClientDiv');
  const changeClientDiv = document.getElementById('changeClientDiv');
  const buttonClose = document.getElementById('btn-close');
  const btnSave = document.getElementById('btn-save');
  const headerInput = document.getElementById('header-input');
  const btnAddContactCreate = document.getElementById('btnAddContactCreate');
  const blackout = document.getElementById('blackout');
  const validatorCreate = document.getElementById('validatorCreate');
  const validatorChange = document.getElementById('validatorChange');
  // форма создания клиента 
  const inputSurname = document.getElementById('input-surname');
  const inputName = document.getElementById('input-name');
  const inputLastname = document.getElementById('input-lastname');
  const errorSpanSurnameCreate = document.getElementById('errorSpanSurnameCreate');
  const errorSpanNameCreate = document.getElementById('errorSpanNameCreate');
  const errorSpanLastnameCreate = document.getElementById('errorSpanLastnameCreate');
  // форма изменения клиента
  const changingId = document.getElementById('changingId');
  const changeInputSurname = document.getElementById('changeInputSurname');
  const changeInputName = document.getElementById('changeInputName');
  const changeInputLastname = document.getElementById('changeInputLastname');
  const btnSaveChange = document.getElementById('btnSaveChange');
  const closeBtnInFormChange = document.getElementById('closeBtnInFormChange');
  const btnAddContactChange = document.getElementById('btnAddContactChange');
  const errorSpanSurnameChange = document.getElementById('errorSpanSurnameChange');
  const errorSpanNameChange = document.getElementById('errorSpanNameChange');
  const errorSpanLastnameChange = document.getElementById('errorSpanLastnameChange');
 

  // 
  btnAddClient.addEventListener('click', function () {
    
    window.scrollTo(pageXOffset, 0);
    newClientDiv.classList.toggle('newClientDivOpen');
    blackout.classList.add('blackout');
  })
  
  // КНОПКА СОХРАНИТЬ В ФОРМЕ СОЗДАНИЯ
  btnSave.addEventListener('click', async e => {
    e.preventDefault()
    if ((inputSurname.value.length > 1)
      & (inputName.value.length > 1)
      & (inputLastname.value.length > 1)) {
      let surname = inputSurname.value.trim();
      let name = inputName.value.trim();
      let lastname = inputLastname.value.trim();
      //
      let contactsList = [];
      allContacts = document.querySelectorAll('.contactForm');
      for (contact of allContacts) {
        let typeValueContact = {};
        typeValueContact.type = contact.children[0].children[0].children[0].textContent;
        typeValueContact.value = contact.children[1].value;
        contactsList.push(typeValueContact)
      }
      const response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          surname: surname,
          lastName: lastname,
          contacts: contactsList,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        clients = await getArrayClients();
        let newClientForSort = {}
        newClientForSort.id = clients[clients.length - 1].id;
        newClientForSort.name = clients[clients.length - 1].name;
        newClientForSort.surname = clients[clients.length - 1].surname;
        newClientForSort.lastName = clients[clients.length - 1].lastName;
        newClientForSort.contacts = clients[clients.length - 1].contacts;
        newClientForSort.createdAt = clients[clients.length - 1].createdAt;
        newClientForSort.updatedAt = clients[clients.length - 1].updatedAt;
        arrayForSort.push(newClientForSort)
        newClientDiv.classList.remove('newClientDivOpen');
        clients = await getArrayClients();
        createContactTr(clients[clients.length - 1]);
        onCloseModal();
        clearInputsInCreate();
        clearErrorSpanSurnameInCreate();
        clearErrorSpanNameInCreate();
        clearErrorSpanLastnameInCreate();
      } else {
        validatorCreate.textContent = 'Возникла ошибка. Тип ошибки: ' + response.status;
      }
    } else {
      if ((inputSurname.value.length < 2) || (inputSurname.value.length > 30)) {
        inputSurname.classList.add('errorInput');
        errorSpanSurnameCreate.classList.add('errorSpanActive');
        errorSpanSurnameCreate.textContent = 'Допустимое количество символов от 2 до 30';
        inputSurname.addEventListener('input', function () { if (inputSurname.value.length > 1) { clearErrorSpanSurnameInCreate() } })
      }
      if ((inputName.value.length < 2) || (inputName.value.length > 30)) {
        inputName.classList.add('errorInput');
        errorSpanNameCreate.classList.add('errorSpanActive');
        errorSpanNameCreate.textContent = 'Допустимое количество символов от 2 до 30';
        inputName.addEventListener('input', function () { if (inputName.value.length > 1) { clearErrorSpanNameInCreate() } })
      }
      if ((inputLastname.value.length < 2) || (inputLastname.value.length > 30)) {
        inputLastname.classList.add('errorInput');
        errorSpanLastnameCreate.classList.add('errorSpanActive');
        errorSpanLastnameCreate.textContent = 'Допустимое количество символов от 2 до 30';
        inputLastname.addEventListener('input', function () { if (inputLastname.value.length > 1) { clearErrorSpanLastnameInCreate() } })
      }
    }
  });
  // СПИСОК КЛИЕНТОВ ИЗ БАЗЫ ДАННЫХ
  async function getArrayClients() {
    let getClients = await fetch('http://localhost:3000/api/clients');
    let arrayClients = await getClients.json();
    return arrayClients;
  }
  // ОТРИСОВКА ТАБЛИЦЫ
  async function createTable() {
    clients = await getArrayClients();
    for (client of clients) {
      createContactTr(client);
    }
  }
  createTable()

  // СОЗДАНИЕ СТРОКИ С КЛИЕНТОМ
  function createContactTr(clientInfo) {
    let trClient = document.createElement('tr');
    trClient.classList.add('trClient');
    let tdId = document.createElement('td');
    tdId.classList.add('tdId');
    tdId.textContent = clientInfo.id;
    let SNL = [clientInfo.surname + ' ' + clientInfo.name + ' ' + clientInfo.lastName]
    let tdSNL = document.createElement('td');
    tdSNL.classList.add('tdSNL');
    tdSNL.textContent = SNL;
    let tdDateCreate = document.createElement('td');
    tdDateCreate.classList.add('tdDateCreate');
    let dateCreate = new Date(clientInfo.createdAt).toLocaleDateString();
    let timeCreate = new Date(clientInfo.createdAt).toLocaleTimeString().slice(0, -3);
    let dateCreateSpan = document.createElement('span');
    dateCreateSpan.classList.add('dateCreateSpan');
    dateCreateSpan.textContent = dateCreate;
    let timeCreateSpan = document.createElement('span');
    timeCreateSpan.classList.add('timeCreateSpan');
    timeCreateSpan.textContent = timeCreate;
    tdDateCreate.append(dateCreateSpan);
    tdDateCreate.append(timeCreateSpan);
    let tdDateChange = document.createElement('td');
    tdDateChange.classList.add('tdDateChange');
    let dateChange = new Date(clientInfo.updatedAt).toLocaleDateString();
    let timeChange = new Date(clientInfo.updatedAt).toLocaleTimeString().slice(0, -3);
    let dateChangeSpan = document.createElement('span');
    dateChangeSpan.classList.add('dateChangeSpan');
    dateChangeSpan.textContent = dateChange;
    let timeChangeSpan = document.createElement('span');
    timeChangeSpan.classList.add('timeChangeSpan');
    timeChangeSpan.textContent = timeChange;
    tdDateChange.append(dateChangeSpan);
    tdDateChange.append(timeChangeSpan);
    let tdContacts = document.createElement('td');
    tdContacts.classList.add('tdContacts');
    //
    for (i = 0; i < clientInfo.contacts.length; i++) {
      let tooltipSpan = document.createElement('span');
      tooltipSpan.classList.add('tooltip');
      if (i > 3) {
        tooltipSpan.classList.add('tooltipHidden');
        tooltipSpan.setAttribute('data-id', clientInfo.id);
      }
      if (clientInfo.contacts[i].type.includes('Телефон')) {
        tooltipSpan.classList.add('tooltipPhone')
        tdContacts.append(tooltipSpan);
        tippy(tooltipSpan, {
          content: 'Телефон: ' + clientInfo.contacts[i].value,
          arrow: true,
          theme: "default",
        })
      };
      if (clientInfo.contacts[i].type.includes('Vk')) {
        tooltipSpan.classList.add('tooltipVk')
        tdContacts.append(tooltipSpan);
        tippy(tooltipSpan, {
          content: 'Vk: ' + clientInfo.contacts[i].value,
          arrow: true,
          theme: "default",
        })
      };
      if (clientInfo.contacts[i].type.includes('Facebook')) {
        tooltipSpan.classList.add('tooltipFb')
        tdContacts.append(tooltipSpan);
        tippy(tooltipSpan, {
          content: 'Facebook: ' + clientInfo.contacts[i].value,
          arrow: true,
          theme: "default",
        })
      };
      if (clientInfo.contacts[i].type.includes('Email')) {
        tooltipSpan.classList.add('tooltipEmail')
        tdContacts.append(tooltipSpan);
        tippy(tooltipSpan, {
          content: 'Email: ' + clientInfo.contacts[i].value,
          arrow: true,
          theme: "default",
        })
      };
      if (clientInfo.contacts[i].type.includes('Другое')) {
        tooltipSpan.classList.add('tooltipOther')
        tdContacts.append(tooltipSpan);
        tippy(tooltipSpan, {
          content: clientInfo.contacts[i].value,
          arrow: true,
          theme: "default",
        })
      };
    };
    btnOpenTooltips = document.createElement('button');
    btnOpenTooltips.classList.add('btnOpenTooltips');
    btnOpenTooltips.textContent = '+' + (clientInfo.contacts.length - 4);
    if (clientInfo.contacts.length > 4) {
      tdContacts.append(btnOpenTooltips);
      btnOpenTooltips.setAttribute('data-id', clientInfo.id);
      btnOpenTooltips.addEventListener('click', function () {
        this.style.display = 'none';
        let tooltipsHidden = document.querySelectorAll('.tooltipHidden[data-id="' + this.dataset.id + '"]');
        for (tooltipHidden of tooltipsHidden) {
          tooltipHidden.classList.remove('tooltipHidden');
        }
      })
    }
    let tdActions = document.createElement('td');
    tdActions.classList.add('tdActions');
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    deleteButton.setAttribute('data-id', clientInfo.id);
    deleteButton.innerHTML = '<img src="./img/кнопкаУдалить.png" alt="">';
    deleteButton.innerHTML += 'Удалить';
    let changeButton = document.createElement('button');
    changeButton.classList.add('changeButton');
    changeButton.setAttribute('data-id', clientInfo.id);
    changeButton.innerHTML = '<img src="./img/кнопкаИзменить.png" alt="">';
    changeButton.innerHTML += 'Изменить';
    deleteButton.addEventListener('click', async function () {
      if (confirm('Вы уверены?')) {
        await deleteClient(this.dataset.id);
      }
      removeAllTr();
      await createTable();
    })
    // ОТКРЫТИЕ ФОРМЫ ИЗМЕНЕНИЯ
    changeButton.addEventListener('click', async function () {
      window.scrollTo(pageXOffset, 0);
      changeClientDiv.classList.toggle('changeClientDivOpen');
      
      blackout.classList.add('blackout');
      const response = await fetch('http://localhost:3000/api/clients/' + this.dataset.id);
      const changingClient = await response.json();
      btnSaveChange.setAttribute('data-id', changingClient.id);
      changingId.textContent = 'ID: ' + changingClient.id;
      changeInputSurname.value = changingClient.surname;
      changeInputName.value = changingClient.name;
      changeInputLastname.value = changingClient.lastName;
      for (i = 0; i < changingClient.contacts.length; i++) {
        //////
        const contactForm = createNewSelect();
        const contactsDivChange = document.getElementById('contactsDivChange');
        contactForm.children[0].children[0].textContent = changingClient.contacts[i].type;
        contactForm.children[1].value = changingClient.contacts[i].value;
        contactsDivChange.append(contactForm);
        defaultSelect();
      }
      btnDeleteChange = document.getElementById('btnDeleteChange');
      btnDeleteChange.setAttribute('data-id', changingClient.id);
      btnDeleteChange.addEventListener('click', async function () {
        if (confirm('Вы уверены?')) {
          await deleteClient(this.dataset.id);
        }
        removeAllTr();
        await createTable();
        changeClientDiv.classList.remove('changeClientDivOpen');
        onCloseModal()
      })
    })
    tdActions.append(changeButton);
    tdActions.append(deleteButton);
    trClient.append(tdId);
    trClient.append(tdSNL);
    trClient.append(tdDateCreate);
    trClient.append(tdDateChange);
    trClient.append(tdContacts);
    trClient.append(tdActions);
    tbody.append(trClient);
  }
  // КНОПКА СОХРАНЕНИЯ В ФОРМЕ ИЗМЕНЕНИЯ
  btnSaveChange.addEventListener('click', async e => {
    e.preventDefault();
    if ((changeInputSurname.value.length > 1)
        & (changeInputName.value.length > 1)
        & (changeInputLastname.value.length > 1)) {
      clientId = btnSaveChange.getAttribute('data-id');
      // Функция изменения клиента
      let contactsList = []
      allContacts = document.querySelectorAll('.contactForm');
      for (contact of allContacts) {
        let typeValueContact = {};
        typeValueContact.type = contact.children[0].children[0].children[0].textContent;
        typeValueContact.value = contact.children[1].value;
        contactsList.push(typeValueContact)
      }
      const response = await fetch('http://localhost:3000/api/clients/' + clientId, {
        method: 'PATCH',
        body: JSON.stringify({
          name: changeInputName.value,
          surname: changeInputSurname.value,
          lastName: changeInputLastname.value,
          contacts: contactsList,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        getClient = await fetch('http://localhost:3000/api/clients/' + clientId);
        client = await getClient.json();
        const arrayId = arrayForSort.map(el => el.id)
        let index = arrayId.indexOf(clientId);
        arrayForSort.splice(index, 1, client)
        changeClientDiv.classList.remove('changeClientDivOpen');
        removeAllTr();
        await createTable();
        onCloseModal();
      } else {
        validatorChange.textContent = 'Возникла ошибка. Тип ошибки: ' + response.status;
      }
    } else {
      if ((changeInputSurname.value.length < 2) || (changeInputSurname.value.length > 30)) {
        changeInputSurname.classList.add('errorInput');
        errorSpanSurnameChange.classList.add('errorSpanActive');
        errorSpanSurnameChange.textContent = 'Допустимое количество символов от 2 до 30';
        changeInputSurname.addEventListener('input', function () { if (changeInputSurname.value.length > 1) { clearErrorSpanSurnameInChange() } })
      }
      if ((changeInputName.value.length < 2) || (changeInputName.value.length > 30)) {
        changeInputName.classList.add('errorInput');
        errorSpanNameChange.classList.add('errorSpanActive');
        errorSpanNameChange.textContent = 'Допустимое количество символов от 2 до 30';
        changeInputName.addEventListener('input', function () { if (changeInputName.value.length > 1) { clearErrorSpanNameInChange() } })
      }
      if ((changeInputLastname.value.length < 2) || (changeInputLastname.value.length > 30)) {
        changeInputLastname.classList.add('errorInput');
        errorSpanLastnameChange.classList.add('errorSpanActive');
        errorSpanLastnameChange.textContent = 'Допустимое количество символов от 2 до 30';
        changeInputLastname.addEventListener('input', function () { if (changeInputLastname.value.length > 1) { clearErrorSpanLastnameInChange() } })
      }
    }
  })
  // ДОБАВЛЕНИЕ КОНТАКТА В ФОРМЕ ИЗМЕНЕНИЯ
  btnAddContactChange.addEventListener('click', function () {
    const contactsDivChange = document.getElementById('contactsDivChange');
    if (document.querySelectorAll('.contactForm').length < 9) {
      const contactForm = createNewSelect();
      contactsDivChange.append(contactForm);
      defaultSelect();
    } else {
      const contactForm = createNewSelect();
      contactsDivChange.append(contactForm);
      defaultSelect();
      this.style.display = 'none';
    }
  });
  // ДОБАВЛЕНИЕ КОНТАКТА В ФОРМЕ СОЗДАНИЯ
  btnAddContactCreate.addEventListener('click', function () {
    const contactsDivCreate = document.getElementById('contactsDivCreate');
    if (document.querySelectorAll('.contactForm').length < 9) {
      const contactForm = createNewSelect();
      contactsDivCreate.append(contactForm);
      defaultSelect();
    } else {
      const contactForm = createNewSelect();
      contactsDivCreate.append(contactForm);
      defaultSelect();
      this.style.display = 'none';
    }
  });
  // КНОПКА ЗАКРЫТЬ В ФОРМЕ ИЗМЕНЕНИЯ
  closeBtnInFormChange.addEventListener('click', function () {
    changeClientDiv.classList.remove('changeClientDivOpen');
    onCloseModal()
    clearErrorSpanSurnameInChange();
    clearErrorSpanNameInChange();
    clearErrorSpanLastnameInChange();
    btnAddContactChange.style.display = 'block';
  })
  // КНОПКИ ЗАКРЫТЬ В ФОРМЕ СОЗДАНИЯ
  buttonClose.addEventListener('click', function () {
    newClientDiv.classList.remove('newClientDivOpen');
    onCloseModal();
    clearInputsInCreate();
    clearErrorSpanSurnameInCreate();
    clearErrorSpanNameInCreate();
    clearErrorSpanLastnameInCreate();
    btnAddContactCreate.style.display = 'block';
  })
  const closeBtnInFormCreate = document.getElementById('closeBtnInFormCreate');
  closeBtnInFormCreate.addEventListener('click', function () {
    newClientDiv.classList.remove('newClientDivOpen');
    onCloseModal()
    clearInputsInCreate();
    clearErrorSpanSurnameInCreate();
    clearErrorSpanNameInCreate();
    clearErrorSpanLastnameInCreate();
    btnAddContactCreate.style.display = 'block';
  })
  // УДАЛЕНИЕ ФОРМ КОНТАКТА ПРИ ЗАКРЫТИИ МОДАЛЬНОГО ОКНА
  function onCloseModal() {
    blackout.classList.remove('blackout');
    let allContactForm = document.querySelectorAll('.contactForm');
    allContactForm.forEach(form => form.remove());
  }
  // ОЧИЩЕНИЕ ИНПУТОВ ПРИ ЗАКРЫТИИ МОДАЛЬНОГО ОКНА
  function clearInputsInCreate() {
    inputSurname.value = '';
    inputName.value = '';
    inputLastname.value = '';
    validatorCreate.textContent = '';
  }
  // ФУНКЦИИ СБРОСА ВАЛИДАЦИИ ПРИ ЗАКРЫТИИ МОДАЛЬНЫХ ОКОН
  function clearErrorSpanSurnameInCreate() {
    inputSurname.classList.remove('errorInput');
    errorSpanSurnameCreate.classList.remove('errorSpanActive');
    errorSpanSurnameCreate.textContent = '';
  }
  function clearErrorSpanNameInCreate() {
    inputName.classList.remove('errorInput');
    errorSpanNameCreate.classList.remove('errorSpanActive');
    errorSpanNameCreate.textContent = '';
  }
  function clearErrorSpanLastnameInCreate() {
    inputLastname.classList.remove('errorInput');
    errorSpanLastnameChange.classList.remove('errorSpanActive');
    errorSpanLastnameChange.textContent = '';
  }
  function clearErrorSpanSurnameInChange() {
    changeInputSurname.classList.remove('errorInput');
    errorSpanSurnameChange.classList.remove('errorSpanActive');
    errorSpanSurnameChange.textContent = '';
  }
  function clearErrorSpanNameInChange() {
    changeInputName.classList.remove('errorInput');
    errorSpanNameChange.classList.remove('errorSpanActive');
    errorSpanNameChange.textContent = '';
  }
  function clearErrorSpanLastnameInChange() {
    changeInputLastname.classList.remove('errorInput');
    errorSpanLastnameChange.classList.remove('errorSpanActive');
    errorSpanLastnameChange.textContent = '';
  }
  // УДАЛЕНИЕ КЛИЕНТА
  async function deleteClient(id) {
    const response = await fetch('http://localhost:3000/api/clients/' + id, {
      method: 'DELETE',
    });
    if (response.ok) {
      const arrayId = arrayForSort.map(el => el.id)
      let index = arrayId.indexOf(id);
      arrayForSort.splice(index, 1)
    }
  }

  // ПОИСК
  async function filtered() {
    removeAllTr();
    const response = await fetch(`http://localhost:3000/api/clients?search=${headerInput.value}`, {
      method: 'GET',
    });
    const filteredArrayClients = await response.json();
    for (client of filteredArrayClients) {
      createContactTr(client);
    }
  }
  let delay;
  function filteredWithTimeout() {
    clearTimeout(delay);
    delay = null;
    if (!delay) {
      delay = setTimeout(filtered, 300)
    }
  }
  headerInput.addEventListener('input', filteredWithTimeout)
  // СОЗДАЁМ МАССИВ ДЛЯ ЗАПИСИ ВСЕХ ИЗМЕНЕНИЙ БЕЗ ОБНОВЛЕНИЯ СТРАНИЦЫ
  async function pushArrayForSort() {
    clients = await getArrayClients();
    for (client of clients) {
      arrayForSort.push(client)
    }
  }
  pushArrayForSort()
  arrayForSort = [];
  // ФУНКЦИЯ КНОПОК СОРТИРОВКИ
  async function Sort() {
    let btnSortId = document.getElementById('btnSortId');
    let btnSortSNM = document.getElementById('btnSortSNM');
    let btnSortDate = document.getElementById('btnSortDate');
    let btnSortChange = document.getElementById('btnSortChange');
    const clients = arrayForSort;
    const sortId = (function () {
      let flag = true,
        predicates = {
          'asc': function (a, b) {
            btnSortId.classList.remove('btnSortRotate');
            return (a.id > b.id) - (b.id > a.id)
          },
          'desc': function (a, b) {
            btnSortId.classList.add('btnSortRotate');
            return (a.id < b.id) - (b.id < a.id)
          }
        }
      return function () {
        flag = !flag // который при каждом вызове переключаем
        clients.sort(predicates[flag ? 'asc' : 'desc'])
        // и сортируем в зависимости от его значения
        removeAllTr();
        for (client of clients) { createContactTr(client) }
      }
    }())
    const sortSNM = (function () {
      let flag = true,
        predicates = {
          'asc': function (a, b) {
            btnSortSNM.classList.add('btnSortRotate');
            if (a.surname.toUpperCase() === b.surname.toUpperCase()) {
              return (a.name.toUpperCase() > b.name.toUpperCase()) - (b.name.toUpperCase() > a.name.toUpperCase());
            }
            return (a.surname.toUpperCase() > b.surname.toUpperCase()) - (b.surname.toUpperCase() > a.surname.toUpperCase());
          },
          'desc': function (a, b) {
            btnSortSNM.classList.remove('btnSortRotate');
            if (a.surname.toUpperCase() === b.surname.toUpperCase()) {
              return (a.name.toUpperCase() < b.name.toUpperCase()) - (b.name.toUpperCase() < a.name.toUpperCase())
            }
            return (a.surname.toUpperCase() < b.surname.toUpperCase()) - (b.surname.toUpperCase() < a.surname.toUpperCase())
          }
        }
      return function () {
        flag = !flag // который при каждом вызове переключаем
        clients.sort(predicates[flag ? 'desc' : 'asc'])
        // и сортируем в зависимости от его значения
        removeAllTr();
        for (client of clients) { createContactTr(client) }
      }
    }())
    const sortDate = (function () {
      let flag = true,
        predicates = {
          'asc': function (a, b) {
            btnSortDate.classList.add('btnSortRotate');
            return (a.createdAt > b.createdAt) - (b.createdAt > a.createdAt)
          },
          'desc': function (a, b) {
            btnSortDate.classList.remove('btnSortRotate');
            return (a.createdAt < b.createdAt) - (b.createdAt < a.createdAt)
          }
        }
      return function () {
        flag = !flag // который при каждом вызове переключаем
        clients.sort(predicates[flag ? 'desc' : 'asc'])
        // и сортируем в зависимости от его значения
        removeAllTr();
        for (client of clients) { createContactTr(client) }
      }
    }())
    const sortChange = (function () {
      let flag = true,
        predicates = {
          'asc': function (a, b) {
            btnSortChange.classList.add('btnSortRotate');
            return (a.updatedAt > b.updatedAt) - (b.updatedAt > a.updatedAt)
          },
          'desc': function (a, b) {
            btnSortChange.classList.remove('btnSortRotate');
            return (a.updatedAt < b.updatedAt) - (b.updatedAt < a.updatedAt)
          }
        }
      return function () {
        flag = !flag // который при каждом вызове переключаем
        clients.sort(predicates[flag ? 'desc' : 'asc'])
        // и сортируем в зависимости от его значения
        removeAllTr();
        for (client of clients) { createContactTr(client) }
      }
    }())
    btnSortId.addEventListener('click', sortId)
    btnSortSNM.addEventListener('click', sortSNM)
    btnSortDate.addEventListener('click', sortDate)
    btnSortChange.addEventListener('click', sortChange);
  }
  Sort();
  // УДАЛЕНИЕ ВСЕХ СТРОЧЕК
  function removeAllTr() {
    let removeTr = document.querySelectorAll('.trClient');
    removeTr.forEach(e => e.remove());
  }
  // АКТИВАЦИЯ ВЫПАДАЮЩЕГО СПИСКА КОНТАКТОВ
  const defaultSelect = () => {
    const elements = document.querySelectorAll('.select');
    elements.forEach(el => {
      const choices = new Choices(el, {
        searchEnabled: false,
        shouldSort: false
      });
    })
  }
  // СОЗДАНИЕ ВЫПАДАЮЩЕГО СПИСКА КОНТАКТОВ
  function createNewSelect() {
    const contactForm = document.createElement('div');
    contactForm.classList.add('contactForm');
    const typeOfContacts = document.createElement('select');
    typeOfContacts.classList.add('select');
    const optionOne = document.createElement('option');
    optionOne.textContent = 'Телефон';
    const optionTwo = document.createElement('option');
    optionTwo.textContent = 'Другое';
    const optionThree = document.createElement('option');
    optionThree.textContent = 'Email';
    const optionFour = document.createElement('option');
    optionFour.textContent = 'Vk';
    const optionFive = document.createElement('option');
    optionFive.textContent = 'Facebook';
    typeOfContacts.append(optionOne, optionTwo, optionThree, optionFour, optionFive);
    contactForm.append(typeOfContacts);
    const contactsInput = document.createElement('input');
    contactsInput.classList.add('contactsInput');
    contactsInput.placeholder = 'Введите данные контакта';
    contactForm.append(contactsInput);
    const btnCloseFormContact = document.createElement('button');
    btnCloseFormContact.classList.add('btnCloseFormContact');
    contactForm.append(btnCloseFormContact);
    contactsInput.addEventListener('input', function () {
      if (contactsInput.previousSibling.children[0].children[0].textContent === 'Телефон') {
        this.setAttribute('type', 'tel');
        var selector = document.querySelectorAll("input[type='tel']");
        var im = new Inputmask("+7(999)999-99-99");
        im.mask(selector);
      }
    })
    btnCloseFormContact.addEventListener('click', function () {
      this.parentNode.remove()
      if (document.querySelectorAll('.contactForm').length === 9) {
          btnAddContactChange.style.display = 'block';
          btnAddContactCreate.style.display = 'block';
      }
    })
    return contactForm;
  }
})