<template>
  <div class="videoList">
    <SectionBlock
      title="官方影视"
      :items="officialChannels"
    />
    <SectionBlock
      title="免费影视"
      :items="freeChannels"
    />
    <SectionBlock
      title="在线游戏"
      :items="gameResources"
    />
    <SectionBlock
      title="图书资源"
      :items="bookResources"
    />
    <SectionBlock
      title="AI工具"
      :items="aiResources"
    />
    <SectionBlock
      title="极客社区"
      :items="communityChannels"
    />
    <SectionBlock
      title="网盘磁力"
      :items="diskSearch"
    />
    <SectionBlock
      title="学习资源"
      :items="learningResources"
    />
    <SectionBlock
      title="音乐资源"
      :items="musicResources"
    />
    <SectionBlock
      title="软件游戏"
      :items="softwareGameResources"
    />
    <SectionBlock
      title="友情链接"
      :items="friendLinks"
    />
  </div>
  <div class="footer">
    <p>Copyright (c) 2024 - {{ new Date().getFullYear() }} <a href="https://github.com/qgming">极点维度</a></p>
    <p>Version 1.0.0</p>
    <p><router-link to="/privacy">隐私政策</router-link></p>
  </div>

</template>

<style scoped>
.videoList {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-size: 14px;
  color: #999;
}

.footer a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer a:hover {
  color: #333;
}
</style>

<script setup>
import { ref } from 'vue'
import SectionBlock from './SectionBlock.vue'
// 官方影视
const officialChannels = ref([
  { 
    id: 1, 
    title: '哔哩哔哩', 
    url: 'https://www.bilibili.com',
    description: '国内知名的视频弹幕网站，提供高质量的动漫、游戏、音乐、舞蹈、科技等内容'
  },
  { 
    id: 2, 
    title: '爱奇艺', 
    url: 'https://www.iqiyi.com',
    description: '中国领先的在线视频平台，提供正版高清电影、电视剧、综艺、动漫等内容'
  },
  { 
    id: 3, 
    title: '腾讯视频', 
    url: 'https://v.qq.com',
    description: '腾讯旗下视频平台，提供海量正版影视内容和独播剧集'
  },
  { 
    id: 4, 
    title: '优酷', 
    url: 'https://www.youku.com',
    description: '阿里巴巴旗下视频网站，提供丰富的影视剧、综艺节目和独家内容'
  },
  { 
    id: 5, 
    title: '芒果TV', 
    url: 'https://www.mgtv.com',
    description: '湖南广播电视台旗下视频平台，提供湖南卫视节目和独家综艺内容'
  },
  { 
    id: 6, 
    title: '央视网', 
    url: 'https://www.cctv.com',
    description: '中央广播电视总台官方网站，提供新闻、纪录片等权威视听节目'
  },
  { 
    id: 7, 
    title: 'YouTube', 
    url: 'https://www.youtube.com',
    description: '全球最大的视频分享平台，提供海量用户原创内容和娱乐视频'
  },
  { 
    id: 8, 
    title: 'Netflix', 
    url: 'https://www.netflix.com',
    description: '全球知名流媒体平台，提供高质量的原创电影、剧集和纪录片'
  },
  { 
    id: 9, 
    title: '抖音网页版', 
    url: 'https://www.douyin.com',
    description: '字节跳动旗下短视频平台，提供趣味短视频内容和直播服务'
  },
  { 
    id: 10, 
    title: '西瓜视频', 
    url: 'https://www.ixigua.com',
    description: '字节跳动旗下中长视频平台，提供丰富的知识、娱乐和资讯内容'
  }
]);
//免费影视
const freeChannels = ref([ 
  { 
    id: 1, 
    title: '耐看点播', 
    url: 'https://www.nkdvd.com',
    description: '高清影视在线观看平台，更新速度快，画质清晰'
  },
  { 
    id: 2, 
    title: '555影视', 
    url: 'https://www.555dy.com',
    description: '免费在线影视网站，资源丰富，更新及时'
  },
  { 
    id: 3, 
    title: '低端影视', 
    url: 'https://ddys.art',
    description: '提供高清影视在线观看，注重用户体验和播放质量'
  },
  { 
    id: 4, 
    title: '美益达影视', 
    url: 'https://meiyd14.tv',
    description: '免费在线影视网站，提供最新电影、电视剧、动漫在线观看'
  },
  { 
    id: 5, 
    title: '茶杯狐', 
    url: 'https://cupfox.app',
    description: '影视资源聚合搜索引擎，帮助用户找到想看的视频内容'
  },
  { 
    id: 6, 
    title: '剧迷', 
    url: 'https://gimy.tv',
    description: '专注于海外剧集的在线观看平台，提供多语言字幕'
  },
  { 
    id: 7, 
    title: '在线之家', 
    url: 'https://www.zxzj.site',
    description: '提供高清电影、电视剧在线观看，播放速度快'
  },
  { 
    id: 8, 
    title: 'AGE动漫', 
    url: 'https://www.agemys.org',
    description: '专注于动漫内容的在线观看平台，更新速度快'
  },
  { 
    id: 9, 
    title: '樱花动漫', 
    url: 'https://www.yhdmp.net',
    description: '提供日本动漫在线观看，资源更新及时'
  },
  { 
    id: 10, 
    title: '大师兄影视', 
    url: 'https://dsxys.com',
    description: '影视剧在线观看网站，内容丰富，广告少'
  },
  { 
    id: 11, 
    title: '皮皮蛋影视', 
    url: 'https://ppdys.vip',
    description: '免费在线观看电影、电视剧的影视网站'
  },
  { 
    id: 12, 
    title: 'LIBVIO', 
    url: 'https://www.libvio.me',
    description: '高清影视在线观看，支持多种播放线路'
  },
  { 
    id: 13, 
    title: '动漫岛', 
    url: 'https://www.dmd85.com',
    description: '专注动漫内容的在线观看网站，资源丰富'
  },
  { 
    id: 14, 
    title: '哔嘀影视', 
    url: 'https://www.bdys10.com',
    description: '提供高清电影在线观看，注重画质'
  },
  { 
    id: 15, 
    title: '泥巴影院', 
    url: 'https://www.nbys.tv',
    description: '提供电影、电视剧、动漫在线观看服务'
  },
  { 
    id: 16, 
    title: '91影院', 
    url: 'https://91free.vip',
    description: '免费在线影视网站，更新及时'
  },
  { 
    id: 17, 
    title: 'HDmoli', 
    url: 'https://www.hdmoli.com',
    description: '提供高清电影在线观看，画质优良'
  },
  { 
    id: 18, 
    title: '素白白', 
    url: 'https://www.subaibai.com',
    description: '提供影视剧在线观看，界面简洁'
  },
  { 
    id: 19, 
    title: 'Cokemv', 
    url: 'https://cokemv.me',
    description: '在线影视网站，资源更新快'
  },
  { 
    id: 20, 
    title: '电影先生', 
    url: 'https://www.dianying.im',
    description: '提供高清电影在线观看服务'
  },
  { 
    id: 21, 
    title: '追剧达人', 
    url: 'https://vipmv.co',
    description: '提供最新电视剧在线观看'
  },
  { 
    id: 22, 
    title: '影视工厂', 
    url: 'https://www.ysgc.fun',
    description: '影视剧在线观看平台，内容丰富'
  },
  { 
    id: 23, 
    title: '看看剧', 
    url: 'https://www.kankanju.cc',
    description: '提供电视剧、电影在线观看'
  },
  { 
    id: 24, 
    title: '剧荒', 
    url: 'https://juhuang.tv',
    description: '影视剧资源网站，帮助用户找到好看的影视作品'
  },
  { 
    id: 25, 
    title: 'Zzzfun', 
    url: 'http://www.zzzfun.com',
    description: '动漫视频网站，提供动漫在线观看服务'
  },
  { 
    id: 26, 
    title: '独播库', 
    url: 'https://duboku.tv',
    description: '影视剧在线观看平台，更新及时'
  },
  { 
    id: 27, 
    title: '爱迪影视', 
    url: 'https://aidi.tv',
    description: '提供电影、电视剧在线观看服务'
  },
  { 
    id: 28, 
    title: '达达龟', 
    url: 'https://www.dadagui.me',
    description: '动漫、影视剧在线观看网站'
  },
  { 
    id: 29, 
    title: '乐猪TV', 
    url: 'http://www.lezhutv.com',
    description: '提供影视剧在线观看，播放流畅'
  },
  { 
    id: 30, 
    title: '快看影视', 
    url: 'https://www.kuaikanys.net',
    description: '在线影视网站，内容更新快'
  }
]);
// 社区
const communityChannels = ref([
  { 
    id: 1, 
    title: 'GitHub', 
    url: 'https://github.com',
    description: '全球最大的代码托管平台，开源项目聚集地'
  },
  { 
    id: 2, 
    title: 'Stack Overflow', 
    url: 'https://stackoverflow.com',
    description: '全球最大的程序员问答社区，解决技术难题'
  },
  { 
    id: 3, 
    title: '掘金', 
    url: 'https://juejin.cn',
    description: '高质量技术社区，前沿技术分享和讨论'
  },
  { 
    id: 4, 
    title: 'V2EX', 
    url: 'https://www.v2ex.com',
    description: '程序员交流社区，分享技术和生活话题'
  },
  { 
    id: 5, 
    title: 'CSDN', 
    url: 'https://www.csdn.net',
    description: '国内最大的IT技术社区，教程资源丰富'
  },
  { 
    id: 6, 
    title: '开源中国', 
    url: 'https://www.oschina.net',
    description: '国内活跃的开源技术社区，软件更新及时'
  },
  { 
    id: 7, 
    title: '博客园', 
    url: 'https://www.cnblogs.com',
    description: '老牌技术博客平台，深度技术文章多'
  },
  { 
    id: 8, 
    title: 'InfoQ', 
    url: 'https://www.infoq.cn',
    description: '高质量软件开发资讯，前沿技术解读'
  },
  { 
    id: 9, 
    title: 'Gitee', 
    url: 'https://gitee.com',
    description: '国内代码托管平台，企业级研发协作'
  },
  { 
    id: 10, 
    title: 'LeetCode', 
    url: 'https://leetcode.cn',
    description: '程序员刷题平台，面试算法题库'
  },
  { 
    id: 11, 
    title: 'DEV Community', 
    url: 'https://dev.to',
    description: '国际开发者社区，技术博客分享平台'
  },
  { 
    id: 12, 
    title: 'Reddit编程区', 
    url: 'https://www.reddit.com/r/programming',
    description: '国际程序员讨论区，技术话题交流'
  },
  { 
    id: 13, 
    title: 'HelloGitHub', 
    url: 'https://hellogithub.com',
    description: '分享GitHub上优质的开源项目，适合新手'
  },
  { 
    id: 14, 
    title: 'Trending', 
    url: 'https://github.com/trending',
    description: 'GitHub趋势榜，热门开源项目推荐'
  },
  { 
    id: 15, 
    title: 'HackerNews', 
    url: 'https://news.ycombinator.com',
    description: '硅谷技术新闻，创业和技术讨论'
  }
]);
// 书籍
const bookResources = ref([
  { 
    id: 1, 
    title: 'Z-Library', 
    url: 'https://z-lib.rest/',
    description: '全球最大数字图书馆，图书论文资源丰富，支持各种语言'
  },
  { 
    id: 2, 
    title: '24h搜书', 
    url: 'https://book.daohangxie.com',
    description: '资源丰富，国内可以直接访问，界面简洁的聚合搜索'
  },
  { 
    id: 3, 
    title: '安娜的档案', 
    url: 'https://zh.annas-archive.org',
    description: 'Z-Library镜像站，资源更全面'
  },
  { 
    id: 4, 
    title: '鸠摩搜书', 
    url: 'https://www.jiumodiary.com',
    description: '国内最好用的电子书搜索引擎，无需注册'
  },

  { 
    id: 5, 
    title: '熊猫搜书', 
    url: 'https://xmsoushu.com',
    description: '专注网盘电子书资源，支持在线预览'
  },
  { 
    id: 6, 
    title: '无名图书', 
    url: 'https://www.book123.info',
    description: '专注计算机编程书籍，PDF格式为主'
  },
  { 
    id: 7, 
    title: '书栈网', 
    url: 'https://www.bookstack.cn',
    description: '开源技术文档分享，支持在线阅读和导出'
  },
  { 
    id: 8, 
    title: 'PDF Drive', 
    url: 'https://www.pdfdrive.com',
    description: '超过8千万PDF资源，支持多语言检索'
  },
  { 
    id: 9, 
    title: 'Internet Archive', 
    url: 'https://archive.org',
    description: '互联网档案馆，包含绝版珍贵书籍'
  },
  { 
    id: 10, 
    title: 'Gutenberg', 
    url: 'https://www.gutenberg.org',
    description: '6万多本免费公版电子书，经典名著多'
  },
  { 
    id: 11, 
    title: 'FreeMbook', 
    url: 'https://freembook.com',
    description: '每日更新免费电子书，提供多种格式下载'
  },
  { 
    id: 12, 
    title: '全国图书馆', 
    url: 'http://www.ucdrs.superlib.net',
    description: '正版学术资源，可在线阅读和文献传递'
  },
  { 
    id: 13, 
    title: '中国哲学书', 
    url: 'https://ctext.org/zhs',
    description: '中国古籍数字化，支持全文检索和对照阅读'
  }
]);
// 网盘磁力
const diskSearch = ref([
  { 
    id: 1, 
    title: '阿里云盘', 
    url: 'https://www.aliyundrive.com',
    description: '官方网盘，稳定可靠，空间大且速度快'
  },
  { 
    id: 2, 
    title: '云盘资源分享', 
    url: 'https://www.yunpanziyuan.com',
    description: '资源分享社区，更新快且活跃'
  },
  { 
    id: 3, 
    title: '易搜', 
    url: 'https://yiso.fun',
    description: '界面简洁的搜索引擎，响应快'
  },
  { 
    id: 4, 
    title: 'TorrentKitty', 
    url: 'https://www.torrentkitty.tv',
    description: '磁力搜索引擎，资源丰富'
  },
  { 
    id: 5, 
    title: 'BTDigg', 
    url: 'https://btdig.com',
    description: 'DHT磁力搜索引擎，资源全'
  },
  { 
    id: 6, 
    title: 'The Pirate Bay', 
    url: 'https://thepiratebay.org',
    description: '世界最大的种子站点'
  },
  { 
    id: 7, 
    title: '1337x', 
    url: 'https://1337x.to',
    description: '知名BT资源网站，界面友好'
  },
  { 
    id: 8, 
    title: 'NYAA', 
    url: 'https://nyaa.si',
    description: '专注动漫资源的BT站点'
  },
  { 
    id: 9, 
    title: 'EZTV', 
    url: 'https://eztv.re',
    description: '专注电视剧资源的BT站'
  },
  { 
    id: 10, 
    title: 'YTS', 
    url: 'https://yts.mx',
    description: '高清电影磁力下载站'
  }
]);
// 在线游戏
const gameResources = ref([
  { 
    id: 1, 
    title: '4399小游戏', 
    url: 'https://www.4399.com',
    description: '中国最大的在线游戏平台，每日更新，游戏数量庞大'
  },
  { 
    id: 2, 
    title: '7k7k小游戏', 
    url: 'https://www.7k7k.com',
    description: '经典小游戏网站，20年老站，游戏分类清晰'
  },
  { 
    id: 3, 
    title: '17yy', 
    url: 'https://www.17yy.com',
    description: '专注HTML5游戏，手机电脑都能玩'
  },
  { 
    id: 4, 
    title: '小霸王', 
    url: 'https://www.yikm.net',
    description: '在线FC游戏，完美复刻童年回忆'
  },
  { 
    id: 5, 
    title: 'CrazyGames', 
    url: 'https://www.crazygames.com',
    description: '国际知名H5游戏平台，游戏质量高'
  },
  { 
    id: 6, 
    title: 'Y8 Games', 
    url: 'https://zh.y8.com',
    description: '经典Flash游戏网站，支持中文，游戏量大'
  },
  { 
    id: 7, 
    title: 'Poki', 
    url: 'https://poki.com',
    description: '高质量HTML5游戏，界面简洁无广告'
  },
  { 
    id: 8, 
    title: '2144', 
    url: 'https://www.2144.cn',
    description: '老牌小游戏网站，运营超15年'
  },
  { 
    id: 9, 
    title: '游戏狗', 
    url: 'https://www.gamedog.cn',
    description: '在线小游戏平台，更新速度快'
  },
  { 
    id: 10, 
    title: 'Kongregate', 
    url: 'https://www.kongregate.com',
    description: '国外知名游戏平台，独立游戏多'
  }
]);
// 学习
const learningResources = ref([
  { 
    id: 1, 
    title: '中国大学MOOC', 
    url: 'https://www.icourse163.org',
    description: '国内知名MOOC平台，提供优质大学课程'
  },
  { 
    id: 2, 
    title: '网易公开课', 
    url: 'https://open.163.com',
    description: '网易旗下免费课程平台，内容丰富'
  },
  { 
    id: 3, 
    title: '学堂在线', 
    url: 'https://www.xuetangx.com',
    description: '清华大学创办的MOOC平台，课程质量高'
  },
  { 
    id: 4, 
    title: 'Coursera', 
    url: 'https://www.coursera.org',
    description: '全球顶级MOOC平台，提供名校课程'
  },
  { 
    id: 5, 
    title: 'edX', 
    url: 'https://www.edx.org',
    description: '麻省理工和哈佛大学创建的在线学习平台'
  },
  { 
    id: 6, 
    title: 'freeCodeCamp', 
    url: 'https://www.freecodecamp.org',
    description: '免费学习编程的开源社区，提供证书'
  },
  { 
    id: 7, 
    title: 'MDN Web Docs', 
    url: 'https://developer.mozilla.org',
    description: 'Mozilla的Web技术权威文档'
  },
  { 
    id: 8, 
    title: 'GitHub Learning Lab', 
    url: 'https://lab.github.com',
    description: 'GitHub官方互动式学习平台'
  },
  { 
    id: 9, 
    title: 'Codecademy', 
    url: 'https://www.codecademy.com',
    description: '互动式编程学习平台，基础课程免费'
  },
  { 
    id: 10, 
    title: 'LeetCode', 
    url: 'https://leetcode.com',
    description: '程序员刷题平台，提供免费题库'
  },
  { 
    id: 11, 
    title: 'W3School', 
    url: 'https://www.w3school.com.cn',
    description: '领先的Web技术教程网站'
  },
  { 
    id: 12, 
    title: '菜鸟教程', 
    url: 'https://www.runoob.com',
    description: '提供编程技术基础教程，适合入门学习'
  },
  { 
    id: 13, 
    title: 'CS50', 
    url: 'https://cs50.harvard.edu',
    description: '哈佛大学著名的计算机科学入门课程'
  },
  { 
    id: 14, 
    title: 'MIT OpenCourseWare', 
    url: 'https://ocw.mit.edu',
    description: 'MIT开放课程，完全免费'
  },
  { 
    id: 15, 
    title: 'Khan Academy', 
    url: 'https://www.khanacademy.org',
    description: '免费教育资源网站，课程体系完整'
  }
]);
// 软件游戏
const softwareGameResources = ref([
  { 
    id: 1, 
    title: '果核剥壳', 
    url: 'https://www.ghxi.com',
    description: '优质软件分享网站，提供绿色破解版软件'
  },
  { 
    id: 2, 
    title: '423Down', 
    url: 'https://www.423down.com',
    description: '专注于Windows软件的下载站，资源丰富'
  },
  { 
    id: 3, 
    title: '吾爱破解', 
    url: 'https://www.52pojie.cn',
    description: '国内知名软件安全与破解论坛'
  },
  {
    id: 6,
    title: 'Byrut Game',
    url: 'https://byrutgame.org/',
    description: '俄罗斯游戏资源站，更新及时'
  },
  {
    id: 12,
    title: '3DM游戏网',
    url: 'https://www.3dmgame.com',
    description: '游戏下载与汉化补丁资源'
  },
  {
    id: 13,
    title: '游侠网',
    url: 'https://www.ali213.net',
    description: '老牌游戏下载网站，资讯全面'
  },
  { 
    id: 4, 
    title: '异次元', 
    url: 'https://www.iplaysoft.com',
    description: '优质软件推荐网站，注重软件质量'
  },
  { 
    id: 5, 
    title: '小众软件', 
    url: 'https://www.appinn.com',
    description: '分享免费实用的小众软件'
  },

  { 
    id: 7,
    title: 'IGG Games', 
    url: 'https://igg-games.com',
    description: '注意：部分游戏会有广告\n老牌游戏资源站，更新及时'
  },
  { 
    id: 8,
    title: 'FitGirl Repacks', 
    url: 'https://fitgirl-repacks.site',
    description: '知名游戏压缩包分享站'
  },
  { 
    id: 9,
    title: 'Steam', 
    url: 'https://store.steampowered.com',
    description: '全球最大的游戏发行平台'
  },
  { 
    id: 10,
    title: 'Epic Games', 
    url: 'https://store.epicgames.com',
    description: '每周提供免费游戏的平台'
  },
  { 
    id: 11,
    title: 'GOG', 
    url: 'https://www.gog.com',
    description: '无DRM的经典游戏下载平台'
  },

  { 
    id: 14,
    title: 'ElAmigos Games', 
    url: 'https://elamigos-games.com',
    description: '优质游戏资源分享站'
  },
]);
//音乐资源
const musicResources = ref([
  { 
    id: 1, 
    title: '网易云音乐', 
    url: 'https://music.163.com',
    description: '网易旗下音乐平台，提供海量音乐在线试听和正版音乐下载服务'
  },
  { 
    id: 2, 
    title: 'QQ音乐', 
    url: 'https://y.qq.com',
    description: '腾讯音乐旗下音乐平台，提供正版音乐在线收听和下载'
  },
  { 
    id: 3, 
    title: '咪咕音乐', 
    url: 'https://music.migu.cn',
    description: '中国移动旗下音乐平台，提供正版音乐和无损音质服务'
  },
  { 
    id: 4, 
    title: '酷我音乐', 
    url: 'https://www.kuwo.cn',
    description: '在线音乐平台，提供音乐播放、下载和音乐资讯服务'
  },
  { 
    id: 5, 
    title: '酷狗音乐', 
    url: 'https://www.kugou.com',
    description: '在线音乐平台，提供音乐在线试听和下载服务'
  },
  { 
    id: 6, 
    title: '5SING', 
    url: 'http://5sing.kugou.com',
    description: '中国原创音乐平台，提供原创音乐分享和交流'
  },
  { 
    id: 7, 
    title: '音乐磁场', 
    url: 'https://www.hifini.com',
    description: '无损音乐下载平台，提供高品质音乐资源'
  },
  { 
    id: 8, 
    title: '51Ape', 
    url: 'http://www.51ape.com',
    description: '无损音乐下载网站，提供APE、FLAC等格式音乐下载'
  },
  { 
    id: 9, 
    title: 'DTShot', 
    url: 'https://www.dtshot.com',
    description: '无损音乐下载网站，提供高品质音乐资源'
  },
  { 
    id: 10, 
    title: '音乐搜索器', 
    url: 'https://music.liuzhijin.cn',
    description: '音乐聚合搜索引擎，支持多平台音乐搜索'
  },
  { 
    id: 11, 
    title: 'Listen 1', 
    url: 'https://listen1.github.io/listen1',
    description: '音乐聚合播放器，支持多平台音乐播放'
  },
  { 
    id: 12, 
    title: 'SoundCloud', 
    url: 'https://soundcloud.com',
    description: '国际音乐平台，提供独立音乐人作品分享和发现'
  },
  { 
    id: 13, 
    title: 'Spotify', 
    url: 'https://open.spotify.com',
    description: '全球流行的音乐流媒体服务平台'
  },
  { 
    id: 14, 
    title: '果核音乐搜索', 
    url: 'https://music.ghxi.com',
    description: '音乐聚合搜索，支持多平台音乐搜索和下载'
  }
]);
//AI工具
const aiResources = ref([
  {
    id: 1,
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: '全球最热门的AI助手，支持免费使用GPT-3.5'
  },
  {
    id: 2,
    title: '文心一言',
    url: 'https://yiyan.baidu.com',
    description: '百度AI助手，免费使用次数充足'
  },
  {
    id: 3,
    title: 'Claude',
    url: 'https://claude.ai',
    description: '免费使用GPT-4级别模型，支持上传文件'
  },
  {
    id: 4,
    title: '通义千问',
    url: 'https://qianwen.aliyun.com',
    description: '阿里AI助手，每日免费额度generous'
  },
  {
    id: 5,
    title: 'Deepseek',
    url: 'https://chat.deepseek.com',
    description: '免费使用强大的代码助手，支持中文'
  },
  {
    id: 6,
    title: 'Kimi Chat',
    url: 'https://kimi.moonshot.cn',
    description: '月之暗面AI助手，免费使用无限制'
  },
  {
    id: 7,
    title: '智谱清言',
    url: 'https://chatglm.cn',
    description: '清华ChatGLM模型，响应速度快'
  },
  {
    id: 8,
    title: '讯飞星火',
    url: 'https://xinghuo.xfyun.cn',
    description: '科大讯飞AI助手，语音交互强大'
  },
  {
    id: 9,
    title: 'Codeium',
    url: 'https://codeium.com',
    description: '免费AI代码补全和生成工具'
  },
  {
    id: 10,
    title: 'Cursor',
    url: 'https://cursor.sh',
    description: 'AI编程IDE，代码解释和生成'
  },
  {
    id: 11,
    title: 'Bito AI',
    url: 'https://bito.ai',
    description: 'AI编程助手，支持多种IDE插件'
  },
  {
    id: 12,
    title: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    description: '微软AI编程助手，学生免费'
  },
  {
    id: 13,
    title: 'Phind',
    url: 'https://phind.com',
    description: '专注于开发者的AI搜索引擎'
  },
  {
    id: 14,
    title: 'Perplexity AI',
    url: 'https://perplexity.ai',
    description: 'AI搜索引擎，实时联网查询'
  },
  {
    id: 15,
    title: 'You.com',
    url: 'https://you.com',
    description: 'AI搜索引擎，支持代码搜索'
  },
  {
    id: 16,
    title: 'Stable Diffusion',
    url: 'https://stablediffusionweb.com',
    description: '免费AI绘画工具，支持在线使用'
  },
  {
    id: 17,
    title: 'Midjourney',
    url: 'https://www.midjourney.com',
    description: '顶级AI绘画工具，画质精美'
  },
  {
    id: 18,
    title: 'Bing Image Creator',
    url: 'https://www.bing.com/create',
    description: '微软免费AI绘画工具，每日限额'
  },
  {
    id: 19,
    title: 'Poe',
    url: 'https://poe.com',
    description: '聚合多个AI模型，包括Claude'
  },
  {
    id: 20,
    title: 'Character AI',
    url: 'https://character.ai',
    description: 'AI角色扮演对话平台'
  },
  {
    id: 21,
    title: 'Hugging Face',
    url: 'https://huggingface.co',
    description: 'AI模型开源社区，可在线体验'
  }
]);
//友情链接
const friendLinks = ref([
  { 
    id: 1, 
    title: '极点AI搜索', 
    url: 'https://s.jdwdai.com',
    description: '由极点维度开发的开源AI搜索网站'
  },
  { 
    id: 2, 
    title: '极点智能体', 
    url: 'https://jdwdai.com',
    description: '由极点维度开发的智能体平台，有自媒体文章生成，论文写作等'
  },
]);
</script>
