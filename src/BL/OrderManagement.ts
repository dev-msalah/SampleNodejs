import { Router, Request, Response, NextFunction } from 'express';
import { isNumeric } from 'rxjs/util/isNumeric';
import { isString } from 'util';
import { OrdersRepository } from '../DAL/OrdersRepository';
import { Order } from '../Model/Order';

let ordersRepository = new OrdersRepository();

/**
 * Handles all data retival 
 */
export class OrderManagement {
  router: Router

  /**
   * Initialize the OrderManagement
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET one order by id
   * @param req 
   * @param res 
   * @param next 
   * sample URL => GET http://localhost:3000/api/v1/orders/Get/5
   */
  public GetById(req: Request, res: Response, next: NextFunction) {
    try {
      let orderId = parseInt(req.params.id);
      if (isNumeric(orderId)) {
        ordersRepository.GetById(orderId, function (error: any, response: any, body: any) {
          if (error) {
           return res.status(404).send({
              message: 'No orders found with the given Order Id.',
              status: res.status
            });
          }

         return res.status(200).send({
            message: 'Success',
            status: res.status,
            matchedOrders: JSON.parse(body)
          });
        });
      }
      else {
        return res.status(500).send({
          message: 'Invalid paramter!',
          status: res.status
        });
      }
    }
    catch (ex) {
      throw ex;
    }
  }

  /**
   * GET all orders from database
   * @param req 
   * @param res 
   * @param next 
   * sample URL => GET http://localhost:3000/api/v1/orders/
   */
  public GetAll(req: Request, res: Response, next: NextFunction) {
    try {
      ordersRepository.GetAll(function (error: any, response: any, body: any) {
        if (error) {
          return res.status(500).send({
            message: 'No orders found with the given company name.',
            status: res.status
          });
        }

       return res.status(200).send({
          message: 'Success',
          status: res.status,
          matchedOrders: JSON.parse(body)
        });
      });
    }
    catch (ex) {
      throw ex;
    }
  }

  /**
   * Get all orders by company name
   * @param req 
   * @param res 
   * @param next 
   * sample URL => GET http://localhost:3000/api/v1/orders/GetByCompanyName/Cheapskates
   */
  public GetByCompanyName(req: Request, res: Response, next: NextFunction) {
    try {
      let companyName = req.params.companyName;
      if (isString(companyName) && companyName !== 'undefined') {
        ordersRepository.GetByCompanyName(companyName, function (error: any, response: any, body: any) {
          if (error) {
          return  res.status(404).send({
              message: 'No orders found with the given company name.',
              status: res.status
            });
          }

         return res.status(200).send({
            message: 'Success',
            status: res.status,
            matchedOrders: JSON.parse(body)
          });
        });
      }
      else {
       return res.status(500).send({
          message: 'Invalid paramter!',
          status: res.status
        });
        //throw new Error('Invalid paramter!');
      }
    }
    catch (ex) {
      throw ex;
    }
  }

  /**
   * Get all orders for address
   * @param req 
   * @param res 
   * @param next 
   * Sample URL => GET http://localhost:3000/api/v1/orders/GetByAddress/Reeperbahn 153
   */
  public GetByAddress(req: Request, res: Response, next: NextFunction) {
    try {
      let address = req.params.address;
      if (isString(address) && address !== 'undefined') {
        ordersRepository.GetByAddress(address, function (error: any, response: any, body: any) {
          if (error) {
         return   res.status(404).send({
              message: 'No orders found with the given address.',
              status: res.status
            });
          }

         return res.status(200).send({
            message: 'Success',
            status: res.status,
            matchedOrders: JSON.parse(body)
          });
        });
      }
      else {
       return res.status(500).send({
          message: 'Invalid paramter!',
          status: res.status
        });
      }
    }
    catch (ex) {
      throw ex;
    }
  }

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   * Sample URL => POST http://localhost:3000/api/v1/orders/Add
   * {
   * "CompanyName": "Mohamed",
   * "CustomerAddress": "Lagerstrasse 11 fdsg sfgs dgsf  ad  g",
   * "OrderedItem": "Flux compensa tor sdg sdg sfg "
   * }
   */
  public CreateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      let CompanyName = req.body.CompanyName;
      let CustomerAddress = req.body.CustomerAddress;
      let OrderedItem = req.body.OrderedItem;

      if (!CompanyName && !CustomerAddress && !OrderedItem) {
        return res.status(500).send({
          message: "Invalid paramter!",
          status: res.status
        });
      }

      let order: Order = new Order(CompanyName, CustomerAddress, OrderedItem);
      if (order === null) {
        return res.status(500).send({
          message: "Invalid paramter!",
          status: res.status
        });

      }
      else {
        ordersRepository.CreateOrder(order, function (error: any, response: any, body: any) {
          if (error) {
            return res.status(404).send({
              message: "Can't found the specified URL",
              status: res.status
            });
          }

          return res.status(200).send({
            message: 'Success',
            status: res.status,
            matchedOrders: body
          });
        });
      }

    }
    catch (ex) {
      throw ex;
    }
  }

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   * Sample URL => PUT http://localhost:3000/api/v1/orders/Edit
   * {
   * 	"OrderId": 5,
   * 	"CompanyName": "Cheapskates23c dsaf Mohamed",
   * 	"CustomerAddress": "Lagerstrasse 11 fdsg sfgs dgsf  ad  g",
   * 	"OrderedItem": "Flux compensa tor sdg sdg sfg "
   * }
   */
  public UpdateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      let orderId = req.body.OrderId;
      let companyName = req.body.CompanyName;
      let customerAddress = req.body.CustomerAddress;
      let orderedItem = req.body.OrderedItem;

      if (!companyName && !customerAddress && !orderedItem) {
        return res.status(500).send({
          message: "Invalid paramter!",
          status: res.status
        });
      }

      if (!isNumeric(orderId)) {
        return res.status(500).send({
          message: "Invalid paramter!",
          status: res.status
        });
      }

      let order: Order = new Order(companyName, customerAddress, orderedItem);
      order.OrderId = orderId;

      ordersRepository.UpdateOrder(order, function (error: any, response: any, body: any) {

        if (error) {
          return res.status(404).send({
            message: "Can't found the specified URL",
            status: res.status
          });
        }

        return res.status(200).send({
          message: 'Success',
          status: res.status,
          matchedOrders: body
        });
      });
    }
    catch (ex) {
      throw ex;
    }
  }

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   * Sample URL => DELETE http://localhost:3000/api/v1/orders/Delete
   * {
   * "OrderId": 4
   * }
   */
  public DeleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      let orderId = req.body.OrderId;

      if (!isNumeric(orderId)) {
        return res.status(500).send({
          message: "Invalid paramter!",
          status: res.status
        });
      }

      ordersRepository.DeleteOrder(orderId, function (error: any, response: any, body: any) {
        if (error) {
          return res.status(404).send({
            message: "Can't found the specified URL",
            status: res.status
          });
        }

        return res.status(200).send({
          message: 'Success',
          status: res.status,
          matchedOrders: body
        });
      });
    }
    catch (ex) {
      throw ex;
    }
  }

  /**
   *
   * @param req 
   * @param res 
   * @param next 
   * Sample URL => http://localhost:3000/api/v1/orders/CountOrders
   */
  public CountOrders(req: Request, res: Response, next: NextFunction) {
    try {
      ordersRepository.CountOrders(function (error: any, response: any, body: any) {
        if (error) {
         return res.status(404).send({
            message: "Can't found the specified URL",
            status: res.status
          });
        }

        let items: Array<any> = new Array<any>();
        Object.keys(body).forEach(function (key, index) {
          items.push({
            OrderedItem: key, // key: the name of the object key
            OrderCount: (body[key] as Array<any>).length
          });
        });

        items = items.sort(function (a, b) {
          var key1 = a.OrderCount;
          var key2 = b.OrderCount;

          return key1 > key2 ? -1 : key1 < key2 ? 1 : 0;;
        });

       return res.status(200).send({
          message: 'Success',
          status: res.status,
          matchedOrders: items
        });
      });
    }
    catch (ex) {
      throw ex;
    }
  }

  private isString(variable: any) {
    return (typeof variable === 'string' || variable instanceof String)
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.GetAll);
    this.router.get('/Get/:id', this.GetById);
    this.router.get('/GetByCompanyName/:companyName', this.GetByCompanyName);
    this.router.get('/GetByAddress/:address', this.GetByAddress);
    this.router.get('/CountOrders', this.CountOrders);
    this.router.post('/Add', this.CreateOrder);
    this.router.put('/Edit', this.UpdateOrder);
    this.router.delete('/Delete', this.DeleteOrder);
  }

}

// Create the OrderManagement, and export its configured Express.Router
const orderManagement = new OrderManagement();
orderManagement.init();

export default orderManagement.router;
