import Controller from './Controller.js';
import path from "path";
import fs from "fs";
import model from "../models/model.js";

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }

    get(){
        if(this.HttpContext.path.params == null || this.HttpContext.path.queryString == '?')
            this.help();
        else
            this.doOperation();
    }

    doOperation() {
        let params = this.HttpContext.path.params;
        if(params.op === undefined)
            return this.HttpContext.response.badRequest("The operation in the request url is not specified");
        console.log(params);
        if(params.op == " ")
            params.op = "+";
        console.log(params);
        let error = "";
        if(params.x != undefined && params.y != undefined && "+-*/%".includes(params.op) && params.op.length == 1)
        {
            if(parseInt(params.x,) == NaN && parseInt(params.y,) == NaN)
                error = "X and Y parameters are not a number"
            else if(parseInt(params.x,) == NaN)
                error = "X parameter is not a number"
            else if(parseInt(params.y,) == NaN)
                error = "Y parameter is not a number"
            else if(Object.keys(params).length != 3){
                error = "Only two parameters are accepted";
                }
            if(error != "")
                this.HttpContext.response.JSON({...params, error:error});
            else{
                params.x = Number(params.x);
                params.y = Number(params.y);
                switch(params.op){
                    case "+":
                        this.HttpContext.response.JSON({...params, value:(params.x + params.y)});
                        break;
                    case "-":
                        this.HttpContext.response.JSON({...params, value:(params.x - params.y)});
                        break;
                    case "*":
                        this.HttpContext.response.JSON({...params, value:(params.x * params.y)});
                        break;
                    case "/":
                        if(params.y == 0){
                            if(params.x != 0)
                                this.HttpContext.response.JSON({...params, value:"Infinity"});
                            else
                                this.HttpContext.response.JSON({...params, value:"NaN"});
                        }else
                            this.HttpContext.response.JSON({...params, value:(params.x / params.y)});
                        break;
                    case "%":
                        this.HttpContext.response.JSON({...params, value:params.y!=0?(params.x % params.y):"NaN"});
                        break;
                }
            }
        }
        else if(params.op == "!" || params.op == "p" || params.op == "np")
        {
            if(parseInt(params.n) == NaN)
                error = "n parameter is not a number";
            else if(Object.keys(params).length != 2)
                error = "Only one parameters are accepted";
            if(error != ""){
                this.HttpContext.response.JSON({...params, error:error});
            }else{
                let anwser;
                params.n = Number(params.n);
                switch(params.op){
                    case "!":
                        anwser = this.factorial(params.n);
                        if(!isNaN(parseInt(anwser)))
                            this.HttpContext.response.JSON({...params, value:anwser});
                        else
                            this.HttpContext.response.JSON({...params, error:anwser});
                        break;
                    case "p":
                        anwser = this.isPrime(params.n);
                        if(anwser === true || anwser === false)
                            this.HttpContext.response.JSON({...params, value:anwser});
                        else
                            this.HttpContext.response.JSON({...params, error:anwser});
                        break;
                    case "np":
                        anwser = this.findNePrime(params.n);
                        if(!isNaN(parseInt(anwser)))
                            this.HttpContext.response.JSON({...params, value:anwser});
                        else
                            this.HttpContext.response.JSON({...params, error:anwser});
                        break;
                }
            }
        }
        else
            return this.HttpContext.response.badRequest("The operation in the request url is syntactically wrong.");
    }

    factorial(x){
        if(x % 1 != 0)
            return "Factoral must be an integer"
        if(x <= 0)
        {
            return "Factorial must be positive"
        }
        let total = 1;
        for(let i = 1; i <= x; i++){
            total *= i
        }
        return total;
    }

    isPrime(x){
        if(x % 1 != 0)
            return "Prime must be an integer"
        if(x <= 0)
        {
            return "Prime must be positive"
        }
        if(x <= 1)
        {
            return false
        }
        let max = Math.sqrt(x)
        for(let i = 2; i <= max; i++){
            if(x % i == 0) return false;
        }
        return true;
    }
    findNePrime(x){
        if(x % 1 != 0)
            return "n must be an integer"
        if(x <= 0)
        {
            return "must be positive"
        }
        let primeNumer = 0;
        for (let i = 0; i < x; i++) {
            primeNumer++;
            while (!this.isPrime(primeNumer)) {
                primeNumer++;
            }
        }
        return primeNumer;
    }

    help(){
        let helpPagePath = path.join(process.cwd(), wwwroot, 'API-Help_pages/math.html');
        this.HttpContext.response.HTML(fs.readFileSync(helpPagePath));
    }
}