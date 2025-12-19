<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>Página No Encontrada 😟</h2>
      <p>
        Lo sentimos, la página que estás buscando no existe.
        Parece que te has perdido en el espacio.
      </p>

      <router-link to="/" class="home-link">
        Regresar al Inicio
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No necesita lógica en <script setup> a menos que uses un layout específico.
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 80vh; /* Asegura que ocupe casi toda la pantalla */
  padding: 20px;
  background-color: #f8f8f8;
}

.content {
  max-width: 600px;
  padding: 40px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 8em;
  margin-bottom: 0.1em;
  color: #dc3545; /* Color de error */
}

h2 {
  font-size: 2em;
  margin-top: 0;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 25px;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #0056b3;
}
</style>