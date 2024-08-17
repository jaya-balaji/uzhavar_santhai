export interface ItemType{
    id:string,
    name: string,
    stock: number,
    price: number
}

export interface counts{
    totalStock:string,
    fCount:string,
    vCount:string
    lCount:string,
    SCpercentage: string
}

export interface UserType{
    email:String;
    name:String;
    phone:String
}

export interface AdminType{
    email:String;
    name:String;
    phone:String;
    location:String
}