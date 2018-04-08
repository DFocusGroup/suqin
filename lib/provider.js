class Provider {
  constructor(options) {
    this.name = null;
    this.options = options || {};
    this._token = null;
  }

  get token() {
    return this._token;
  }
  set token(val) {
    this._token = val;
    return this._token;
  }

  get fetch() {
    return this._fetch;
  }
  set fetch(axios) {
    let agent = axios.create(this.options.request || {});
    this._fetch = agent.request;
  }

  get readAPIs() {
    return {
      // 基本方案实现
      getUser: function (filter, onErr) {
        return this.fetch(filter).catch(onErr);
      }
    };
  }

  get writeAPIs() {
    return {};
  }
}

module.exports = Provider;
