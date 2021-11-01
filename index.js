const fs = require("fs");
const { DBError, ParamError } = require("./errors.js");
class DB{
    /**
     * SimpleDB
     * @param { Object } params (with args)
     * @param { String } params.filename (db file)
     * @param { String } params.name (db name)
     */
    constructor(params){
        if(!params)throw new ParamError({
            message: "No params!",
            code: 0
        });
        if(!params.filename)throw new ParamError({
            message: "No param \"filename\"!",
            code: 0
        });
        if(!params.name)throw new ParamError({
            message: "No param \"name\"!",
            code: 0
        });
        this.filename = params.filename;
        this.name = params.name;
        if(!fs.existsSync(this.filename))
            fs.appendFile(this.filename, '{}', function(error){
                if(error)throw new DBError({
                    message: error,
                    code: -1
                })
            });
        this.db = fs.readFileSync(this.filename, "utf8");
        if(this.db == ""){
            this.db = {};
            this.db[params.name] = [];
            this.write()
        };
        if(typeof this.db == "string"){
            try{
                this.db = JSON.parse(this.db)
            }catch(e){
                if(e instanceof SyntaxError){
                    throw new DBError({
                        message: "Database broken.",
                        code: 3
                    })
                }else{
                    throw new DBError({
                        message: e,
                        code: -1
                    })
                }
            }
        };
        if(this.db[params.name] == null){
            this.db[params.name] = [];
            this.write()
        }
    };
    /**
     * Retrieving all entrys.
     * 
     * @returns { Array } Array with all entrys
     */
    get(){
        try{   
            return this.db[this.name]
        }catch(e){
            this.db[this.name] = [];
            this.write()
            throw new DBError({
                message: "Database broken.",
                code: 3
            })
        }
    };
    /**
     * Searching entry by JSON or function
     * 
     * @param { JSON | Function } SearchFilter Search key. 
     * @returns { Array } Array with finded entrys.
     */

    search(params){
        if(!params)throw new ParamError({
            message: "No params!",
            code: 0
        });
        if(typeof params == "object"){
            let dbArray = this.db[this.name];
            for(let i of Object.keys(params)) dbArray = dbArray.filter(e => params[i] == e[i]);
            return dbArray
        }else{
            return this.db[this.name].filter(params)
        }
    };
    /**
     * Writing any changes.
     * 
     * @returns { Boolean } If everything good.
     */
    write(){
        fs.writeFile(this.filename, JSON.stringify(this.db, null, '\t'), function(error){
            if(error)throw new DBError({
                message: error,
                code: -1
            });
            return true
        })
    };
    /**
     * Adding entry.
     * 
     * @param { JSON } JSONEntry 
     * @returns { JSON } JSONEntry
     */
    new(json){
        if(typeof json != "object")throw new ParamError({
            message: "No JSON introduced!",
            code: 1
        });
        const result = this.db[this.name].push(json);
        return this.db[this.name][result-1]
    };
    /**
     * Removing entry by key.
     * 
     * @param { JSON | Function } SearchFilter Search key.  
     * @returns { Boolean }
     */
    remove(params){
        if(!params)throw new ParamError({
            message: "No params!",
            code: 0
        });
        let result = this.search(params);
        
        if(result.length == 0)throw new DBError({
            message: "Not found!",
            code: 2
        });
        this.db[this.name] = this.db[this.name].filter(data => data != result[0]);
        return true
    }
};
module.exports = DB