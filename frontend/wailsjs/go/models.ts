export namespace controllers {
	
	export class Credentials {
	    user_name: string;
	    password: string;
	
	    static createFrom(source: any = {}) {
	        return new Credentials(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.user_name = source["user_name"];
	        this.password = source["password"];
	    }
	}
	export class DataDay {
	    year: number;
	    month: number;
	    day: number;
	
	    static createFrom(source: any = {}) {
	        return new DataDay(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.year = source["year"];
	        this.month = source["month"];
	        this.day = source["day"];
	    }
	}
	export class DataMonth {
	    year: number;
	    month: number;
	
	    static createFrom(source: any = {}) {
	        return new DataMonth(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.year = source["year"];
	        this.month = source["month"];
	    }
	}
	export class DataWeek {
	    year: number;
	    week: number;
	
	    static createFrom(source: any = {}) {
	        return new DataWeek(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.year = source["year"];
	        this.week = source["week"];
	    }
	}

}

export namespace models {
	
	export class BarCode {
	    id: number;
	    name: string;
	    tag: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new BarCode(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.tag = source["tag"];
	        this.value = source["value"];
	    }
	}
	export class ConfigData {
	    name: string;
	    ipPrinter: string;
	    port: string;
	
	    static createFrom(source: any = {}) {
	        return new ConfigData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.ipPrinter = source["ipPrinter"];
	        this.port = source["port"];
	    }
	}
	export class DataProduct {
	    id: number;
	    name: string;
	    description: string;
	    sku: string;
	    price: number;
	    stock: number;
	    minStock: number;
	    idProvider: number;
	
	    static createFrom(source: any = {}) {
	        return new DataProduct(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.sku = source["sku"];
	        this.price = source["price"];
	        this.stock = source["stock"];
	        this.minStock = source["minStock"];
	        this.idProvider = source["idProvider"];
	    }
	}
	export class HistoryItem {
	    id: number;
	    product: string;
	    user: string;
	    date: number;
	    count: number;
	    total: number;
	
	    static createFrom(source: any = {}) {
	        return new HistoryItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.product = source["product"];
	        this.user = source["user"];
	        this.date = source["date"];
	        this.count = source["count"];
	        this.total = source["total"];
	    }
	}
	export class NewBarCode {
	    name: string;
	    tag: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new NewBarCode(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.tag = source["tag"];
	        this.value = source["value"];
	    }
	}
	export class NewProduct {
	    name: string;
	    description: string;
	    sku: string;
	    price: number;
	    stock: number;
	    minStock: number;
	    idProvider: number;
	
	    static createFrom(source: any = {}) {
	        return new NewProduct(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	        this.sku = source["sku"];
	        this.price = source["price"];
	        this.stock = source["stock"];
	        this.minStock = source["minStock"];
	        this.idProvider = source["idProvider"];
	    }
	}
	export class NewProvider {
	    name: string;
	    phone: string;
	
	    static createFrom(source: any = {}) {
	        return new NewProvider(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.phone = source["phone"];
	    }
	}
	export class NewUser {
	    userName: string;
	    fullName: string;
	    isAdmin: boolean;
	    password: string;
	
	    static createFrom(source: any = {}) {
	        return new NewUser(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.userName = source["userName"];
	        this.fullName = source["fullName"];
	        this.isAdmin = source["isAdmin"];
	        this.password = source["password"];
	    }
	}
	export class PasswordProfileData {
	    currentPass: string;
	    newPass: string;
	
	    static createFrom(source: any = {}) {
	        return new PasswordProfileData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.currentPass = source["currentPass"];
	        this.newPass = source["newPass"];
	    }
	}
	export class Provider {
	    id: number;
	    name: string;
	    phone: string;
	
	    static createFrom(source: any = {}) {
	        return new Provider(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.phone = source["phone"];
	    }
	}
	export class Product {
	    id: number;
	    name: string;
	    description: string;
	    sku: string;
	    price: number;
	    stock: number;
	    minStock: number;
	    provider: Provider;
	
	    static createFrom(source: any = {}) {
	        return new Product(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.sku = source["sku"];
	        this.price = source["price"];
	        this.stock = source["stock"];
	        this.minStock = source["minStock"];
	        this.provider = this.convertValues(source["provider"], Provider);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ProductGroup {
	    id: number;
	    name: string;
	    description: string;
	    sku: string;
	    price: number;
	    stock: number;
	    minStock: number;
	    provider: Provider;
	    count: number;
	
	    static createFrom(source: any = {}) {
	        return new ProductGroup(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.sku = source["sku"];
	        this.price = source["price"];
	        this.stock = source["stock"];
	        this.minStock = source["minStock"];
	        this.provider = this.convertValues(source["provider"], Provider);
	        this.count = source["count"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ProfileData {
	    userName: string;
	    fullName: string;
	
	    static createFrom(source: any = {}) {
	        return new ProfileData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.userName = source["userName"];
	        this.fullName = source["fullName"];
	    }
	}
	
	export class Sale {
	    id: number;
	    product: string;
	    user: string;
	    date: number;
	    count: number;
	    total: number;
	
	    static createFrom(source: any = {}) {
	        return new Sale(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.product = source["product"];
	        this.user = source["user"];
	        this.date = source["date"];
	        this.count = source["count"];
	        this.total = source["total"];
	    }
	}
	export class User {
	    id: number;
	    userName: string;
	    fullName: string;
	    isAdmin: boolean;
	
	    static createFrom(source: any = {}) {
	        return new User(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.userName = source["userName"];
	        this.fullName = source["fullName"];
	        this.isAdmin = source["isAdmin"];
	    }
	}

}

