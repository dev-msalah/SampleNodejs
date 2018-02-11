import { Router, Request, Response, NextFunction } from 'express';
import { Order } from '../Model/Order';
import { isNumeric } from 'rxjs/util/isNumeric';
const request = require("request");

export class OrdersRepository {

    /**
   * Initialize the orderRepository
   */
    constructor() {

    }

    public URL: string = 'https://ordersms-078c.restdb.io/rest/order';
    public Headers: any = {
        'cache-control': 'no-cache',
        'x-apikey': 'b3a49c297e19c39b67d2ecc90bfa3a3393f95',
        'content-type': 'application/json'
    }

/**
 * Get all Orders from Database
 * @param callbackFunction 
 */
    public GetAll(callbackFunction: any) {
        try {
            var options = {
                method: 'GET',
                url: this.URL,
                headers: this.Headers
            };
            request(options, callbackFunction);
        }
        catch (ex) {
            throw ex;
        }
    }

    /**
     * Get all Orders that match company name
     * @param companyName 
     * @param callbackFunction 
     */
    public GetByCompanyName(companyName: string, callbackFunction: any) {
        try {
            if(!companyName)
                throw new Error('Invalid paramter!');

            var query = '?q={"CompanyName": "' + companyName + '"}';
            var options = {
                method: 'GET',
                url: this.URL + query,
                headers: this.Headers
            };
            request(options, callbackFunction);
        }
        catch (ex) {
            throw ex;
        }

    }

    /**
     * Get all orders that match address
     * @param address 
     * @param callbackFunction 
     */
    public GetByAddress(address: string, callbackFunction: any) {
        try {    
            if(!address)
                throw new Error('Invalid paramter!');
                    
            var query = '?q={"CustomerAddress": "' + address + '"}';
            var options = {
                method: 'GET',
                url: this.URL + query,
                headers: this.Headers
            };
            request(options, callbackFunction);
        }
        catch (ex) {
            throw ex;
        }
    }

    /**
     * Get all orders that match order id
     * @param orderId 
     * @param callbackFunction 
     */
    public GetById(orderId: number, callbackFunction: any) {
        try {
            if(!orderId)
                throw new Error('Invalid paramter!');

            var query = '?q={"OrderId": ' + orderId + '}';
            var options = {
                method: 'GET',
                url: this.URL + query,
                headers: this.Headers
            };
            request(options, callbackFunction);
        }
        catch (ex) {
            throw ex;
        }
    }

    /**
     * Create a new Order 
     * @param order 
     * @param callbackFunction 
     */
    public CreateOrder(order: Order, callbackFunction: any) {
        try {
            if(!order)
                throw new Error('Invalid paramter!');

            var options = {
                method: 'POST',
                url: this.URL,
                headers: this.Headers,
                body: order,
                json: true
            };
            request(options, callbackFunction);
        }
        catch (ex) {
            throw ex;
        }
    }

    /**
     * Update an Existing order
     * @param order 
     * @param callbackFunction 
     */
    public UpdateOrder(order: Order, callbackFunction: any) {
        try {
            if(!order && !order.OrderId)
                throw new Error('Invalid paramter!');

            var _this = this;
            var _order = order;
            
            this.GetById(order.OrderId, function (error: any, response: any, body: any) {
                if (JSON.parse(body)[0] === undefined)
                    throw new Error('Invalid Order Id!');
                
                var recordId = JSON.parse(body)[0]._id;
                var options = {
                    method: 'PUT',
                    url: _this.URL + '/' + recordId,
                    headers: _this.Headers,
                    body: _order,
                    json: true
                };
                request(options, callbackFunction);
            })
        }
        catch (ex) {
            throw ex;
        }
    }

    /**
     * Delete an order 
     * @param orderId 
     * @param callbackFunction 
     */
    public DeleteOrder(orderId: number, callbackFunction: any) {
        try {
            if (!isNumeric(orderId)) 
                throw new Error('Invalid paramter!');

            var options = {
                method: 'Delete',
                url: this.URL + '/*?q={"OrderId": ' + orderId + '}',
                headers: this.Headers,
                json: true
            };
            request(options, callbackFunction);
        }
        catch (ex) {
            throw ex;
        }
    }

    public CountOrders(callbackFunction: any) {
        try {
            var options = {
                method: 'GET',
                url: this.URL + '?groupby=OrderedItem',
                headers: this.Headers,
                json: true
            };
            request(options, callbackFunction);
        }
        catch (ex) {
            throw ex;
        }
    }
}

export default OrdersRepository