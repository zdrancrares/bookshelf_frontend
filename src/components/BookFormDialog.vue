<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="isEdit ? 'Edit Book' : 'Add New Book'"
    :style="{ width: '480px' }"
    modal
    :draggable="false"
  >
    <form class="book-form" @submit.prevent="handleSubmit">
      <div class="field">
        <label>Title *</label>
        <InputText v-model="form.title" placeholder="Enter book title" class="w-full" />
        <small class="error" v-if="errors.title">{{ errors.title }}</small>
      </div>
      <div class="field">
        <label>Author *</label>
        <InputText v-model="form.author" placeholder="Author name" class="w-full" />
        <small class="error" v-if="errors.author">{{ errors.author }}</small>
      </div>
      <div class="field-row">
        <div class="field" style="flex:1">
          <label>Price *</label>
          <InputNumber v-model="form.price" placeholder="0.00" :min="0" :max-fraction-digits="2" class="w-full" prefix="$" />
          <small class="error" v-if="errors.price">{{ errors.price }}</small>
        </div>
        <div class="field" style="flex:1">
          <label>Genre</label>
          <Select v-model="form.genre" :options="genres" placeholder="Select genre" class="w-full" />
        </div>
      </div>
    </form>

    <template #footer>
      <Button label="Cancel" text @click="$emit('update:visible', false)" />
      <Button
        :label="isEdit ? 'Save Changes' : 'Add Book'"
        :icon="isEdit ? 'pi pi-check' : 'pi pi-plus'"
        :loading="loading"
        @click="handleSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Button from 'primevue/button'

const props = defineProps({
  visible: Boolean,
  book: { type: Object, default: null },
  loading: Boolean
})

const emit = defineEmits(['update:visible', 'submit'])

const genres = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'TECHNOLOGY']

const isEdit = computed(() => !!props.book)

const emptyForm = () => ({ title: '', author: '', price: null, genre: null })
const form = ref(emptyForm())
const errors = ref({})

watch(() => props.visible, (val) => {
  if (val) {
    form.value = props.book
      ? { title: props.book.title, author: props.book.author, price: props.book.price, genre: props.book.genre }
      : emptyForm()
    errors.value = {}
  }
})

function validate() {
  errors.value = {}
  if (!form.value.title?.trim()) errors.value.title = 'Title is required'
  if (!form.value.author?.trim()) errors.value.author = 'Author is required'
  if (!form.value.price || form.value.price <= 0) errors.value.price = 'Price must be positive'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', { ...form.value })
}
</script>

<style scoped>
.book-form { display: flex; flex-direction: column; gap: 16px; padding: 8px 0; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-row { display: flex; gap: 16px; }
label { font-size: 13px; font-weight: 500; color: var(--text2); }
.error { color: #ef4444; font-size: 12px; }
.w-full { width: 100%; }
</style>
