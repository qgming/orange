<template>
  <div class="searchBox">
    <input type="text" v-model="searchQuery" placeholder="搜索视频..." />
    <button @click="search">搜索</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const searchUrl = "https://zhuiyingmao5.com/vodsearch/-------------.html?wd=";


const search = () => {
  if (searchQuery.value === "") {
    alert('请输入内容！');
  } else {
    window.open(searchUrl + searchQuery.value);
  }
};

// 监听键盘点击事件
const handleKeydown = (event) => {
  if (event.key === "Enter") {
    search();
  }
};

// 绑定键盘事件
window.addEventListener('keydown', handleKeydown);
</script>

<style scoped>
.searchBox {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid orange;
  background-color: white;
  border-radius: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 1s ease-in-out;
  margin-top: 100px;
}

.searchBox:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

input {
  width: 600px;
  height: 40px;
  margin-left: 10px;
  font-size: 20px;
  flex: 1;
  border: none;
  outline: none;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 50px;
  margin-left: 10px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ff8c00;
}

@media screen and (max-width: 768px) {
  input {
    width: 260px;
    height: 40px;
  }
}
</style>