import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }


    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '8158269083f7617f69401d7d9f3b2c73';
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`); //axios works same as fetch but it works on all browser , it automatically return json. it is better than fetch. axios is also better in error handeling
            //console.log(res);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}



