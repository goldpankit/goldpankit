<template>
  <div class="grid">
    <ComponentWrap>
      <Input v-if="component.type === 'input'" :style="component.style"/>
      <Form v-if="component.type === 'form'" :style="component.style">
        <template v-if="component.children != null && component.children.length > 0">
          <Grid v-for="subComponent in component.children" :component="subComponent"/>
        </template>
      </Form>
    </ComponentWrap>
  </div>
</template>

<script>
import Form from "./pc/Form.vue";
import Input from "./pc/Input.vue";
import ComponentWrap from "./ComponentWrap.vue";

export default {
  name: "Grid",
  components: {ComponentWrap, Input, Form},
  props: {
    component: {
      required: true
    }
  }
}
</script>

<style scoped>

</style>
