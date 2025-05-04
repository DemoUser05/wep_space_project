<template>
  <div>
    <h1>Повідомлення з серверу:</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "MessageDisplay",
  data() {
    return {
      message: "", // Для зберігання отриманого повідомлення
    };
  },
  mounted() {
    // Виконання запиту при завантаженні компонента
    fetch("http://localhost:5000/api/message")
      .then((response) => response.json())
      .then((data) => {
        this.message = data.message; // Збереження повідомлення у змінній
      })
      .catch((error) => console.error("Помилка отримання даних:", error));
  },
};
</script>
