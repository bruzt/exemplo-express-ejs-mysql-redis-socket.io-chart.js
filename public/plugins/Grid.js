

class Grid {

    constructor(configs){

        // Campos obrigatórios
        this._deleteUrl = configs.deleteUrl;
        this._deleteMessage = configs.deleteMessage;
        ///////////////

        // Eventos padrão
        configs.listeners = Object.assign({

            afterUpdateClick: (event) => {

                $('#modal-update').modal('show');
        
            },

            afterDeleteClick: (event) => {

                window.location.reload();
        
            }

        }, configs.listeners);
        /////////////

        // Valores Padrão
        configs = Object.assign({}, {
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete',
            onUpdateLoad: (formUpdate, name, data) => {
                let input = formUpdate.querySelector(`[name=${name}]`);
                if(input) input.value = data[name];
            }
        }, configs);
        ///////////////

        this._rows = [...document.querySelectorAll('table tbody tr')];

        // Campos opcionais (usa o padrão se não passar nada)
        this._formCreate = document.querySelector(configs.formCreate);
        this._formUpdate = document.querySelector(configs.formUpdate);
        this._btnUpdate = document.querySelectorAll(configs.btnUpdate);
        this._btnDelete = document.querySelectorAll(configs.btnDelete);
        this._listeners = configs.listeners; // = {}
        this._updateLoad = configs.onUpdateLoad;
        this._options = configs;
        ///////////////

        this.initForms();
        this.initButtons();

    }

    fireEvent(name, args){

        if(typeof this._listeners[name] === 'function'){
            this._listeners[name].apply(this, args);
        }

    }

    getTrData(event){

        let tr = event.path.find( (element) => {

            return (element.tagName.toUpperCase() == 'TR');

        });

        return JSON.parse(tr.dataset.row);

    }

    async initForms(){

        if(this._formCreate) this._formCreate.addAjaxSaveOnSubmit(); // .addAjaxSaveOnSubmit() = /plugins/formSave.js

        if (this._formUpdate) this._formUpdate.addAjaxSaveOnSubmit();

    }

    initButtons(){

        this._rows.forEach( (row) => {

            [...row.querySelectorAll('.btn')].forEach( (btn) => {

                btn.addEventListener('click', (event) => {

                    if(event.target.classList.contains(this._options.btnUpdate.slice(1))){

                        this.btnUpdateClick(event);

                    } else if (event.target.classList.contains(this._options.btnDelete.slice(1))){

                        this.btnDeleteClick(event);

                    } else {

                        this.fireEvent('buttonClick', [event.target, this.getTrData(event), event]);

                    }
                });
            });
        });
    }

    btnUpdateClick(event){

        this.fireEvent('beforeUpdateClick', [event]);

        event.preventDefault();

        let data = this.getTrData(event);

        for(let name in data){

            this._updateLoad(this._formUpdate, name, data);

        }

        this.fireEvent('afterUpdateClick', [event]);

    }

    async btnDeleteClick(event){

        this.fireEvent('beforeDeleteClick', [event]);

        let data = this.getTrData(event);

        if(confirm(eval('`' + this._deleteMessage + '`'))){

            try {
                // '${data.id}' está no _deleteUrl
                let response = await fetch(eval('`' + this._deleteUrl + '`'), { 
                    method: 'DELETE',
                });

                let json = await response.json();

                this.fireEvent('afterDeleteClick', [event]);
        
            } catch (error) {
                console.error(error);
            }
        }
    }

}