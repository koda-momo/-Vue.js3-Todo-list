<template>
  <div class="all">
    <div class="collapse" id="navbarToggleExternalContent">
      <div class="bg-dark p-4">
        <h5 class="text-white h4">menu</h5>
        <span class="text-muted">
          <ul>
            <li><router-link to="/">top</router-link></li>
            <li><router-link to="/todoList">todoList</router-link></li>
            <li><router-link to="/kakeibo">kakeibo</router-link></li>
          </ul>
        </span>
      </div>
    </div>
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggleExternalContent"
          aria-controls="navbarToggleExternalContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>

<style scoped>
.all {
  width: 100%;
}

.container-fluid {
  padding-left: 950px;
}

.bg-dark {
  background-color: rgb(255, 160, 160) !important;
}
</style>
