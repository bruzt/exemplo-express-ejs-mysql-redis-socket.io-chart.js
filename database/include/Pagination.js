const mysql = require('../mysql');

class Pagination {

    constructor(query, params = [], itemsPerPage = 15){

        this._query = query;
        this._params = params;
        this._itemsPerPage = itemsPerPage;
        this.currentPage = 1;

    }

    getPage(page){

        this.currentPage = page - 1;

        this._params.push(
            this.currentPage * this._itemsPerPage,
            this._itemsPerPage
        );

        return new Promise( (resolve, reject) => {
    
            mysql.query([this._query, 'SELECT FOUND_ROWS() AS FOUND_ROWS;']
                .join(';'), this._params, (err, results) => {
    
                if(err){
    
                    reject(err);
    
                } else {

                    this.data = results[0],
                    this.total = results[1][0].FOUND_ROWS,
                    this.totalPages = Math.ceil(this.total / this._itemsPerPage)
                    this.currentPage++;

                    resolve(this.data);
    
                }
            });
        });
    }

    getNavigation(params){

        let limitPageNav = 5;
        let links = [];
        let pageNumberStart = 0;
        let pageNumberEnd = 0;

        if(this.getTotalPages() < limitPageNav){
            limitPageNav = this.getTotalPages();
        }

        // estamos nas primeiras paginas
        if((this.getCurrentPage() - parseInt(limitPageNav / 2)) <= 1){
            pageNumberStart = 1;
            pageNumberEnd = limitPageNav;

        // estamos nas ultimas paginas
        } else if((this.getCurrentPage() + parseInt(limitPageNav / 2)) > this.getTotalPages()){
            pageNumberStart = this.getTotalPages() - limitPageNav;
            pageNumberEnd = this.getTotalPages();

        // nem perto do começo nem perto do fim
        } else {
            pageNumberStart = this.getCurrentPage() - parseInt(limitPageNav / 2);
            pageNumberEnd = this.getCurrentPage() + parseInt(limitPageNav / 2);
        }

        if(this.getCurrentPage() > 1){

            links.push({
                text: '«',
                href: '?' + this.getQueryString(Object.assign({}, params, { page: this.getCurrentPage() - 1 })),
                active: true
            });
        }

        for(let x = pageNumberStart; x <= pageNumberEnd; x++){

            links.push({
                text: x,
                href: '?' + this.getQueryString(Object.assign({}, params, { page: x })),
                active: (x == this.getCurrentPage()) ? true : false
            });
        }

        if(this.getCurrentPage() < this.getTotalPages()){

            links.push({
                text: '»',
                href: '?' + this.getQueryString(Object.assign({}, params, { page: this.getCurrentPage() + 1 })),
                active: true
            });
        }

        return links;

    }

    getQueryString(params){

        let queryString = [];

        for(let name in params){

            queryString.push(`${name}=${params[name]}`);

        }

        return queryString.join('&');

    }

    getTotal(){
        return this.total;
    }

    getCurrentPage(){
        return this.currentPage;
    }

    getTotalPages(){
        return this.totalPages;
    }

}

module.exports = Pagination;