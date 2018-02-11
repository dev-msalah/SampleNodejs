export class Order {
    OrderId: number;
    CompanyName: string;
    CustomerAddress: string;
    OrderedItem: string;

    constructor( companyName: string, customerAddress: string, orderedItem: string) {
        this.CompanyName = companyName;
        this.CustomerAddress = customerAddress;
        this.OrderedItem = orderedItem;
    }
}