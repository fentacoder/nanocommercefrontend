export class TextFormat{
  formatFullName(fullName:string = 'no name'):string{
    if(fullName !== null){
      let nameArr:string[] = fullName.split(' ');
      let firstName:string = this.formatFirstName(nameArr[0]);
      return firstName + ' ' + nameArr[1].substring(0,1).toUpperCase() + '.';
    }else{
      return '';
    }

  }

  formatFirstName(firstName:string = ''):string{
    if(firstName.length > 0){
      let firstLetter = firstName.substring(0,1).toUpperCase();
      return firstLetter + firstName.substring(1);
    }else{
      return '';
    }

  }
}
