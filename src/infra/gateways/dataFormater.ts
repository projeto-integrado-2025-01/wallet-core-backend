import { Injectable } from "@nestjs/common";

@Injectable()
export class DataFormater {
  public trimData<T extends Object>(data: T): T {
    const props = Object.keys(data);
    props.forEach((prop) => {
      if(typeof data[prop] === 'object') {
        this.trimData(data[prop]);
      }
      if(typeof data[prop] === 'string') {
        const val: string = data[prop];
        data[prop] = val.trim();
      }
    });
    return data
  }

  public extractOnlyNumbers(data: string): string {
    return data.replace(/\D/g, '');
  }
}