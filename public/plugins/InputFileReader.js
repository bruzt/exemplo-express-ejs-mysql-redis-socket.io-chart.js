


class InputFileReader {

    constructor(inputElement, imgElement){

        this._inputElement = inputElement;
        this._imgElement = imgElement;

        this.initInputEvent();

    }

    initInputEvent(){
        
        document.querySelector(this._inputElement).addEventListener('change', async (event) => {

            try {

                let result = await this.reader(event.target.files[0]);

                document.querySelector(this._imgElement).src = result;
                
            } catch (error) {
                console.error(error);
            }
        }); 
    }

    reader(file){

        return new Promise( (resolve, reject) => {

            let reader = new FileReader();

            reader.onload = () => {
    
                resolve(reader.result);

            }

            reader.onerror = (error) => {

                reject(error);

            }
    
            reader.readAsDataURL(file);
        });
    }
    
}