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
     * Retrieving all entries.
     * 
     * @returns { Array } Array with all entries
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
     * @param { Object | Function } SearchFilter Search key. 
     * @returns { Array } Array with finded entries.
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
     * @param { Object } JSONEntry 
     * @returns { Object } JSONEntry
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
     * @param { Object | Function } SearchFilter Search key.  
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
    };
    /**
     * Add some values to all entries if they don't have this value.
     * 
     * @param { Object } values The value to add.
     * @returns { Object } An object with all values ​​and how many were added.
     */
    include(values){
        if(!values)throw new ParamError({
            message: "No values!",
            code: 1
        });
        if(typeof values != "object")throw new ParamError({
            message: "Values must be object!",
            code: 2
        });
        let added = {};

        for(let entry of this.db[this.name]){
            for(let value_name of Object.keys(values)){
                if(entry[value_name] == null){
                    if(added[value_name] == null)added[value_name] = 0;
                    entry[value_name] = values[value_name];
                    added[value_name]++
                }
            }
        };
        return added
    };
    /**
     * Clean DB.
     * 
     * @returns { Boolean }
     */
    clear(){
        this.db[this.name] = [];
        return true
    };
    /**
     * Remove all entries by key.
     * 
     * @param { Object | Function } SearchFilter Search key.  
     * @returns { Number } Amount of removed entries
     */
    removeKey(params){
        if(!params)throw new ParamError({
            message: "No params!",
            code: 0
        });

        let entries = this.search(params),
            removed = 0;

        for(let entry of entries){
            this.db[this.name] = this.db[this.name].filter(e => e != entry);
            removed++
        };
        return removed
    }
    /**
     * Add some values to all entries with some key if they don't have this value.
     * 
     * @param { Object | Function } SearchFilter Search key. 
     * @param { Object } values The value to add.
     * @returns { Object } An object with all values ​​and how many were added.
     */
    includeKey(searchfilter, values){
        if(!searchfilter)throw new ParamError({
            message: "No SearchFilter!",
            code: 1
        });
        if(!values)throw new ParamError({
            message: "No value!",
            code: 1
        });
        if(typeof values != "object")throw new ParamError({
            message: "Value must be object!",
            code: 2
        });
        

        let entries = this.search(searchfilter),
            added = {};

        for(let entry of entries){
            for(let value_name of Object.keys(values)){
                if(entry[value_name] == null){
                    if(added[value_name] == null)added[value_name] = 0;
                    entry[value_name] = values[value_name];
                    added[value_name]++
                }
            }
        };

        return added
    }
};
module.exports = DB