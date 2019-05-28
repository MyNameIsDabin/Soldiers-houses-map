<template>
  <div class="toolbar">
    <span>
      군 주택 특별공급 목록
    </span>
    <ion-icon name="arrow-dropup"></ion-icon>
  </div>
</template>
<script>
export default {
  name: 'Toolbar',
  data() {
    return {
    };
  }
}
</script>
<style scoped>
  .toolbar {
    display: flex;
    flex-basis: 60px;
    background-color: white;
    padding: 5px 20px;
    align-items: center;
    justify-content: space-between;
  }
</style>
