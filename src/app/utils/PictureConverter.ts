export class PictureConverter{
  arrayBufferToBase64(buffer){
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach(b => binary += String.fromCharCode(b));
    return window.btoa(binary);
  }

  dataTypeFormat(convertedString:string = '',dataType:string = ''){
    dataType = dataType.toLowerCase();

    if(dataType === 'jpg' || dataType === 'jpeg'){
      return 'data:image/jpeg;base64,' + convertedString;
    }else if(dataType === 'png'){
      return 'data:image/png;base64,' + convertedString;
    }else if(dataType === 'gif'){
      return 'data:image/gif;base64,' + convertedString;
    }else{
      return '';
    }
  }
}
