const Provider = require('../').Provider;

class sampleProvider extends Provider {
  constructor(options) {
    super(options);
    this.name = 'sp';
  }

  get readAPIs() {
    return {
      getToken: function () {
        return this.fetch({
          url: '/',
          params: {
            getToken: 1
          }
        }).then(function (res) {
          this.token = res.data;
        }.bind(this));
      },
      getUser: function (filter, fn, onErr) {
        return this.fetch(filter).then(fn).catch(onErr);
      }
    };
  }

  get writeAPIs() {
    return {
      setUser: function (filter, fn, onErr) {
        return this.fetch({
          method: 'post',
          url: filter.url,
          params: filter.id,
          headers: { 'Authorization': filter.token }
        }).then(fn).catch(onErr);
      }      
    };
  }
}

module.exports = sampleProvider;
