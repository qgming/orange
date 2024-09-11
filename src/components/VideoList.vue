<template>
  <div class="videoList">
    <div class="section">
      <h3>官方频道</h3>
      <div class="cardContainer">
        <div v-for="video in officialChannels" :key="video.id" class="card" @click="goToUrl(video.url)">
          <img :src="getFavicon(video.url)" alt="logo" class="logo" />
          <a>{{ video.title }}</a>
        </div>
      </div>
    </div>
    <div class="section">
      <h3>免费频道</h3>
      <div class="cardContainer">
        <div v-for="video in freeChannels" :key="video.id" class="card" @click="goToUrl(video.url)">
          <img :src="getFavicon(video.url)" alt="logo" class="logo" />
          <a>{{ video.title }}</a>
        </div>
      </div>
    </div>
    <div class="section">
      <h3>友情链接</h3>
      <div class="cardContainer">
        <div v-for="link in friendLinks" :key="link.id" class="card" @click="goToUrl(link.url)">
          <img :src="getFavicon(link.url)" alt="logo" class="logo" />
          <a>{{ link.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const officialChannels = ref([
  { id: 1, title: '爱奇艺', url: 'https://www.iqiyi.com' },
  { id: 2, title: '腾讯视频', url: 'https://v.qq.com' },
  { id: 3, title: '优酷', url: 'https://www.youku.com' },
  { id: 4, title: '芒果TV', url: 'https://www.mgtv.com' },
  { id: 5, title: '哔哩哔哩', url: 'https://www.bilibili.com' },
  { id: 6, title: '乐视视频', url: 'https://www.le.com' },
  { id: 7, title: 'Netflix', url: 'https://www.netflix.com' },
  { id: 8, title: 'Amazon', url: 'https://www.amazon.com' },
  { id: 9, title: 'Disney+', url: 'https://www.disneyplus.com' },
  { id: 10, title: 'HBO Max', url: 'https://www.hbomax.com' },
  { id: 11, title: 'YouTube', url: 'https://www.youtube.com' },
  { id: 12, title: 'Hulu', url: 'https://www.hulu.com' },
  { id: 13, title: 'Apple TV+', url: 'https://www.apple.com/apple-tv-plus/' },
  { id: 14, title: 'Paramount+', url: 'https://www.paramountplus.com' },
  // 可以继续添加更多的官方频道链接
]);

const freeChannels = ref([
  { id: 1, title: '美益达影视', url: 'https://www.myd02.com' },
  { id: 2, title: '555电影', url: 'https://www.555dy1.com' },
  { id: 3, title: 'FreeOK', url: 'https://www.freeok.pro' },
  { id: 4, title: '低端影视', url: 'https://ddys.pro' },
  { id: 5, title: 'NO视频', url: 'https://www.novipnoad.com' },
  { id: 6, title: '狗番', url: 'https://www.dogsfun.fun' },
  { id: 7, title: '漫搜搜', url: 'https://msousou.vip/' },
  { id: 8, title: '悠云影视', url: 'https://yoyys1.com' },
  { id: 9, title: '可可影视', url: 'https://www.kkys3.com:51111//' },
  { id: 10, title: '追影猫', url: 'https://zhuiyingmao5.com' },
  { id: 11, title: '剧圈圈', url: 'https://www.jqqzx.cc' },
  { id: 12, title: 'HDmoli', url: 'https://www.hdmoli.com' },
  { id: 14, title: '大米星球', url: 'https://dmti.club' },
  { id: 15, title: '新视觉影视', url: 'https://www.6080yy4.com' },
  { id: 16, title: '臭蛋蛋影视', url: 'https://cddys.me' },
  { id: 17, title: '看片狂人', url: 'https://kpkuang.one' },
  { id: 18, title: '缘觉影视', url: 'https://www.yjys.me' },
  { id: 19, title: '美剧星球', url: 'https://www.kmeiju.cc' },
  { id: 20, title: 'PP影视', url: 'https://www.pptv06.com' },
  { id: 21, title: '蜜糖动漫', url: 'https://www.mtacg.tv' },
  { id: 22, title: '喵物次元', url: 'https://www.mwcy.net' },
  { id: 23, title: 'Nico动漫', url: 'https://nicohub.cc' },
  { id: 25, title: '樱花动漫', url: 'https://www.yhdm.nl' },
  { id: 26, title: 'AGE动漫', url: 'https://www.agemys.com' },
  { id: 27, title: 'ZzzFun', url: 'http://www.zzzfun.one' },
  { id: 28, title: '剧迷', url: 'https://gimy.ai' },
  { id: 29, title: 'LIBVIO', url: 'https://www.libvio.me' },
  { id: 31, title: '影视工场', url: 'https://www.ysgc.fun' },
  { id: 32, title: '爱看影视', url: 'https://ikan6.vip' },
  { id: 33, title: '大师兄影视', url: 'https://dsxys.pro' },
  { id: 35, title: '快看影视', url: 'https://www.kuaikanys.net' },
  { id: 36, title: '片库', url: 'https://www.piankumi.cc/' },
  // 可以继续添加更多的免费频道链接
]);
const friendLinks = ref([
  { id: 1, title: '极点搜索', url: 'https://s.jdwdai.com' },
  { id: 2, title: '极点智能体', url: 'https://www.jdwdai.com' },
  { id: 3, title: '橘子导航', url: 'https://www.videolist.cn' },
  // 可以继续添加更多的友情链接
]);

function goToUrl(url) {
  window.open(url, '_blank');
}

function getFavicon(url) {
  return `https://api.iowen.cn/favicon/${new URL(url).hostname}.png`;
}
</script>

<style scoped>
.videoList {
  margin: 60px 0;
}

.section {
  margin-bottom: 20px;
}

h3 {
  font-size: 20px;
  margin-bottom: 10px;
  user-select: none;
}

.cardContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.card {
  background-color: white;
  padding: 15px;
  border-radius: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  user-select: none;
}

.card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

a {
  text-decoration: none;
  color: black;
  font-size: 20px;
}

a:hover {
  background-color: transparent;
}

@media screen and (max-width: 768px) {}
</style>