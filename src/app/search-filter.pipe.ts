import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!value)return null;
    if(!args)return value;

    args = args.toLowerCase();

    return value.filter((data:any) => {
      let searchTerm = data
      return JSON.stringify(searchTerm).toLowerCase().includes(args);
    })
  }

}
