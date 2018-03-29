const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('server', function(){
    before(function(){
        return runServer();
    });
    after(function(){
        return closeServer();
    });

    it('should return a 200 status code', function(){
        return chai.request(app)
            .get('/')
            .then(function(res){
                expect(res).to.have.status(200);
            });
    });
});