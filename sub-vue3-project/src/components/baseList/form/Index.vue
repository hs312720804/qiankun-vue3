<template>
  <div>
    <ApiForm :value="value.apiJson" :menu="value"></ApiForm>
    <FieldForm :value="value.fieldsJson"></FieldForm>
    <ExtraForm :value="value.extraJson" :menu="value"></ExtraForm>
  </div>
</template>

<script>
import ApiForm from '../../formResource/components/ApiForm.vue'
import FieldForm from '../../formResource/components/FieldForm.vue'
import ExtraForm from '../../formResource/components/ExtraForm.vue'

export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ApiForm,
    FieldForm,
    // AdvanceForm,
    ExtraForm
  },
  created () {
  }
}
</script>

<style>

</style>
