import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { OrdersRepository } from '../src/DAL/OrdersRepository';
import { Order } from '../src/Model/Order';
import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

let ordersRepository = new OrdersRepository();

describe('GET api/v1/orders', () => {
  var OrderId;
  before(function (done) {
    // runs before all tests in this block
    let order: Order = new Order("N Company", "Alexandria", "Flux compensa 1");
    ordersRepository.CreateOrder(order, function (error: any, response: any, body: any) {
      OrderId = body.OrderId;
      done();
    });
  });

  after(function (done) {
    // runs after all tests in this block
    ordersRepository.DeleteOrder(OrderId, function (error: any, response: any, body: any) {
      done();
    });
  });

  it('responds with JSON array 1', () => {
    return chai.request(app).get('/api/v1/orders')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body.message).to.equal("Success");
        expect(res.body.matchedOrders).to.be.an('array');
      });
  });

  it('should include N Company 2', () => {
    chai.request(app).get('/api/v1/orders')
      .then(res => {
        let order = res.body.matchedOrders.find(order => order.CompanyName === 'N Company');
        expect(order).to.exist;
        expect(order).to.have.all.keys([
          '_id',
          'CompanyName',
          'CustomerAddress',
          'OrderedItem',
          'OrderId'
        ]);
      });
  });

  describe('GET api/v1/orders/Get/:id', () => {
    var orderId;
    before(function (done) {
      // runs before all tests in this block
      let order: Order = new Order("x Company", "Alexandria", "Flux compensa 1");
      ordersRepository.CreateOrder(order, function (error: any, response: any, body: any) {
        orderId = body.OrderId;
        done();
      });
    });

    //after
    after(function (done) {
      // runs after all tests in this block
      ordersRepository.DeleteOrder(orderId, function (error: any, response: any, body: any) {
        done();
      });
    });

    it('should have valid Order Id',(done)=>{
      chai.request(app).get('/api/v1/orders/Get/Mohamed' )
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.message).to.be.equal('Invalid paramter!');
        done();
      });
    });

    it('responds with single JSON object', () => {
      return chai.request(app).get('/api/v1/orders/Get/' + orderId)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should return x Company', () => {
      return chai.request(app).get('/api/v1/orders/Get/' + orderId)
        .then(res => {
          expect(res.body.matchedOrders[0].CompanyName).to.equal('x Company');
        });
    });
  });

  //GetByCompanyName
  describe('GET api/v1/orders/GetByCompanyName', () => {
    var companyName;
    var orderId;
    before(function (done) {
      // runs before all tests in this block
      let order: Order = new Order("z Company", "Alexandria", "Flux compensa 1");
      ordersRepository.CreateOrder(order, function (error: any, response: any, body: any) {
        orderId = body.OrderId;
        companyName = body.CompanyName;
        done();
      });
    });

    //after
    after(function (done) {
      // runs after all tests in this block
      ordersRepository.DeleteOrder(orderId, function (error: any, response: any, body: any) {
        done();
      });
    });

    it('responds with single JSON object', () => {
      return chai.request(app).get('/api/v1/orders/GetByCompanyName/' + companyName)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should return z Company', () => {
      return chai.request(app).get('/api/v1/orders/GetByCompanyName/' + companyName)
        .then(res => {
          expect(res.body.matchedOrders[0].CompanyName).to.equal('z Company');
        });
    });

    it('should accept string company name', (done) => {
      var param;

      chai.request(app).get('/api/v1/orders/GetByCompanyName/' + param).end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
    });

    it('should return empty object if result not found', () => {
      return chai.request(app).get('/api/v1/orders/GetByCompanyName/9999999999999999999999999999999999999999')
        .then(res => {
          expect(res.body.matchedOrders[0]).to.equal(undefined);
        });
    });
  });

  //GetByAddress
  describe('GET api/v1/orders/GetByAddress', () => {
    var customerAddress;
    var orderId;
    before(function (done) {
      // runs before all tests in this block
      let order: Order = new Order("y Company", "Alexandria, Egypt", "Flux compensa 1");
      ordersRepository.CreateOrder(order, function (error: any, response: any, body: any) {
        orderId = body.OrderId;
        customerAddress = body.CustomerAddress;
        done();
      });
    });

    //after
    after(function (done) {
      // runs after all tests in this block
      ordersRepository.DeleteOrder(orderId, function (error: any, response: any, body: any) {
        done();
      });
    });

    it('responds with single JSON object', () => {
      return chai.request(app).get('/api/v1/orders/GetByAddress/' + customerAddress)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should return Order with address Alexandria, Egypt', () => {
      return chai.request(app).get('/api/v1/orders/GetByAddress/' + customerAddress)
        .then(res => {
          expect(res.body.matchedOrders[0].CustomerAddress).to.equal('Alexandria, Egypt');
        });
    });

    it('should accept string address', (done) => {
      var param;
      chai.request(app).get('/api/v1/orders/GetByAddress/' + param).end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
    });

    it('should return empty object if result not found', () => {
      return chai.request(app).get('/api/v1/orders/GetByAddress/Holland')
        .then(res => {
          expect(res.body.matchedOrders[0]).to.equal(undefined);
        });
    });
  });

  //CountOrders
  describe('GET api/v1/orders/CountOrders', () => {
    var customerAddress: string[] = [];
    var orderId: number[] = [];
    before(function (done) {
      // runs before all tests in this block
      let order: Order = new Order("k Company", "Alexandria, Egypt", "Flux compensa 1300");
      let order2: Order = new Order("k2 Company", "Alexandria, Egypt", "Flux compensa 1200");
      let order3: Order = new Order("k2 Company", "Alexandria, Egypt", "Flux compensa 1000");

      var order_onCreate = function (order, arrayIndex) {
        return new Promise(function (resolve, reject) {
          ordersRepository.CreateOrder(order, function (error: any, response: any, body: any) {
            orderId[arrayIndex] = body.OrderId;
            customerAddress[arrayIndex] = body.CustomerAddress;
            resolve();
          });
        });
      };

      order_onCreate(order, 0).then(function () {
        return order_onCreate(order, 1).then(function () {
          return order_onCreate(order, 2).then(function () {
            return order_onCreate(order2, 3).then(function () {
              return order_onCreate(order2, 4).then(function () {
                return order_onCreate(order3, 5).then(function () {
                  done();
                });
              });
            });
          });
        });
      });

    });

    //after
    after(function (done) {
      // runs after all tests in this block
      var order_onDelete = function (orderId) {
        return new Promise(function (resolve, reject) {
          ordersRepository.DeleteOrder(orderId, function (error: any, response: any, body: any) {
            resolve();
          });
        });
      };

      order_onDelete(orderId[0]).then(function () {
        return order_onDelete(orderId[1]).then(function () {
          return order_onDelete(orderId[2]).then(function () {
            return order_onDelete(orderId[3]).then(function () {
              return order_onDelete(orderId[4]).then(function () {
                return order_onDelete(orderId[5]).then(function () {
                  done();
                });
              });
            });
          });
        });
      });
    });

    it('responds with single JSON object', () => {
      return chai.request(app).get('/api/v1/orders/CountOrders')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should return (Flux compensa 1300) with OrderCount = 3', () => {
      return chai.request(app).get('/api/v1/orders/CountOrders')
        .then(res => {
          var matchedOrder = res.body.matchedOrders.filter(x => x.OrderedItem == "Flux compensa 1300")
          expect(matchedOrder).to.be.an('array');
          expect(matchedOrder[0].OrderCount).to.equal(3);
        });
    });

    it('should return (Flux compensa 1200) with OrderCount = 2', () => {
      return chai.request(app).get('/api/v1/orders/CountOrders')
        .then(res => {
          var matchedOrder = res.body.matchedOrders.filter(x => x.OrderedItem == "Flux compensa 1200")
          expect(matchedOrder).to.be.an('array');
          expect(matchedOrder[0].OrderCount).to.equal(2);
        });
    });

    it('should return (Flux compensa 1000) with OrderCount = 1', () => {
      return chai.request(app).get('/api/v1/orders/CountOrders')
        .then(res => {
          var matchedOrder = res.body.matchedOrders.filter(x => x.OrderedItem == "Flux compensa 1000")
          expect(matchedOrder).to.be.an('array');
          expect(matchedOrder[0].OrderCount).to.equal(1);
        });
    });

    it('should not accept parameters', (done) => {
      chai.request(app).get('/api/v1/orders/CountOrders/123123').end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
  });

  //Add
  describe('POST api/v1/orders/Add', () => {
    var orderIds: number[] = [];
    //after
    after(function (done) {
      // runs after all tests in this block
      var order_onDelete = function (orderId) {
        return new Promise(function (resolve, reject) {
          ordersRepository.DeleteOrder(orderId, function (error: any, response: any, body: any) {
            resolve();
          });
        });
      };

      order_onDelete(orderIds[0]).then(function () {
        return order_onDelete(orderIds[1]).then(function () {
          return order_onDelete(orderIds[2]).then(function () {
            return order_onDelete(orderIds[3]).then(function () {
              done();
            });
          });
        });
      });
    });

    it('should be POST Request', (done) => {
      chai.request(app).get('/api/v1/orders/Add').end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });

    it('should have json object in in request body', () => {
      return chai.request(app).post('/api/v1/orders/Add').set(
        "Content-Type", "application/json"
      ).send({
        "CompanyName": "Created Company",
        "CustomerAddress": "Alexandria",
        "OrderedItem": "Flux compensa 1"
      })
        .then(res => {
          orderIds[0] = res.body.matchedOrders.OrderId;
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should have valid json object in request body', (done) => {
      chai.request(app).post('/api/v1/orders/Add').set(
        "Content-Type", "application/json"
      ).send({
        "Nothing": "0"
      })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.be.equal('Invalid paramter!');
          done();
        });
    });

    it('should not have empty json object in request body', (done) => {
      chai.request(app).post('/api/v1/orders/Add').set(
        "Content-Type", "application/json"
      ).send({
      })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.be.equal('Invalid paramter!');
          done();
        });
    });

    it('should create order with Company Name only', () => {
      return chai.request(app).post('/api/v1/orders/Add').set(
        "Content-Type", "application/json"
      ).send({
        "CompanyName": "Created 1 Company"
      })
        .then(res => {
          orderIds[1] = res.body.matchedOrders.OrderId;
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should create order with Customer Address only', () => {
      return chai.request(app).post('/api/v1/orders/Add').set(
        "Content-Type", "application/json"
      ).send({
        "CustomerAddress": "Alexandria"
      })
        .then(res => {
          orderIds[2] = res.body.matchedOrders.OrderId;
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should create order with Ordered Item only', () => {
      return chai.request(app).post('/api/v1/orders/Add').set(
        "Content-Type", "application/json"
      ).send({
        "OrderedItem": "Flux compensa 1"
      })
        .then(res => {
          orderIds[3] = res.body.matchedOrders.OrderId;
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });
  });

  //Edit
  describe('PUT api/v1/orders/Edit', () => {
    var orderId;

    before(function (done) {
      // runs before all tests in this block
      let order: Order = new Order("r Company", "Alexandria, Egypt", "Flux compensa 1");
      ordersRepository.CreateOrder(order, function (error: any, response: any, body: any) {
        orderId = body.OrderId;
        done();
      });
    });

    //after
    after(function (done) {
      // runs after all tests in this block
      ordersRepository.DeleteOrder(orderId, function (error: any, response: any, body: any) {
        done();
      });
    });

    it('should be PUT Request', (done) => {
      chai.request(app).get('/api/v1/orders/Edit').end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });

    it('should have json object in body', () => {
      return chai.request(app).put('/api/v1/orders/Edit').set(
        "Content-Type", "application/json"
      ).send({
        "OrderId": orderId,
        "CompanyName": "Created Company",
        "CustomerAddress": "Alexandria",
        "OrderedItem": "Flux compensa 1"
      })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should have valid json object in request body', (done) => {
      chai.request(app).put('/api/v1/orders/Edit').set(
        "Content-Type", "application/json"
      ).send({
        "Nothing": "0"
      })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.be.equal('Invalid paramter!');
          done();
        });
    });

    it('should not have empty json object in request body', (done) => {
      chai.request(app).put('/api/v1/orders/Edit').set(
        "Content-Type", "application/json"
      ).send({
      })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.be.equal('Invalid paramter!');
          done();
        });
    });

    it('should have valid Order Id',(done)=>{
      chai.request(app).put('/api/v1/orders/Edit').set(
        "Content-Type", "application/json"
      ).send({
        "OrderId": "Mohamed",
        "CompanyName": "Created 1 Company",
        "CustomerAddress": "Alexandria 1",
        "OrderedItem": "Flux compensa 12"
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.message).to.be.equal('Invalid paramter!');
        done();
      });
    });

    it('should update the whole order', () => {
      return chai.request(app).put('/api/v1/orders/Edit').set(
        "Content-Type", "application/json"
      ).send({
        "OrderId": orderId,
        "CompanyName": "Created 1 Company",
        "CustomerAddress": "Alexandria 1",
        "OrderedItem": "Flux compensa 12"
      })
        .then(res => {

          expect(res.body.matchedOrders.CompanyName).to.be.equal('Created 1 Company');
          expect(res.body.matchedOrders.CustomerAddress).to.be.equal('Alexandria 1');
          expect(res.body.matchedOrders.OrderedItem).to.be.equal('Flux compensa 12');
        });
    });

    it('should update Company Name only', () => {
      return chai.request(app).put('/api/v1/orders/Edit').set(
        "Content-Type", "application/json"
      ).send({
        "OrderId": orderId,
        "CompanyName": "Created 3 Company",
      })
        .then(res => {
          expect(res.body.matchedOrders.CompanyName).to.be.equal('Created 3 Company');
        });
    });

    it('should update Customer Address only', () => {
      return chai.request(app).put('/api/v1/orders/Edit').set(
        "Content-Type", "application/json"
      ).send({
        "OrderId": orderId,
        "CustomerAddress": "Alexandria 13333"
      })
        .then(res => {
          expect(res.body.matchedOrders.CustomerAddress).to.be.equal('Alexandria 13333');

        });
    });
    it('should update Orderd Item Only', () => {
      return chai.request(app).put('/api/v1/orders/Edit').set(
        "Content-Type", "application/json"
      ).send({
        "OrderId": orderId,
        "OrderedItem": "Flux compensa 124545454545"
      })
        .then(res => {
          expect(res.body.matchedOrders.OrderedItem).to.be.equal('Flux compensa 124545454545');
        });
    });
  });
  //Delete
  describe('Delete api/v1/orders/Delete', () => {
    var orderId;

    before(function (done) {
      // runs before all tests in this block
      let order: Order = new Order("r Company", "Alexandria, Egypt", "Flux compensa 1");
      ordersRepository.CreateOrder(order, function (error: any, response: any, body: any) {
        orderId = body.OrderId;
        done();
      });
    });

    //after
    after(function (done) {
      // runs after all tests in this block
      ordersRepository.DeleteOrder(orderId, function (error: any, response: any, body: any) {
        done();
      });
    });

    it('should be Delete Request', (done) => {
      chai.request(app).get('/api/v1/orders/Edit').end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    })
    it('should have json object in body', () => {
      return chai.request(app).del('/api/v1/orders/Delete').set(
        "Content-Type", "application/json"
      ).send({
        "OrderId": orderId
      })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should have valid Order Id',(done)=>{
      chai.request(app).del('/api/v1/orders/Delete').set(
        "Content-Type", "application/json"
      ).send({
        "OrderId": "Mohamed"
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.message).to.be.equal('Invalid paramter!');
        done();
      });
    });

    it('should Delete the whole order', (done) => {
      var createdId;
      let order: Order = new Order("r Company", "Alexandria, Egypt", "Flux compensa 1");

      var order_onCreate = function (order) {
        return new Promise(function (resolve, reject) {
          ordersRepository.CreateOrder(order, function (error: any, response: any, body: any) {
            createdId = body.OrderId;
            resolve();
          });
        });
      };
      order_onCreate(order).then(function () {
        chai.request(app).del('/api/v1/orders/Delete').set(
          "Content-Type", "application/json"
        ).send({
          "OrderId": createdId
        })
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            done();
          });
      });

    })
  });
});