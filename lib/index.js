const Provider = require('./provider');
const axios = require('axios');

class Suqin {
  constructor() {
    this._providers = {};
    this._writable = {};
    this.mainProvider = null;
  }

  /**
   * 添加 provider
   * @param {String} name
   * @param {Provider} provider
   * @param {Boolean} readOnly
   * @public
   */
  use(name, provider, readOnly) {
    // 获取 provider 的名称
    if (!readOnly && !provider) {
      provider = name;
      name = provider.name;
    }

    if (!name) {
      throw new Error('Need a `Name` for provider.');
    }

    // provider 参数必须是 Provider 的实例
    if (!(provider instanceof Provider)) {
      throw new Error('Need a available Provider.');
    }
    
    provider.fetch = axios;
    this._applyAPI(provider);
    this.providers[name] = provider;

    // 默认第一个加入的 provider 是主 provider
    if (!this.mainProvider) {
      this.mainProvider = provider;
    }

    // 第三参数为 true 时，该 provider api 只读
    if (readOnly !== true) {
      this._writable[name] = provider;
    }
    return this;
  }

  /**
   * 设置主 provider
   * @param {String} name Provider 名称
   * @public
   */
  main(name) {
    if (!this._isProvider(name)) {
      throw new Error('Should be the name of one of the providers.');
    }
    this.mainProvider = this.providers[name];
    return this;
  }

  get providers() {
    return this._providers;
  }
  get writable() {
    return this._writable;
  }
 
  /**
   * 是否为已注册 Provider
   * @param {String} name Provider 名称
   */
  _isProvider(name) {
    return name && this._providers[name];
  }

  get _handler() {
    return {
      /**
       * 读操作器
       * @param {String} APIName Provider 的 API 名称
       * @param {String|Boolean} providerName 可选。不传，提供主 provider 结果；传入 true 时，提供所有 provider 结果；传入指定 provider 名称时，提供相应结果。
       */
      readAPIs: function (APIName, providerName, ...args) {
        let result;
        if (providerName === true) {
          result = {};
          let providers = this.providers;
          for (let p in providers) {
            let provider = providers[p];
            result[p] = this._findAPI(provider.readAPIs, APIName).bind(provider)(...args);
          }
        } else {
          if (this._isProvider(providerName)) {
            let provider = this.providers[providerName];
            result = this._findAPI(provider.readAPIs, APIName).bind(provider)(...args);
          } else {
            let provider = this.mainProvider;
            result = this._findAPI(provider.readAPIs, APIName).bind(provider)(providerName, ...args);
          }
        }
    
        return result;
      },
    
      /**
       * 写操作器
       * @param {String} APIName Provider 的 API 名称
       * @param {String} providerName 可选，指定 provider 名称。不传，提供所有可写 provider 结果；传入指定 provider 名称时，提供相应 provider 结果。
       */
      writeAPIs: function (APIName, providerName, ...args) {
        let result;
        if (this._isProvider(providerName)) {
          let provider = this.providers[providerName];
          result = this._findAPI(provider.writeAPIs, APIName).bind(provider)(...args);
        } else {
          result = {};
          let providers = this.writable;
          for (let p in providers) {
            let provider = providers[p];
            result[p] = this._findAPI(provider.writeAPIs, APIName).bind(provider)(providerName, ...args);
          }
        }
        return result;
      }
    };
  }

  /**
   * 检查是否实现了相应 API 接口
   * @param {Object} APIs API 集合
   * @param {String} APIName API 名称
   */
  _findAPI(APIs, APIName) {
    if (!APIs[APIName]) {
      throw new Error(`No API:${APIName}.`);
    }
    return APIs[APIName];
  }

  /**
   * 注册 API
   * @param {Provider} provider Provider 对象
   */
  _applyAPI(provider) {
    for (let rw in this._handler) {
      let handler = this._handler[rw].bind(this);
      for (let name in provider[rw]) {
        // 已有同名方法，不再注册
        if (!this[name]) {
          // 注册成为一个形式方法，被调用时仍用 handler 处理。
          this[name] = function(...args) {
            return handler(name, ...args);
          }
        }
      }
    };
  }
}

Suqin.Provider = Provider;
module.exports = Suqin;
