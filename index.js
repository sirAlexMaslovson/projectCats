/* eslint-disable no-restricted-globals */
/* eslint-disable camelcase */

const $wr = document.querySelector('[data-wr]')
const $openModalButton = document.querySelector('[data-open_modal]')
const $modalWr = document.querySelector('[data-modals_wr]')
const $modalClose = document.querySelector('[data-modals_close]')
const $dataId = document.querySelector('[data-form_id]')
const $dataName = document.querySelector('[data-form_name]')

const generateCard = (post) => `
 <div data-card_id=${post.id} class="card my-2" style="width: 18rem;">
  <img src="${post.img_link}" class="card-img-top" alt="${post.name}">
  <div class="card-body">
    <h5 class="card-title">${post.name}</h5>
    <p class="card-text">${post.description}</p>
    <a data-action="show" class="btn bg-success">Show</a>
    <a data-action="edit" class="btn btn-primary">Edit</a>
    <a data-action="delete" class="btn btn-danger">Delete</a>
  </div>
</div>
`

const generateModalDataCard = (post) => `
<div data-card_id=${post.id} class="modal-wr">
    <div class="custom-modal bg-success position-relative">
    
      <div class="card" style="width: 18rem;">
        <img src="${post.img_link}" class="card-img-top" alt="${post.name}">
        <form name="add_cat_info" id="formDataInfo">
                <div class="mb-3 d-flex">
                <h2>Id:</h2>
                    <input placeholder="Id" readonly data-form_id required name="id" type="number" class="form-control bg-secondary text-dark bg-opacity-25 text-center" id="exampleInputEmail1"
                        aria-describedby="emailHelp" value="${post.id}">
                </div>
                <div class="mb-3 d-flex">
                <h5>Имя:</h5>
                    <input placeholder="Name" data-form_name required name="name" type="text" class="form-control text-center" id="exampleInputEmail2"
                        aria-describedby="emailHelp" value="${post.name}">
                </div>
                <div class="mb-3 d-flex">
                <h5>Возраст:</h5>
                    <input placeholder="Age" required data-form_age name="age" type="number" min="0" max="21" class="form-control" id="exampleInputEmail6"
                        aria-describedby="emailHelp" value="${post.age}">
                </div>
                <div class="mb-3 d-flex">
                <h5>Рейтинг:</h5>
                    <input placeholder="Rate" data-form_rate name="rate" type="number" min="0" max="10" class="form-control" id="exampleInputEmail3"
                        aria-describedby="emailHelp" value="${post.rate}">
                </div>
                <div class="mb-3 input-group d-flex">
                <h5>Описание:</h5>
                        <textarea placeholder="Description" data-form_description name="description" type="text" class="form-control" aria-label="With textarea">${post.description}</textarea>
                </div>
                <div class="mb-3 d-flex">
                    <input type="checkbox" data-form_favorite name="favorite" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1" value="${post.favorite}">favorite</label>
                </div>
                <div class="mb-3 input-group d-flex">
                <h5>Img:</h5>
                        <textarea placeholder="Picture link" data-form_img name="img_link" type="text" class="form-control" aria-label="With textarea">${post.img_link}</textarea>
                </div>
                <button data-action="close_card" class="btn btn-danger position-absolute bottom-0 end-0">X</button>
                <button name="add_cat_in" data-action="edit_card" class="btn btn-primary position-absolute bottom-0 start-0">Принять изм.</button>
                <button data-action="delete_card" class="btn btn-danger position-absolute bottom-0 start-50">Удалить</button>     
    </div>
</div>
`

class API {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async getAllCats() {
    try {
      const response = await fetch(`${this.baseUrl}/show`)
      return response.json()
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteCat(catId) {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${catId}`, {
        method: 'DELETE',
      })
      console.log(response)
    } catch (error) {
      throw new Error(error)
    }
  }

  async addCat(data) {
    try {
      const response = await fetch(`${this.baseUrl}/add`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      console.log(response)
    } catch (error) {
      throw new Error(error)
    }
  }

  async editCat(catId, data) {
    try {
      // eslint-disable-next-line no-undef
      const response = await fetch(`${this.baseUrl}/update/${catId}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      console.log(response)
    } catch (error) {
      throw new Error(error)
    }
  }

  async getCatById(catId) {
    try {
      const response = await fetch(`${this.baseUrl}/show/${catId}`)
      return response.json()
    } catch (error) {
      throw new Error(error)
    }
  }
}

const api = new API('http://sb-cats.herokuapp.com/api/2/sirAlexMaslovson')
api.getAllCats().then((responsFromBackEnd) => {
  responsFromBackEnd.data.forEach((cat) => $wr.insertAdjacentHTML('beforeend', generateCard(cat)))
})

$wr.addEventListener('click', (event) => {
  // eslint-disable-next-line default-case
  switch (event.target.dataset.action) {
    case 'delete': {
      const $cardWr = event.target.closest('[data-card_id]')
      const catId = $cardWr.dataset.card_id
      api.deleteCat(catId).then(() => {
        $cardWr.remove()
      }).catch(() => { })
      break
    }

    case 'edit': {
      $modalWr.classList.remove('hidden')
      $dataId.remove()
      $dataName.remove()
      const $cardWr = event.target.closest('[data-card_id]')
      const catId = $cardWr.dataset.card_id

      document.forms.add_cat.addEventListener('submit', (event_edit) => {
        event_edit.preventDefault()
        const data = Object.fromEntries(new FormData(event_edit.target).entries())

        data.rate = Number(data.rate)
        data.favorite = data.favorite === 'on'

        api.editCat(catId, data).then(() => {
          $modalWr.classList.add('hidden')
          location.reload()
        }).catch(alert)
      })
      break
    }
    case 'show': {
      const $cardWr = event.target.closest('[data-card_id]')
      const catId = $cardWr.dataset.card_id
      api.getCatById(catId).then((post) => {
        $wr.insertAdjacentHTML('beforeend', generateModalDataCard(post.data))
      })
      break
    }

    default:
      break
  }
})

document.forms.add_cat.addEventListener('submit', (event) => {
  event.preventDefault()
  const data = Object.fromEntries(new FormData(event.target).entries())
  data.id = Number(data.id)
  data.rate = Number(data.rate)
  data.favorite = data.favorite === 'on'
  api.addCat(data).then(() => {
    $wr.insertAdjacentHTML('beforeend', generateCard(data))
    $modalWr.classList.add('hidden')
    event.target.reset()
  }).catch(alert)
})

$openModalButton.addEventListener('click', () => {
  $modalWr.classList.remove('hidden')
})

$modalClose.addEventListener('click', () => {
  $modalWr.classList.add('hidden')
})

$wr.addEventListener('click', (event) => {
  console.log(event.target.dataset.action)
  // eslint-disable-next-line default-case
  switch (event.target.dataset.action) {
    case 'delete_card': {
      event.preventDefault()
      const $cardWr = event.target.closest('[data-card_id]')
      const catId = $cardWr.dataset.card_id
      api.deleteCat(catId).then(() => {
        $cardWr.remove()
        location.reload()
      }).catch(() => { })
      break
    }
    case 'edit_card': {
      event.preventDefault()
      const $cardWr = event.target.closest('[data-card_id]')
      const catId = $cardWr.dataset.card_id
      console.log(catId)

      const form = document.getElementById('formDataInfo')
      const name = form.querySelector('[data-form_name]')
      const id = form.querySelector('[data-form_id]')
      const rate = form.querySelector('[data-form_rate]')
      const age = form.querySelector('[data-form_age]')
      const description = form.querySelector('[data-form_description]')
      const img_link = form.querySelector('[data-form_img]')

      const data = {
        id: id.value,
        name: name.value,
        rate: rate.value,
        age: age.value,
        description: description.value,
        img_link: img_link.value,
      }

      data.rate = Number(data.rate)
      data.favorite = data.favorite === 'on'

      document.forms.add_cat_info.addEventListener('keypress', () => data)

      const $buttonWr = document.querySelector('[name="add_cat_in"]')

      $buttonWr.onclick = (function buttonClick() {
        api.editCat(catId, data).then(() => {
          location.reload()
        }).catch(alert)
      }())
    }
  }
})

const rawFormDataFromLS = localStorage.getItem(document.forms.add_cat.name)
const formDataFromLS = rawFormDataFromLS ? JSON.parse(rawFormDataFromLS) : undefined

if (formDataFromLS) {
  Object.keys(formDataFromLS).forEach((key) => {
    document.forms.add_cat[key].value = formDataFromLS[key]
  })
}

document.forms.add_cat.addEventListener('input', () => {
  const formDataObj = Object.fromEntries(new FormData(document.forms.add_cat).entries())
  localStorage.setItem(document.forms.add_cat.name, JSON.stringify(formDataObj))
})
