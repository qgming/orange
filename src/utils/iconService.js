/**
 * 图标服务 - 提供多种获取网站图标的方法
 *
 * 功能特性：
 * 1. 优化的异步加载策略（缓存 > 网站目录 > 第三方API）
 * 2. 内存缓存机制避免重复请求
 * 3. 并行检测多个图标源，快速获取第一个可用图标
 * 4. 超时控制和错误处理
 * 5. 获取失败返回null，不显示占位图标
 */

class IconService {
  constructor() {
    // 缓存图标URL，避免重复请求
    this.iconCache = new Map();

    // 第三方图标服务列表（按优先级排序）
    this.iconServices = [
      // Google Favicon API - 最稳定可靠
      (domain) =>
        `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
          domain
        )}&sz=64`,
      // Favicon.im - 中国可用的图标服务
      (domain) =>
        `https://api.favicon.im/${encodeURIComponent(domain)}?larger=true`,
      // Yandex Favicon API - 俄罗斯服务，中国可访问
      (domain) =>
        `https://favicon.yandex.net/favicon/${encodeURIComponent(domain)}`,
    ];

    // 黄色表情符号列表（10个）
    this.yellowEmojis = ['😀', '😃', '😄', '😁', '😆', '😊', '😎', '🤗', '🤩', '😺'];
  }

  /**
   * 获取随机黄色表情符号作为Data URL
   * @param {string} domain - 域名（用于保持一致性）
   * @returns {string} 表情符号的Data URL
   */
  getRandomEmojiDataUrl(domain) {
    // 使用域名的哈希值来选择表情符号，确保同一域名总是显示相同的表情
    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
      hash = ((hash << 5) - hash) + domain.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % this.yellowEmojis.length;
    const emoji = this.yellowEmojis[index];

    // 创建一个canvas来绘制表情符号
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // 不设置背景，保持透明

    // 绘制表情符号（增大尺寸以适应透明背景）
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 32, 32);

    // 转换为Data URL
    return canvas.toDataURL('image/png');
  }

  /**
   * Base64编码Unicode字符串
   * @param {string} str - 要编码的字符串
   * @returns {string} Base64编码后的字符串
   */
  base64EncodeUnicode(str) {
    const bytes = new TextEncoder().encode(str);
    const binary = String.fromCharCode(...bytes);
    return btoa(binary);
  }

  /**
   * 获取网站域名
   * @param {string} url - 网站URL
   * @returns {string} 域名
   */
  getDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  /**
   * 尝试从标准路径获取图标
   * @param {string} url - 网站URL
   * @returns {string} 图标URL
   */
  getStandardFavicon(url) {
    try {
      const domain = new URL(url).origin;
      return `${domain}/favicon.ico`;
    } catch {
      return "";
    }
  }

  /**
   * 尝试从推测路径获取图标
   * @param {string} url - 网站URL
   * @returns {Array} 图标URL数组
   */
  getAlternativeIconPaths(url) {
    try {
      const domain = new URL(url).origin;
      const paths = [
        `${domain}/assets/favicon.ico`,
        `${domain}/static/favicon.ico`,
        `${domain}/img/favicon.ico`,
        `${domain}/images/favicon.ico`,
        `${domain}/favicon.png`,
        `${domain}/assets/favicon.png`,
        `${domain}/apple-touch-icon.png`,
        `${domain}/apple-touch-icon-precomposed.png`,
        `${domain}/mstile-150x150.png`,
      ];
      return paths;
    } catch {
      return [];
    }
  }

  /**
   * 通过第三方服务获取图标
   * @param {string} domain - 域名
   * @param {number} serviceIndex - 服务索引
   * @returns {string|null} 图标URL，如果超出索引返回null
   */
  getIconFromService(domain, serviceIndex = 0) {
    if (serviceIndex >= this.iconServices.length) {
      return null;
    }
    return this.iconServices[serviceIndex](domain);
  }


  /**
   * 检测图标是否可访问（异步，优化超时）
   * @param {string} iconUrl - 图标URL
   * @param {number} timeout - 超时时间（毫秒）
   * @returns {Promise<boolean>} 是否可访问
   */
  async checkIconAvailability(iconUrl, timeout = 2000) {
    // 跳过Data URL检测，直接返回true
    if (iconUrl.startsWith('data:')) {
      return true;
    }

    return new Promise((resolve) => {
      const img = new Image();
      let resolved = false;

      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          img.onload = null;
          img.onerror = null;
          img.src = '';
        }
      };

      img.onload = () => {
        cleanup();
        resolve(true);
      };

      img.onerror = () => {
        cleanup();
        resolve(false);
      };

      // 设置超时
      const timer = setTimeout(() => {
        cleanup();
        resolve(false);
      }, timeout);

      img.src = iconUrl;
    });
  }

  /**
   * 获取网站图标 - 优化的异步加载策略
   * 优先级：缓存 > 网站目录 > 第三方服务 > 随机表情符号
   * @param {string} url - 网站URL
   * @param {Object} options - 选项
   * @param {boolean} options.cache - 是否使用缓存
   * @returns {Promise<string>} 图标URL，如果获取失败返回随机表情符号
   */
  async getWebsiteIcon(url, options = {}) {
    const { cache = true } = options;
    const domain = this.getDomain(url);

    // 1. 优先检查缓存
    if (cache && this.iconCache.has(domain)) {
      return this.iconCache.get(domain);
    }

    let finalIconUrl = null;

    // 2. 尝试网站标准路径（并行检测，使用第一个成功的）
    const standardIcon = this.getStandardFavicon(url);
    const alternativePaths = this.getAlternativeIconPaths(url);
    const allPaths = [standardIcon, ...alternativePaths];

    finalIconUrl = await this.findFirstAvailableIcon(allPaths);

    // 3. 如果网站目录都失败，尝试第三方服务（仅Google）
    if (!finalIconUrl) {
      const serviceUrls = this.iconServices.map((service) => service(domain));
      finalIconUrl = await this.findFirstAvailableIcon(serviceUrls);
    }

    // 4. 如果所有服务都失败，使用随机表情符号
    if (!finalIconUrl) {
      finalIconUrl = this.getRandomEmojiDataUrl(domain);
    }

    // 缓存结果
    if (cache) {
      this.iconCache.set(domain, finalIconUrl);
    }

    return finalIconUrl;
  }

  /**
   * 并行检测多个图标URL，返回第一个可用的（使用Promise.race优化）
   * @param {Array<string>} iconUrls - 图标URL数组
   * @returns {Promise<string|null>} 第一个可用的图标URL，如果都不可用则返回null
   */
  async findFirstAvailableIcon(iconUrls) {
    if (!iconUrls || iconUrls.length === 0) {
      return null;
    }

    // 使用Promise.race策略：一旦有一个成功就立即返回
    return new Promise((resolve) => {
      let completedCount = 0;
      const totalCount = iconUrls.length;

      iconUrls.forEach(async (iconUrl) => {
        try {
          const isAvailable = await this.checkIconAvailability(iconUrl);
          if (isAvailable) {
            resolve(iconUrl);
          } else {
            completedCount++;
            if (completedCount === totalCount) {
              resolve(null);
            }
          }
        } catch {
          completedCount++;
          if (completedCount === totalCount) {
            resolve(null);
          }
        }
      });
    });
  }

  /**
   * 批量获取图标（优化并发控制）
   * @param {Array} urls - URL数组
   * @param {Object} options - 选项
   * @param {number} options.batchSize - 批次大小
   * @param {Function} options.onProgress - 进度回调
   * @returns {Promise<Object>} 域名-图标URL映射
   */
  async batchGetIcons(urls, options = {}) {
    const { batchSize = 8, onProgress } = options;
    const results = {};
    let processedCount = 0;

    // 并发请求，但限制并发数避免过多请求
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const promises = batch.map(async (url) => {
        try {
          const iconUrl = await this.getWebsiteIcon(url, { cache: true });
          const domain = this.getDomain(url);
          return { domain, iconUrl };
        } catch {
          return { domain: this.getDomain(url), iconUrl: "" };
        }
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ domain, iconUrl }) => {
        results[domain] = iconUrl;
        processedCount++;

        // 调用进度回调
        if (onProgress) {
          onProgress(processedCount, urls.length, domain);
        }
      });
    }

    return results;
  }

  /**
   * 预加载重要网站的图标（智能优先级）
   * @param {Array} importantUrls - 重要网站URL数组
   * @param {Object} options - 选项
   * @returns {Promise<Object>} 预加载结果
   */
  async preloadIcons(importantUrls, options = {}) {
    const { onProgress, priorityFirst = true } = options;

    if (priorityFirst) {
      // 优先加载推荐网站的图标
      console.log(`开始预加载 ${importantUrls.length} 个网站图标...`);
    }

    const results = await this.batchGetIcons(importantUrls, {
      cache: true,
      batchSize: 10,
      onProgress,
    });

    console.log(`图标预加载完成: ${Object.keys(results).length} 个`);
    return results;
  }

  /**
   * 获取图标加载统计信息
   * @returns {Object} 统计信息
   */
  getLoadStats() {
    const cached = this.iconCache.size;
    const cacheHitRate =
      cached > 0 ? ((cached / (cached + 1)) * 100).toFixed(2) : 0;

    return {
      cachedCount: cached,
      cacheHitRate: `${cacheHitRate}%`,
      cacheKeys: Array.from(this.iconCache.keys()),
    };
  }

  /**
   * 清理图标缓存
   */
  clearCache() {
    this.iconCache.clear();
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} 缓存统计
   */
  getCacheStats() {
    return {
      cachedIcons: this.iconCache.size,
      cacheKeys: Array.from(this.iconCache.keys()),
    };
  }
}

// 创建单例实例
const iconService = new IconService();

// 导出方法和实例
export { iconService, IconService };

// 便捷方法
export const getWebsiteIcon = (url, options) =>
  iconService.getWebsiteIcon(url, options);
export const getDomain = (url) => iconService.getDomain(url);
export const preloadIcons = (urls) => iconService.preloadIcons(urls);
