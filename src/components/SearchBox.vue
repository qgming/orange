<template>
  <div class="searchBox">
    <input type="text" v-model="searchQuery" placeholder="搜索视频..." />
    <button @click="search">搜索</button>
  </div>
  <div v-for="video in recommendedFilms" :key="video.name" class="aVideo">
    <img class="videoPoster" :src="video.poster" alt="海报" />
    <div>
      <p class="videoName">{{ video.name }}</p>
      <p class="videoDirector">导演: {{ video.director }}</p>
      <p class="videoActor">主演: {{ video.actor }}</p>
      <p class="videoTime">时间: {{ video.time }}</p>
      <p class="videoDouban">豆瓣评分: {{ video.douban }}</p>
      <p class="videoEvaluation">评价: {{ video.evaluation }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-03126c7e1f2747d5845e6671d71f2255',
  dangerouslyAllowBrowser: true // 添加此选项以允许在浏览器中使用
});

// const openai = new OpenAI({
//   baseURL: 'https://api.siliconflow.cn/v1/',
//   apiKey: 'sk-znrtcqyzubppaupfgqrvxdvqfpudactmikrymjcftvkrdwwr',
//   dangerouslyAllowBrowser: true // 添加此选项以允许在浏览器中使用
// });

async function toAi(message) {
  const completion = await openai.chat.completions.create({
    messages: message,
    // model: "Qwen/Qwen2-7B-Instruct",
    model: "deepseek-chat",
  });
  console.log(completion.choices[0].message.content);
  recommendedFilms.value = JSON.parse(completion.choices[0].message.content);
}

const prompt = ref('');

onMounted(async () => {
  try {
    const response = await fetch('../prompt/search.txt');
    if (!response.ok) {
      throw new Error('无法读取文件');
    }
    prompt.value = await response.text();
    allMessage.push({ role: "system", content: prompt.value });
  } catch (error) {
    console.error('读取文件时出错:', error);
  }
});

const allMessage = [];
const aiMessage = [];
const recommendedFilms = ref([]);


const searchQuery = ref('');
const searchUrl = 'https://lkvod.me/nk/-------------.html?wd=';


const search = async () => {
  if (searchQuery.value === "") {
    alert('请输入内容！');
  } else {
    allMessage.push({ role: "user", content: searchQuery.value });
    await toAi(allMessage);
  }
};

const handleKeydown = (event) => {
  if (event.key === "Enter") {
    search();
  }
};

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

.aVideo {
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.videoPoster {
  width: 160px;
  /* height: 240px; */
  border-radius: 12px;
  border: 1px solid white;
  margin-right: 15px;
}

.videoName {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 5px;
}

.videoDirector {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}

.videoActor {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}

.videoTime {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}

.videoDouban {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}

.videoEvaluation {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}

@media screen and (max-width: 768px) {
  input {
    width: 260px;
    height: 40px;
  }
}
</style>