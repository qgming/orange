<template>
  <div class="videoList">
    <div class="section">
      <div class="section-header">
        <h3>官方影视</h3>
        <button class="expand-btn" @click="toggleExpand('official')" v-if="officialChannels.length > getDefaultVisibleCount()">
          {{ expandedSections.official ? '收起' : '展开' }}
          <span class="arrow" :class="{ 'arrow-up': expandedSections.official }">▼</span>
        </button>
      </div>
      <div class="cardContainer" :class="{ 'expanded': expandedSections.official }">
        <div v-for="video in getVisibleCards(officialChannels, 'official')" :key="video.id" class="card" @click="goToUrl(video.url)">
          <div class="logo-container">
            <img 
              v-if="hasFavicon(video.url)" 
              :src="getFavicon(video.url)" 
              alt="logo" 
              class="logo" 
              @error="faviconCache[new URL(video.url).hostname] = false"
            />
            <div v-else class="text-logo">{{ getFirstChar(video.title) }}</div>
          </div>
          <a>{{ video.title }}</a>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <h3>免费影视</h3>
        <button class="expand-btn" @click="toggleExpand('free')" v-if="freeChannels.length > getDefaultVisibleCount()">
          {{ expandedSections.free ? '收起' : '展开' }}
          <span class="arrow" :class="{ 'arrow-up': expandedSections.free }">▼</span>
        </button>
      </div>
      <div class="cardContainer" :class="{ 'expanded': expandedSections.free }">
        <div v-for="video in getVisibleCards(freeChannels, 'free')" :key="video.id" class="card" @click="goToUrl(video.url)">
          <div class="logo-container">
            <img 
              v-if="hasFavicon(video.url)" 
              :src="getFavicon(video.url)" 
              alt="logo" 
              class="logo" 
              @error="faviconCache[new URL(video.url).hostname] = false"
            />
            <div v-else class="text-logo">{{ getFirstChar(video.title) }}</div>
          </div>
          <a>{{ video.title }}</a>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <h3>极客社区</h3>
        <button class="expand-btn" @click="toggleExpand('friend')" v-if="friendLinks.length > getDefaultVisibleCount()">
          {{ expandedSections.friend ? '收起' : '展开' }}
          <span class="arrow" :class="{ 'arrow-up': expandedSections.friend }">▼</span>
        </button>
      </div>
      <div class="cardContainer" :class="{ 'expanded': expandedSections.friend }">
        <div v-for="link in getVisibleCards(friendLinks, 'friend')" :key="link.id" class="card" @click="goToUrl(link.url)">
          <div class="logo-container">
            <img 
              v-if="hasFavicon(link.url)" 
              :src="getFavicon(link.url)" 
              alt="logo" 
              class="logo" 
              @error="faviconCache[new URL(link.url).hostname] = false"
            />
            <div v-else class="text-logo">{{ getFirstChar(link.title) }}</div>
          </div>
          <a>{{ link.title }}</a>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <h3>图书资源</h3>
        <button class="expand-btn" @click="toggleExpand('book')" v-if="bookResources.length > getDefaultVisibleCount()">
          {{ expandedSections.book ? '收起' : '展开' }}
          <span class="arrow" :class="{ 'arrow-up': expandedSections.book }">▼</span>
        </button>
      </div>
      <div class="cardContainer" :class="{ 'expanded': expandedSections.book }">
        <div v-for="book in getVisibleCards(bookResources, 'book')" :key="book.id" class="card" @click="goToUrl(book.url)">
          <div class="logo-container">
            <img 
              v-if="hasFavicon(book.url)" 
              :src="getFavicon(book.url)" 
              alt="logo" 
              class="logo" 
              @error="faviconCache[new URL(book.url).hostname] = false"
            />
            <div v-else class="text-logo">{{ getFirstChar(book.title) }}</div>
          </div>
          <a>{{ book.title }}</a>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <h3>网盘搜索</h3>
        <button class="expand-btn" @click="toggleExpand('disk')" v-if="diskSearch.length > getDefaultVisibleCount()">
          {{ expandedSections.disk ? '收起' : '展开' }}
          <span class="arrow" :class="{ 'arrow-up': expandedSections.disk }">▼</span>
        </button>
      </div>
      <div class="cardContainer" :class="{ 'expanded': expandedSections.disk }">
        <div v-for="disk in getVisibleCards(diskSearch, 'disk')" :key="disk.id" class="card" @click="goToUrl(disk.url)">
          <div class="logo-container">
            <img 
              v-if="hasFavicon(disk.url)" 
              :src="getFavicon(disk.url)" 
              alt="logo" 
              class="logo" 
              @error="faviconCache[new URL(disk.url).hostname] = false"
            />
            <div v-else class="text-logo">{{ getFirstChar(disk.title) }}</div>
          </div>
          <a>{{ disk.title }}</a>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <h3>游戏资源</h3>
        <button class="expand-btn" @click="toggleExpand('game')" v-if="gameResources.length > getDefaultVisibleCount()">
          {{ expandedSections.game ? '收起' : '展开' }}
          <span class="arrow" :class="{ 'arrow-up': expandedSections.game }">▼</span>
        </button>
      </div>
      <div class="cardContainer" :class="{ 'expanded': expandedSections.game }">
        <div v-for="game in getVisibleCards(gameResources, 'game')" :key="game.id" class="card" @click="goToUrl(game.url)">
          <div class="logo-container">
            <img 
              v-if="hasFavicon(game.url)" 
              :src="getFavicon(game.url)" 
              alt="logo" 
              class="logo" 
              @error="faviconCache[new URL(game.url).hostname] = false"
            />
            <div v-else class="text-logo">{{ getFirstChar(game.title) }}</div>
          </div>
          <a>{{ game.title }}</a>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <h3>学习资源</h3>
        <button class="expand-btn" @click="toggleExpand('learn')" v-if="learningResources.length > getDefaultVisibleCount()">
          {{ expandedSections.learn ? '收起' : '展开' }}
          <span class="arrow" :class="{ 'arrow-up': expandedSections.learn }">▼</span>
        </button>
      </div>
      <div class="cardContainer" :class="{ 'expanded': expandedSections.learn }">
        <div v-for="learn in getVisibleCards(learningResources, 'learn')" :key="learn.id" class="card" @click="goToUrl(learn.url)">
          <div class="logo-container">
            <img 
              v-if="hasFavicon(learn.url)" 
              :src="getFavicon(learn.url)" 
              alt="logo" 
              class="logo" 
              @error="faviconCache[new URL(learn.url).hostname] = false"
            />
            <div v-else class="text-logo">{{ getFirstChar(learn.title) }}</div>
          </div>
          <a>{{ learn.title }}</a>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <h3>软件资源</h3>
        <button class="expand-btn" @click="toggleExpand('software')" v-if="softwareResources.length > getDefaultVisibleCount()">
          {{ expandedSections.software ? '收起' : '展开' }}
          <span class="arrow" :class="{ 'arrow-up': expandedSections.software }">▼</span>
        </button>
      </div>
      <div class="cardContainer" :class="{ 'expanded': expandedSections.software }">
        <div v-for="software in getVisibleCards(softwareResources, 'software')" :key="software.id" class="card" @click="goToUrl(software.url)">
          <div class="logo-container">
            <img 
              v-if="hasFavicon(software.url)" 
              :src="getFavicon(software.url)" 
              alt="logo" 
              class="logo" 
              @error="faviconCache[new URL(software.url).hostname] = false"
            />
            <div v-else class="text-logo">{{ getFirstChar(software.title) }}</div>
          </div>
          <a>{{ software.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 展开状态控制
const expandedSections = reactive({
  official: false,
  free: false,
  book: false,
  disk: false,
  game: false,
  learn: false,
  software: false,
  friend: false
});

// 每行显示的卡片数量（根据屏幕宽度动态计算）
const getCardsPerRow = () => {
  const width = window.innerWidth;
  if (width >= 1024) return 6;
  if (width >= 768) return 4;
  if (width >= 360) return 3;
  return 2;
};

// 计算默认显示的卡片数量（两行）
const getDefaultVisibleCount = () => getCardsPerRow() * 2;

// 获取应该显示的卡片
const getVisibleCards = (cards, sectionKey) => {
  const visibleCount = expandedSections[sectionKey] ? cards.length : getDefaultVisibleCount();
  return cards.slice(0, visibleCount);
};

// 切换展开状态
const toggleExpand = (sectionKey) => {
  expandedSections[sectionKey] = !expandedSections[sectionKey];
};

const officialChannels = ref([
  { id: 1, title: '哔哩哔哩', url: 'https://www.bilibili.com' },
  { id: 2, title: '爱奇艺', url: 'https://www.iqiyi.com' },
  { id: 3, title: '腾讯视频', url: 'https://v.qq.com' },
  { id: 4, title: '优酷', url: 'https://www.youku.com' },
  { id: 5, title: '芒果TV', url: 'https://www.mgtv.com' },
  { id: 6, title: '央视网', url: 'https://www.cctv.com' },
  { id: 7, title: 'YouTube', url: 'https://www.youtube.com' },
  { id: 8, title: 'Netflix', url: 'https://www.netflix.com' },
  { id: 9, title: '抖音网页版', url: 'https://www.douyin.com' },
  { id: 10, title: '西瓜视频', url: 'https://www.ixigua.com' }
]);

const freeChannels = ref([
  { id: 1, title: '低端影视', url: 'https://ddys.art' },
  { id: 2, title: '茶杯狐', url: 'https://cupfox.app' },
  { id: 3, title: '剧迷', url: 'https://gimytv.app' },
  { id: 4, title: '在线之家', url: 'https://www.zxzj.site' },
  { id: 5, title: 'AGE动漫', url: 'https://www.agemys.org' },
  { id: 6, title: '樱花动漫', url: 'https://www.yhdmp.net' },
  { id: 7, title: '555影视', url: 'https://www.555dy.com' },
  { id: 8, title: '大师兄影视', url: 'https://dsxys.com' },
  { id: 9, title: '片库', url: 'https://www.pianku.la' },
  { id: 10, title: 'LIBVIO', url: 'https://www.libvio.me' },
  { id: 11, title: '动漫岛', url: 'https://www.dmd85.com' },
  { id: 12, title: '哔嘀影视', url: 'https://www.bdys10.com' },
  { id: 13, title: '泥巴影院', url: 'https://www.nbys.tv' },
  { id: 14, title: '91影院', url: 'https://91free.vip' },
  { id: 15, title: 'HDmoli', url: 'https://www.hdmoli.com' },
  { id: 16, title: '素白白', url: 'https://www.subaibai.com' },
  { id: 17, title: 'Cokemv', url: 'https://cokemv.me' },
  { id: 18, title: '电影先生', url: 'https://www.dianying.im' },
  { id: 19, title: '追剧达人', url: 'https://vipmv.co' },
  { id: 20, title: '影视工厂', url: 'https://www.ysgc.fun' },
  { id: 21, title: '看看剧', url: 'https://www.kankanju.cc' },
  { id: 22, title: '剧荒', url: 'https://juhuang.tv' },
  { id: 23, title: 'Zzzfun', url: 'http://www.zzzfun.com' },
  { id: 24, title: '独播库', url: 'https://duboku.tv' },
  { id: 25, title: '8K影视', url: 'https://www.8kvod.com' }
]);

const friendLinks = ref([
  { id: 1, title: '知乎', url: 'https://www.zhihu.com' },
  { id: 2, title: '微博', url: 'https://weibo.com' },
  { id: 3, title: '豆瓣', url: 'https://www.douban.com' },
  { id: 4, title: 'CSDN', url: 'https://www.csdn.net' },
  { id: 5, title: '简书', url: 'https://www.jianshu.com' },
  { id: 6, title: '掘金', url: 'https://juejin.cn' },
  { id: 7, title: 'V2EX', url: 'https://www.v2ex.com' },
  { id: 8, title: '少数派', url: 'https://sspai.com' },
  { id: 9, title: '什么值得买', url: 'https://www.smzdm.com' },
  { id: 10, title: '小众软件', url: 'https://www.appinn.com' },
  { id: 11, title: '博客园', url: 'https://www.cnblogs.com' },
  { id: 12, title: '开源中国', url: 'https://www.oschina.net' },
  { id: 13, title: 'InfoQ', url: 'https://www.infoq.cn' },
  { id: 14, title: '思否', url: 'https://segmentfault.com' },
  { id: 15, title: 'Gitee', url: 'https://gitee.com' },
  { id: 16, title: 'HelloGitHub', url: 'https://hellogithub.com' },
  { id: 17, title: '掘金酱', url: 'https://e.juejin.cn' },
  { id: 18, title: 'GitChat', url: 'https://gitbook.cn' }
]);

const bookResources = ref([
  { id: 1, title: 'Z-Library', url: 'https://singlelogin.re' },
  { id: 2, title: '24h搜书', url: 'https://24hbook.com' },
  { id: 3, title: '鸠摩搜书', url: 'https://www.jiumodiary.com' },
  { id: 4, title: '熊猫搜书', url: 'https://xmsoushu.com' },
  { id: 5, title: 'Library Genesis', url: 'https://libgen.rs' },
  { id: 6, title: '书享家', url: 'https://shuxiangjia.cn' },
  { id: 7, title: '无名图书', url: 'https://www.book123.info' },
  { id: 8, title: 'Gutenberg', url: 'https://www.gutenberg.org' },
  { id: 9, title: 'Internet Archive', url: 'https://archive.org' },
  { id: 10, title: '书栈网', url: 'https://www.bookstack.cn' },
  { id: 11, title: 'PDF Drive', url: 'https://www.pdfdrive.com' },
  { id: 12, title: '全国图书馆', url: 'http://www.ucdrs.superlib.net' },
  { id: 13, title: 'CSDN博客', url: 'https://blog.csdn.net' },
  { id: 14, title: '脚本之家', url: 'https://www.jb51.net' },
  { id: 15, title: '码农之家', url: 'https://www.xz577.com' },
  { id: 16, title: '码农网', url: 'https://www.codercto.com' },
  { id: 17, title: 'IT天空', url: 'https://www.itsk.com' },
  { id: 18, title: 'FreeMbook', url: 'https://freembook.com' },
  { id: 19, title: '中国哲学书', url: 'https://ctext.org/zhs' },
  { id: 20, title: '中国知网', url: 'https://www.cnki.net' }
]);

const diskSearch = ref([
  { id: 1, title: '阿里云盘', url: 'https://www.aliyundrive.com' },
  { id: 2, title: '阿里云盘资源', url: 'https://alipanso.com' },
  { id: 3, title: '小纸条', url: 'https://u.gitcafe.net' },
  { id: 4, title: '大力盘搜索', url: 'https://www.dalipan.com' },
  { id: 5, title: '云盘资源', url: 'https://www.yunpanziyuan.com' },
  { id: 6, title: '奈斯搜索', url: 'https://www.niceso.fun' },
  { id: 7, title: '易搜', url: 'https://yiso.fun' },
  { id: 8, title: '猫狸盘搜', url: 'https://www.alipansou.com' },
  { id: 9, title: '云盘分享', url: 'https://www.yunpan123.com' },
  { id: 10, title: '超能搜', url: 'https://www.chaonengso.com' },
  { id: 11, title: '阿里小站', url: 'https://alixiaozhan.net' },
  { id: 12, title: '盘友社区', url: 'https://www.panyoubbs.com' },
  { id: 13, title: '霸王龙影库', url: 'https://t-rex.tzfile.com' },
  { id: 14, title: '阿里云盘资源导航', url: 'https://aliyun.panpanr.com' },
  { id: 15, title: '网盘资源分享', url: 'https://aliwp.cn' }
]);

const gameResources = ref([
  { id: 1, title: 'Steam', url: 'https://store.steampowered.com' },
  { id: 2, title: 'Epic免费', url: 'https://store.epicgames.com/free-games' },
  { id: 3, title: '3DM游戏', url: 'https://www.3dmgame.com' },
  { id: 4, title: '游侠网', url: 'https://www.ali213.net' },
  { id: 5, title: '游民星空', url: 'https://www.gamersky.com' },
  { id: 6, title: '小霸王', url: 'https://www.yikm.net' },
  { id: 7, title: 'GOG', url: 'https://www.gog.com' },
  { id: 8, title: 'Humble', url: 'https://www.humblebundle.com' },
  { id: 9, title: 'Switch520', url: 'https://www.switch520.com' },
  { id: 10, title: 'CrazyGames', url: 'https://www.crazygames.com' },
  { id: 11, title: 'Itch.io', url: 'https://itch.io' },
  { id: 12, title: '游戏年轮', url: 'https://www.bibgame.com' },
  { id: 13, title: '叽哩叽哩', url: 'https://www.jiligamefun.com' },
  { id: 14, title: '游戏下载', url: 'https://www.xidfr.com' },
  { id: 15, title: '游戏仓库', url: 'https://www.gamekeep.net' },
  { id: 16, title: '老男人游戏网', url: 'https://www.oldmanemu.net' },
  { id: 17, title: 'Watt Toolkit', url: 'https://steampp.net' },
  { id: 18, title: '蘑菇游戏', url: 'https://www.mogud.com' }
]);

const learningResources = ref([
  { id: 1, title: '菜鸟教程', url: 'https://www.runoob.com' },
  { id: 2, title: 'W3School', url: 'https://www.w3school.com.cn' },
  { id: 3, title: '中国大学MOOC', url: 'https://www.icourse163.org' },
  { id: 4, title: '学堂在线', url: 'https://www.xuetangx.com' },
  { id: 5, title: 'Coursera', url: 'https://www.coursera.org' },
  { id: 6, title: 'edX', url: 'https://www.edx.org' },
  { id: 7, title: 'Udemy', url: 'https://www.udemy.com' },
  { id: 8, title: '极客时间', url: 'https://time.geekbang.org' },
  { id: 9, title: 'LeetCode', url: 'https://leetcode.cn' },
  { id: 10, title: 'GitHub', url: 'https://github.com' },
  { id: 11, title: '掘金', url: 'https://juejin.cn' },
  { id: 12, title: '牛客网', url: 'https://www.nowcoder.com' },
  { id: 13, title: '慕课网', url: 'https://www.imooc.com' },
  { id: 14, title: '网易公开课', url: 'https://open.163.com' },
  { id: 15, title: '腾讯课堂', url: 'https://ke.qq.com' },
  { id: 16, title: '51CTO学院', url: 'https://edu.51cto.com' },
  { id: 17, title: '力扣', url: 'https://leetcode.cn' },
  { id: 18, title: 'SegmentFault', url: 'https://segmentfault.com' },
  { id: 19, title: 'InfoQ', url: 'https://www.infoq.cn' },
  { id: 20, title: 'GitChat', url: 'https://gitbook.cn' }
]);

const softwareResources = ref([
  { id: 1, title: '果核剥壳', url: 'https://www.ghxi.com' },
  { id: 2, title: '423Down', url: 'https://www.423down.com' },
  { id: 3, title: '异次元', url: 'https://www.iplaysoft.com' },
  { id: 4, title: '小众软件', url: 'https://www.appinn.com' },
  { id: 5, title: '吾爱破解', url: 'https://www.52pojie.cn' },
  { id: 6, title: '胡萝卜周', url: 'https://www.carrotchou.blog' },
  { id: 7, title: '软件管家', url: 'https://www.mpyit.com' },
  { id: 8, title: '腾讯软件', url: 'https://pc.qq.com' },
  { id: 9, title: '微当下载', url: 'https://www.weidown.com' },
  { id: 10, title: '软件先锋', url: 'https://soft.macxf.com' },
  { id: 11, title: '大眼仔旭', url: 'http://www.dayanzai.me' },
  { id: 12, title: '落尘之木', url: 'https://www.luochenzhimu.com' },
  { id: 13, title: '殁漂遥', url: 'https://www.mpyit.com' },
  { id: 14, title: '软件SOS', url: 'https://www.rjsos.com' },
  { id: 15, title: '易破解', url: 'https://www.ypojie.com' },
  { id: 16, title: '软件缘', url: 'https://www.appcgn.com' },
  { id: 17, title: '软件目录', url: 'https://www.rjml.cn' },
  { id: 18, title: '阿虚同学', url: 'https://axutongxue.com' },
  { id: 19, title: 'N软网', url: 'https://www.nruan.com' },
  { id: 20, title: '佛系软件', url: 'https://foxirj.com' }
]);

const faviconCache = reactive({});

function getFirstChar(title) {
  return title.charAt(0);
}

function getFavicon(url) {
  try {
    const hostname = new URL(url).hostname;
    // 如果缓存中已经明确标记为失败，直接返回null
    if (faviconCache[hostname] === false) {
      return null;
    }
    // 如果缓存中有有效的URL，返回该URL
    if (faviconCache[hostname]) {
      return faviconCache[hostname];
    }
    // 否则尝试获取Google的favicon
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch (e) {
    console.error('Error getting favicon:', e);
    return null;
  }
}

function hasFavicon(url) {
  try {
    const hostname = new URL(url).hostname;
    // 只有明确标记为false时才返回false
    return faviconCache[hostname] !== false;
  } catch (e) {
    return false;
  }
}

function goToUrl(url) {
  window.open(url, '_blank');
}
</script>

<style scoped>
.videoList {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
  padding: 0 10px;
}

.cardContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

/* 默认高度设置为两行卡片的高度 */
.cardContainer:not(.expanded) {
  max-height: 360px; /* 根据实际卡片高度调整 */
}

.cardContainer.expanded {
  max-height: 2000px; /* 设置一个足够大的值 */
}

/* 在较小屏幕上调整默认高度 */
@media screen and (max-width: 767px) {
  .cardContainer:not(.expanded) {
    max-height: 280px;
  }
}

.card {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  width: calc(20% - 16px); /* 5 cards per row by default */
  min-width: 140px;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.logo-container {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  border-radius: 12px;
  background: #f8f9fa;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover .logo-container {
  transform: scale(1.05);
}

.logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.text-logo {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
}

a {
  margin-top: 8px;
  color: #333;
  font-size: 14px;
  text-decoration: none;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  max-width: 100%;
}

/* Desktop styles */
@media screen and (min-width: 1024px) {
  .videoList {
    padding: 30px;
  }

  .cardContainer {
    gap: 25px;
  }

  .card {
    width: calc(16.666% - 21px); /* 6 cards per row */
    padding: 20px;
  }

  .logo-container {
    width: 56px;
    height: 56px;
  }

  .logo {
    width: 40px;
    height: 40px;
  }

  .text-logo {
    font-size: 24px;
  }

  a {
    font-size: 16px;
  }
}

/* Tablet styles */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .cardContainer {
    gap: 20px;
  }

  .card {
    width: calc(25% - 15px); /* 4 cards per row */
  }
}

/* Mobile styles */
@media screen and (max-width: 767px) {
  .videoList {
    padding: 15px;
  }

  .section h3 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .cardContainer {
    gap: 15px;
    padding: 5px;
  }

  .card {
    width: calc(33.333% - 10px); /* 3 cards per row */
    padding: 12px;
    min-width: 100px;
  }

  .logo-container {
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
  }

  .logo {
    width: 24px;
    height: 24px;
  }

  .text-logo {
    font-size: 16px;
  }

  a {
    font-size: 12px;
    margin-top: 6px;
  }
}

/* Small mobile styles */
@media screen and (max-width: 359px) {
  .cardContainer {
    gap: 10px;
  }

  .card {
    width: calc(50% - 5px); /* 2 cards per row */
    padding: 10px;
  }

  .logo-container {
    width: 36px;
    height: 36px;
  }

  .logo {
    width: 20px;
    height: 20px;
  }

  .text-logo {
    font-size: 14px;
  }

  a {
    font-size: 11px;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.expand-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: none;
  background-color: #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.expand-btn:hover {
  background-color: #e0e0e0;
}

.arrow {
  display: inline-block;
  transition: transform 0.3s ease;
  font-size: 12px;
}

.arrow-up {
  transform: rotate(180deg);
}
</style>