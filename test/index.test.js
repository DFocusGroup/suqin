const Suqin = require('../');
const sampleProvider = require('./sampleProvider');
const nonameProvider = require('./nonameProvider');

describe('Suqin', function () {
  describe('constructor testing', function() {
    let directories = new Suqin();
    let sp = new sampleProvider();
    let nn = new nonameProvider();

    it('should created subclass well', function (done) {
      directories.should.have.properties({
        _providers: {},
        _writable: {},
        mainProvider: null
      });
      done();
    });
    it('should added a provider well', function (done) {
      directories.use(sp);
      directories.providers.should.have.properties(sp.name);
      done();
    });
    it('should threw an error when provider has no name given', function (done) {
      try {
        directories.use(nn);
      } catch (error) {
        error.should.instanceof(Error);
        error.message.should.eql('Need a `Name` for provider.');
      }
      done();
    });
    it('should added a provider without name well, when name is given by init', function (done) {
      directories.use('nn', nn);
      directories.providers.should.have.properties('nn');
      done();
    });
    it('should threw an error when provider was not given', function (done) {
      try {
        directories.use('aa', true);
      } catch (error) {
        error.should.instanceof(Error);
        error.message.should.eql('Need a available Provider.');
      }
      done();
    });
    it('should not got a writable provider when readOnly set true', function (done) {
      let ro = new sampleProvider();
      directories.use('ro', ro, true);
      directories.providers.should.have.properties('ro');
      directories.writable.should.not.have.properties('ro');
      done();
    });
  });
  describe('functions testing', function () {
    let directories = new Suqin();
    let sp = new sampleProvider();
    let nn = new nonameProvider();

    it('should put the first `use` provider as the main provider', function (done) {
      directories.use(sp).use('nn', nn);
      directories.mainProvider.should.eql(sp);
      done();
    });
    it('should change the main provider after #main called', function (done) {
      directories.main('nn');
      directories.mainProvider.should.eql(nn);
      done();
    });
    it('should threw an error when unknown provider name by #main called', function (done) {
      try {
        directories.main('hahaha');
      } catch (error) {
        error.should.instanceof(Error);
        error.message.should.eql('Should be the name of one of the providers.');
      }
      done();
    });
    it('should threw an error when the function is not be applied', function (done) {
      try {
        directories.setUser('nn', {}, function () {});
      } catch (error) {
        error.should.instanceof(Error);
        error.message.should.eql('No API:setUser.');
      }
      done();
    });
  });
});

describe('Provider', function () {
  const server = require('./sampleServer');
  describe('API testing', function () {
    describe('one provider', function () {
      let directories = new Suqin();
      let nn = new nonameProvider({
        request: {
          baseURL: 'http://127.0.0.1:3000/'
        }
      });
      directories.use('nn', nn);

      it('should inherited all functions of Provider', function () {
        return directories.getUser({
          url: '/',
          id: 'A'
        }, function (res) {
        }, function (err) {
          should(err.response.status).eql(401);
        });
      });
      it('should done well when an specified provider set by call #getUser', function () {
        return directories.getUser('nn', {
          url: '/',
          id: 'A'
        }, function (res) {
        }, function (err) {
          should(err.response.status).eql(401);
        });
      });
    });
    describe('two providers', function () {
      let directories = new Suqin();
      let nn = new nonameProvider({
        request: {
          baseURL: 'http://127.0.0.1:3000/'
        }
      });
      let sp = new sampleProvider({
        request: {
          baseURL: 'http://127.0.0.1:3000/'
        }
      });
      directories.use(sp).use('nn', nn, true);

      it('should done well when call all providers', function () {
        return directories.getUser(true, {
          url: '/',
          id: 'A'
        }, function (res) {
        }, function (err) {
          should(err.response.status).eql(401);
        }).should.have.properties(['sp', 'nn']);
      });
      it('should done with only writable providers', function () {
        return directories.setUser(true, {
          url: '/',
          id: 'A'
        }, function (res) {
        }, function (err) {
          should(err.response.status).eql(401);
        }).should.have.not.properties(['nn']);
      });
      it('should done well when an specified provider set by call #setUser', function () {
        return directories.getUser('sp', {
          url: '/',
          id: 'A'
        }, function (res) {
        }, function (err) {
          should(err.response.status).eql(401);
        });
      });
      it('should got token and got right response with token', function () {
        directories.getToken().then(function () {
          directories.setUser('sp', {
            url: '/',
            id: 'A',
            token: sp.token
          }, function (res) {
            should(res.status).eql(200);
          }, function (err) {
            console.log(err);
          });
        });
      });
    });
  });
  after(function () {
    server.close();
  });
})
