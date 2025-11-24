<template>
  <q-page class="q-pa-md">

    <div class="q-gutter-md">

      <q-input
        v-model="searchQuery"
        label="Unesi pojam za pretraživanje"
        outlined
        clearable
      />

      <q-option-group
        v-model="searchBy"
        :options="searchOptions"
        type="radio"
        inline
      />

      <q-btn
        label="Traži"
        color="primary"
        @click="searchBooks"
      />

    </div>

    <q-table
      :rows="filteredBooks"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="q-mt-md bg-white shadow-2 rounded-borders"
      :pagination="{ rowsPerPage: 5 }"
      wrap-cells
    >
      <template v-slot:body-cell-slika="props">
        <q-td :props="props">
          <q-img
            :src="props.row.slika"
            alt="slika knjige"
            style="width: 60px; height: 90px; object-fit: cover; border-radius: 4px;"
          />
        </q-td>
      </template>
    </q-table>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const rows = ref([])
const filteredBooks = ref([])
const searchQuery = ref('')
const searchBy = ref('naslov')

const searchOptions = [
  { label: 'Po naslovu', value: 'naslov' },
  { label: 'Po autoru', value: 'autor' }
]

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    style: { width: '50px' }
  },
  {
    name: 'slika',
    label: 'Slika',
    field: 'slika',
    align: 'center',
    style: { width: '70px' }
  },
  {
    name: 'naslov',
    label: 'Naslov',
    field: 'naslov',
    align: 'left',
    style: { width: '180px', wordBreak: 'break-word' }
  },
  {
    name: 'autor',
    label: 'Autor',
    field: 'autor',
    align: 'left',
    style: { width: '140px', wordBreak: 'break-word' }
  }
]

async function loadBooks() {
  await axios.get('http://localhost:3000/api/knjiga')
    .then(result => {
      rows.value = result.data
      filteredBooks.value = [...rows.value]
    })
    .catch(error => {
      console.error('Greška pri dohvaćanju knjiga:', error)
    })
}

function searchBooks() {
  const query = searchQuery.value.toLowerCase()

  if (!query) {
    filteredBooks.value = [...rows.value]
    return
  }

  filteredBooks.value = rows.value.filter(book =>
    book[searchBy.value].toLowerCase().includes(query)
  )
}

onMounted(() => {
  loadBooks()
})
</script>

<style scoped>
.q-table {
  border-radius: 12px;
}
</style>