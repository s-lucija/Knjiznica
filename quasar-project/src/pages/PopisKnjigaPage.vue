<template>
  <q-page class="q-pa-lg bg-grey-1">
    <h4 class="text-h5 text-primary text-center q-mb-md">
      Popis svih knjiga
    </h4>

    <q-table
      title="Knjige u knjižnici"
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      bordered
      separator="horizontal"
      :pagination="{ rowsPerPage: 5 }"
      class="bg-white shadow-2 rounded-borders"
      wrap-cells
    >
      <template v-slot:body-cell-slika="props">
        <q-td :props="props">
          <img
            :src="props.row.slika"
            alt="Slika knjige"
            style="width: 60px; height: auto; border-radius: 6px;"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.status.toLowerCase() === 'slobodna' ? 'green' : 'red'"
            text-color="white"
            size="sm"
          >
            {{ props.row.status }}
          </q-chip>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const rows = ref([])

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true,
    style: { width: '50px', fontSize: '14px', whiteSpace: 'nowrap' },
    headerStyle: { fontSize: '16px' }
  },
  {
    name: 'naslov',
    label: 'Naslov',
    field: 'naslov',
    align: 'left',
    sortable: true,
    style: {
      width: '180px',
      fontSize: '14px',
      whiteSpace: 'normal',
      wordBreak: 'break-word'
    },
    headerStyle: { fontSize: '16px' }
  },
  {
    name: 'autor',
    label: 'Autor',
    field: 'autor',
    align: 'left',
    sortable: true,
    style: {
      width: '140px',
      fontSize: '14px',
      whiteSpace: 'normal',
      wordBreak: 'break-word'
    },
    headerStyle: { fontSize: '16px' }
  },
  {
    name: 'opis',
    label: 'Opis',
    field: 'opis',
    align: 'left',
    style: {
      width: '300px',
      fontSize: '14px',
      whiteSpace: 'normal',
      wordBreak: 'break-word'
    },
    headerStyle: { fontSize: '16px' }
  },
  {
    name: 'slika',
    label: 'Slika',
    field: 'slika',
    align: 'center',
    style: { width: '70px' },
    headerStyle: { fontSize: '16px' }
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    style: { width: '90px', fontSize: '14px', whiteSpace: 'nowrap' },
    headerStyle: { fontSize: '16px' }
  }
]

onMounted(() => {
  loadBooks()
})

async function loadBooks() {
  try {
    const result = await axios.get('http://localhost:3000/api/knjiga')
    rows.value = result.data
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.q-table {
  border-radius: 12px;
}
</style>