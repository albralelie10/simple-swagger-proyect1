// const express= require("express")
// const morgan = require("morgan")
// const cors=require("cors")
// const low=require("lowdb")

import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUI from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import router from "./routes/book.js";
const PORT = 3000;
const app = express();

// Remember to set type: module in package.json or use .mjs extension

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file)
const defaultData = { books: [] }
const db = new Low(adapter, defaultData)

// If JSON file doesn't exist, defaultData is used instead
await db.read();

app.db = db;

const definition={
        openapi:"3.0.3",
        info:{
            title:"Simple openAPI proyect with swagger",
            description:"A simple API to managment a library",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:3000"
            }
        ],
        components:{
            securitySchemes:{
                bearerAuth:{
                    type:"http",
                    scheme:"bearer"
                }
            },
            schemas:{    
                book:{
                    type:"object",
                    required:["title","author"],
                    properties:{
                        id:{
                            type:"string",
                            description:"Auto generate unique id for a book"
                        },
                        title:{
                            type:"string",
                            description:"El titulo del libro"
                        },
                        author:{
                            type:"string",
                            description:"El autor del libro"
                        }
                    },
                    example:{
                        id:"HSJSDA-X1",
                        title:"Clock Orange",
                        author:"Burrows, K"
                    }
                }
            },
    },
        paths: {
            "/books": {
                get: {
                    tags: ["Books"],
                    summary: "Devuelve una lista de todos los libros en 'books'",
                    responses: {
                        200: {
                            description: "Respuesta exitosa. Devuelve la lista de libros.",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#components/schemas/book"
                                    }
                                }
                            }
                        }
                    },
                   security:[
                    {
                        bearerAuth:[]
                    }
                   ]
                },
                post:{
                    tags:["Books"],
                    summary: "Agrega un objeto de tipo 'Libro' a la coleccion",
                    requestBody:{
                        required:true,
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        title:{
                                            type:"string"
                                        },
                                        author:{
                                            type:"string"
                                        }
                                    }
                                }
                            }
                            
                        }
                    },
                    responses: {
                        201:{
                            description:"Libro agregado con exito",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            title:{
                                                type:"string",
                                                description:"El titulo del libro"
                                            },
                                            author:{
                                                type:"string",
                                                description:"El autor del libro"
                                            }
                                        }
                                    }
                                }
                            }

                        },
                        500:{
                            description:"Server Error"
                        }
                    }
                }
            },
            "/books/{id}":{
                get:{
                    summary:"Devuelve un unico libro de la coleccion",
                    tags:["Books"],
                    responses:{
                        200:{
                            description:"Devuelve un libro con la ID especificada",
                            content:{
                                "application/json":{
                                    schema:{
                                        $ref:"#/components/schemas/book"
                                    }
                                }
                            }
                        },
                        404:{
                            description:"Book dosnt exists"
                        }
                    },
                    parameters: [
                        {
                            in: "path",
                            name: "id",
                            schema: {
                                type: "string"
                            },
                            required: true,
                            description: "ID of the Book"
                        }
                    ]
                },
                put:{
                    summary:"Actualiza un libro de la coleccion con el contenido dado",
                    tags:["Books"],
                    parameters:[{
                        in:"path",
                        name:"id",
                        schema:{
                            type:"string"
                        },
                        required:true,
                        description:"The ID of the Book"
                    }],
                    requestBody:{
                        required:true,
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        title:{
                                            type:"string"
                                        },
                                        author:{
                                            type:"string"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses:{
                        200:{
                            description:"Deveuelve el libro con el contenido actualizado",
                            content:{
                                "application/json":{
                                    schema:{
                                        $ref:"#/components/schemas/book"
                                    }
                                }
                            }
                        },404:{
                            description:"El libro con la ID no existe en la BD",
                        },500:{
                            description:"Server Error"
                        }
                    }
                },
                delete:{
                    summary:"Borra de la colecccion  el libro con la ID especificada",
                    tags:["Books"],
                    responses:{
                        200:{
                            descritpion:"Devuelve una lista de libros sin inlcuir al libro que se ha eliminado",
                            content:{
                                "application/json":{
                                    schema:{
                                        type:"Array",
                                        $ref: "#/components/schemas/book"
                                    }
                                }
                            }
                        },
                        500:{
                            description:"Server Error"
                        }
                    },
                    parameters:[
                        {
                            in:"path",
                            name:"id",
                            schema:{
                                type:"string"
                            },
                            required:true,
                            description:"The ID of the Book"
                        }
                    ],
                    security:[
                        {
                            bearerAuth:[]
                        }
                    ]
                }
            }
        }
}


const options={
    definition,
    apis:["./routes/*.js"]
}


app.use("/documents",swaggerUI.serve,swaggerUI.setup(swaggerJSDoc(options)))
app.use(cors())
app.use(express.json());
app.use("/books", router);

app.listen(PORT, () => console.log("Server running"));








