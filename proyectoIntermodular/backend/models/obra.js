const { Sequelize } = require("sequelize")
const puntua = require("./puntua")

module.exports=function(sequelize,DataTypes){

    return sequelize.define("obra",{

        idobra: {

            autoIncrement:true,
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true

        },
        tipo:{

            type: DataTypes.ENUM('anime','manga'),
            allowNull:false,
        },
        titulo:{
            type: DataTypes.STRING(1000),
            allowNull:false,
        },
        sinopsis:{
            type: DataTypes.STRING(2000),
            allowNull:true,
        },
        genero:{
            type: DataTypes.STRING(100),
            allowNull:false,
        },
        fechalanzamiento:{

            type: DataTypes.DATE,
            allowNull:true,
        },

        estudio:{

            type: DataTypes.STRING(200),
            allowNull:true,
        },
        autor:{

            type: DataTypes.STRING(200),
            allowNull:true,
        },
        portada:{
            type: DataTypes.BLOB('long'),
            allowNull:false
        },
        estado:{

            type: DataTypes.ENUM('cancelado', 'finalizado', 'en emision', 'proximamente', 'pausado','eliminada'),
            allowNull:false,
        },
        idApi:{

            type: DataTypes.INTEGER,
            allowNull:true,
            unique:true
        },
        puntuacion:{
            type: DataTypes.FLOAT,
            allowNull:true,
        },
        popularidad:{
            type: DataTypes.INTEGER,
            allowNull:true,
        },
        trailer:{
            type: DataTypes.STRING(300),
            allowNull: true
        }

    },

{
    tableName:"obra",
    timestamps: false,
    indexes:[
        {
            name: "PRIMARY",
            unique:true,
            using:"BTREE",
            fields:[
                {name:"idobra"}
            ]
        }


    ]
})

}