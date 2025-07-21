/**
 * 网站可用性检测工具
 * 提供多种检测方法来验证网站是否可以正常访问
 */

class SiteChecker {
  constructor(options = {}) {
    this.timeout = options.timeout || 5000; // 默认5秒超时
    this.maxConcurrent = options.maxConcurrent || 5; // 最大并发数
    this.retryCount = options.retryCount || 1; // 重试次数
    this.cache = new Map(); // 缓存检测结果
    this.cacheTimeout = options.cacheTimeout || 300000; // 缓存5分钟
  }

  /**
   * 检测单个网站是否可用
   * @param {string} url - 网站URL
   * @returns {Promise<{url: string, status: boolean, responseTime: number, error?: string}>}
   */
  async checkSite(url) {
    // 检查缓存
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.result;
    }

    const startTime = Date.now();
    let result;

    try {
      // 使用多种检测方法
      const checkPromises = [
        this.checkWithImage(url),
        this.checkWithFetch(url),
        this.checkWithCorsProxy(url),
      ];

      // 使用 Promise.race 获取最快的结果
      const fastestResult = await Promise.race(checkPromises);
      const responseTime = Date.now() - startTime;

      result = {
        url,
        status: true,
        responseTime,
        method: fastestResult.method,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      result = {
        url,
        status: false,
        responseTime,
        error: error.message,
      };
    }

    // 缓存结果
    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * 使用图片加载检测网站可用性
   * @private
   */
  async checkWithImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        img.src = "";
        reject(new Error("Image load timeout"));
      }, this.timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve({ method: "image" });
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("Image load error"));
      };

      // 添加随机参数避免缓存
      const testUrl = new URL(url);
      testUrl.pathname = "/favicon.ico";
      testUrl.searchParams.set("_t", Date.now());

      img.src = testUrl.toString();
    });
  }

  /**
   * 使用fetch API检测网站可用性
   * @private
   */
  async checkWithFetch(url) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 对于no-cors模式，我们无法获取真实状态码
      // 只要请求没有抛出异常，就认为网站可用
      return { method: "fetch" };
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Fetch timeout");
      }
      throw new Error("Fetch error: " + error.message);
    }
  }

  /**
   * 使用CORS代理检测网站可用性
   * @private
   */
  async checkWithCorsProxy(url) {
    const corsProxies = [
      "https://api.allorigins.win/raw?url=",
      "https://cors-anywhere.herokuapp.com/",
      "https://corsproxy.io/?",
    ];

    for (const proxy of corsProxies) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(proxy + encodeURIComponent(url), {
          method: "HEAD",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return { method: "cors-proxy" };
        }
      } catch (error) {
        // 继续尝试下一个代理
        continue;
      }
    }

    throw new Error("All CORS proxies failed");
  }

  /**
   * 批量检测网站可用性
   * @param {Array<string>} urls - 网站URL数组
   * @param {Function} onProgress - 进度回调函数
   * @returns {Promise<Array>}
   */
  async checkSites(urls, onProgress = null) {
    const results = [];
    const total = urls.length;
    let completed = 0;

    // 使用队列控制并发
    const queue = [...urls];
    const workers = [];

    for (let i = 0; i < Math.min(this.maxConcurrent, urls.length); i++) {
      workers.push(
        this.processQueue(queue, results, () => {
          completed++;
          if (onProgress) {
            onProgress(completed, total);
          }
        })
      );
    }

    await Promise.all(workers);
    return results;
  }

  /**
   * 处理队列中的URL
   * @private
   */
  async processQueue(queue, results, onComplete) {
    while (queue.length > 0) {
      const url = queue.shift();
      if (!url) continue;

      let retryCount = 0;
      let lastError;

      while (retryCount <= this.retryCount) {
        try {
          const result = await this.checkSite(url);
          results.push(result);
          onComplete();
          break;
        } catch (error) {
          lastError = error;
          retryCount++;

          if (retryCount <= this.retryCount) {
            // 重试前等待
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
          } else {
            // 所有重试都失败
            results.push({
              url,
              status: false,
              responseTime: -1,
              error: lastError.message,
            });
            onComplete();
          }
        }
      }
    }
  }

  /**
   * 获取检测统计信息
   * @param {Array} results - 检测结果数组
   * @returns {Object} 统计信息
   */
  getStats(results) {
    const total = results.length;
    const available = results.filter((r) => r.status).length;
    const unavailable = total - available;
    const avgResponseTime =
      results
        .filter((r) => r.status && r.responseTime > 0)
        .reduce((sum, r) => sum + r.responseTime, 0) / available || 0;

    return {
      total,
      available,
      unavailable,
      availabilityRate: total > 0 ? ((available / total) * 100).toFixed(1) : 0,
      avgResponseTime: Math.round(avgResponseTime),
    };
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 获取缓存大小
   */
  getCacheSize() {
    return this.cache.size;
  }
}

// 创建全局实例
export const siteChecker = new SiteChecker({
  timeout: 8000,
  maxConcurrent: 3,
  retryCount: 2,
  cacheTimeout: 300000, // 5分钟缓存
});

// 便捷函数
export const checkSite = (url) => siteChecker.checkSite(url);
export const checkSites = (urls, onProgress) =>
  siteChecker.checkSites(urls, onProgress);
export const getStats = (results) => siteChecker.getStats(results);

export default SiteChecker;
