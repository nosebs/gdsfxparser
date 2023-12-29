
import zlib from "node:zlib";


export class MusicLibrary {

    static parse(udata) {
        let data = zlib.inflateSync(Buffer.from(udata, "base64"))
            .toString()
            .split("|")
        //console.log("version", data[0])
        let tauthors = data[1].split(";")
        let tcontents = data[2].split(";")
        let ttypes = data[3].split(";")
        
        let ml = new MusicLibrary()

        ml.authors = tauthors.filter((s) => s.length != 0)
            .map((v) => {
            let g = v.split(",");
            return {
                id: parseInt(g[0]),
                name: g[1],
                site: g[2] != " " ? decodeURIComponent(g[2]) : null,
                youtube: g[3] != " " ? g[3] : null
            }
        })

        ml.types = ttypes.filter((s) => s.length != 0)
            .map((v) => {
            let g = v.split(",");
            return {
                id: parseInt(g[0]),
                name: g[1]
            }
        })


        ml.contents = tcontents.filter((s) => s.length != 0)
            .map((v) => {
            let g = v.split(",");
            return {
                id: parseInt(g[0]),
                author: ml.authors.find(x => x.id == parseInt(g[2])),
                name: g[1],
                size: parseInt(g[3]),
                length: parseInt(g[4]),
                types: g[5].split(".")
                    .filter((s) => s.length != 0)
                    .map((w) => ml.types.find(x => x.id == parseInt(w)))
            }
        })
        
        return ml

    }
    
    getAuthors() {
       return this.authors
    }
    
    getTypes() {
       return this.types;
    }
    
    getContents() {
       return this.contents
    }
    
}

export class SFXLibrary {

    static parse(udata) {
        let data = zlib.inflateSync(Buffer.from(udata, "base64"))
            .toString()
            .split("|")

        let tauthors = data[1].split(";")
        let tcontents = data[0].split(";")
        //console.log(tauthors, tcontents)
        
        let sfxl = new SFXLibrary()
        sfxl.authors = tauthors.filter((s) => s.length != 0)
            .map((v) => {
            let g = v.split(",");
            return {
                name: g[0],
                site: decodeURIComponent(g[1])
            }
        })
        sfxl.sfxs = [];
        sfxl.categories = [];
        /*            
            /*if(g[2] == "0") { //sfx
               sfxl.sfxs.push(
                id: parseInt(g[0]),
                name: g[1],
                type: g[2], //always 0
                //idk2: g[3], maybe author id
                size: parseInt(g[4]),
                length: parseInt(g[5])
              })
            }*/
        let contents = tcontents.filter((s) => s.length != 0);
        sfxl.types = contents.filter((x) => x.split(",")[2] === "1").map((v) => {
            let g = v.split(",");
            if(g[2] == "1") return {
               id: parseInt(g[0]),
               name: g[1]
            }
        })
        
        sfxl.contents = contents.filter((x) => x.split(",")[2] === "0").map((v) => {
            let g = v.split(",");
            if(g[2] == "0") return {
               id: parseInt(g[0]),
               name: g[1],
               type: sfxl.types.find(x => x.id === parseInt(g[3])),
               size: parseInt(g[4]),
               length: parseInt(g[5])
            }
        })
        return sfxl;
    }
    
    getAuthors() {
       return this.authors
    }
    
    getTypes() {
       return this.types;
    }
    
    getContents() {
       return this.contents
    }
}